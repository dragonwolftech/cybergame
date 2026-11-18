/* Chapter runner, score, and save. No DOM. */
(function (root) {
  "use strict";

  const NA = root.NightAudit;
  const KEY = "night-audit-v2";
  const OLD_KEY = "night-audit-v1";
  const memoryStore = {};
  const db = (typeof localStorage !== "undefined")
    ? localStorage
    : {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(memoryStore, k) ? memoryStore[k] : null; },
      setItem: function (k, v) { memoryStore[k] = String(v); },
      removeItem: function (k) { delete memoryStore[k]; }
    };

  function rankRows() {
    const chapters = NA.chapters || [];
    const counts = [0, 0, 0, 0];
    chapters.forEach(function (ch) { counts[ch.tier || 0] += 1; });
    let upto = 0;
    const ends = counts.map(function (n) { upto += n * 100; return upto; });
    const top = ends[3] || upto || 100;
    return [
      { min: 0, name: "Script Kiddie" },
      { min: Math.max(80, (ends[0] || 0) - 40), name: "Stringer" },
      { min: Math.max(160, (ends[1] || 0) - 40), name: "Operator" },
      { min: Math.max(240, (ends[2] || 0) - 40), name: "Night Wire" },
      { min: Math.max(320, top - 220), name: "Red Cell" },
      { min: Math.max(400, top - 30), name: "Ghost" }
    ];
  }

  let state = null;
  let timer = null;
  let inTick = false;
  let pendingTick = false;
  let forceInstant = false;

  function freshState() {
    return {
      v: 2,
      notice: null,
      player: null,
      settings: { fast: false, sound: false },
      trust: { quill: 0, rook: 0, lena: 0, pix: 0 },
      trustLog: [],
      codex: ["range", "cell"],
      best: {},
      chapters: {},
      active: null,
      pendingDebrief: null,
      hintSheet: null,
      reviewing: null,
      nudgeDebrief: false
    };
  }

  function chapterById(id) {
    return NA.chapters.find(function (c) { return c.id === id; }) || null;
  }

  function currentChapter() {
    if (!state || !state.active) return null;
    return chapterById(state.active);
  }

  function hydrate(run) {
    if (!run) return null;
    run.goals = run.goals || {};
    run.unread = run.unread || { beacon: false, pix: false };
    run.transcript = run.transcript || { beacon: [], pix: [] };
    run.transcript.beacon = run.transcript.beacon || [];
    run.transcript.pix = run.transcript.pix || [];
    run.views = run.views || {};
    run.missed = run.missed || {};
    run.webCwd = run.webCwd || "/public";
    return run;
  }

  function activeRun() {
    if (!state || !state.active) return null;
    return hydrate(state.chapters[state.active]);
  }

  function viewingId() {
    return (state && (state.reviewing || state.active)) || null;
  }

  function viewingRun() {
    const id = viewingId();
    if (!id || !state.chapters[id]) return null;
    return hydrate(state.chapters[id]);
  }

  function persistable(source) {
    const copy = JSON.parse(JSON.stringify(source));
    delete copy.hintSheet;
    delete copy.nudgeDebrief;
    delete copy.reviewing;
    delete copy.notice;
    if (copy.settings) delete copy.settings.instant;
    Object.keys(copy.chapters || {}).forEach(function (id) {
      if (copy.chapters[id]) delete copy.chapters[id].typing;
    });
    return copy;
  }

  function save() {
    db.setItem(KEY, JSON.stringify(persistable(state)));
  }

  function utf8ToB64url(text) {
    const bytes = unescape(encodeURIComponent(text));
    return btoa(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function b64urlToUtf8(text) {
    const pad = text.length % 4 === 0 ? "" : "====".slice(text.length % 4);
    const bytes = atob(text.replace(/-/g, "+").replace(/_/g, "/") + pad);
    return decodeURIComponent(escape(bytes));
  }

  function checksum(json) {
    return NA.sha256(json).slice(0, 10);
  }

  function extractCode(raw) {
    let text = String(raw || "").trim();
    const linked = text.match(/#save=([^\s&]+)/i);
    if (linked) {
      try { text = decodeURIComponent(linked[1]); } catch (err) { text = linked[1]; }
    }
    return text.replace(/\s+/g, "");
  }

  function normalize(parsed) {
    parsed.v = 2;
    parsed.notice = null;
    parsed.settings = parsed.settings || { fast: false, sound: false };
    if (typeof parsed.settings.sound !== "boolean") parsed.settings.sound = false;
    if (parsed.settings) delete parsed.settings.instant;
    parsed.codex = Array.isArray(parsed.codex) ? parsed.codex : ["range", "cell"];
    parsed.best = parsed.best && typeof parsed.best === "object" ? parsed.best : {};
    parsed.chapters = parsed.chapters && typeof parsed.chapters === "object" ? parsed.chapters : {};
    parsed.trust = parsed.trust || { quill: 0, rook: 0, lena: 0, pix: 0 };
    parsed.trustLog = Array.isArray(parsed.trustLog) ? parsed.trustLog : [];
    parsed.hintSheet = null;
    parsed.reviewing = null;
    parsed.nudgeDebrief = false;
    if (parsed.player) {
      parsed.player = {
        name: String(parsed.player.name || "Rowe").replace(/[<>]/g, "").trim().slice(0, 24) || "Rowe",
        call: String(parsed.player.call || "LOW").replace(/[<>]/g, "").trim().slice(0, 12).toUpperCase() || "LOW"
      };
    }
    return parsed;
  }

  function scoreOf(data) {
    return Object.keys((data && data.best) || {}).reduce(function (sum, id) {
      return sum + ((data.best[id] | 0) || 0);
    }, 0);
  }

  function rankName(score) {
    const rows = rankRows();
    let name = rows[0].name;
    rows.forEach(function (row) { if (score >= row.min) name = row.name; });
    return name;
  }

  function describeSave(data) {
    const score = scoreOf(data);
    let reached = "No chapter finished yet";
    let bestN = 0;
    let bestTitle = "";
    (NA.chapters || []).forEach(function (ch) {
      const run = data.chapters && data.chapters[ch.id];
      if (run && run.status === "done" && ch.n >= bestN) {
        bestN = ch.n;
        bestTitle = ch.title;
      }
    });
    if (bestN) reached = "Through " + bestN + " · " + bestTitle;
    if (data.active && data.chapters && data.chapters[data.active] && data.chapters[data.active].status !== "done") {
      const ch = chapterById(data.active);
      if (ch) reached = "In progress · " + ch.n + " " + ch.title;
    }
    const who = data.player ? (data.player.name + " / " + data.player.call) : "No name yet";
    return {
      who: who,
      rank: rankName(score),
      score: score,
      reached: reached
    };
  }

  function load() {
    try {
      let raw = db.getItem(KEY);
      if (!raw) {
        const old = db.getItem(OLD_KEY);
        db.removeItem(OLD_KEY);
        const fresh = freshState();
        if (old) {
          fresh.notice = "The lesson path changed, so this handset started over. Old chapter progress was cleared.";
          try {
            const parsedOld = JSON.parse(old);
            if (parsedOld && parsedOld.settings) {
              fresh.settings.fast = !!parsedOld.settings.fast;
              fresh.settings.sound = !!parsedOld.settings.sound;
            }
          } catch (err) { /* old save was not usable */ }
        }
        return fresh;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 2 || !parsed.trust) {
        db.removeItem(KEY);
        db.removeItem(OLD_KEY);
        return freshState();
      }
      return normalize(parsed);
    } catch (err) {
      return freshState();
    }
  }

  function emit() {
    if (NA.Game && typeof NA.Game.onChange === "function") NA.Game.onChange();
  }

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function prefersReduced() {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function delayFor(step) {
    if (state.settings.instant) return 0;
    if (state.settings.fast || prefersReduced()) return 40;
    const n = (step.text || "").length;
    return Math.min(1500, 320 + n * 12);
  }

  function pushMsg(msg) {
    const run = activeRun();
    if (!run) return;
    const thread = msg.thread || "beacon";
    if (!run.transcript[thread]) run.transcript[thread] = [];
    run.transcript[thread].push({
      who: msg.who,
      text: msg.text || "",
      kind: msg.kind || "text",
      card: msg.card || null,
      time: Date.now()
    });
    if (NA.lookingAt !== thread) run.unread[thread] = true;
  }

  function commitSay(step) {
    pushMsg({ who: step.who, thread: step.thread || "beacon", text: step.text, kind: "text" });
  }

  function commitCard(step) {
    pushMsg({
      who: step.who || "system",
      thread: step.thread || "beacon",
      kind: "card",
      text: step.text || "",
      card: {
        app: step.app,
        title: step.title,
        sub: step.sub || "",
        doc: step.doc || null,
        url: step.url || null
      }
    });
  }

  function scoreChapter(run) {
    const ch = currentChapter();
    const freeHints = !!(ch && ch.tier <= 1);
    const hintCost = freeHints ? 0 : [0, 10, 30, 60][Math.min(3, run.hints | 0)];
    const wrongCost = Math.min(45, (run.wrongs | 0) * 5);
    let s = 100 - hintCost - wrongCost;
    const cleanHints = freeHints || (run.hints | 0) === 0;
    if (run.ethics !== false && (run.wrongs | 0) === 0 && cleanHints) s += 10;
    if (run.goals && run.goals["reported-pii"]) s += 5;
    return Math.max(15, s);
  }

  function finishChapter() {
    const run = activeRun();
    const ch = currentChapter();
    if (!run || !ch || run.status === "done") return;
    const score = scoreChapter(run);
    run.status = "done";
    run.awarded = score;
    if (!state.best[ch.id] || score > state.best[ch.id]) state.best[ch.id] = score;
    (ch.codex || []).forEach(function (entry) {
      if (state.codex.indexOf(entry.id) === -1) state.codex.push(entry.id);
    });
    state.pendingDebrief = ch.id;
    state.nudgeDebrief = true;
    save();
  }

  function currentStep() {
    const run = activeRun();
    const ch = currentChapter();
    if (!run || !ch || run.status === "done") return null;
    const scene = ch.scenes[run.ip.scene];
    if (!scene) return null;
    return scene[run.ip.i] || null;
  }

  function scheduleSay(step) {
    const run = activeRun();
    run.typing = { who: step.who, thread: step.thread || "beacon" };
    timer = setTimeout(function () {
      timer = null;
      const runNow = activeRun();
      if (!runNow || !runNow.typing) return;
      commitSay(step);
      runNow.typing = null;
      runNow.ip.i++;
      save();
      tick();
    }, delayFor(step));
  }

  function stepOnce() {
    const run = activeRun();
    const ch = currentChapter();
    if (!run || !ch || run.status === "done") return "stop";
    if (run.typing) return "stop";
    const scene = ch.scenes[run.ip.scene];
    if (!scene) {
      if (state.settings.instant) throw new Error("Missing scene " + run.ip.scene + " in " + ch.id);
      return "stop";
    }
    const step = scene[run.ip.i];
    if (!step) return "stop";

    if (step.skipIfGoal && run.goals[step.skipIfGoal]) {
      if (step.skipGoto) run.ip = { scene: step.skipGoto, i: 0 };
      else run.ip.i++;
      return "continue";
    }

    if (step.do === "say") {
      if (state.settings.instant) {
        commitSay(step);
        run.ip.i++;
        return "continue";
      }
      scheduleSay(step);
      return "stop";
    }
    if (step.do === "card") {
      commitCard(step);
      run.ip.i++;
      return "continue";
    }
    if (step.do === "goto") {
      run.ip = { scene: step.scene, i: 0 };
      return "continue";
    }
    if (step.do === "await") {
      const unmet = step.goals.filter(function (g) { return !run.goals[g]; });
      if (!unmet.length) {
        run.ip.i++;
        return "continue";
      }
      return "stop";
    }
    if (step.do === "choice") return "stop";
    if (step.do === "branch") {
      run.ip = { scene: step.pick(state), i: 0 };
      return "continue";
    }
    if (step.do === "finish") {
      finishChapter();
      return "stop";
    }
    run.ip.i++;
    return "continue";
  }

  function tick() {
    if (inTick) {
      pendingTick = true;
      return;
    }
    inTick = true;
    try {
      let guard = 0;
      while (guard++ < 100) {
        if (stepOnce() !== "continue") break;
      }
    } finally {
      inTick = false;
    }
    if (pendingTick) {
      pendingTick = false;
      tick();
      return;
    }
    emit();
  }

  function freshRun(ch) {
    return {
      status: "open",
      hints: 0,
      wrongs: 0,
      ethics: true,
      goals: {},
      missed: {},
      ip: { scene: ch.start, i: 0 },
      transcript: { beacon: [], pix: [] },
      unread: { beacon: false, pix: false },
      term: NA.sim.makeSession(ch.lab),
      webCwd: (ch.lab.web && ch.lab.web.start) || "/public",
      webFile: null,
      webSawSensitive: false,
      views: {},
      choiceLock: ""
    };
  }

  function isOpen(ch) {
    if (!state.player) return false;
    const i = NA.chapters.findIndex(function (c) { return c.id === ch.id; });
    if (i <= 0) return true;
    const prev = NA.chapters[i - 1];
    const run = state.chapters[prev.id];
    return !!(run && run.status === "done");
  }

  function addTrust(id, deltas) {
    if (state.trustLog.some(function (e) { return e.id === id; })) return;
    state.trustLog.push({ id: id, deltas: deltas });
    Object.keys(deltas).forEach(function (k) {
      state.trust[k] = (state.trust[k] || 0) + deltas[k];
    });
  }

  function recomputeTrust() {
    state.trust = { quill: 0, rook: 0, lena: 0, pix: 0 };
    state.trustLog.forEach(function (entry) {
      Object.keys(entry.deltas).forEach(function (k) {
        state.trust[k] = (state.trust[k] || 0) + entry.deltas[k];
      });
    });
  }

  function applyGoals(list) {
    const run = activeRun();
    (list || []).forEach(function (g) { run.goals[g] = true; });
  }

  const Game = {
    onChange: null,
    state: null,
    init: function (opts) {
      clearTimer();
      forceInstant = !!(opts && opts.instant);
      if (opts && opts.reset) {
        db.removeItem(KEY);
        db.removeItem(OLD_KEY);
      }
      state = load();
      state.settings.instant = forceInstant;
      Game.state = state;
      if (state.active && state.player) tick();
      else emit();
    },
    setPlayer: function (name, call) {
      const clean = function (v, max) {
        return String(v || "").replace(/[<>]/g, "").trim().slice(0, max);
      };
      state.notice = null;
      state.player = {
        name: clean(name, 24) || "Rowe",
        call: (clean(call, 12) || "LOW").toUpperCase()
      };
      save();
      emit();
    },
    setFast: function (v) {
      state.settings.fast = !!v;
      save();
      emit();
    },
    setSound: function (v) {
      state.settings.sound = !!v;
      save();
      emit();
    },
    resetAll: function () {
      clearTimer();
      db.removeItem(KEY);
      db.removeItem(OLD_KEY);
      state = freshState();
      state.settings.instant = forceInstant;
      Game.state = state;
      NA.lookingAt = null;
      emit();
    },
    chapterById: chapterById,
    currentChapter: currentChapter,
    activeRun: activeRun,
    viewingRun: viewingRun,
    viewingId: viewingId,
    isOpen: isOpen,
    currentStep: currentStep,
    blocked: function () {
      const step = currentStep();
      if (!step) return null;
      if (step.do === "choice" || step.do === "await") return step;
      return null;
    },
    startChapter: function (id) {
      const ch = chapterById(id);
      if (!ch) return { error: "missing" };
      if (!isOpen(ch)) return { error: "locked" };
      state.reviewing = null;
      if (!state.chapters[id]) state.chapters[id] = freshRun(ch);
      else hydrate(state.chapters[id]);
      if (!state.chapters[id].term) state.chapters[id].term = NA.sim.makeSession(ch.lab);
      state.active = id;
      save();
      tick();
      return { ok: true };
    },
    review: function (id) {
      state.reviewing = id;
      emit();
    },
    clearReview: function () {
      state.reviewing = null;
    },
    replayChapter: function (id) {
      const ch = chapterById(id);
      if (!ch) return { error: "missing" };
      const prevBest = state.best[id] || 0;
      clearTimer();
      state.trustLog = state.trustLog.filter(function (e) { return e.id.indexOf(id + ":") !== 0; });
      recomputeTrust();
      state.chapters[id] = freshRun(ch);
      state.best[id] = prevBest;
      state.reviewing = null;
      state.active = id;
      state.pendingDebrief = null;
      save();
      tick();
      return { ok: true };
    },
    choose: function (id) {
      const run = activeRun();
      const ch = currentChapter();
      const step = currentStep();
      if (!run || !step || step.do !== "choice") return { error: "no-choice" };
      const opt = (step.options || []).find(function (o) { return o.id === id; });
      if (!opt) {
        return {
          error: "no-such-option",
          id: id,
          scene: run.ip.scene,
          options: (step.options || []).map(function (o) { return o.id; })
        };
      }
      pushMsg({ who: "you", thread: step.thread || "beacon", text: opt.text });
      if (opt.trust) addTrust(ch.id + ":" + run.ip.scene + ":" + opt.id, opt.trust);
      if (opt.ethicsFail) run.ethics = false;
      if (opt.reply) {
        pushMsg({
          who: opt.reply.who,
          thread: opt.reply.thread || step.thread || "beacon",
          text: opt.reply.text
        });
      }
      if (opt.wrong) {
        const mid = run.ip.scene + ":" + run.ip.i + ":" + opt.id;
        if (!run.missed[mid]) {
          run.missed[mid] = true;
          run.wrongs++;
        }
        save();
        emit();
        return { ok: true, wrong: true };
      }
      if (opt.goal) run.goals[opt.goal] = true;
      (opt.goals || []).forEach(function (g) { run.goals[g] = true; });
      if (opt.goto) run.ip = { scene: opt.goto, i: 0 };
      else run.ip.i++;
      save();
      tick();
      return { ok: true };
    },
    skipTyping: function () {
      if (!timer) return;
      clearTimer();
      const step = currentStep();
      const run = activeRun();
      if (!step || step.do !== "say" || !run) return;
      commitSay(step);
      run.typing = null;
      run.ip.i++;
      save();
      tick();
    },
    look: function (thread) {
      NA.lookingAt = thread;
      const run = activeRun();
      if (run && run.unread && run.unread[thread]) {
        run.unread[thread] = false;
        save();
      }
    },
    termExec: function (line) {
      const run = activeRun();
      const ch = currentChapter();
      if (!run || !ch) return { error: "no-chapter" };
      if (!run.term) run.term = NA.sim.makeSession(ch.lab);
      const result = NA.sim.termReduce(run.term, line, ch.lab);
      run.term = result.session;
      if (result.penalty) {
        const key = "pen:" + String(line).trim();
        if (!run.missed[key]) {
          run.missed[key] = true;
          run.wrongs++;
        }
      }
      if (result.ethicsFail) run.ethics = false;
      if (result.aside) {
        pushMsg({ who: result.aside.who, thread: "beacon", text: result.aside.text });
      }
      applyGoals(result.goals);
      save();
      tick();
      return result;
    },
    openDoc: function (id) {
      const run = activeRun();
      const ch = currentChapter();
      if (!run || !ch) return { error: "no-chapter" };
      const doc = (ch.lab.files || []).find(function (d) { return d.id === id; });
      if (!doc) return { error: "missing" };
      if (doc.goal) run.goals[doc.goal] = true;
      run.views.doc = id;
      save();
      tick();
      return { doc: doc };
    },
    flagMail: function (id) {
      const run = activeRun();
      const ch = currentChapter();
      if (!run || !ch) return { error: "no-chapter" };
      const res = NA.sim.flagMail(id, ch.lab);
      run.views.mailNote = res.note;
      run.views.mailFocus = id;
      if (res.ok) run.goals[res.goal] = true;
      else if (!run.missed["mail:" + id]) {
        run.missed["mail:" + id] = true;
        run.wrongs++;
      }
      save();
      tick();
      return res;
    },
    submitIntel: function (data) {
      const run = activeRun();
      if (!run) return { error: "no-chapter" };
      const res = NA.sim.checkIntel(data);
      run.views.intel = { draft: data, ok: res.ok, note: res.note };
      if (res.ok) run.goals.intel = true;
      save();
      tick();
      return res;
    },
    attemptLogin: function (user, pass) {
      const run = activeRun();
      const ch = currentChapter();
      if (!run || !ch || !ch.lab.login) return { error: "no-login" };
      const mode = ch.lab.login.mode;
      if (mode === "factory" && ch.lab.login.needs && !run.goals[ch.lab.login.needs]) {
        run.views.login = { ok: false, note: "Read the field manual in Files first. This cell doesn't guess passwords." };
        save();
        emit();
        return run.views.login;
      }
      const res = mode === "sqli" ? NA.sim.checkSql(user, pass) : NA.sim.checkFactory(user, pass);
      run.views.login = res;
      if (res.ok) run.goals[mode === "sqli" ? "sqli" : "logged-in"] = true;
      else if (mode === "factory" && !run.missed.login) {
        run.missed.login = true;
        run.wrongs++;
      }
      save();
      tick();
      return res;
    },
    attemptEcho: function (text) {
      const run = activeRun();
      if (!run) return { error: "no-chapter" };
      const res = NA.sim.checkEcho(text);
      run.views.echo = { input: text, ok: res.ok, note: res.note, tags: res.tags || [] };
      if (res.ok) run.goals.xss = true;
      save();
      tick();
      return res;
    },
    webOpen: function (input) {
      const run = activeRun();
      const ch = currentChapter();
      if (!run || !ch || !ch.lab.web) return { error: "no-web" };
      const cwd = run.webCwd || ch.lab.web.start || "/public";
      const path = NA.sim.normJoin(cwd, input);
      const node = ch.lab.web.fs[path];
      if (!node && path !== "/") {
        run.views.webNote = "Nothing at " + path + ".";
        save();
        emit();
        return { error: "missing", path: path };
      }
      if (path === "/" || (node && node.dir)) {
        run.webCwd = path;
        run.webFile = null;
        run.views.webNote = null;
        save();
        emit();
        return { dir: true, path: path };
      }
      run.webFile = path;
      run.views.webNote = null;
      if (node.sensitive) run.webSawSensitive = true;
      if (node.goal) run.goals[node.goal] = true;
      save();
      tick();
      return { file: true, path: path, content: node.content, sensitive: !!node.sensitive };
    },
    reportPii: function () {
      const run = activeRun();
      const ch = currentChapter();
      if (!run || !run.webSawSensitive) return { error: "not-looking" };
      if (run.goals["reported-pii"]) return { ok: true };
      run.goals["reported-pii"] = true;
      addTrust(ch.id + ":pii", { lena: 1, quill: 1 });
      pushMsg({
        who: "lena",
        thread: "beacon",
        text: "Thank you. Close it. The finding is that the folder was reachable. I don't want the contents in your notes."
      });
      save();
      tick();
      return { ok: true };
    },
    submitReport: function (data) {
      const run = activeRun();
      if (!run) return { error: "no-chapter" };
      const res = NA.sim.checkReport(data);
      run.views.report = { draft: data, ok: res.ok, errors: res.errors, note: res.note };
      if (res.ok) run.goals.report = true;
      else if (!run.missed.report) {
        run.missed.report = true;
        run.wrongs++;
      }
      save();
      tick();
      return res;
    },
    setBrowserUrl: function (url) {
      const run = activeRun();
      if (!run) return;
      run.browserUrl = url;
      save();
    },
    buyHint: function () {
      const ch = currentChapter();
      const run = activeRun();
      if (!ch || !run || run.status === "done") return;
      if (run.hints >= ch.hints.length) {
        state.hintSheet = { text: ch.hints[ch.hints.length - 1], n: run.hints, maxed: true };
        emit();
        return;
      }
      run.hints += 1;
      const freeHints = ch.tier <= 1;
      state.hintSheet = {
        text: ch.hints[run.hints - 1],
        n: run.hints,
        cost: freeHints ? 0 : [0, 10, 20, 30][run.hints],
        free: freeHints
      };
      save();
      emit();
    },
    showHint: function () {
      const ch = currentChapter();
      const run = activeRun();
      if (!run || !ch) return;
      if (!run.hints) {
        Game.buyHint();
        return;
      }
      state.hintSheet = { text: ch.hints[Math.min(ch.hints.length, run.hints) - 1], n: run.hints, cost: 0, free: ch.tier <= 1 };
      emit();
    },
    closeHint: function () {
      state.hintSheet = null;
      emit();
    },
    remember: function (ui) {
      state.ui = ui;
      save();
    },
    openDebrief: function (id) {
      state.pendingDebrief = id;
      state.nudgeDebrief = true;
      emit();
    },
    closeDebrief: function () {
      state.pendingDebrief = null;
      state.nudgeDebrief = false;
      save();
      emit();
    },
    objective: function () {
      const ch = currentChapter();
      const run = activeRun();
      if (!ch || !run || run.status === "done") return null;
      const step = currentStep();
      let text = ch.objective;
      let progress = "";
      if (run && run.ip && String(run.ip.scene || "").indexOf("quiz") === 0) {
        text = "Answer the question at the bottom of the screen.";
      } else if (step && step.do === "choice") {
        text = "Answer the question at the bottom of the screen.";
      } else if (step && step.do === "await") {
        const left = step.goals.filter(function (g) { return !run.goals[g]; });
        progress = (step.goals.length - left.length) + "/" + step.goals.length;
        const labels = left.map(function (g) { return (ch.goalText && ch.goalText[g]) || g; });
        if (labels.length) text = labels[0];
      }
      let command = "";
      if (ch.tier <= 1 && run && ch.scaffold) {
        ch.scaffold.forEach(function (item) {
          if (!command && !run.goals[item.goal]) command = item.command;
        });
      }
      const tierNames = ["Basics", "Beginner", "Intermediate", "Advanced"];
      return {
        n: ch.n,
        title: ch.title,
        tier: ch.tier || 0,
        tierName: tierNames[ch.tier || 0] || "Basics",
        text: text,
        command: command,
        progress: progress,
        hints: run.hints,
        maxHints: (ch.hints || []).length,
        freeHints: ch.tier <= 1,
        provisional: scoreChapter(run)
      };
    },
    totalScore: function () {
      return Object.keys(state.best).reduce(function (sum, id) { return sum + (state.best[id] || 0); }, 0);
    },
    rank: function () {
      const rows = rankRows();
      const score = Game.totalScore();
      let name = rows[0].name;
      rows.forEach(function (r) { if (score >= r.min) name = r.name; });
      return { name: name, score: score, next: rows.filter(function (r) { return r.min > score; })[0] || null };
    },
    standing: function () {
      const t = state.trust || {};
      const score = (t.quill || 0) + (t.rook || 0) + (t.lena || 0) - (t.pix || 0);
      const word = score >= 8 ? "Trusted" : score >= 3 ? "Solid" : score > 0 ? "Shaky" : "Unproven";
      return { score: score, word: word, trust: t };
    },
    scoreChapter: scoreChapter,
    rankRows: rankRows,
    exportCode: function () {
      const json = JSON.stringify(persistable(state));
      return "NA2." + utf8ToB64url(json) + "." + checksum(json);
    },
    readCode: function (raw) {
      const code = extractCode(raw);
      const parts = code.match(/^(NA\d+)\.([A-Za-z0-9_-]+)\.([a-f0-9]+)$/i);
      if (!parts) {
        return { ok: false, error: "That doesn't look like a Night Audit save code. Copy the whole code, including the NA2 at the start." };
      }
      if (parts[1].toUpperCase() !== "NA2") {
        return { ok: false, error: "That save is from a different Night Audit version, so this page can't open it." };
      }
      let json = "";
      try {
        json = b64urlToUtf8(parts[2]);
      } catch (err) {
        return { ok: false, error: "That code is damaged. Copy it again, with no missing characters." };
      }
      if (checksum(json) !== parts[3].toLowerCase()) {
        return { ok: false, error: "That code is damaged. The checksum doesn't match. Copy it again." };
      }
      let data = null;
      try {
        data = JSON.parse(json);
      } catch (err) {
        return { ok: false, error: "That code is damaged. Copy it again." };
      }
      if (!data || data.v !== 2 || !data.trust || typeof data.chapters !== "object") {
        return { ok: false, error: "That save is from a different Night Audit version, so this page can't open it." };
      }
      data = normalize(data);
      return { ok: true, state: data, preview: describeSave(data), code: code };
    },
    applySave: function (incoming) {
      clearTimer();
      state = normalize(JSON.parse(JSON.stringify(incoming)));
      Game.state = state;
      NA.lookingAt = null;
      save();
      emit();
    },
    people: {
      quill: { name: "QUILL", role: "fixer" },
      rook: { name: "ROOK", role: "netrunner" },
      lena: { name: "VOSS", role: "corp liaison" },
      pix: { name: "PIX", role: "ghost" },
      you: { name: "YOU", role: "stringer" },
      system: { name: "HANDSET", role: "wire" }
    }
  };

  NA.Game = Game;
  NA.lookingAt = null;
})(typeof globalThis !== "undefined" ? globalThis : this);
