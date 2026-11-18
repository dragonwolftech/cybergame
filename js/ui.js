/* Full-page chat client. The lab never leaves this site. */
(function () {
  "use strict";

  const Game = NightAudit.Game;
  const screenEl = document.getElementById("screen");
  let stack = [{ name: "boot" }];
  let modal = null;
  let ready = false;
  let navigated = false;
  let sidebarOpen = false;
  let inspected = {};
  let histCursor = -1;
  let histDraft = "";
  let bootPhase = 1;
  let bootTimer = 0;
  let pendingCmd = "";

  const GLOSS = [
    ["IP address", "The number of one computer on a network. Example: 192.0.2.40. That range is for labs, not the real internet."],
    ["domain name", "A word name that points at a computer, like helixdyne.example. People remember the name. The computer still uses the number."],
    ["red team", "People hired to try to break a system and then write a report. Without the written hire, the same actions are an intrusion."],
    ["rules of engagement", "The written permission for a test: what you may touch, which techniques are allowed, the hours, and when you stop."],
    ["authorization", "Written permission. If it is not on the list, you do not have it."],
    ["scope", "The list of systems you are allowed to test. Nearby does not count."],
    ["password", "A secret you type to prove you are allowed in. Anyone who knows it can pretend to be that account."],
    ["phishing", "A message that pretends to be someone you trust so you will click or type a secret."],
    ["encoding", "A costume for text, like base64. Anyone can undo it. It is not a lock."],
    ["encryption", "A lock. Without the key, the text stays unreadable."],
    ["terminal", "A text window. You type a command and the computer prints an answer."],
    ["command", "One instruction you type into the terminal, then Run."],
    ["server", "A computer that waits for requests and sends answers."],
    ["network", "Computers that can send messages to each other."],
    ["request", "A message that asks for something. A browser request asks a server for a page."],
    ["HTTP", "The ordinary language websites use. The browser asks. The server answers."],
    ["hash", "A fingerprint of some text. You cannot turn the fingerprint back into the text."],
    ["port", "A numbered door on one computer. Different programs listen on different doors."]
  ];

  const CAST = {
    quill: { handle: "QUILL", tag: "fixer", glyph: "Q" },
    rook: { handle: "ROOK", tag: "runner", glyph: "R" },
    lena: { handle: "VOSS", tag: "corp", glyph: "V" },
    pix: { handle: "PIX", tag: "ghost", glyph: "X" }
  };

  const MARKS = {
    c1: "  /\\   CIVIC RANGE\n /__\\  ENGAGEMENT 04\n ROE   AFTER HOURS",
    c2: "  [◇]  HELIX DYNE\n  PUBLIC LIGHT\n  NO JACK-IN",
    c3: "  ▣▣▣  OPEN PORTS\n  GRID SCAN\n  LAB HOST ONLY",
    c4: "  ██  FACTORY\n  ██  SETTINGS\n  HELIXGATE",
    c5: "  ✉  THE POLITE LIE\n  MAIL ICE\n  READ THE HREF",
    c6: "  #  THREE SECRETS\n  COSTUME / HASH / LOCK",
    c7: "  >_  THE QUERY\n  MIRROR ONLY",
    c8: "  </>  ECHO\n  PARSE, DON'T RUN",
    c9: "  ../  BACK STAIR\n  FILES.HELIX",
    c10: "  #  BORROWED ROOT\n  SUDO / SUID",
    c11: "  >>  OTHER DOOR\n  SAME KEY, NEXT HOST",
    c12: "  ▣  WHAT WE LEAVE\n  LOGS / REPORT"
  };

  const HEADLINES = [
    "CINDERWHARF WIRE // neon rain locked over the docks until dawn",
    "HELIX DYNE // Beacon chrome waits on the Night Audit window",
    "LOWLIGHT // stringer jacked into a sealed range, city stays outside",
    "RANGE AUTHORITY // no carrier traffic leaves the handset",
    "METRO ICE // production turnstiles stay shut to the cell",
    "BLINKR // handles talk louder than the corp towers",
    "FIXER BOARD // chrome is cheap, a written scope is not",
    "SECTOR 7 // city lights drift, the grid holds",
    "SPRAWL // magenta wash on the Helix glass, acid on the river",
    "NIGHT MARKET // runners trade rumors, Night Audit trades reports"
  ];

  const BOOT_LINES = [
    "HANDSET 04  ·  CINDERWHARF GRID",
    "JACK IN  ·  CIVIC RANGE AUTHORITY",
    "ICE CHECK  ……  SEALED",
    "CARRIER  ……  NONE",
    "PACKETS LEAVING THE GLASS  ……  0",
    "NEON RAIN  ·  SECTOR 7  ·  LOCAL ONLY",
    "SIGNAL LOCK"
  ];

  const AudioBus = (function () {
    let ctx = null;
    let hum = null;
    let lfoTimer = 0;
    function context() {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      if (!ctx) ctx = new Ctor();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function startHum() {
      const c = context();
      if (!c || hum) return;
      const o1 = c.createOscillator();
      const o2 = c.createOscillator();
      const filter = c.createBiquadFilter();
      const gain = c.createGain();
      o1.type = "sawtooth";
      o2.type = "sine";
      o1.frequency.value = 55;
      o2.frequency.value = 82.4;
      filter.type = "lowpass";
      filter.frequency.value = 220;
      gain.gain.value = 0.012;
      o1.connect(filter);
      o2.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      o1.start();
      o2.start();
      hum = { o1: o1, o2: o2, gain: gain, filter: filter };
      lfoTimer = setInterval(function () {
        if (!hum || !ctx) return;
        const wobble = 180 + Math.sin(ctx.currentTime * 0.35) * 40;
        hum.filter.frequency.setTargetAtTime(wobble, ctx.currentTime, 0.2);
      }, 400);
    }
    function stopHum() {
      if (lfoTimer) {
        clearInterval(lfoTimer);
        lfoTimer = 0;
      }
      if (!hum) return;
      try { hum.o1.stop(); hum.o2.stop(); } catch (err) { /* already stopped */ }
      hum = null;
    }
    return {
      supported: function () { return !!(window.AudioContext || window.webkitAudioContext); },
      set: function (on) { if (on) startHum(); else stopHum(); },
      blip: function (freq) {
        const c = context();
        if (!c) return;
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "square";
        o.frequency.value = freq || 640;
        g.gain.setValueAtTime(0.035, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.07);
        o.connect(g);
        g.connect(c.destination);
        o.start();
        o.stop(c.currentTime + 0.08);
      }
    };
  })();

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function soundOn() {
    return !!(Game.state && Game.state.settings && Game.state.settings.sound);
  }

  const SVG = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 11 L12 4 L20 11 V20 H4 Z"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 6 H19 V16 H8 L5 19 Z"/></svg>',
    jobs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 7 V5 H16 V7 M4 7 H20 V19 H4 Z"/></svg>',
    term: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 7 L11 12 L5 17 M12 17 H19"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7 H20 V18 H4 Z M4 7 L12 13 L20 7"/></svg>',
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><path d="M4 12 H20 M12 4 C9 7 9 17 12 20 C15 17 15 7 12 4"/></svg>',
    files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7 H10 L12 9 H20 V19 H4 Z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 5 H12 V20 H5 Z M12 5 H19 V20 H12"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.5 5.5 L7.5 7.5 M16.5 16.5 L18.5 18.5 M18.5 5.5 L16.5 7.5 M7.5 16.5 L5.5 18.5"/></svg>'
  };

  function h(tag, props) {
    const node = document.createElement(tag);
    const kids = Array.prototype.slice.call(arguments, 2);
    Object.keys(props || {}).forEach(function (key) {
      const value = props[key];
      if (value == null || value === false) return;
      if (key === "class") node.className = value;
      else       if (key === "html") node.innerHTML = value;
      else if (key === "checked") node.checked = !!value;
      else if (key === "value") node.value = String(value);
      else if (key.indexOf("on") === 0 && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
      else node.setAttribute(key, value === true ? "" : String(value));
    });
    kids.forEach(function (kid) {
      if (kid == null || kid === false) return;
      if (Array.isArray(kid)) kid.forEach(function (part) { if (part) node.append(part.nodeType ? part : document.createTextNode(String(part))); });
      else node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    });
    return node;
  }

  function icon(name) {
    return h("span", { class: "ico", html: SVG[name] || "" });
  }

  function fill(text) {
    const player = (Game.state && Game.state.player) || { name: "operator", call: "LOW" };
    return String(text || "").split("{name}").join(player.name).split("{call}").join(player.call);
  }

  function gloss(text) {
    const source = fill(text);
    const parts = [];
    const used = {};
    let cursor = 0;
    const pattern = new RegExp("\\b(" + GLOSS.map(function (row) {
      return row[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("|") + ")\\b", "gi");
    let match;
    while ((match = pattern.exec(source))) {
      const word = match[1];
      const key = word.toLowerCase();
      parts.push(document.createTextNode(source.slice(cursor, match.index)));
      if (used[key]) parts.push(document.createTextNode(word));
      else {
        used[key] = true;
        const def = (GLOSS.filter(function (row) { return row[0].toLowerCase() === key; })[0] || ["", ""])[1];
        parts.push(h("button", {
          class: "jargon",
          type: "button",
          onClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            const open = event.currentTarget.querySelector(".jargontip");
            if (open) open.remove();
            else event.currentTarget.append(h("span", { class: "jargontip" }, def));
          }
        }, word));
      }
      cursor = match.index + word.length;
    }
    parts.push(document.createTextNode(source.slice(cursor)));
    return parts;
  }

  function insertCommand(cmd) {
    pendingCmd = cmd;
    if (view().name !== "terminal") go("terminal");
    else refresh();
  }

  function view() { return stack[stack.length - 1]; }

  function viewKey() {
    const v = view();
    return [v.name, v.thread || "", v.doc || "", v.letter || "", v.entry || ""].join("|");
  }

  function clock() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function fmtTime(ts) {
    const d = new Date(ts || Date.now());
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function normUrl(url) {
    let s = String(url || "").trim();
    if (!s) return "";
    if (!/^https?:\/\//i.test(s)) s = "https://" + s;
    return s.replace(/\/$/, "");
  }

  function remember() {
    if (!Game.state || !Game.state.player) return;
    const v = view();
    Game.remember({
      screen: v.name,
      thread: v.thread || null,
      doc: v.doc || null,
      letter: v.letter || null,
      entry: v.entry || null
    });
  }

  function go(name, extra) {
    const next = Object.assign({ name: name }, extra || {});
    if (name === "home" || name === "jobs") stack = [Object.assign(next, { name: name === "home" ? "jobs" : name })];
    else stack.push(next);
    if (stack.length > 16) stack.splice(1, stack.length - 16);
    if (name === "home" || name === "jobs" || name === "messages") Game.clearReview();
    if (name === "thread") Game.look(next.thread || "beacon");
    remember();
    navigated = true;
    refresh();
  }

  function back() {
    if (stack.length > 1) stack.pop();
    else stack = [{ name: "jobs" }];
    remember();
    navigated = true;
    refresh();
  }

  function snapshot() {
    const sc = screenEl.querySelector(".scroll");
    const fields = [];
    screenEl.querySelectorAll("[data-keep]").forEach(function (el) {
      fields.push({ id: el.id, value: el.value, checked: el.checked, start: el.selectionStart });
    });
    const focus = document.activeElement && document.activeElement.id;
    const stick = !sc || (sc.scrollHeight - sc.scrollTop - sc.clientHeight < 90);
    return { fields: fields, scroll: sc ? sc.scrollTop : 0, stick: stick, focus: focus, key: viewKey() };
  }

  function restore(shot, jumped) {
    if (!shot) return;
    shot.fields.forEach(function (f) {
      const el = document.getElementById(f.id);
      if (!el) return;
      if (el.type === "checkbox" || el.type === "radio") el.checked = f.checked;
      else el.value = f.value;
      if (document.activeElement !== el && shot.focus === f.id) {
        el.focus();
        try { if (typeof f.start === "number") el.setSelectionRange(f.start, f.start); } catch (err) { /* date inputs */ }
      }
    });
    const sc = screenEl.querySelector(".scroll");
    if (sc) {
      const follow = view().name === "thread" || view().name === "terminal";
      if (!jumped && shot.key === viewKey()) sc.scrollTop = shot.stick ? sc.scrollHeight : shot.scroll;
      else sc.scrollTop = follow ? sc.scrollHeight : 0;
    }
    if (shot.focus && document.getElementById(shot.focus)) document.getElementById(shot.focus).focus();
  }

  function refresh() {
    if (!ready) return;
    const shot = snapshot();
    if (view().name === "thread" && !(Game.state && Game.state.reviewing)) Game.look(view().thread || "beacon");
    else NightAudit.lookingAt = null;
    const jumped = navigated;
    navigated = false;
    try {
      screenEl.replaceChildren(shell());
    } catch (err) {
      screenEl.textContent = "Handset glitch: " + err.message;
      console.error(err);
      return;
    }
    restore(shot, jumped);
    if (pendingCmd) {
      const input = document.getElementById("term-in");
      if (input) {
        input.value = pendingCmd;
        input.focus();
      }
      pendingCmd = "";
    }
  }

  function onGame() {
    if (Game.state && Game.state.nudgeDebrief) Game.state.nudgeDebrief = false;
    refresh();
  }

  function shell() {
    const name = view().name;
    if (name === "boot" || name === "ident") {
      const gate = h("div", { class: "gate" });
      gate.append(body());
      if (Game.state && Game.state.hintSheet) gate.append(hintSheet());
      if (modal) gate.append(modalBox());
      return gate;
    }
    const root = h("div", { class: "workspace" + (sidebarOpen ? " nav-open" : "") });
    root.append(sidebar());
    const main = h("div", { class: "workspace-main" });
    main.append(workspaceHead());
    const note = alertBanner();
    if (note) main.append(note);
    if (showTabs()) main.append(tabBar());
    if (showObjective()) main.append(objectiveBar());
    main.append(body());
    root.append(main);
    if (sidebarOpen) {
      root.append(h("button", { class: "scrim", "aria-label": "Close channels", onClick: function () { sidebarOpen = false; refresh(); } }));
    }
    if (Game.state && Game.state.hintSheet) root.append(hintSheet());
    if (modal) root.append(modalBox());
    return root;
  }

  function closeNav() {
    sidebarOpen = false;
  }

  function workspaceHead() {
    return h("header", { class: "workspace-head" },
      h("button", {
        class: "menu",
        onClick: function () { sidebarOpen = !sidebarOpen; refresh(); }
      }, sidebarOpen ? "Close" : "Channels"),
      h("h2", { class: "glitch" }, paneTitle()),
      h("span", { class: "fine", id: "clock" }, clock())
    );
  }

  function paneTitle() {
    const name = view().name;
    const titles = {
      messages: "Channels",
      thread: (view().thread === "pix" ? "PIX" : "Beacon Cell"),
      jobs: "Dispatch",
      terminal: "Terminal",
      mail: "Mail",
      letter: "Mail",
      browser: "Browser",
      files: "Files",
      doc: "Files",
      codex: "Codex",
      entry: "Codex",
      settings: "Settings",
      debrief: "Debrief"
    };
    return titles[name] || "Night Audit";
  }

  function sidebar() {
    const player = (Game.state && Game.state.player) || { name: "", call: "" };
    const rank = Game.state && Game.state.player ? Game.rank() : { name: "—", score: 0 };
    const stand = Game.state && Game.state.player ? Game.standing() : { word: "Unproven", trust: {} };
    const run = Game.activeRun();
    const here = view();
    function goNav(name, extra) {
      closeNav();
      go(name, extra);
    }
    const side = h("aside", { class: "sidebar" });
    side.append(h("div", { class: "brand" }, h("h1", { class: "glitch" }, "Night Audit"), h("span", {}, "GRID")));
    if (player.name) {
      side.append(h("div", { class: "rankcard" },
        h("div", { class: "rank" }, rank.name),
        h("div", { class: "meta" }, rank.score + " banked · " + player.call + " · " + stand.word + (stand.trust.pix >= 3 ? " · PIX has your ear" : ""))
      ));
    }
    side.append(h("div", { class: "side-label" }, "Channels"));
    [
      ["beacon", "# Beacon Cell"],
      ["pix", "# PIX"]
    ].forEach(function (row) {
      const unread = run && !Game.state.reviewing && run.unread && run.unread[row[0]] && !(here.name === "thread" && (here.thread || "beacon") === row[0]);
      side.append(h("button", {
        class: "chan" + (here.name === "thread" && (here.thread || "beacon") === row[0] ? " on" : ""),
        onClick: function () { goNav("thread", { thread: row[0] }); }
      }, h("span", {}, row[1]), unread ? h("i", { class: "dot" }) : null));
    });
    side.append(h("div", { class: "side-label" }, "Range"));
    [
      ["jobs", "Dispatch", "jobs"],
      ["codex", "Codex", "book"],
      ["settings", "Settings", "gear"]
    ].forEach(function (item) {
      side.append(h("button", {
        class: "navbtn" + (here.name === item[0] || (item[0] === "codex" && here.name === "entry") ? " on" : ""),
        onClick: function () { goNav(item[0]); }
      }, icon(item[2]), item[1]));
    });
    side.append(ticker());
    side.append(h("div", { class: "sidefoot" }, "Sealed handset. The neon rain stays outside the glass."));
    return side;
  }

  function ticker() {
    const lines = reducedMotion() ? HEADLINES.slice(0, 3) : HEADLINES.concat(HEADLINES);
    return h("div", { class: "ticker" },
      h("div", { class: "ticker-label" }, "Cinderwharf wire"),
      h("div", { class: "ticker-window" },
        h("div", { class: "ticker-track" }, lines.map(function (line) {
          return h("span", {}, line);
        }))
      )
    );
  }

  function chapterMark(id) {
    if (!id || !MARKS[id]) return null;
    return h("pre", { class: "mark", "aria-hidden": "true" }, MARKS[id]);
  }

  function showTabs() {
    const name = view().name;
    return ["thread", "messages", "terminal", "mail", "letter", "browser", "files", "doc"].indexOf(name) !== -1;
  }

  function tabBar() {
    const name = view().name;
    const tabs = [
      ["chat", "Chat"],
      ["terminal", "Terminal"],
      ["mail", "Mail"],
      ["browser", "Browser"],
      ["files", "Files"]
    ];
    function active(id) {
      if (id === "chat") return name === "thread" || name === "messages";
      if (id === "mail") return name === "mail" || name === "letter";
      if (id === "files") return name === "files" || name === "doc";
      return name === id;
    }
    return h("nav", { class: "tabs" }, tabs.map(function (tab) {
      return h("button", {
        class: active(tab[0]) ? "on" : "",
        onClick: function () {
          closeNav();
          if (tab[0] === "chat") {
            const thread = view().thread || "beacon";
            go("thread", { thread: thread });
          } else go(tab[0]);
        }
      }, tab[1]);
    }));
  }

  function alertBanner() {
    const run = Game.activeRun();
    const reviewing = Game.state && Game.state.reviewing;
    const here = view().name === "thread" ? (view().thread || "beacon") : null;
    if (run && run.status !== "done" && !reviewing) {
      const step = Game.blocked();
      if (step && step.do === "choice") {
        const thread = step.thread || "beacon";
        if (thread !== here) {
          const who = thread === "pix" ? "PIX" : "Beacon Cell";
          return h("button", { class: "banner", onClick: function () { go("thread", { thread: thread }); } }, who + " is waiting for a reply");
        }
      }
      if (run.unread && run.unread.pix && here !== "pix") {
        return h("button", { class: "banner", onClick: function () { go("thread", { thread: "pix" }); } }, "New message from PIX");
      }
      if (run.unread && run.unread.beacon && here !== "beacon") {
        return h("button", { class: "banner", onClick: function () { go("thread", { thread: "beacon" }); } }, "New message in Beacon Cell");
      }
    }
    if (Game.state.pendingDebrief && view().name !== "debrief") {
      return h("button", { class: "banner ready", onClick: function () { go("debrief"); } }, "Debrief is ready");
    }
    return null;
  }

  function showObjective() {
    const name = view().name;
    return ["thread", "terminal", "mail", "letter", "browser", "files", "doc"].indexOf(name) !== -1 && Game.objective();
  }

  function objectiveBar() {
    const info = Game.objective();
    if (!info) return h("div");
    const run = Game.activeRun();
    return h("div", { class: "obj" },
      h("div", {},
        h("strong", {}, (info.tierName || "Basics") + " · " + String(info.n).padStart(2, "0") + (info.progress ? "  " + info.progress : "")),
        h("p", {}, gloss(info.text)),
        info.command ? h("button", {
          class: "cmdchip",
          onClick: function () { insertCommand(info.command); }
        }, "Type: " + info.command) : null
      ),
      h("button", {
        class: "hintbtn",
        onClick: function () { if (run && run.hints) Game.showHint(); else Game.buyHint(); }
      }, "Hint" + (info.freeHints ? " · free" : "") + " " + info.hints + "/" + info.maxHints)
    );
  }

  function topbar() {
    if (stack.length <= 1) return h("span");
    return h("div", { class: "backrow" },
      h("button", { class: "textbtn", onClick: back }, "← Back")
    );
  }

  function body() {
    const name = view().name;
    const map = {
      boot: bootView,
      ident: identView,
      home: homeView,
      messages: messagesView,
      thread: threadView,
      jobs: jobsView,
      terminal: terminalView,
      mail: mailView,
      letter: letterView,
      browser: browserView,
      files: filesView,
      doc: docView,
      codex: codexView,
      entry: entryView,
      settings: settingsView,
      debrief: debriefView
    };
    const fn = map[name] || homeView;
    return fn();
  }

  function armBoot() {
    if (bootTimer || bootPhase >= BOOT_LINES.length) return;
    if (reducedMotion()) {
      bootPhase = BOOT_LINES.length;
      return;
    }
    bootTimer = setTimeout(function () {
      bootTimer = 0;
      bootPhase = Math.min(BOOT_LINES.length, bootPhase + 1);
      if (view().name === "boot") refresh();
    }, 340);
  }

  function bootView() {
    armBoot();
    const done = bootPhase >= BOOT_LINES.length;
    const lines = BOOT_LINES.slice(0, reducedMotion() ? BOOT_LINES.length : bootPhase);
    const log = h("div", { class: "bootlog" });
    lines.forEach(function (line, i) {
      log.append(h("p", { class: "bootline" + (i === lines.length - 1 ? " hot" : "") }, "> " + line));
    });
    const wrap = h("div", { class: "view" });
    const scroll = h("div", { class: "scroll boot" },
      h("p", { class: "kicker" }, "Civic Range // jack-in"),
      h("h1", { class: "wordmark glitch" }, "Night Audit"),
      log,
      h("p", {}, "Handset 04 · the sprawl of Cinderwharf"),
      h("p", { class: "lead" }, "You start from zero. The first lessons are words and six commands. Nothing here touches a real network.")
    );
    if (Game.state && Game.state.notice) scroll.append(h("p", { class: "warn" }, Game.state.notice));
    if (done) {
      scroll.append(h("button", { class: "btn primary", id: "jack-in", onClick: function () { go("ident"); } }, "Jack in"));
    }
    wrap.append(scroll);
    return wrap;
  }

  function identView() {
    const wrap = h("div", { class: "view" });
    const name = h("input", { id: "pname", "data-keep": "1", maxlength: "24", autocapitalize: "words", autocomplete: "off", placeholder: "Rowe" });
    const call = h("input", { id: "pcall", "data-keep": "1", maxlength: "12", autocapitalize: "characters", autocomplete: "off", placeholder: "LOW" });
    function take(useByline) {
      const n = useByline ? "Rowe" : name.value;
      const c = useByline ? "LOW" : call.value;
      Game.setPlayer(n, c);
      stack = [{ name: "jobs" }];
      remember();
      navigated = true;
      refresh();
    }
    wrap.append(h("div", { class: "scroll ident" },
      h("p", { class: "kicker" }, "Locker tag"),
      h("h2", { class: "greet glitch" }, "Who's jacking into the channel?"),
      h("p", { class: "sub" }, "The Lowlight ran your Beacon piece through the sprawl. Quill will burn whatever name you give the cell."),
      h("label", { class: "field" }, "Name", name),
      h("label", { class: "field" }, "Callsign", call),
      h("button", { class: "btn primary", onClick: function () { take(false); } }, "Jack into the channel"),
      h("button", { class: "ghost", onClick: function () { take(true); } }, "Use the byline · Rowe / LOW")
    ));
    return wrap;
  }

  function homeView() {
    const player = Game.state.player;
    const rank = Game.rank();
    const stand = Game.standing();
    const hour = new Date().getHours();
    const shift = hour < 5 || hour >= 22 ? "Late shift" : hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
    const job = nextJob();
    const wrap = h("div", { class: "view" });
    const scroll = h("div", { class: "scroll home" });
    scroll.append(
      h("p", { class: "kicker" }, "Cinderwharf"),
      h("h2", { class: "greet" }, shift + ", " + player.name + "."),
      h("p", { class: "sub" }, job ? "Engagement 04 is on the dispatch list." : "The report is filed. The rollout can wait on the truth."),
      h("div", { class: "rankcard" },
        h("div", { class: "rank" }, rank.name),
        h("div", { class: "meta" }, rank.score + " banked · " + player.call + " · standing " + stand.word + (stand.trust.pix >= 3 ? " · PIX has your ear" : ""))
      )
    );
    if (Game.state.pendingDebrief) {
      scroll.append(h("button", { class: "btn", onClick: function () { Game.openDebrief(Game.state.pendingDebrief); } }, "Debrief is waiting on the handset"));
    }
    if (job) {
      scroll.append(h("button", {
        class: "btn primary",
        onClick: function () { begin(job.ch.id); }
      }, (job.mode === "continue" ? "Return to " : "Start ") + job.ch.title));
    }
    scroll.append(h("div", { class: "grid" }, [
      appBtn("messages", "msg", "Messages", ""),
      appBtn("jobs", "jobs", "Jobs", "amb"),
      appBtn("terminal", "term", "Terminal", "grn"),
      appBtn("mail", "mail", "Mail", "mag"),
      appBtn("browser", "web", "Browser", ""),
      appBtn("files", "files", "Files", "amb"),
      appBtn("codex", "book", "Codex", "vio"),
      appBtn("settings", "gear", "Settings", "")
    ]));
    wrap.append(scroll);
    return wrap;
  }

  function appBtn(name, glyph, label, tone) {
    return h("button", { class: "appbtn", onClick: function () { go(name); } },
      h("span", { class: "glyph " + tone }, icon(glyph)),
      label
    );
  }

  function nextJob() {
    const chapters = NightAudit.chapters;
    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      const run = Game.state.chapters[ch.id];
      if (run && run.status !== "done") return { ch: ch, mode: "continue" };
      if (!run && Game.isOpen(ch)) return { ch: ch, mode: "start" };
    }
    return null;
  }

  function begin(id) {
    const res = Game.startChapter(id);
    if (!res.ok) return;
    go("thread", { thread: "beacon" });
  }

  function messagesView() {
    const run = Game.viewingRun();
    const wrap = h("div", { class: "view" });
    const scroll = h("div", { class: "scroll" });
    if (!run) {
      scroll.append(h("p", { class: "sub" }, "Dispatch hasn't opened a channel. Jobs are on the home screen."));
    } else {
      [
        ["beacon", "Beacon Cell", "QUILL · ROOK · VOSS"],
        ["pix", "PIX", "ghost on the wire"]
      ].forEach(function (row) {
        const list = (run.transcript && run.transcript[row[0]]) || [];
        const last = list[list.length - 1];
        const unread = Game.activeRun() && Game.state.active === Game.viewingId() && Game.activeRun().unread && Game.activeRun().unread[row[0]];
        const preview = last ? fill(last.text || (last.card && last.card.title) || "Attachment") : "No traffic yet";
        scroll.append(h("button", {
          class: "thread",
          onClick: function () { go("thread", { thread: row[0] }); }
        },
          h("strong", { class: "who" }, row[1] + (unread ? " · new" : "")),
          h("span", { class: "fine" }, row[2]),
          h("span", { class: "preview" }, preview)
        ));
      });
    }
    wrap.append(topbar("Messages"), scroll);
    return wrap;
  }

  function threadView() {
    const thread = view().thread || "beacon";
    const run = Game.viewingRun();
    const active = Game.activeRun();
    const reviewing = Game.state.reviewing;
    const wrap = h("div", { class: "view" });
    wrap.append(topbar(thread === "pix" ? "PIX" : "Beacon Cell"));
    if (reviewing) {
      wrap.append(h("div", { class: "banner" }, "Filed chapter. Read only."));
    }
    const sc = h("div", { class: "scroll chat" });
    const viewing = Game.viewingId && Game.viewingId();
    const mark = chapterMark(viewing);
    if (mark) sc.append(mark);
    const msgs = (run && run.transcript && run.transcript[thread]) || [];
    if (!msgs.length) sc.append(h("div", { class: "sysmsg" }, "The channel is quiet."));
    msgs.forEach(function (m, i) { sc.append(bubble(m, i === msgs.length - 1)); });
    if (!reviewing && active && active.typing && active.typing.thread === thread && Game.state.active === Game.viewingId()) {
      sc.append(h("div", { class: "msg" },
        h("div", { class: "who who-" + active.typing.who }, person(active.typing.who)),
        h("div", {},
          h("span", { class: "typing" }, h("i"), h("i"), h("i")),
          h("button", { class: "skip", onClick: function () { Game.skipTyping(); } }, "skip")
        )
      ));
    }
    wrap.append(sc);
    const step = Game.blocked();
    if (!reviewing && step && step.do === "choice" && (step.thread || "beacon") === thread) {
      wrap.append(h("div", { class: "composer" }, step.options.map(function (opt) {
        return h("button", { class: "choice", "data-choice": opt.id, onClick: function () { Game.choose(opt.id); } }, opt.text);
      })));
    }
    return wrap;
  }

  function person(who) {
    if (who === "you") {
      const call = (Game.state && Game.state.player && Game.state.player.call) || "YOU";
      return h("span", { class: "who-bits" },
        h("span", { class: "avatar", "aria-hidden": "true" }, call.slice(0, 1)),
        h("span", {}, call),
        h("span", { class: "tag" }, "stringer")
      );
    }
    const cast = CAST[who];
    if (!cast) return who || "";
    return h("span", { class: "who-bits" },
      h("span", { class: "avatar", "aria-hidden": "true" }, cast.glyph),
      h("span", {}, cast.handle),
      h("span", { class: "tag" }, cast.tag)
    );
  }

  function bubble(m, fresh) {
    const beat = fresh ? " beat" : "";
    if (m.kind === "card" && m.card) {
      return h("div", { class: "msg" + beat },
        h("div", { class: "who who-" + m.who }, person(m.who)),
        h("button", {
          class: "cardmsg",
          onClick: function () { openCard(m.card); }
        }, m.card.title, h("span", {}, m.card.sub || "Open"))
      );
    }
    if (m.who === "system") return h("div", { class: "sysmsg" + beat }, gloss("HANDSET // " + (m.text || "")));
    const mine = m.who === "you";
    return h("div", { class: "msg" + (mine ? " mine" : "") + beat },
      h("div", { class: "who who-" + m.who }, person(m.who)),
      h("div", { class: "bubble" }, gloss(m.text)),
      h("div", { class: "when" }, fmtTime(m.time))
    );
  }

  function openCard(card) {
    if (card.doc) Game.openDoc(card.doc);
    if (card.url) Game.setBrowserUrl(normUrl(card.url));
    if (card.app === "files" && card.doc) go("doc", { doc: card.doc });
    else if (card.app) go(card.app);
  }

  function jobsView() {
    const wrap = h("div", { class: "view" });
    const sc = h("div", { class: "scroll" });
    sc.append(h("p", { class: "sub" }, "Start at Tier 0 if the words are new. One idea at a time. Hints are free in Tier 0 and Tier 1."));
    let lastTier = -1;
    const tierNames = ["Tier 0 · Basics", "Tier 1 · Beginner", "Tier 2 · Intermediate", "Tier 3 · Advanced"];
    NightAudit.chapters.forEach(function (ch) {
      if ((ch.tier || 0) !== lastTier) {
        lastTier = ch.tier || 0;
        sc.append(h("h2", { class: "tierhead" }, tierNames[lastTier] || "Tier"));
      }
      const open = Game.isOpen(ch);
      const run = Game.state.chapters[ch.id];
      const done = run && run.status === "done";
      const card = h("article", { class: "job" + (open ? "" : " locked") + (done ? " done" : "") });
      const mark = chapterMark(ch.id);
      if (mark) card.append(mark);
      card.append(h("div", { class: "jobn" }, String(ch.n).padStart(2, "0")));
      if (done) card.append(h("div", { class: "stamp" }, "FILED"));
      card.append(h("h3", {}, ch.title), h("p", { class: "concept" }, ch.concept));
      if (!open) card.append(h("p", { class: "lock" }, "Locked — finish the previous chapter."));
      else if (done) {
        card.append(h("p", { class: "fine" }, (Game.state.best[ch.id] || 0) + " pts banked"));
        const row = h("div", { class: "row" });
        row.append(h("button", { class: "btn", onClick: function () { Game.openDebrief(ch.id); } }, "Debrief"));
        row.append(h("button", { class: "btn", onClick: function () { Game.review(ch.id); go("thread", { thread: "beacon" }); } }, "Thread"));
        row.append(h("button", { class: "ghost", onClick: function () { confirmReplay(ch); } }, "Replay"));
        card.append(row);
      }       else if (run) card.append(h("button", { class: "btn primary", onClick: function () { begin(ch.id); } }, "Return to " + ch.title));
      else card.append(h("button", { class: "btn primary", onClick: function () { begin(ch.id); } }, "Start " + ch.title));
      sc.append(card);
    });
    wrap.append(topbar("Dispatch"), sc);
    return wrap;
  }

  function confirmReplay(ch) {
    modal = {
      title: "Replay " + ch.title + "?",
      text: "Your best score stays on the books. Trust you earned in this chapter is taken again from the choices you make now.",
      yes: "Replay",
      onYes: function () {
        modal = null;
        Game.replayChapter(ch.id);
        go("thread", { thread: "beacon" });
      }
    };
    refresh();
  }

  function lab() {
    const ch = Game.currentChapter();
    return ch ? ch.lab : null;
  }

  function needJob(title, copy) {
    const wrap = h("div", { class: "view" });
    wrap.append(topbar(title), h("div", { class: "scroll" }, h("p", { class: "sub" }, copy)));
    return wrap;
  }

  function terminalView() {
    const run = Game.activeRun();
    const chapterLab = lab();
    if (!run || !chapterLab) return needJob("Terminal", "No job loaded. Open Dispatch and take a chapter.");
    if (!run.term) run.term = NightAudit.sim.makeSession(chapterLab);
    const wrap = h("div", { class: "view" });
    wrap.append(topbar("Terminal"));
    const sc = h("div", { class: "scroll termscroll" });
    run.term.lines.forEach(function (line) {
      sc.append(h("div", { class: "t-" + (line.cls || "out") }, line.text));
    });
    const input = h("input", {
      id: "term-in",
      "data-keep": "1",
      autocapitalize: "off",
      autocomplete: "off",
      spellcheck: "false",
      "aria-label": "Command",
      placeholder: run.term.mode === "pass" ? "passphrase" : "help"
    });
    input.addEventListener("keydown", function (event) {
      const history = run.term.history || [];
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        if (!history.length || run.term.mode === "pass") return;
        if (histCursor < 0) histDraft = input.value;
        if (event.key === "ArrowUp") histCursor = histCursor < 0 ? history.length - 1 : Math.max(0, histCursor - 1);
        else histCursor = histCursor < 0 ? -1 : Math.min(history.length, histCursor + 1);
        input.value = histCursor < 0 || histCursor >= history.length ? histDraft : history[histCursor];
      }
    });
    const form = h("form", {
      class: "termform",
      onSubmit: function (event) {
        event.preventDefault();
        const value = input.value;
        input.value = "";
        histCursor = -1;
        Game.termExec(value);
      }
    }, input, h("button", { class: "btn", type: "submit" }, "Run"));
    wrap.append(sc, form);
    return wrap;
  }

  function mailView() {
    const chapterLab = lab();
    const run = Game.activeRun();
    if (!chapterLab || !run) return needJob("Mail", "The lab mailbox is dark. Take a job first.");
    const wrap = h("div", { class: "view" });
    const sc = h("div", { class: "scroll" });
    const mail = chapterLab.mail || [];
    if (!mail.length) sc.append(h("p", { class: "sub" }, "Nothing in the lab mailbox for this chapter."));
    mail.forEach(function (m) {
      sc.append(h("button", {
        class: "mailitem",
        onClick: function () { go("letter", { letter: m.id }); }
      },
        h("strong", {}, m.from),
        h("div", {}, m.subject),
        h("small", {}, m.addr + " · " + m.time)
      ));
    });
    if (run.views && run.views.mailNote) sc.append(h("p", { class: run.goals && run.goals["flagged-phish"] ? "oknote" : "warn" }, run.views.mailNote));
    wrap.append(topbar("Mail"), sc);
    return wrap;
  }

  function letterView() {
    const chapterLab = lab();
    const run = Game.activeRun();
    const mail = chapterLab && (chapterLab.mail || []).find(function (m) { return m.id === view().letter; });
    if (!mail || !run) return mailView();
    const wrap = h("div", { class: "view" });
    const sc = h("div", { class: "scroll letter" });
    sc.append(h("h2", {}, mail.subject));
    sc.append(h("p", { class: "addr" }, mail.from + " <" + mail.addr + ">"));
    sc.append(h("p", { class: "fine" }, "Reply-To: " + (mail.replyTo || mail.addr)));
    mail.paragraphs.forEach(function (p) { sc.append(h("p", {}, p)); });
    if (mail.link) {
      const shown = inspected[mail.id];
      const mismatch = mail.link.href.replace(/\/$/, "") !== mail.link.text.replace(/\/$/, "");
      sc.append(h("div", { class: "linkcard" },
        h("p", {}, mail.link.text),
        shown ? h("p", { class: mismatch ? "warn" : "oknote" }, "Destination: " + mail.link.href) : null,
        h("button", {
          class: "btn",
          onClick: function () { inspected[mail.id] = true; refresh(); }
        }, shown ? "Destination is on the card" : "Inspect destination")
      ));
    }
    sc.append(h("button", {
      class: "btn primary",
      onClick: function () { Game.flagMail(mail.id); }
    }, "Flag as phishing"));
    if (run.views && run.views.mailFocus === mail.id && run.views.mailNote) {
      sc.append(h("p", { class: run.goals["flagged-phish"] && mail.phish ? "oknote" : "warn" }, run.views.mailNote));
    }
    wrap.append(topbar("Message"), sc);
    return wrap;
  }

  function browserView() {
    const chapterLab = lab();
    const run = Game.activeRun();
    if (!chapterLab || !run || !chapterLab.browser) return needJob("Browser", "The proxy has no clips until a job is loaded.");
    const pages = chapterLab.browser.pages || {};
    const current = normUrl(run.browserUrl || chapterLab.browser.home);
    const page = pages[current] || pages[current + "/"];
    const wrap = h("div", { class: "view" });
    wrap.append(topbar("Browser"));
    const bar = h("form", {
      class: "urlbar",
      onSubmit: function (event) {
        event.preventDefault();
        const input = document.getElementById("url-in");
        const next = normUrl(input.value);
        input.value = "";
        Game.setBrowserUrl(next);
        refresh();
      }
    },
      h("input", { id: "url-in", "data-keep": "1", placeholder: current || "lab url", "aria-label": "Address", autocapitalize: "off", autocomplete: "off", spellcheck: "false" }),
      h("button", { class: "btn", type: "submit" }, "Go")
    );
    const marks = h("div", { class: "bookmarks" }, (chapterLab.browser.bookmarks || []).map(function (b) {
      return h("button", { onClick: function () { Game.setBrowserUrl(normUrl(b.url)); refresh(); } }, b.label);
    }));
    const sc = h("div", { class: "scroll" });
    sc.append(renderPage(page, current));
    wrap.append(bar, marks, sc);
    return wrap;
  }

  function renderPage(page, url) {
    if (!page) {
      return h("div", {},
        h("h2", {}, "Range proxy"),
        h("p", { class: "warn" }, "This client only opens pages clipped into the lab. Nothing was sent to the real internet."),
        h("p", { class: "fine" }, url || "")
      );
    }
    const head = [h("p", { class: "kicker" }, url), h("h2", {}, page.title || "Page")];
    if (page.type === "login") return h("div", {}, head, blocks(page.blocks), loginForm());
    if (page.type === "echo") return h("div", {}, head, blocks(page.blocks), echoForm());
    if (page.type === "intel") return h("div", {}, head, blocks(page.blocks), intelForm());
    if (page.type === "report") return h("div", {}, head, blocks(page.blocks), reportForm());
    if (page.type === "files") return h("div", { class: "filesite" }, head, blocks(page.blocks), fileSite());
    return h("div", {}, head, blocks(page.blocks));
  }

  function blocks(list) {
    return (list || []).map(function (block) {
      if (block.h) return h("h3", { class: "ph" }, block.h);
      if (block.p) return h("p", {}, block.p);
      if (block.warn) return h("p", { class: "warn" }, block.warn);
      if (block.code) return h("pre", { class: "code" }, block.code);
      if (block.a) return h("button", { class: "linkish", onClick: function () { Game.setBrowserUrl(normUrl(block.a[0])); refresh(); } }, block.a[1]);
      return null;
    });
  }

  function loginForm() {
    const run = Game.activeRun();
    const res = run.views.login;
    if (res && res.ok) {
      return h("div", {},
        h("p", { class: "oknote" }, res.note),
        res.query ? h("pre", {}, res.query) : null,
        res.flag ? h("p", {}, "Token: " + res.flag) : null
      );
    }
    return h("form", {
      onSubmit: function (event) {
        event.preventDefault();
        const user = document.getElementById("login-user").value;
        const pass = document.getElementById("login-pass").value;
        Game.attemptLogin(user, pass);
      }
    },
      h("label", { class: "field" }, "Username", h("input", { id: "login-user", "data-keep": "1", autocapitalize: "off", autocomplete: "off", spellcheck: "false" })),
      h("label", { class: "field" }, "Passphrase", h("input", { id: "login-pass", "data-keep": "1", type: "password", autocomplete: "off" })),
      res && res.query ? h("pre", {}, res.query) : null,
      res && res.note ? h("p", { class: "warn" }, res.note) : null,
      h("button", { class: "btn primary", type: "submit" }, "Sign in")
    );
  }

  function echoForm() {
    const run = Game.activeRun();
    const res = run.views.echo;
    return h("form", {
      onSubmit: function (event) {
        event.preventDefault();
        const value = document.getElementById("echo-in").value;
        Game.attemptEcho(value);
      }
    },
      h("label", { class: "field" }, "Search", h("input", { id: "echo-in", "data-keep": "1", autocapitalize: "off", autocomplete: "off", spellcheck: "false" })),
      res && res.tags && res.tags.length ? h("p", { class: "fine" }, "Parsed tags: " + res.tags.join(", ")) : null,
      res && res.note ? h("p", { class: res.ok ? "oknote" : "warn" }, res.note) : null,
      h("button", { class: "btn primary", type: "submit" }, "Search")
    );
  }

  function intelForm() {
    const run = Game.activeRun();
    const draft = (run.views.intel && run.views.intel.draft) || {};
    const note = run.views.intel && run.views.intel.note;
    const ok = run.views.intel && run.views.intel.ok;
    return h("form", {
      onSubmit: function (event) {
        event.preventDefault();
        Game.submitIntel({
          user: document.getElementById("intel-user").value,
          host: document.getElementById("intel-host").value
        });
      }
    },
      h("label", { class: "field" }, "Public handle", h("input", { id: "intel-user", "data-keep": "1", value: draft.user || "", autocapitalize: "off", autocomplete: "off", spellcheck: "false" })),
      h("label", { class: "field" }, "Staging hostname", h("input", { id: "intel-host", "data-keep": "1", value: draft.host || "", autocapitalize: "off", autocomplete: "off", spellcheck: "false" })),
      note ? h("p", { class: ok ? "oknote" : "warn" }, note) : null,
      h("button", { class: "btn primary", type: "submit" }, "File notes")
    );
  }

  function reportForm() {
    const run = Game.activeRun();
    const saved = (run.views.report && run.views.report.draft) || {};
    const errors = (run.views.report && run.views.report.errors) || [];
    const ok = run.views.report && run.views.report.ok;
    const fixes = new Set(saved.fixes || []);
    const severities = ["critical", "high", "medium", "low"];
    const options = [
      ["encode", "Encode output on the staff search"],
      ["parameter", "Parameterize the query the portal forwards"],
      ["debug", "Turn the debug query log off on reachable staging"],
      ["banner", "Hide the version banner and stop there"],
      ["waf", "Put a firewall in front and leave the code"]
    ];
    return h("form", {
      onSubmit: function (event) {
        event.preventDefault();
        const picked = [];
        options.forEach(function (opt) {
          const box = document.getElementById("fix-" + opt[0]);
          if (box && box.checked) picked.push(opt[0]);
        });
        let severity = saved.severity || "";
        severities.forEach(function (s) {
          const box = document.getElementById("sev-" + s);
          if (box && box.checked) severity = s;
        });
        Game.submitReport({
          severity: severity,
          fixes: picked,
          summary: document.getElementById("report-body").value
        });
      }
    },
      h("p", { class: "fine" }, "Severity"),
      h("div", { class: "radios" }, severities.map(function (s) {
        return h("label", {},
          h("input", { type: "radio", name: "sev", id: "sev-" + s, "data-keep": "1", checked: saved.severity === s }),
          " " + s
        );
      })),
      h("p", { class: "fine" }, "Repairs — tick every one you would actually ship"),
      options.map(function (opt) {
        return h("label", { class: "check" },
          h("input", { type: "checkbox", id: "fix-" + opt[0], "data-keep": "1", checked: fixes.has(opt[0]) }),
          h("span", {}, opt[1])
        );
      }),
      h("label", { class: "field" }, "Paragraph for the board", h("textarea", { id: "report-body", "data-keep": "1" }, saved.summary || "")),
      errors.map(function (err) { return h("p", { class: "warn" }, err); }),
      ok ? h("p", { class: "oknote" }, run.views.report.note) : null,
      h("button", { class: "btn primary", type: "submit" }, "File report")
    );
  }

  function fileSite() {
    const chapterLab = lab();
    const run = Game.activeRun();
    const web = chapterLab && chapterLab.web;
    if (!web || !run) return h("p", {}, "No file tree in this job.");
    const cwd = run.webCwd || web.start || "/public";
    const node = run.webFile ? web.fs[run.webFile] : null;
    if (node && !node.dir) {
      return h("div", {},
        h("button", { class: "btn", onClick: function () { Game.webOpen(cwd); } }, "Back to " + cwd),
        h("pre", {}, node.content || ""),
        node.sensitive ? h("button", { class: "btn primary", onClick: function () { Game.reportPii(); } }, "Report to Lena and stop") : null,
        run.goals["reported-pii"] && node.sensitive ? h("p", { class: "oknote" }, "Lena has the report. Leave the rows alone.") : null
      );
    }
    const rows = NightAudit.sim.webList(web.fs, cwd);
    const list = h("div", {});
    list.append(h("div", { class: "path" }, cwd || "/"));
    if (cwd !== "/") {
      list.append(h("button", { class: "btn", onClick: function () { Game.webOpen(".."); } }, ".."));
    }
    rows.forEach(function (row) {
      list.append(h("button", {
        class: "btn",
        onClick: function () { Game.webOpen(row.name); }
      }, row.dir ? row.name + "/" : row.name));
    });
    list.append(h("form", {
      class: "urlbar",
      onSubmit: function (event) {
        event.preventDefault();
        const input = document.getElementById("web-path");
        const value = input.value;
        input.value = "";
        Game.webOpen(value);
      }
    },
      h("input", { id: "web-path", "data-keep": "1", placeholder: "../config/…", "aria-label": "Path", autocapitalize: "off", autocomplete: "off", spellcheck: "false" }),
      h("button", { class: "btn", type: "submit" }, "Open")
    ));
    if (run.views.webNote) list.append(h("p", { class: "warn" }, run.views.webNote));
    return list;
  }

  function filesView() {
    const chapterLab = lab();
    const run = Game.activeRun();
    if (!chapterLab || !run) return needJob("Files", "The cell hasn't dropped any documents.");
    const wrap = h("div", { class: "view" });
    const sc = h("div", { class: "scroll" });
    const files = chapterLab.files || [];
    if (!files.length) sc.append(h("p", { class: "sub" }, "No documents for this chapter. The work is in another app."));
    files.forEach(function (doc) {
      sc.append(h("button", {
        class: "docitem",
        onClick: function () { go("doc", { doc: doc.id }); }
      }, h("strong", {}, doc.title), run.goals[doc.goal] ? h("div", { class: "fine" }, "Read") : null));
    });
    wrap.append(topbar("Files"), sc);
    return wrap;
  }

  function docView() {
    const chapterLab = lab();
    const doc = chapterLab && (chapterLab.files || []).find(function (d) { return d.id === view().doc; });
    if (!doc) return filesView();
    const run = Game.activeRun();
    if (doc.goal && run && !run.goals[doc.goal]) {
      const id = doc.id;
      setTimeout(function () {
        if (view().name === "doc" && view().doc === id) Game.openDoc(id);
      }, 0);
    }
    const wrap = h("div", { class: "view" });
    wrap.append(topbar(doc.title), h("div", { class: "scroll" }, h("pre", {}, doc.body)));
    return wrap;
  }

  function allEntries() {
    const list = NightAudit.primer.map(function (entry) {
      return Object.assign({ chapter: 0, chapterTitle: "Handset" }, entry);
    });
    NightAudit.chapters.forEach(function (ch) {
      (ch.codex || []).forEach(function (entry) {
        list.push(Object.assign({ chapter: ch.n, chapterTitle: ch.title }, entry));
      });
    });
    return list;
  }

  function codexView() {
    const wrap = h("div", { class: "view" });
    const q = h("input", { id: "codex-q", "data-keep": "1", placeholder: "Filter terms", "aria-label": "Filter codex", autocapitalize: "off" });
    q.addEventListener("input", function () { refresh(); });
    const query = (document.getElementById("codex-q") && document.getElementById("codex-q").value || "").toLowerCase();
    const sc = h("div", { class: "scroll" });
    sc.append(h("label", { class: "field" }, "Codex", q));
    const unlocked = Game.state.codex || [];
    allEntries().forEach(function (entry) {
      if (query && entry.term.toLowerCase().indexOf(query) === -1 && (entry.def || "").toLowerCase().indexOf(query) === -1) return;
      const known = unlocked.indexOf(entry.id) !== -1;
      sc.append(h("button", {
        class: "entry",
        onClick: function () { if (known) go("entry", { entry: entry.id }); }
      },
        h("h3", {}, known ? entry.term : "Sealed"),
        h("div", { class: "fine" }, known ? (entry.chapter ? "Chapter " + entry.chapter + " · " + entry.chapterTitle : "On the client from the start") : "Unlocks when you file that chapter"),
        known ? h("p", { class: "preview" }, entry.def) : null
      ));
    });
    wrap.append(topbar("Codex"), sc);
    return wrap;
  }

  function entryView() {
    const entry = allEntries().find(function (e) { return e.id === view().entry; });
    if (!entry || (Game.state.codex || []).indexOf(entry.id) === -1) return codexView();
    const wrap = h("div", { class: "view" });
    wrap.append(topbar(entry.term), h("div", { class: "scroll" },
      h("p", { class: "kicker" }, entry.chapter ? "Chapter " + entry.chapter : "Handset"),
      h("h2", {}, entry.term),
      h("p", {}, entry.def),
      h("h3", { class: "ph" }, "Why a defender cares"),
      h("p", {}, entry.defend)
    ));
    return wrap;
  }

  function settingsView() {
    const wrap = h("div", { class: "view" });
    const fast = Game.state.settings && Game.state.settings.fast;
    wrap.append(topbar("Settings"), h("div", { class: "scroll" },
      h("p", { class: "sub" }, "Night Audit is fiction. Helix Dyne, Cinderwharf, and every address in the lab were invented. Commands run in this browser. The debrief links are the only thing that leave, and they open public references in a new tab."),
      h("button", {
        class: "btn",
        id: "sound-toggle",
        onClick: function () {
          const next = !soundOn();
          Game.setSound(next);
          AudioBus.set(next);
          if (next) AudioBus.blip(880);
        }
      }, soundOn() ? "Synth hum: on" : "Synth hum: off"),
      h("p", { class: "fine" }, AudioBus.supported()
        ? "Optional. A local oscillator and short UI blips. Nothing is downloaded, and it stays off until you ask."
        : "This browser has no WebAudio, so the hum stays silent."),
      h("button", {
        class: "btn",
        onClick: function () { Game.setFast(!fast); }
      }, fast ? "Fast messages: on" : "Fast messages: off"),
      h("p", { class: "fine" }, "Faster arrival. Hints still cost. The system setting for reduced motion does this too."),
      h("button", {
        class: "btn",
        onClick: function () {
          modal = {
            title: "Wipe this client?",
            text: "Rank, score, trust, and every transcript go. The lessons don't. You can start the locker over.",
            yes: "Wipe it",
            onYes: function () {
              modal = null;
              stack = [{ name: "boot" }];
              inspected = {};
              bootPhase = 1;
              if (bootTimer) { clearTimeout(bootTimer); bootTimer = 0; }
              AudioBus.set(false);
              Game.resetAll();
            }
          };
          refresh();
        }
      }, "Reset progress"),
      h("p", { class: "fine" }, "Authorized practice only. Nothing on this site is a permission slip for a real network.")
    ));
    return wrap;
  }

  function debriefView() {
    const id = Game.state.pendingDebrief || (Game.currentChapter() && Game.currentChapter().id);
    const ch = Game.chapterById(id) || Game.currentChapter();
    const wrap = h("div", { class: "view" });
    if (!ch) {
      wrap.append(topbar("Debrief"), h("div", { class: "scroll" }, h("p", {}, "No debrief filed.")));
      return wrap;
    }
    const d = ch.debrief;
    const score = Game.state.best[ch.id];
    const next = NightAudit.chapters[ch.n];
    const sc = h("div", { class: "scroll debrief" });
    sc.append(
      h("p", { class: "kicker" }, "Debrief · " + String(ch.n).padStart(2, "0")),
      h("h2", {}, ch.title),
      h("p", { class: "fine" }, ch.concept + (score ? " · " + score + " banked · " + Game.rank().name : "")),
      h("h3", {}, "What you just learned"),
      h("p", { class: "learned" }, ch.learned || ch.concept),
      h("h3", {}, "What you did"),
      h("p", {}, d.what),
      h("h3", {}, "What a defender does"),
      h("p", {}, d.defend),
      h("h3", {}, "What gets it caught"),
      h("p", {}, d.detect),
      h("h3", {}, "Read further"),
      h("p", {}, h("a", { href: d.url, target: "_blank", rel: "noopener noreferrer" }, d.urlLabel)),
      h("p", { class: "fine" }, "This link leaves the lab. The techniques in this client are for systems you are paid and permitted to test. Every host you touched here was fictional."),
      h("button", {
        class: "btn primary",
        onClick: function () { Game.closeDebrief(); go("jobs"); }
      }, "Back to dispatch")
    );
    if (next && Game.isOpen(next)) {
      sc.append(h("button", { class: "btn", onClick: function () { Game.closeDebrief(); begin(next.id); } }, "Next · " + next.title));
    }
    sc.append(h("button", {
      class: "ghost",
      onClick: function () { Game.review(ch.id); go("thread", { thread: "beacon" }); }
    }, "Reread the thread"));
    wrap.append(topbar("Debrief"), sc);
    return wrap;
  }

  function hintSheet() {
    const sheet = Game.state.hintSheet;
    const info = Game.objective();
    const run = Game.activeRun();
    return h("div", { class: "sheet" },
      h("p", { class: "kicker" }, "Hint " + sheet.n + (sheet.free ? " · free" : (sheet.cost ? " · −" + sheet.cost + " if you file now" : ""))),
      h("p", {}, gloss(sheet.text)),
      info ? h("p", { class: "fine" }, "Filing this chapter now would bank " + info.provisional + ".") : null,
      h("div", { class: "row" },
        run && run.hints < 3 ? h("button", { class: "btn", onClick: function () { Game.buyHint(); } }, "Deeper hint") : null,
        h("button", { class: "ghost", onClick: function () { Game.closeHint(); } }, "Close")
      )
    );
  }

  function modalBox() {
    return h("div", { class: "modal" },
      h("h3", {}, modal.title),
      h("p", {}, modal.text),
      h("button", { class: "btn primary", onClick: function () { const fn = modal.onYes; modal = null; fn(); } }, modal.yes),
      h("button", { class: "ghost", onClick: function () { modal = null; refresh(); } }, "Cancel")
    );
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && stack.length > 1 && !modal) back();
  });

  setInterval(function () {
    const node = document.getElementById("clock");
    if (node) node.textContent = clock();
  }, 10000);

  document.addEventListener("click", function (event) {
    if (!soundOn()) return;
    const hit = event.target && event.target.closest && event.target.closest("button, a");
    if (!hit || hit.id === "sound-toggle") return;
    AudioBus.blip(hit.classList.contains("primary") ? 740 : 520);
  });

  document.addEventListener("pointerdown", function () {
    if (soundOn()) AudioBus.set(true);
  }, { once: true });

  function startCity() {
    const canvas = document.getElementById("city");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = reducedMotion();
    let drops = [];
    let lights = [];
    let running = true;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = [];
      const count = Math.min(70, Math.max(24, Math.floor(canvas.width / 22)));
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: 0.45 + Math.random() * 1.1,
          len: 8 + Math.random() * 12
        });
      }
      lights = [];
      const glowCount = Math.min(28, Math.floor(canvas.width / 40));
      for (let i = 0; i < glowCount; i++) {
        lights.push({
          x: Math.random() * canvas.width,
          y: canvas.height * (0.15 + Math.random() * 0.75),
          c: i % 3 === 0 ? "#ff2bd6" : i % 3 === 1 ? "#3dffe8" : "#c6ff3d",
          p: Math.random() * Math.PI * 2
        });
      }
    }
    function frame(t) {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(61, 255, 232, 0.06)";
      ctx.lineWidth = 1;
      const gap = 56;
      const drift = reduce ? 0 : (t * 0.012) % gap;
      for (let x = -gap + drift; x < canvas.width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 40, canvas.height);
        ctx.stroke();
      }
      lights.forEach(function (L) {
        ctx.globalAlpha = reduce ? 0.35 : 0.22 + Math.sin(t / 800 + L.p) * 0.18;
        ctx.fillStyle = L.c;
        ctx.fillRect(L.x, L.y, 2, 10);
      });
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "rgba(190, 236, 255, 0.45)";
      drops.forEach(function (d) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.6, d.y + d.len);
        ctx.stroke();
        if (!reduce) {
          d.y += 2.4 * d.z;
          d.x += 0.25 * d.z;
          if (d.y > canvas.height) {
            d.y = -16;
            d.x = Math.random() * canvas.width;
          }
        }
      });
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", function () {
      resize();
      if (reduce) frame(0);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        running = false;
        return;
      }
      if (!running && !reduce) {
        running = true;
        requestAnimationFrame(frame);
      }
    });
    if (reduce) frame(0);
    else requestAnimationFrame(frame);
  }

  startCity();

  Game.onChange = onGame;
  Game.init();
  if (location.search.indexOf("fast=1") !== -1 && Game.state.settings) Game.state.settings.fast = true;
  if (Game.state.player) {
    const ui = Game.state.ui || { screen: "jobs" };
    const screenName = !ui.screen || ui.screen === "home" ? "jobs" : ui.screen;
    stack = [{ name: screenName, thread: ui.thread, doc: ui.doc, letter: ui.letter, entry: ui.entry }];
    if (Game.state.pendingDebrief && stack[0].name !== "debrief") stack.push({ name: "debrief" });
  } else {
    stack = [{ name: "boot" }];
  }
  ready = true;
  refresh();
})();
