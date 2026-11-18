/* Lab simulations. Every host, query, and mailbox lives in memory. */
(function (root) {
  "use strict";

  const NA = root.NightAudit = root.NightAudit || {};
  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function b64encode(str) {
    const bytes = [];
    const s = String(str);
    for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i) & 0xff);
    let out = "";
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      const triple = (a << 16) | (b << 8) | c;
      out += B64[(triple >> 18) & 63] + B64[(triple >> 12) & 63];
      out += i + 1 < bytes.length ? B64[(triple >> 6) & 63] : "=";
      out += i + 2 < bytes.length ? B64[triple & 63] : "=";
    }
    return out;
  }

  function b64decode(input) {
    const clean = String(input).replace(/[^A-Za-z0-9+/=]/g, "");
    let buf = 0;
    let bits = 0;
    let out = "";
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (ch === "=") break;
      const v = B64.indexOf(ch);
      if (v < 0) continue;
      buf = (buf << 6) | v;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        out += String.fromCharCode((buf >> bits) & 255);
      }
    }
    return out;
  }

  function printableRatio(s) {
    if (!s) return 0;
    let ok = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c === 9 || c === 10 || c === 13 || (c >= 32 && c < 127)) ok++;
    }
    return ok / s.length;
  }

  function normJoin(cwd, input) {
    const raw = String(input || "").trim();
    const base = !raw ? (cwd || "/") : raw.startsWith("/") ? raw : (String(cwd || "/").replace(/\/$/, "") + "/" + raw);
    const stack = [];
    base.split("/").forEach(function (bit) {
      if (!bit || bit === ".") return;
      if (bit === "..") stack.pop();
      else stack.push(bit);
    });
    return "/" + stack.join("/");
  }

  function expandHome(raw, home) {
    const s = String(raw || "").trim();
    if (s === "~" || s === "") return home;
    if (s.startsWith("~/")) return home.replace(/\/$/, "") + s.slice(1);
    return s;
  }

  function parentPath(p) {
    if (!p || p === "/") return "/";
    const i = p.lastIndexOf("/");
    return i <= 0 ? "/" : p.slice(0, i);
  }

  function listDir(fs, dir) {
    const prefix = dir === "/" ? "/" : dir.replace(/\/$/, "") + "/";
    const names = [];
    Object.keys(fs).forEach(function (key) {
      if (!key.startsWith(prefix)) return;
      const rest = key.slice(prefix.length);
      if (!rest || rest.indexOf("/") !== -1) return;
      names.push(rest);
    });
    names.sort(function (a, b) {
      const na = fs[prefix + a];
      const nb = fs[prefix + b];
      const da = !!(na && na.dir);
      const db = !!(nb && nb.dir);
      if (da !== db) return da ? -1 : 1;
      return a.localeCompare(b);
    });
    return names;
  }

  function hostOf(lab, session) {
    return lab.term.hosts[session.host];
  }

  function makeSession(lab) {
    const hostId = (lab.term && lab.term.start) || "jump";
    const host = lab.term.hosts[hostId];
    return {
      host: hostId,
      cwd: host.home,
      mode: "cmd",
      passFor: null,
      history: [],
      lines: [
        { text: "NIGHT AUDIT range shell — sealed lab", cls: "dim" },
        { text: host.banner || "Fictional hosts only. Type help.", cls: "dim" }
      ],
      flags: {},
      cronGone: {},
      stack: []
    };
  }

  function pushLine(session, text, cls) {
    String(text).split("\n").forEach(function (line) {
      session.lines.push({ text: line, cls: cls || "out" });
    });
    if (session.lines.length > 180) session.lines = session.lines.slice(-180);
  }

  function tokenize(line) {
    return String(line).trim().split(/\s+/).filter(Boolean);
  }

  function resolvePath(session, host, token) {
    const expanded = expandHome(token, host.home);
    return normJoin(session.cwd, expanded === host.home && (token === "~" || token === "") ? host.home : expanded);
  }

  function findNode(host, path) {
    return host.fs[path] || null;
  }

  function findExec(host, name, pathList) {
    const paths = pathList || ["/usr/local/bin", "/opt/helix", "/bin"];
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i].replace(/\/$/, "") + "/" + name;
      const node = host.fs[p];
      if (node && node.exec) return { path: p, node: node };
    }
    return null;
  }

  const DEFAULT_WHOIS = {
    "helixdyne.example": "Domain: helixdyne.example\nRegistrar: Civic Range Lab (fictional)\nOrg: Helix Dyne, Cinderwharf\nName servers: ns1.helixdyne.example\nComment: staff names are not in whois. People leak those themselves.",
    "nightaudit.example": "Domain: nightaudit.example\nOrg: Night Audit\nComment: the cell that holds this contract. Lab copy only."
  };

  function execProgram(id, args) {
    if (id === "helix-status") {
      if (args[0] === "--health") {
        return {
          lines: [
            "helix-status debug build",
            "reader: root (SUID)",
            "token: FLAG-SUID-DEBUG-LEFT-IN",
            "A production binary should not be SUID, and should not still have a debug flag."
          ],
          goals: ["saw-token"]
        };
      }
      if (args[0] === "--quiet") return { lines: ["helix-status: ok"] };
      return { lines: ["usage: helix-status [--quiet|--health]", "Look at the permission bits before you celebrate a flag."] };
    }
    if (id === "log-prune") {
      return {
        lines: [
          "log-prune: this lab copy will not turn your pattern into a shell.",
          "It is still the wrong amount of privilege.",
          "sudo -l shows this account can run it as root with no passphrase.",
          "The script's comment also mentions helix-status --health. Read that next."
        ]
      };
    }
    if (id === "ping") {
      return {
        lines: [
          "ping: ordinary lab tool. SUID here is normal; it needs a raw socket.",
          "Compare these bits with helix-status. The custom binary is the finding, not ping."
        ]
      };
    }
    return { lines: [id + ": the lab has no behavior for that program."] };
  }

  function formatLong(name, node) {
    const mode = node.mode || (node.dir ? "drwxr-xr-x" : "-rw-r--r--");
    const own = node.own || "auditor";
    return mode + "  " + own + " " + own + "  " + name;
  }

  function sqlTautology(value) {
    const s = String(value || "");
    return (
      /'\s*or\s+'?\d+'?\s*=\s*'?\d+'?/i.test(s) ||
      /'\s*or\s+'[^']+'\s*=\s*'[^']+'?/i.test(s) ||
      /"\s*or\s+"[^"]+"\s*=\s*"[^"]+"?/i.test(s) ||
      /"\s*or\s+'?\d+'?\s*=\s*'?\d+'?/i.test(s) ||
      /'\s*--/.test(s) ||
      /"\s*--/.test(s)
    );
  }

  function checkSql(user, pass) {
    const u = String(user == null ? "" : user);
    const p = String(pass == null ? "" : pass);
    const query = "SELECT id, name FROM staff WHERE name='" + u + "' AND phrase='" + p + "'";
    if (sqlTautology(u) || sqlTautology(p)) {
      return {
        ok: true,
        query: query,
        flag: "FLAG-TAUTOLOGY",
        note: "The mirror returned the first row because the WHERE clause was always true. A parameterized query would have treated your input as a name, not as SQL."
      };
    }
    return {
      ok: false,
      query: query,
      note: "No row. The mirror glued your text into the sentence above. The password is not the lesson."
    };
  }

  function checkFactory(user, pass) {
    const u = String(user || "").trim().toLowerCase();
    const p = String(pass || "");
    if (u === "operator" && p === "letmein-change-me") {
      return {
        ok: true,
        note: "HelixGate mirror accepted the factory account. Finding: the installer never rotated it. Token for your notes: FLAG-FACTORY-STILL-ON. Lena rotates it after this test."
      };
    }
    if ((u === "admin" && p === "admin") || (u === "admin" && p === "password")) {
      return { ok: false, note: "That pair is a cliché. This product's cliché is printed in its own field manual." };
    }
    return { ok: false, note: "Rejected. This lab does not want a password spray. The manual has the factory pair." };
  }

  function checkEcho(input) {
    const s = String(input == null ? "" : input);
    const re = /<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    const names = [];
    let m;
    while ((m = re.exec(s))) names.push(m[1].toLowerCase());
    if (!names.length) {
      return {
        ok: false,
        note: "Stored as text. The mirror did not build a tag. The page is only interesting if it treats your words as markup."
      };
    }
    const script = names.indexOf("script") !== -1;
    return {
      ok: true,
      tags: names,
      note: script
        ? "The mirror parsed a script tag. This training page refuses to run it. The finding is already true: input became markup. Defenders encode output and set a content security policy so the browser never makes that jump."
        : "The mirror parsed your input as HTML (" + names.join(", ") + ") and did not run code. That is the whole proof. On a real site, output encoding and a content security policy keep data from becoming markup."
    };
  }

  function normHandle(v) {
    return String(v || "").trim().toLowerCase().replace(/^@/, "");
  }

  function normHost(v) {
    return String(v || "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/\.$/, "");
  }

  function checkIntel(input) {
    const user = normHandle(input && input.user);
    const host = normHost(input && input.host);
    const okUser = user === "ivopell";
    const okHost = host === "vpn-staging.helixdyne.example";
    const notes = [];
    if (!okUser) notes.push("Handle doesn't match the public talk. Design's account is a different person.");
    if (!okHost) notes.push("Hostname doesn't match what was left in public. You want the staging VPN, not the marketing site.");
    return {
      ok: okUser && okHost,
      note: okUser && okHost
        ? "Filed. Ivo Pell posted the staging name himself. The finding is the leak, not the hostname."
        : notes.join(" ")
    };
  }

  function checkReport(data) {
    const errors = [];
    const severity = String((data && data.severity) || "").toLowerCase();
    if (severity !== "high") {
      if (severity === "critical") {
        errors.push("Critical is for a wide-open compromise: unauthenticated takeover, or live city badges spilling out. You don't have evidence of that. High is the honest call.");
      } else if (severity === "medium") {
        errors.push("Medium undersells a staff page that will treat an attacker's input as markup, next to a debug log left on a reachable host. Rate the headline High.");
      } else if (severity === "low" || severity === "info" || severity === "informational") {
        errors.push("Too low. A colleague's browser can be made to run someone else's markup, and the health port is telling stories. That is High.");
      } else {
        errors.push("Pick a severity. The headline finding is High.");
      }
    }
    const fixes = new Set((data && data.fixes) || []);
    if (!fixes.has("encode")) errors.push("Include output encoding on the staff search. That is what stops reflected markup.");
    if (!fixes.has("parameter")) errors.push("Include parameterized queries for the search the portal forwards. Encoding alone doesn't fix a query built by gluing text.");
    if (!fixes.has("debug")) errors.push("Include turning the debug query log off on the network-reachable staging host.");
    if (fixes.has("banner")) errors.push("Hiding the version banner is housekeeping, not a fix. Don't list it as the remediation.");
    if (fixes.has("waf")) errors.push("A filter in front of a broken page is not the repair. Take that one off. Change the code.");
    const summary = String((data && data.summary) || "").trim();
    if (summary.length < 40) {
      errors.push("Write a short paragraph the board can read: what is affected, what could happen, what to change.");
    } else {
      if (!/(beacon|staging|search|portal|staff|health)/i.test(summary)) {
        errors.push("Name the asset. The Beacon staff search, or the staging health port.");
      }
      if (!/(encode|encoding|sanitize|sanitise|parameter|debug)/i.test(summary)) {
        errors.push("Name a real fix in the paragraph: encode output, parameterize the query, or disable the debug log.");
      }
    }
    return {
      ok: errors.length === 0,
      errors: errors,
      note: errors.length ? "" : "Filed. Severity High, with repairs a defender can actually do."
    };
  }

  function flagMail(id, lab) {
    const mail = (lab.mail || []).find(function (m) { return m.id === id; });
    if (!mail) return { ok: false, note: "No such message." };
    if (mail.phish) {
      return {
        ok: true,
        goal: "flagged-phish",
        note: "Flagged. Lookalike domain, urgent badge threat, and a link that doesn't go where the words claim."
      };
    }
    return { ok: false, note: mail.whyLegit || "That one is ordinary cell traffic." };
  }

  function helpLines(lab) {
    const tools = (lab.term && lab.term.tools) || {};
    const lines = [
      "help                 this list",
      "ls [path]            list a directory. ls -l shows bits",
      "cd [path]            change directory. cd ~ goes home",
      "cat <file>           read a file",
      "pwd                  print the working directory",
      "whois <name>         lab registrar cache only",
      "submit <value>       hand a value to the scorer",
      "clear                wipe the scrollback",
      "exit                 leave an ssh session"
    ];
    if (tools.scan) lines.push("scan <host>          service scan inside the scope card");
    if (tools.decode) lines.push("decode <file>        reverse an encoding (not a lock)");
    if (tools.hash) lines.push("hash <word>          SHA-256 a single word, for comparison");
    if (tools.crack) lines.push("crack <hash> <list>  try a tiny local wordlist against one unsalted digest");
    if (tools.ssh) lines.push("ssh user@host        lab accounts on the scope card only");
    if (tools.sudo) lines.push("sudo -l              show the sudo policy");
    if (tools.fetch) lines.push("fetch <url>          request a lab URL");
    if (tools.cron) lines.push("cron                 list scheduled tasks");
    if (tools.cron) lines.push("remove <id>          remove a scheduled task you can justify");
    return lines;
  }

  function termReduce(session, raw, lab) {
    const s = {
      host: session.host,
      cwd: session.cwd,
      mode: session.mode,
      passFor: session.passFor ? Object.assign({}, session.passFor) : null,
      history: session.history.slice(),
      lines: session.lines.map(function (l) { return { text: l.text, cls: l.cls }; }),
      flags: Object.assign({}, session.flags),
      cronGone: Object.assign({}, session.cronGone),
      stack: (session.stack || []).slice()
    };
    const goals = [];
    let penalty = false;
    let ethicsFail = false;
    let aside = null;
    const line = String(raw == null ? "" : raw);
    const term = lab.term || { hosts: {} };
    const host = hostOf(lab, s);
    if (!host) {
      pushLine(s, "no host", "err");
      return { session: s, goals: goals, penalty: false, ethicsFail: false, aside: null };
    }

    if (s.mode === "pass") {
      const secret = line;
      pushLine(s, "password: ••••••••", "cmd");
      const spec = term.ssh && term.ssh[s.passFor.key];
      s.mode = "cmd";
      const forbidden = term.forbiddenPasswords && term.forbiddenPasswords[secret];
      if (forbidden) {
        penalty = true;
        ethicsFail = !!forbidden.ethicsFail;
        aside = forbidden.aside || null;
        pushLine(s, forbidden.text || "Rejected. That secret did not come from the engagement.", "err");
        s.passFor = null;
        return { session: s, goals: goals, penalty: penalty, ethicsFail: ethicsFail, aside: aside };
      }
      if (spec && secret === spec.password) {
        s.stack.push({ host: s.host, cwd: s.cwd });
        s.host = spec.host;
        const next = term.hosts[spec.host];
        s.cwd = next.home;
        s.passFor = null;
        pushLine(s, spec.motd || ("connected to " + spec.host), "ok");
        if (spec.goal) goals.push(spec.goal);
        return { session: s, goals: goals, penalty: false, ethicsFail: false, aside: null };
      }
      s.passFor = null;
      pushLine(s, "permission denied", "err");
      return { session: s, goals: goals, penalty: false, ethicsFail: false, aside: null };
    }

    if (!line.trim()) return { session: s, goals: goals, penalty: false, ethicsFail: false, aside: null };

    s.history.push(line.trim());
    if (s.history.length > 40) s.history = s.history.slice(-40);
    const promptUser = host.user || "auditor";
    pushLine(s, promptUser + "@" + (host.prompt || host.id || s.host) + " " + (s.cwd === host.home ? "~" : s.cwd) + " $ " + line.trim(), "cmd");

    const tok = tokenize(line);
    const cmd = tok[0];
    const tools = term.tools || {};

    function need(flag, label) {
      if (tools[flag]) return false;
      pushLine(s, label + " is not on this chapter's headset profile.", "dim");
      return true;
    }

    if (cmd === "help") {
      helpLines(lab).forEach(function (ln) { pushLine(s, ln, "dim"); });
    } else if (cmd === "clear") {
      s.lines = [];
    } else if (cmd === "pwd") {
      pushLine(s, s.cwd);
    } else if (cmd === "exit") {
      if (s.stack.length) {
        const prev = s.stack.pop();
        s.host = prev.host;
        s.cwd = prev.cwd;
        pushLine(s, "back on " + prev.host, "dim");
      } else {
        pushLine(s, "already on the jump host", "dim");
      }
    } else if (cmd === "cd") {
      const destTok = tok[1] || "~";
      const dest = normJoin(s.cwd, expandHome(destTok, host.home));
      const node = findNode(host, dest);
      if (dest === "/" || (node && node.dir)) {
        s.cwd = dest === host.home ? host.home : dest;
        if (dest !== "/" && !node) pushLine(s, "no such directory", "err");
      } else if (!node) pushLine(s, "no such directory", "err");
      else pushLine(s, "not a directory", "err");
    } else if (cmd === "ls") {
      const long = tok.some(function (t) { return t.startsWith("-") && t.indexOf("l") !== -1; });
      const targetTok = tok.filter(function (t) { return !t.startsWith("-"); })[1];
      const dir = targetTok ? normJoin(s.cwd, expandHome(targetTok, host.home)) : s.cwd;
      const node = dir === "/" ? { dir: true } : findNode(host, dir);
      if (!node) pushLine(s, "no such path", "err");
      else if (!node.dir && dir !== "/") pushLine(s, "not a directory", "err");
      else {
        const names = listDir(host.fs, dir);
        if (!names.length) pushLine(s, "(empty)", "dim");
        names.forEach(function (name) {
          const child = host.fs[(dir === "/" ? "" : dir) + "/" + name];
          if (long) pushLine(s, formatLong(name, child || {}));
          else pushLine(s, child && child.dir ? name + "/" : name, child && child.dir ? "dim" : "out");
        });
      }
    } else if (cmd === "cat") {
      if (!tok[1]) pushLine(s, "usage: cat <file>", "dim");
      else {
        const path = normJoin(s.cwd, expandHome(tok.slice(1).join(" "), host.home));
        const node = findNode(host, path);
        if (!node) pushLine(s, "no such file", "err");
        else if (node.dir) pushLine(s, "is a directory", "err");
        else if (node.exec && !node.content) pushLine(s, "binary file. try running " + (tok[1] || "it"), "dim");
        else {
          pushLine(s, node.content || "");
          if (node.flag) s.flags[node.flag] = true;
          if (node.goal) goals.push(node.goal);
        }
      }
    } else if (cmd === "whois") {
      const name = (tok[1] || "").toLowerCase().replace(/\.$/, "");
      if (!name) pushLine(s, "usage: whois <domain>", "dim");
      else {
        const table = Object.assign({}, DEFAULT_WHOIS, term.whois || {});
        pushLine(s, table[name] || "No record in the lab cache. This phone will not ask the real internet.");
      }
    } else if (cmd === "scan") {
      if (need("scan", "scan")) {
        /* profile */
      } else if (!tok[1]) pushLine(s, "usage: scan <host from the scope card>", "dim");
      else {
        const hostName = tok[1].replace(/\.$/, "");
        const rows = term.scans && term.scans[hostName];
        if (rows) {
          pushLine(s, "scan " + hostName + " (lab, in scope)", "ok");
          rows.forEach(function (r) {
            pushLine(s, String(r.port) + "/tcp  " + r.state + "  " + r.service + (r.banner ? "  " + r.banner : ""));
          });
          if (term.scanGoal && term.scanGoal.host === hostName) goals.push(term.scanGoal.goal);
        } else if (/^192\.0\.2\.\d+$/.test(hostName)) {
          pushLine(s, hostName + " is inside the test range. Nothing in this lab is answering.");
        } else {
          penalty = true;
          aside = {
            who: "quill",
            text: "The proxy dropped that. If it is not on the scope card, you do not scan it. Not from this phone, not from a real one."
          };
          pushLine(s, "Out of scope. The range proxy refused " + hostName + ".", "err");
        }
      }
    } else if (cmd === "decode") {
      if (need("decode", "decode")) {
        /* profile */
      } else if (!tok[1]) pushLine(s, "usage: decode <file>", "dim");
      else {
        const path = normJoin(s.cwd, expandHome(tok[1], host.home));
        const node = findNode(host, path);
        if (!node || node.dir || !node.content) pushLine(s, "no such file", "err");
        else {
          const plain = b64decode(node.content.trim());
          if (printableRatio(plain) > 0.9 && plain.trim()) {
            pushLine(s, plain, "ok");
            pushLine(s, "Base64 is an encoding. Anyone can reverse it. There is no key.", "dim");
            if (term.decodeGoal && path === term.decodeGoal) goals.push("decoded");
          } else {
            pushLine(s, "That did not come back as text. If the header says AES, encoding tricks will not open it. Encryption without the key stays shut.", "warn");
          }
        }
      }
    } else if (cmd === "hash") {
      if (need("hash", "hash")) {
        /* profile */
      } else if (!tok[1]) pushLine(s, "usage: hash <word>", "dim");
      else {
        const word = tok.slice(1).join(" ");
        const dig = NA.sha256(word);
        pushLine(s, dig, "ok");
        pushLine(s, "Same word, same digest, every time. You cannot run this backward. Compare it to the fingerprint file.", "dim");
      }
    } else if (cmd === "crack") {
      if (need("crack", "crack")) {
        /* profile */
      } else if (tok.length < 3) pushLine(s, "usage: crack <hash-file> <wordlist>", "dim");
      else {
        const a = normJoin(s.cwd, expandHome(tok[1], host.home));
        const b = normJoin(s.cwd, expandHome(tok[2], host.home));
        const na = findNode(host, a);
        const nb = findNode(host, b);
        if (!na || !nb || !na.content || !nb.content) pushLine(s, "missing file", "err");
        else {
          const files = [na, nb];
          let hashFile = null;
          let wordFile = null;
          files.forEach(function (f) {
            if (/[a-f0-9]{64}/i.test(f.content) && f.content.split(/\n/).length < 12) hashFile = f;
            else wordFile = f;
          });
          if (!hashFile || !wordFile || hashFile === wordFile) {
            pushLine(s, "I need one digest file and one word list.", "err");
          } else {
            const m = hashFile.content.match(/[a-f0-9]{64}/i);
            const want = m[0].toLowerCase();
            const words = wordFile.content.split(/\n/).map(function (w) { return w.trim(); }).filter(Boolean);
            pushLine(s, "unsalted SHA-256. trying " + words.length + " local words. no network.", "dim");
            let found = null;
            words.forEach(function (w) {
              const dig = NA.sha256(w);
              if (dig === want && !found) found = w;
            });
            if (found) {
              pushLine(s, "match: " + found, "ok");
              pushLine(s, NA.sha256(found), "ok");
              pushLine(s, "It fell because the phrase was short, unsalted, and on a list of " + words.length + ". A slow hash with a unique salt would not have cared about this list.", "dim");
              goals.push(term.crackGoal || "cracked");
            } else {
              pushLine(s, "no match in that list", "err");
            }
          }
        }
      }
    } else if (cmd === "submit") {
      const value = tok.slice(1).join(" ").trim().toLowerCase();
      const table = term.submit && term.submit.answers;
      const priorScan = !!(session.flags && session.flags["saw-scan"]);
      if (!table) pushLine(s, "Nothing to submit on this job.", "dim");
      else if (term.submit.needs === "saw-scan" && !priorScan) {
        pushLine(s, "Scorer held that. Scan the host before you name a port.", "warn");
      } else {
        const goal = table[value];
        if (!goal) pushLine(s, "The scorer does not want that value.", "err");
        else {
          pushLine(s, "submitted " + value, "ok");
          goals.push(goal);
        }
      }
    } else if (cmd === "ssh") {
      if (need("ssh", "ssh")) {
        /* profile */
      } else if (!tok[1] || tok[1].indexOf("@") === -1) pushLine(s, "usage: ssh user@host", "dim");
      else {
        const key = tok[1];
        const spec = term.ssh && term.ssh[key];
        if (!spec) {
          const hostPart = key.split("@")[1] || key;
          if (/^192\.0\.2\.\d+$/.test(hostPart)) {
            pushLine(s, "No lab account on " + hostPart + " for that name. Stay with the host the file named.", "err");
          } else {
            penalty = true;
            aside = { who: "quill", text: "That address is not on the card. The range will not open a session there." };
            pushLine(s, "Out of scope. Handshake refused.", "err");
          }
        } else {
          s.mode = "pass";
          s.passFor = { key: key };
          pushLine(s, "password required for " + key, "dim");
        }
      }
    } else if (cmd === "sudo") {
      if (need("sudo", "sudo")) {
        /* profile */
      } else if (tok[1] === "-l") {
        pushLine(s, term.sudoText || "no sudo policy on this host", "ok");
        if (term.sudoGoal) goals.push(term.sudoGoal);
      } else if (tok[1]) {
        const rest = tok.slice(1);
        const bin = rest[0].split("/").pop();
        const found = findExec(host, bin, term.path) || (host.fs[rest[0]] && host.fs[rest[0]].exec ? { node: host.fs[rest[0]] } : null);
        if (!found) pushLine(s, "sudo: not permitted, and not a lab program. sudo -l is the honest command.", "err");
        else if (found.node.exec === "log-prune" || rest[0].indexOf("log-prune") !== -1) {
          const result = execProgram("log-prune", rest.slice(1));
          result.lines.forEach(function (ln) { pushLine(s, ln, "warn"); });
        } else {
          pushLine(s, "sudo: " + rest[0] + " is not in the NOPASSWD list. Least privilege means the answer is no.", "err");
        }
      } else pushLine(s, "usage: sudo -l", "dim");
    } else if (cmd === "fetch") {
      if (need("fetch", "fetch")) {
        /* profile */
      } else if (!tok[1]) pushLine(s, "usage: fetch <lab url>", "dim");
      else {
        const url = tok[1].replace(/\/$/, "");
        const hit = term.fetches && (term.fetches[url] || term.fetches[url + "/"]);
        if (!hit) {
          pushLine(s, "The lab proxy has no page for that. In-scope URLs only.", "err");
        } else {
          pushLine(s, hit.body, "ok");
          if (hit.goal) goals.push(hit.goal);
        }
      }
    } else if (cmd === "cron") {
      if (need("cron", "cron")) {
        /* profile */
      } else {
        const entries = (term.cron && term.cron.entries) || [];
        pushLine(s, "scheduled tasks on this lab host", "dim");
        entries.forEach(function (e) {
          if (s.cronGone[e.id]) return;
          pushLine(s, e.id + "  " + e.text, e.bad ? "warn" : "out");
        });
        s.flags.listedCron = true;
      }
    } else if (cmd === "remove") {
      if (need("cron", "remove")) {
        /* profile */
      } else if (!tok[1]) pushLine(s, "usage: remove <task id>", "dim");
      else {
        const entries = (term.cron && term.cron.entries) || [];
        const entry = entries.find(function (e) { return e.id === tok[1]; });
        if (!entry || s.cronGone[entry.id]) pushLine(s, "no such task", "err");
        else if (!entry.bad) {
          penalty = true;
          pushLine(s, "Refusing. " + entry.id + " is ordinary upkeep. Removing it would be you breaking the lab, not finding the intruder.", "err");
        } else {
          s.cronGone[entry.id] = true;
          pushLine(s, "removed " + entry.id, "ok");
          pushLine(s, "Document it. Do not replace it with one of yours. Do not wipe the log that proves it was here.", "dim");
          if (term.cron.goal) goals.push(term.cron.goal);
        }
      }
    } else if (cmd === "submit-skip") {
      pushLine(s, "unknown command. type help.", "err");
    } else {
      const found = findExec(host, cmd, term.path);
      if (found) {
        if (found.node.exec === "log-prune") {
          pushLine(s, "permission denied. log-prune is not SUID. Check sudo -l before forcing it.", "err");
        } else {
          const result = execProgram(found.node.exec, tok.slice(1));
          result.lines.forEach(function (ln) { pushLine(s, ln, "ok"); });
          (result.goals || []).forEach(function (g) { goals.push(g); });
        }
      } else {
        pushLine(s, "unknown command. type help.", "err");
      }
    }

    /* submit gate: if the lab wants a flag in session.flags first */
    if (cmd === "submit" && term.submit && term.submit.needs) {
      const needFlag = term.submit.needs;
      const have = !!(session.flags && session.flags[needFlag]) || !!s.flags[needFlag];
      /* goals from this same command are already pushed; the needs check above was weak.
         Re-evaluate: if needs names a goal that must already have been earned, look at a hook.
         We encode needs as a session flag the scan command sets. */
      if (!have && term.submit.needs === "saw-scan") {
        /* scan sets a goal, not a flag. Check incoming goals union previous via a flag set here. */
      }
    }

    if (goals.indexOf("saw-scan") !== -1) s.flags["saw-scan"] = true;

    return { session: s, goals: goals, penalty: penalty, ethicsFail: ethicsFail, aside: aside };
  }

  function webList(fs, dir) {
    return listDir(fs, dir).map(function (name) {
      const node = fs[(dir === "/" ? "" : dir) + "/" + name];
      return { name: name, dir: !!(node && node.dir), sensitive: !!(node && node.sensitive) };
    });
  }

  NA.sim = {
    b64encode: b64encode,
    b64decode: b64decode,
    normJoin: normJoin,
    listDir: listDir,
    makeSession: makeSession,
    termReduce: termReduce,
    checkSql: checkSql,
    checkFactory: checkFactory,
    checkEcho: checkEcho,
    checkIntel: checkIntel,
    checkReport: checkReport,
    flagMail: flagMail,
    webList: webList,
    helpLines: helpLines
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
