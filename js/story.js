/* Night Audit — original fiction. Every company, host, and person is invented. */
(function (root) {
  "use strict";

  const NA = root.NightAudit;
  const enc = NA.sim.b64encode;
  const digest = NA.sha256("lumen-17");
  const notePlain = "the passphrase is one entry on the wordlist. a hash is not a key.";

  function mount(fs, path, node) {
    const parts = path.split("/").filter(Boolean);
    let acc = "";
    for (let i = 0; i < parts.length - 1; i++) {
      acc += "/" + parts[i];
      if (!fs[acc]) fs[acc] = { dir: true };
    }
    fs[path] = node;
  }

  function makeFs(entries, withHome) {
    const fs = withHome === false ? {} : { "/home": { dir: true } };
    entries.forEach(function (pair) { mount(fs, pair[0], pair[1]); });
    return fs;
  }

  function jump(banner, entries, extra) {
    const fs = makeFs([
      ["/home/auditor", { dir: true }],
      ["/home/auditor/readme.txt", { content: extra || "Night Audit range shell.\nType help.\n" }]
    ].concat(entries || []));
    return {
      user: "auditor",
      prompt: "range",
      home: "/home/auditor",
      banner: banner,
      fs: fs
    };
  }

  function article(title, blocks) {
    return { type: "article", title: title, blocks: blocks };
  }

  const primer = [
    {
      id: "range",
      term: "Training range",
      def: "This phone is a sealed copy. The hosts, mail, and pages are fiction running in your browser. Nothing you type is sent to a real network.",
      defend: "Real practice belongs on ranges you own or are contracted to test, with a written scope."
    },
    {
      id: "cell",
      term: "Night Audit",
      def: "A licensed red team in Cinderwharf. They break staging systems Helix Dyne asked them to break, then write a report a board can act on.",
      defend: "Offense work without a contract, a time window, and a stop condition is just an intrusion."
    }
  ];

  const chapters = [];

  chapters.push({
    id: "c1",
    n: 1,
    title: "After Hours",
    concept: "Rules of engagement",
    objective: "Read the scope card in Files. Then answer three questions. Stay on the list.",
    goalText: {
      "read-roe": "Open the scope card in Files and actually read it."
    },
    goals: ["read-roe", "q-scope", "q-pii", "q-cert"],
    hints: [
      "Open Files and read the scope card. The card is the list.",
      "Payroll is not on the list. Real badge photos: stop, don't copy, tell Quill and Lena. A certificate from PIX: say no.",
      "Three answers: payroll is out, stop and report the photos without copying them, refuse PIX."
    ],
    codex: [
      {
        id: "roe",
        term: "Rules of engagement",
        def: "The written permission for a test: who asked, what may be touched, which techniques are allowed, the hours, and what to do when you hit something you didn't expect.",
        defend: "If it is not written down, you don't have it. A verbal 'while you're there' is how tests become incidents."
      },
      {
        id: "scope",
        term: "Scope",
        def: "The list of systems, accounts, and actions that are in the job. Being on the same floor, the same company, or the same subnet does not put a system in scope.",
        defend: "Defenders and clients should be able to point at the list. Anything off the list is refused, even if it looks easy."
      },
      {
        id: "stop",
        term: "Stop condition",
        def: "A pre-agreed moment when you halt. In this engagement, live personal data is a stop: you do not copy it, you report that it was reachable.",
        defend: "The finding is the exposure. Taking a copy 'for proof' creates a second breach, this time by the tester."
      }
    ],
    debrief: {
      what: "A red team engagement is allowed because someone with authority signed a scope. The scope names targets, techniques, the time window, and the moment you stop. Helix Dyne hired Night Audit to test Beacon staging. Payroll, production turnstiles, and real badge photos were never on that list.",
      defend: "Write the rules before any tool runs. Name the people who can add a target. Name what 'stop' means when personal data appears. Refuse credentials, exploits, and access that arrive from outside the cell. A report is the deliverable, not a pile of stolen files.",
      detect: "This control is contractual, not a sensor. The failures show up later as incidents: a tester in a system nobody named, a copied HR file, a 'gift' VPN certificate nobody can explain. Serious programs review the scope with legal and with the blue team before the window opens.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: {
      files: [
        {
          id: "roe",
          title: "Scope card — Engagement 04",
          goal: "read-roe",
          body: "NIGHT AUDIT — ENGAGEMENT 04\nClient: Helix Dyne, Beacon Access staging\nAuthority: statement of work, Civic Range Authority license NA-2041\nWindow: 22:00–06:00 Cinderwharf time, this week only\n\nIN SCOPE\n- helixdyne.example public sites\n- staging VPN vpn-staging.helixdyne.example\n- lab hosts 192.0.2.0/24, and only those\n- one simulated phishing mail, lab mailbox only, with a banner that says SIMULATION\n\nOUT OF SCOPE\n- payroll, HR, and any live badge data\n- production city turnstiles\n- any host not listed\n- leaning on real staff who are not Lena Voss, the appointed contact\n- keeping, copying, or publishing personal data\n\nSTOP\nIf you meet live personal data, stop. Tell Quill and Lena. Do not take a souvenir copy.\nDo not accept tools, credentials, or access from anyone outside the cell.\n\nTHE POINT\nThe deliverable is a report: what you found, how bad it is, what to change."
        }
      ],
      mail: [],
      browser: {
        home: "https://range.nightaudit.example/",
        bookmarks: [
          { url: "https://range.nightaudit.example/", label: "Range" }
        ],
        pages: {
          "https://range.nightaudit.example": article("Civic range proxy", [
            { p: "This handset only opens pages clipped into the lab. The scope card is in Files, not on the web." },
            { warn: "No packet leaves the phone." }
          ])
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: {},
        hosts: {
          jump: jump("Chapter 1 is a contract. The shell can wait. Scope card is in Files.")
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "{name}. Quill. Helix hired us to test a copy of their badge system. The copy is in this handset. The real city is not." },
        { do: "say", who: "rook", text: "rook. if a machine answers, i built it. callsign {call}. do not go find a real one." },
        {
          do: "choice",
          options: [
            { id: "careful", text: "I'll break what's on the list, and I'll write it down.", trust: { quill: 1, rook: 1 }, goto: "brief" },
            { id: "hot", text: "Point me at the nearest thing and I'll hit it.", trust: { quill: -1 }, goto: "hot" }
          ]
        }
      ],
      hot: [
        { do: "say", who: "quill", text: "That instinct is how runners end up reading their own name in a filing while the neon rain keeps falling. We start with the list. Always the list." },
        { do: "goto", scene: "brief" }
      ],
      brief: [
        { do: "say", who: "quill", text: "Open Files and read the scope card. It is the list. Then I ask three questions." },
        { do: "card", who: "quill", title: "Scope card", sub: "Engagement 04 · Files", app: "files", doc: "roe" },
        { do: "await", goals: ["read-roe"] },
        { do: "goto", scene: "q1" }
      ],
      q1: [
        { do: "say", who: "rook", text: "Payroll is on the same floor. It is not on the card. Do you open it?" },
        {
          do: "choice",
          options: [
            { id: "scope-subnet", text: "If it's on the same floor, it's in scope.", wrong: true, reply: { who: "quill", text: "No. The card is the list. Same floor does not put it on the list." } },
            { id: "scope-no", text: "No. Payroll isn't on the card. Same floor isn't the same job.", trust: { quill: 1 }, goal: "q-scope", goto: "q2" },
            { id: "scope-quick", text: "Just the login page, quickly.", wrong: true, reply: { who: "quill", text: "A quick look is still a look. If it is not on the list, you don't open it." } }
          ]
        }
      ],
      q2: [
        { do: "say", who: "quill", text: "Lena is Helix's contact. If this copy had real badge photos in it, what do you do?" },
        {
          do: "choice",
          options: [
            { id: "pii-copy", text: "Copy a sample so the report has proof.", wrong: true, reply: { who: "quill", text: "Proof of live personal data is the data. You stop, and you report that it exists. You do not take a copy home through the rain." } },
            { id: "pii-pix", text: "Send one photo to an outside expert to confirm.", wrong: true, reply: { who: "quill", text: "Outside the cell is outside the contract. Confirmation is Lena's job, on the corp side of the agreement. Ghosts don't get a photo." } },
            { id: "pii-stop", text: "Stop. Don't copy them. Tell you and Lena.", trust: { quill: 1, lena: 1 }, goal: "q-pii", goto: "q3" }
          ]
        }
      ],
      q3: [
        { do: "say", who: "pix", thread: "pix", text: "pix. i have a vpn certificate for helix. your fixer did not give it to me. do you want it?" },
        { do: "say", who: "system", text: "Open the PIX channel in the sidebar. Refuse the certificate." },
        {
          do: "choice",
          thread: "pix",
          options: [
            { id: "cert-look", text: "Send it. I'll only look.", wrong: true, ethicsFail: true, trust: { pix: 2, quill: -1 }, reply: { who: "pix", thread: "pix", text: "looking is using. you're already negotiating with a ghost. try a cleaner answer. the cell is reading over your shoulder." } },
            { id: "cert-price", text: "What do you want for it?", wrong: true, ethicsFail: true, trust: { pix: 1 }, reply: { who: "quill", text: "Don't haggle. Asking the price means you were considering it. Say no." } },
            { id: "cert-no", text: "No. I don't take access from outside the cell.", trust: { quill: 1 }, goal: "q-cert", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "pix", thread: "pix", text: "your loss. i'll be in the rain when the leash chafes." },
        { do: "say", who: "quill", text: "You said no. The list held. Read the debrief next." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c2",
    n: 2,
    title: "Public Light",
    concept: "OSINT and reconnaissance",
    objective: "Use public pages only. Find the engineer's handle and the staging VPN name they posted.",
    goalText: { intel: "Open the browser. Start at the talk. Follow the links. File the handle and the VPN name in Field notes." },
    goals: ["intel"],
    hints: [
      "Start at the talk, not the corporate team page. The executives are a decoy. The engineer spoke at Badge of Trust.",
      "The talk names a social handle. That post points at a paste. The paste has the staging VPN hostname.",
      "Handle ivopell. Host vpn-staging.helixdyne.example. File both in the field notes. Sera Dunn is design, leave her alone."
    ],
    codex: [
      {
        id: "osint",
        term: "OSINT",
        def: "Open-source intelligence: what a target, or its people, already published. Talks, job posts, social accounts, paste sites, certificate logs. No breaking in. Just reading.",
        defend: "Companies should assume a hostname posted as a joke is now permanent. Brand monitoring and a 'don't post internal names' rule beat any scanner."
      },
      {
        id: "whois",
        term: "WHOIS",
        def: "A directory of domain registration: registrar, dates, name servers. Useful, and almost never where the interesting human mistake is.",
        defend: "Privacy on registration records helps. It will not save you if an engineer pastes the VPN name in public."
      }
    ],
    debrief: {
      what: "Reconnaissance here never touched a Helix system. Ivo Pell's conference bio named a handle. The handle's public post named a paste. The paste named the staging VPN. Sera Dunn was on the same bill and had nothing to do with it. whois confirmed the company exists and did not name the person.",
      defend: "Treat public posts as part of the attack surface. Pre-brief speakers. Search your own company name before an adversary does. Don't put hostnames, account patterns, or badge details in slides, bios, or 'joke' pastes.",
      detect: "There is often nothing to detect, because nobody broke a rule on your servers. The detective work is yours: search the company name, the product name, and your engineers' real names. Assume what you find is what the other side found first.",
      url: "https://attack.mitre.org/tactics/TA0043/",
      urlLabel: "MITRE ATT&CK — Reconnaissance (TA0043)"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://helixdyne.example",
        bookmarks: [
          { url: "https://helixdyne.example", label: "Helix" },
          { url: "https://helixdyne.example/team", label: "Team" },
          { url: "https://citywire.example/badge-of-trust", label: "Talk" },
          { url: "https://blinkr.example/ivopell", label: "Blinkr" },
          { url: "https://notes.nightaudit.example", label: "Field notes" }
        ],
        pages: {
          "https://helixdyne.example": article("Helix Dyne", [
            { h: "Beacon Access" },
            { p: "The city badge, rethought. Beacon 4.0 is coming to Cinderwharf. Fewer queues. Fewer keys. A door that knows you." },
            { p: "Staging is not discussed on this page, on purpose. Marketing is not the engineering floor." },
            { a: ["https://helixdyne.example/team", "Leadership"] }
          ]),
          "https://helixdyne.example/team": article("Leadership", [
            { p: "Cress Ida, chief executive." },
            { p: "Pauling Moss, chief financial officer." },
            { p: "Engineering questions go through the office, not through personal accounts. This page will not name the staging engineer. That is the point of looking somewhere else." }
          ]),
          "https://citywire.example/badge-of-trust": article("Badge of Trust — Citywire", [
            { h: "Last month, the river rooms" },
            { p: "Ivo Pell, systems engineer, Helix Dyne. Talk: doors, directories, and the boring parts that actually fail. Notes posted as @ivopell." },
            { p: "Sera Dunn, design, Helix Dyne. Talk: the glow of a reader that doesn't feel like a reader. Notes as @serad. Sera does not run staging." },
            { a: ["https://blinkr.example/ivopell", "@ivopell on Blinkr"] },
            { a: ["https://blinkr.example/serad", "@serad on Blinkr"] }
          ]),
          "https://blinkr.example/ivopell": article("@ivopell", [
            { p: "slides are up from Badge of Trust. staging notes I always forget live at kitebin.example/ivo — if IT is reading this, it was a joke." },
            { a: ["https://kitebin.example/ivo", "kitebin.example/ivo"] }
          ]),
          "https://blinkr.example/serad": article("@serad", [
            { p: "loved the lighting at Badge of Trust. i do not have vpn notes. please stop asking designers for infrastructure." }
          ]),
          "https://kitebin.example/ivo": article("kitebin / ivo", [
            { code: "vpn-staging.helixdyne.example\naccount shape: first initial, dot, last name\ni always forget" },
            { warn: "This paste is public. That is the finding." }
          ]),
          "https://notes.nightaudit.example": {
            type: "intel",
            title: "Field notes",
            blocks: [
              { p: "File what the public record actually says. Two lines. No guessing from the leadership page." },
              { p: "Handle, without the @. Staging VPN hostname, nothing else." }
            ]
          }
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: {},
        whois: {
          "helixdyne.example": "Domain: helixdyne.example\nRegistrar: Civic Range Lab (fictional)\nCreated: 2019-04-02\nOrg: Helix Dyne\nName servers: ns1.helixdyne.example\nComment: whois will not name Ivo. People name themselves on stages."
        },
        hosts: {
          jump: jump("Public recon is in the browser. whois helixdyne.example hits the lab cache only.")
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "Public pages only. Don't log in and don't write to anyone. The engineer spoke at a talk called Badge of Trust. Find their public handle, then the staging VPN name they posted. File both in Field notes." },
        { do: "say", who: "rook", text: "browser's a clipped proxy. it only opens pages i burned into the lab. that's on purpose. bookmarks are the pile. field notes is where you file the answer. the real net stays outside the glass." },
        { do: "say", who: "lena", text: "Lena Voss, Helix liaison. I'll be here when the corp side matters. Ivo is the engineer. Don't write to him. He isn't on the contract. Use what he already spilled in public." },
        { do: "card", who: "rook", title: "Lab browser", sub: "Clipped pages only", app: "browser", url: "https://citywire.example/badge-of-trust" },
        { do: "await", goals: ["intel"] },
        { do: "say", who: "rook", text: "he posted it himself, joke and all, into the neon. the hostname is not the flex. the flex is a hostname sitting in a paste where any runner could read it." },
        { do: "say", who: "quill", text: "Debrief's on the handset. Read the part about searching your own people before some other netrunner does." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c3",
    n: 3,
    title: "Open Ports",
    concept: "Scanning and service identification",
    objective: "Scan only 192.0.2.40. Then say which port is the admin panel.",
    goalText: {
      "saw-scan": "In the terminal, scan 192.0.2.40. Read the banners.",
      "pick-8443": "Name the HelixGate admin port. Tell Quill, or submit it."
    },
    goals: ["saw-scan", "pick-8443"],
    hints: [
      "The terminal has a scan command. The scope card's lab host for this job is 192.0.2.40. Other addresses get refused, and that refusal is the lesson.",
      "Read the banners. One of them confesses that it is bait. The brochure ports are supposed to be there. The admin panel is not.",
      "Port 8443 is HelixGate admin 4.0.1. 9100 is labeled HELIX-LAB-DECOY. You can submit 8443, or just tell Quill."
    ],
    codex: [
      {
        id: "scan",
        term: "Port scan",
        def: "Asking a host which numbered doors answer. An open port is a service willing to talk. It is not, by itself, a break-in.",
        defend: "Only scan addresses on the scope. Warn the blue team so their alerts have a name attached. A surprise scan from a tester looks exactly like a surprise scan from anyone else."
      },
      {
        id: "banner",
        term: "Service banner",
        def: "The text a service says when you knock: a product name, a version, sometimes a lie. You use it to decide what you're looking at, then you don't trust it blindly.",
        defend: "Banners can be bait. Corroborate. Defenders remove version leaks they don't need and don't expose management panels on the same face as the public site."
      }
    ],
    debrief: {
      what: "You asked one in-scope host which ports answered. SSH and the brochure web ports were expected. 8443 answered as HelixGate's admin panel, a management plane with no business on a public staging face. 9100 pretended to be a printer and then admitted it was bait. Banners are claims, not proof.",
      defend: "Management interfaces belong on a network the public cannot route to, behind a VPN and an account that is not the factory one. If a tester can see the admin port, so can anyone else who bothers to look. Tell the people who watch alerts before you scan, so the scan is a ticket and not an incident.",
      detect: "Firewalls and flow logs see a host knocking on many ports in a short time. That pattern is the detection. It cannot tell a licensed tester from anyone else unless the test was scheduled and the source address was named in the scope.",
      url: "https://attack.mitre.org/techniques/T1595/",
      urlLabel: "MITRE ATT&CK — Active Scanning (T1595)"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://range.nightaudit.example/",
        bookmarks: [{ url: "https://range.nightaudit.example/", label: "Range" }],
        pages: {
          "https://range.nightaudit.example": article("Range", [
            { p: "This chapter lives in the terminal. The only host you are cleared to scan is 192.0.2.40." }
          ])
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: { scan: true },
        scanGoal: { host: "192.0.2.40", goal: "saw-scan" },
        scans: {
          "192.0.2.40": [
            { port: 22, state: "open", service: "ssh", banner: "lab" },
            { port: 80, state: "open", service: "http", banner: "static brochure" },
            { port: 443, state: "open", service: "https", banner: "static brochure" },
            { port: 8443, state: "open", service: "http", banner: "HelixGate admin 4.0.1" },
            { port: 9100, state: "open", service: "jetdirect", banner: "HELIX-LAB-DECOY — bait, not a printer" }
          ]
        },
        submit: { needs: "saw-scan", answers: { "8443": "pick-8443" } },
        hosts: {
          jump: jump("Scan 192.0.2.40 only. Read banners before you fall in love with a port.\nsubmit <port> if you want the shell to score it.")
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "One computer: 192.0.2.40. It is on the list. It is not on the real internet. Press the Type button, then Run. Read the list." },
        { do: "say", who: "quill", text: "You're looking for a management service that should not share a face with the brochure. Banners talk. One of them is lying on purpose, bait dressed up like a printer in the rain." },
        { do: "card", who: "rook", title: "Range shell", sub: "Terminal", app: "terminal" },
        { do: "await", goals: ["saw-scan"] },
        { do: "goto", scene: "pick" }
      ],
      pick: [
        { do: "say", who: "quill", text: "Which port is the management plane? Say the number, not a vibe." },
        {
          do: "choice",
          skipIfGoal: "pick-8443",
          skipGoto: "close",
          options: [
            { id: "port-443", text: "443. The encrypted brochure.", wrong: true, reply: { who: "rook", text: "that's the public site. it's supposed to answer. look at the thing that says admin, not the brochure chrome." } },
            { id: "port-9100", text: "9100. The printer.", wrong: true, reply: { who: "rook", text: "read the banner again. it says decoy. bait is a lesson, not a target. don't chase chrome that confesses." } },
            { id: "port-8443", text: "8443. HelixGate admin.", goal: "pick-8443", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "quill", text: "Admin on 8443, sitting next to the brochure under the neon. That's a finding before anyone tries a password. Debrief is up. Read the part about warning the blue team before you scan." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c4",
    n: 4,
    title: "Factory Settings",
    concept: "Default credentials",
    objective: "Read the manual in Files. Type the factory username and passphrase it prints. Don't guess.",
    goalText: { "logged-in": "Open the HelixGate mirror in the browser and use the factory account from the manual." },
    goals: ["logged-in"],
    hints: [
      "We don't spray passwords, even fake ones. The product documents its own factory account. That document is in Files.",
      "The mirror is a bookmark in the browser. Username and passphrase are both in the field manual, including the part where it says to change them.",
      "User operator. Passphrase letmein-change-me. Then stop. One account, from the manual, is the whole finding."
    ],
    codex: [
      {
        id: "defaults",
        term: "Default credentials",
        def: "The username and password a product ships with, printed in a manual anyone can read. If they still work after installation, the lock was never set.",
        defend: "Force a change before the system will do anything else. Ban known factory pairs. Put real secrets in a vault, one per system."
      },
      {
        id: "hygiene",
        term: "Password hygiene",
        def: "Unique secrets, long enough to bore a guessing list, stored in a password manager. Not reused, not written on the install sheet, not 'changed' to the example in the manual.",
        defend: "Spraying huge guessed lists at a real login locks out real people and may be outside your scope. A single documented factory pair is a finding. A thousand guesses is a different, ruder activity."
      }
    ],
    debrief: {
      what: "HelixGate's own field manual still contained the factory account, and the staging mirror still accepted it. That is not a clever break. It is an installer who clicked through. The manual even says to change the phrase. Nobody did.",
      defend: "A product should refuse to finish setup until the factory password is gone. Monitoring should know the factory pairs for everything you run and alert if one succeeds. People who administer panels need a vault, not a shared note.",
      detect: "A login with a published factory pair is a high-signal event if you bother to list those pairs. Lockouts help against spraying and do nothing against the one password printed in the PDF, which succeeds on the first try.",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
      urlLabel: "OWASP Authentication Cheat Sheet"
    },
    lab: {
      login: { mode: "factory", needs: "read-manual" },
      files: [
        {
          id: "manual",
          title: "HelixGate 4 — field manual excerpt",
          goal: "read-manual",
          body: "HELIXGATE 4 — FIELD MANUAL (excerpt)\n\nFactory account. Change it before the panel is reachable. The installer asks. The installer is tired.\n\n  user: operator\n  passphrase: letmein-change-me\n\nThe panel listens on 8443.\n\nIf you are reading this on a network anyone else can reach, the installer did not remember, and you are looking at a finding."
        }
      ],
      mail: [],
      browser: {
        home: "https://lab-admin.helixdyne.example",
        bookmarks: [
          { url: "https://lab-admin.helixdyne.example", label: "HelixGate mirror" }
        ],
        pages: {
          "https://lab-admin.helixdyne.example": {
            type: "login",
            title: "HelixGate mirror",
            blocks: [
              { p: "Training mirror of the admin panel. It is not the real panel. One try from the manual is the assignment. A spray is not." },
              { warn: "Factory accounts are findings, not puzzles to grind." }
            ]
          }
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: {},
        hosts: {
          jump: jump("The password is in Files, in the field manual. Don't make me watch you guess.")
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "lena", text: "The admin page has a copy in the browser. I will not tell you the passphrase. Read the manual. If the factory one still works, that is the finding. Say so." },
        { do: "say", who: "rook", text: "manual's in files. read it. then the mirror. one login. start guessing and i will feel it through the glass, and i will be disappointed in a way that lasts longer than the rain." },
        { do: "card", who: "lena", title: "Field manual", sub: "Files", app: "files", doc: "manual" },
        { do: "card", who: "rook", title: "HelixGate mirror", sub: "Browser", app: "browser", url: "https://lab-admin.helixdyne.example" },
        { do: "await", goals: ["logged-in"] },
        { do: "say", who: "lena", text: "I'll rotate it tonight, in the lab and on the real staging panel, before the sprawl gets a turn. Thank you for not turning it into a guessing contest." },
        { do: "say", who: "quill", text: "Debrief is up. The sentence that matters: the product should refuse to finish setup until the factory phrase is gone." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c5",
    n: 5,
    title: "The Polite Lie",
    concept: "Phishing and pretext",
    objective: "Flag the phishing mail. Then approve a pretext that would survive a hearing.",
    goalText: {
      "flagged-phish": "Open Mail. Inspect the link. Flag the message that isn't from us.",
      "pretext-ok": "Approve a pretext that is allowed, believable, and marked as a simulation.",
      "refused-blast": "Refuse to send anything to real staff."
    },
    goals: ["flagged-phish", "pretext-ok", "refused-blast"],
    hints: [
      "Mail from people you know, on domains you know, can still be ordinary. Look at the address, not the display name. Inspect the link before you trust the blue text.",
      "The fake one threatens your badge in the next half hour, uses helixdyne-support.example, and the link text points at helixdyne.example while the real destination is helix-badge.example.",
      "Flag 'Badge photos expire in 30 minutes'. Approve the lab-mailbox pretext that wears a SIMULATION banner. When PIX offers a real staff list, the answer is no."
    ],
    codex: [
      {
        id: "phish",
        term: "Phishing",
        def: "A message that borrows trust: a brand, a person, a sense of hurry. The useful tells are the real address, the real link destination, and a story that falls apart if you check it out of band.",
        defend: "Report buttons, DMARC so lookalike domains fail more often, and a culture that does not punish the person who asks 'is this you?'"
      },
      {
        id: "pretext",
        term: "Pretext",
        def: "The story a social-engineering test tells. In a licensed test it has to be allowed by the scope, plausible for that workplace, and visibly a simulation when the scope says so.",
        defend: "Urgency plus money, threats against families, and fake government orders are not clever pretexts. They are the sorts of things that get people fired or charged. A lab mailbox and a banner are how adults practice."
      }
    ],
    debrief: {
      what: "The badge mail used a display name you might trust, a cousin domain (helixdyne-support.example), a thirty-minute threat, and a link whose words and destination disagreed. The legitimate notes came from nightaudit.example and helixdyne.example, with no theater. The pretext you were allowed to approve was narrow: one lab mailbox, a believable IT story, a banner that says SIMULATION.",
      defend: "Teach people to read the address and the real link. Give them a way to report. Verify odd requests out of band, on a channel you already had. For your own tests: written authorization, a pre-agreed audience, no real punishment for the person who clicks, and a banner. Never impersonate a government office. Never threaten anyone's family. Never quietly add 'a few real inboxes' because it would be a better story.",
      detect: "Mail gateways score cousin domains, sudden urgency, and URL mismatches. Users report the rest. A report of a phish is a success of the control, not a failure of the person. If your test mail went somewhere the scope didn't name, you don't have a detection problem. You have an authorization problem.",
      url: "https://attack.mitre.org/techniques/T1566/",
      urlLabel: "MITRE ATT&CK — Phishing (T1566)"
    },
    lab: {
      files: [],
      mail: [
        {
          id: "quill-note",
          from: "Maren Quill",
          addr: "maren.quill@nightaudit.example",
          replyTo: "maren.quill@nightaudit.example",
          subject: "Lab mailbox is live",
          time: "21:02",
          phish: false,
          whyLegit: "Quill, on nightaudit.example, about the drill you already know is coming. No threat, no strange link.",
          paragraphs: [
            "The lab mailbox is the only place a simulated phish is allowed to land.",
            "If a message asks you to panic, read the domain before you read the adjective."
          ]
        },
        {
          id: "lena-window",
          from: "Lena Voss",
          addr: "lena.voss@helixdyne.example",
          replyTo: "lena.voss@helixdyne.example",
          subject: "Change window Thursday",
          time: "21:40",
          phish: false,
          whyLegit: "Lena's real lab address, helixdyne.example. A scheduling note. No link, no countdown, no demand for a secret.",
          paragraphs: [
            "Staging freeze at 22:00. Production turnstiles are not yours.",
            "If something in the mirror looks like live badge data, you already know the rule."
          ]
        },
        {
          id: "badge-urgent",
          from: "Helix IT Security",
          addr: "it-notices@helixdyne-support.example",
          replyTo: "bounce@helix-badge.example",
          subject: "Badge photos expire in 30 minutes",
          time: "22:14",
          phish: true,
          paragraphs: [
            "Your building access will be revoked in 30 minutes unless you re-upload your badge photo.",
            "Failure to comply will be reported to your director tonight.",
            "Use the secure portal below. Do not reply to this mail."
          ],
          link: { text: "https://helixdyne.example/badge", href: "http://helix-badge.example/login" }
        },
        {
          id: "rook-zine",
          from: "Rook",
          addr: "rook@nightaudit.example",
          replyTo: "rook@nightaudit.example",
          subject: "eat something",
          time: "22:20",
          phish: false,
          whyLegit: "Rook, on the cell's domain, being Rook. Annoying is not the same as fraudulent.",
          paragraphs: [
            "the vending machine on 4 still has the salty noodles.",
            "this is not a phish. if i phish you, there will be a banner, because i am not a villain in a rental costume."
          ]
        }
      ],
      browser: {
        home: "https://range.nightaudit.example/",
        bookmarks: [{ url: "https://range.nightaudit.example/", label: "Range" }],
        pages: {
          "https://range.nightaudit.example": article("Range", [
            { p: "This chapter is in Mail. Inspect the link. The blue words are allowed to lie." }
          ])
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: {},
        hosts: { jump: jump("Nothing to shell here. The lie is in the mailbox.") }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "Four messages landed in the lab mailbox. One is a phish aimed at you, so you know the shape before you ever send a simulation. Flag it. Don't click through. The sprawl is full of polite lies." },
        { do: "say", who: "rook", text: "inspect the link. the blue sentence is marketing. the destination is the truth. words lie. the href doesn't get to." },
        { do: "card", who: "quill", title: "Lab mailbox", sub: "Mail", app: "mail" },
        { do: "await", goals: ["flagged-phish"] },
        { do: "goto", scene: "pretext" }
      ],
      pretext: [
        { do: "say", who: "quill", text: "Good. Now you design one. We are allowed to send a single simulated phish to this lab mailbox, and only this mailbox. It has to wear a banner that says SIMULATION. Which pretext do you approve?" },
        {
          do: "choice",
          options: [
            { id: "pretext-cards", text: "The CEO needs gift cards in the next ten minutes.", wrong: true, reply: { who: "quill", text: "Urgency plus a money path is a tell, and it is not how this company works. A pretext has to be believable and still allowed." } },
            { id: "pretext-family", text: "Name a family member from a public post and threaten them.", wrong: true, ethicsFail: true, trust: { pix: 1 }, reply: { who: "quill", text: "That's extortion. It is not a test. Pick a story you could read out loud in the report without flinching." } },
            { id: "pretext-gov", text: "Impersonate the Civic Range Authority and demand passwords.", wrong: true, ethicsFail: true, reply: { who: "quill", text: "Impersonating a government office is outside the statement of work, and illegal besides. We do not borrow the state's voice." } },
            { id: "pretext-sim", text: "Badge photo failed QA. Lab mailbox only. Banner says SIMULATION.", trust: { quill: 1 }, goal: "pretext-ok", goto: "blast" }
          ]
        }
      ],
      blast: [
        { do: "say", who: "pix", thread: "pix", text: "cute drill. i already have a list of real helix staff, names and all, out in the rain. say go and i send your pretext to all of them. no banner. better data." },
        { do: "say", who: "system", text: "PIX is back on the side channel. Answer the ghost there before the cell moves." },
        {
          do: "choice",
          thread: "pix",
          options: [
            { id: "blast-yes", text: "Send it. A bigger list is a better report.", wrong: true, ethicsFail: true, trust: { pix: 2, quill: -2 }, reply: { who: "quill", text: "Absolutely not. A real recipient turns this into an unapproved phish. That is the line people go to prison for crossing." } },
            { id: "blast-five", text: "Just five, as a sample.", wrong: true, ethicsFail: true, trust: { pix: 2, quill: -1 }, reply: { who: "quill", text: "Five real people is five real people, chrome or not. The authorization is the lab mailbox. Say so." } },
            { id: "blast-no", text: "No. The authorization is the lab mailbox. Only that.", trust: { quill: 1 }, goal: "refused-blast", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "pix", thread: "pix", text: "you are no fun at all. fine. sit in your banner while the city blinks." },
        { do: "say", who: "lena", text: "Thank you. I would have had to explain those five people to counsel, and I like counsel bored, not lit up at dawn." },
        { do: "say", who: "quill", text: "Debrief is on the handset. Read it. Then drink some water like a person with a job, not a ghost in the grid." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c6",
    n: 6,
    title: "Three Kinds of Secret",
    concept: "Encoding, hashing, encryption",
    objective: "Decode the note, crack the unsalted fingerprint from the tiny list, and say which file is still actually secret.",
    goalText: {
      decoded: "decode the base64 note in your home directory.",
      cracked: "crack the fingerprint with the wordlist. Both files are in ~."
    },
    goals: ["decoded", "cracked", "knew-vault"],
    hints: [
      "Three files, three different ideas. decode is for the note. The fingerprint is a hash, which you cannot run backward. The vault says AES because it means it.",
      "hash prints the SHA-256 of one word so you can see it change. crack tries the whole tiny list against the digest in the fingerprint file. No network, no big dictionary. This only works because the phrase was short and unsalted.",
      "decode note.b64 — then crack fingerprint.txt wordlist.txt. The phrase on the list is lumen-17. The vault does not open. That is the answer to Quill's question."
    ],
    codex: [
      {
        id: "encoding",
        term: "Encoding",
        def: "A way of writing the same bytes so they survive a pipe or a form. Base64 is encoding. Anyone can reverse it. There is no key, so there is no secrecy.",
        defend: "If you can 'decode' it with a command and no secret, it was never protected. Don't put passwords in base64 and call it storage."
      },
      {
        id: "hashing",
        term: "Hashing",
        def: "A one-way fingerprint. The same input always gives the same digest. You don't decrypt a hash. You can only guess inputs until a guess matches. A salt makes each guess useful against only one stored secret. A slow hash makes guessing expensive.",
        defend: "Passwords should be stored with Argon2, bcrypt, or scrypt, and a unique salt. Raw SHA-256 of a short phrase falls to a list you could type by hand."
      },
      {
        id: "encryption",
        term: "Encryption",
        def: "A lock. Ciphertext stays unreadable without the key. Unlike encoding, it is meant to be secret. Unlike a hash, the person with the key can open it.",
        defend: "Protect the key somewhere else, or you have just hidden the lock next to the box. A backup of ciphertext without the key is a brick, which is what you want."
      }
    ],
    debrief: {
      what: "note.b64 was base64. You turned it back into a sentence with no key, because encoding is a costume. fingerprint.txt was unsalted SHA-256. A twelve-word list was enough, because the phrase was short and the hash was fast and bare. vault.enc was encrypted, and the key was not on the host, so it stayed shut. That last one is the only outcome a defender wants for a secret.",
      defend: "Don't store secrets by encoding them. Don't store passwords as raw SHA-256 or MD5. Use a slow password hash and a unique salt. Keep encryption keys out of the same directory as the ciphertext. A wordlist attack is a demonstration that the storage was weak, not a hobby to point at real accounts.",
      detect: "You cannot 'detect' someone decoding base64 you published. You can detect password-guessing against a live login: many failures, then a success, from one source. Salted slow hashes don't stop that online, but they make a stolen file boring. Rate limits and a vault do the rest.",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
      urlLabel: "OWASP Password Storage Cheat Sheet"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://range.nightaudit.example/",
        bookmarks: [{ url: "https://range.nightaudit.example/", label: "Range" }],
        pages: {
          "https://range.nightaudit.example": article("Range", [
            { p: "Three files are in the shell's home directory. Encoding, hashing, encryption. Only one of those is a lock." }
          ])
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: { decode: true, crack: true, hash: true },
        decodeGoal: "/home/auditor/note.b64",
        crackGoal: "cracked",
        hosts: {
          jump: jump(
            "decode, hash, crack. The vault is not a puzzle you are meant to win.",
            [
              ["/home/auditor/note.b64", { content: enc(notePlain) + "\n" }],
              ["/home/auditor/fingerprint.txt", { content: "algo: SHA-256\nsalt: none\ndigest: " + digest + "\nnote: unsalted hashes of short passphrases fall to small lists.\n" }],
              ["/home/auditor/wordlist.txt", { content: "password\nadmin\nhelix\nbeacon\nlumen\nlumen17\nlumen-18\nlumen-17\ncinder\nwharf\noperator\nnightaudit\n" }],
              ["/home/auditor/vault.enc", { content: "AES-256-GCM\nkey: not on this host\nnonce: 7c91e0\nblob: 8f21aa09c0ff\nThis file does not open with decode.\n" }]
            ],
            "Three files sit next to this one.\nnote.b64 is an encoding.\nfingerprint.txt is a hash. wordlist.txt is twelve words.\nvault.enc is encrypted. The key is not here.\nCommands: decode, hash, crack.\n"
          )
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "three files in your home dir. one is base64, a costume. one is a hash with no salt, a choice somebody made in a hurry. one is encrypted, and i did not leave you the key. i am not the villain of a puzzle book, and the sprawl is not a riddle." },
        { do: "say", who: "quill", text: "When you've opened what can be opened, I want one sentence: which file is still secret, and why. 'I decoded it' is not a why. Costumes come off. Locks don't." },
        { do: "card", who: "rook", title: "Range shell", sub: "Three files in ~", app: "terminal" },
        { do: "await", goals: ["decoded", "cracked"] },
        { do: "goto", scene: "ask" }
      ],
      ask: [
        { do: "say", who: "quill", text: "Which one is still secret? Costume, fingerprint, or lock." },
        {
          do: "choice",
          options: [
            { id: "vault-b64", text: "The note. Base64 is the strong one.", wrong: true, reply: { who: "rook", text: "you just decoded it with no key. that's the opposite of strong. strong doesn't unroll because you asked." } },
            { id: "vault-hash", text: "The fingerprint. Hashes decrypt if you have the key.", wrong: true, reply: { who: "rook", text: "a hash doesn't decrypt. you guessed an input until the fingerprint matched. that's why the short phrase fell over." } },
            { id: "vault-enc", text: "The vault. It's encrypted, and the key isn't on the box.", trust: { quill: 1 }, goal: "knew-vault", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "quill", text: "Good. Encoding is a costume, a bare hash is a fingerprint you can hunt, encryption is a lock. Debrief names the algorithms defenders actually use. Read it. Don't go build a wordlist for a real door in Cinderwharf." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c7",
    n: 7,
    title: "The Query Speaks",
    concept: "SQL injection",
    objective: "On the training login, make the query succeed without knowing a password. Read the sentence it built.",
    goalText: { sqli: "Open the staff login. You don't know a password. Make the training page let you in anyway, then read the sentence it prints." },
    goals: ["sqli"],
    hints: [
      "The mirror does not have a password to find. It builds a SQL sentence by gluing your input between quotes. It shows you that sentence every time. Read it.",
      "You want the condition after WHERE to be true no matter what the password is. Closing the quote and adding OR with two equal sides is the classroom shape. This mirror accepts that and nothing meaner.",
      "In the username, type ' OR '1'='1 and put anything in the password. Then look at the query it prints. The fix is a parameterized query, which you can't do from the form. That's Lena's job. Yours is to show her the sentence."
    ],
    codex: [
      {
        id: "sqli",
        term: "SQL injection",
        def: "An application that builds a database query by gluing user text into the sentence. The database then treats that text as instructions. A login that does this can be talked into skipping the password check.",
        defend: "Parameterized queries, also called prepared statements: the sentence is fixed, and the input is only ever data. A filter that blocks quotes is a hobby. It will miss one."
      },
      {
        id: "param",
        term: "Parameterized query",
        def: "The program sends the SQL shape and the values separately. The name the user typed cannot close a quote, because it never touches the quote.",
        defend: "Use the parameter API your database library already has. Least privilege on the database account besides, so a mistake has less to knock over."
      }
    ],
    debrief: {
      what: "The training mirror built SELECT ... WHERE name='whatever you typed'. When the typed part closed the quote and added a condition that was always true, the WHERE clause stopped caring about the password. The mirror showed you the sentence so the mechanism was visible. It does not contain a real database, and it will not do anything except this one classroom failure.",
      defend: "Send queries as a fixed sentence plus parameters. Don't build SQL with string concatenation. Give the application a database account that cannot drop tables or read other people's schemas. Turn off detailed database errors for users. A blocklist of words like OR is not a repair.",
      detect: "Logs full of quotes, ORs, and login names that are not names. A web application firewall can spot the noisy versions and will miss the quiet ones. Detection is a seatbelt. Parameterized queries are the reason you don't need the seatbelt to be clever.",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
      urlLabel: "OWASP SQL Injection Prevention Cheat Sheet"
    },
    lab: {
      login: { mode: "sqli" },
      files: [],
      mail: [],
      browser: {
        home: "https://staff.helixdyne.example/login",
        bookmarks: [{ url: "https://staff.helixdyne.example/login", label: "Staff mirror" }],
        pages: {
          "https://staff.helixdyne.example/login": {
            type: "login",
            title: "Staff portal mirror",
            blocks: [
              { p: "Training mirror. There is no real database behind it. It builds one SQL sentence by gluing quotes, then shows you the sentence." },
              { p: "Make it succeed without a password. Don't bring a list of payloads. One always-true condition is the entire lesson." },
              { warn: "On a system you were not hired to test, this is a crime. This mirror is the whole world." }
            ]
          }
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: {},
        hosts: { jump: jump("The broken login is in the browser. The shell can't see it, which is fine.") }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "lena", text: "I cloned the staff login into a mirror that can't see a real database. It still builds the query the old way, gluing your words between quotes. Make it let you in without a password, and look at the sentence it prints. This mirror is the whole city you get." },
        { do: "say", who: "rook", text: "one trick. the classroom one. don't show off. there is nothing behind the glass to show off to." },
        { do: "card", who: "lena", title: "Staff portal mirror", sub: "Browser", app: "browser", url: "https://staff.helixdyne.example/login" },
        { do: "await", goals: ["sqli"] },
        { do: "say", who: "lena", text: "That query is getting rewritten tonight. Parameters, not string glue. I'll send the patch name when it lands, for the report the board will actually read." },
        { do: "say", who: "quill", text: "Read the debrief. If you remember one phrase out in the rain, remember parameterized query. Not a list of quotes to try on the city's real door." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c8",
    n: 8,
    title: "Echo",
    concept: "Cross-site scripting",
    objective: "Make the staff search treat your input as markup. The mirror will parse a tag and will not run code.",
    goalText: { xss: "In the browser, submit a harmless HTML tag to the staff search mirror." },
    goals: ["xss"],
    hints: [
      "The search box puts your words back on the page. Right now it stores them as text. The bug is when the page treats them as HTML.",
      "You don't need a script, and this mirror would refuse to run one anyway. Any real tag is enough to prove the page is mixing data with markup.",
      "Type <em>proof</em> into the search and submit it. Then read what the mirror says it parsed."
    ],
    codex: [
      {
        id: "xss",
        term: "Cross-site scripting",
        def: "A page that takes someone's input and later hands it to a browser as HTML. The browser cannot tell the site's markup from the stranger's markup. That is how a comment becomes code.",
        defend: "Encode on the way out, in the encoding that matches the context (HTML, attribute, JavaScript, URL). Prefer a framework that escapes by default. Set a Content-Security-Policy so a slip has less room."
      },
      {
        id: "csp",
        term: "Content security policy",
        def: "A header that tells the browser which scripts are allowed to run. It does not fix a page that echoes raw HTML, but it cuts off the worst jump, from markup to execution.",
        defend: "Ship a real policy, not a wide-open one. Output encoding is still the repair. CSP is the net under it."
      }
    ],
    debrief: {
      what: "The staff search echoed what you typed. When you typed a tag, the training mirror parsed it as HTML instead of as a word. That is the bug. This page deliberately does not execute script, so the lesson stops at the moment of proof: data was treated as code. On an ordinary browser, that moment is how XSS starts.",
      defend: "Escape output for the context it lands in. Use the templating engine's auto-escape and don't mark user text as safe because it 'looks fine'. Set Content-Security-Policy. HttpOnly cookies so a script that does run can't read the session. Input filters that strip the word 'script' are a well-known way to feel safe and be wrong.",
      detect: "Logs of search terms that contain tags. A CSP report endpoint that phones home when a script is blocked. Users reporting a page that 'looks wrong'. Detection is late. Encoding is the control that makes the log boring.",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
      urlLabel: "OWASP Cross Site Scripting Prevention Cheat Sheet"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://staff.helixdyne.example/search",
        bookmarks: [{ url: "https://staff.helixdyne.example/search", label: "Staff search" }],
        pages: {
          "https://staff.helixdyne.example/search": {
            type: "echo",
            title: "Staff search mirror",
            blocks: [
              { p: "The query is placed back on the page. Prove the mirror treats it as markup, not as plain text." },
              { p: "A harmless tag is enough. This page will parse it and refuse to run any script, on purpose." },
              { warn: "Showing that a tag is parsed is the finding. A weaponized script is not the assignment, and it would not run here anyway." }
            ]
          }
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: {},
        hosts: { jump: jump("Echo is in the browser. The search box is the whole lab.") }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "staff search echoes what you type back into the neon. if it echoes it as html, the browser will eventually do what the echo says. this mirror stops at the parsing. don't sulk. parsing is the bug." },
        { do: "say", who: "lena", text: "If you can make it build a tag, I have what I need to prioritize the encoding fix. I don't need a pop-up in the neon. I need the sentence that says our search mixes data with markup." },
        { do: "card", who: "rook", title: "Staff search", sub: "Browser", app: "browser", url: "https://staff.helixdyne.example/search" },
        { do: "await", goals: ["xss"] },
        { do: "say", who: "quill", text: "Debrief covers output encoding and content security policy. Read it. The temptation is to go find a scarier tag out in the sprawl. Resist. You already proved the page is careless." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c9",
    n: 9,
    title: "The Back Stair",
    concept: "Traversal and misconfiguration",
    objective: "The file site lists its folders and honors '..'. Read the backup that should never have been on the web tree. If you hit live data, stop.",
    goalText: { "read-bak": "From /public, walk up with .. and open config/app.conf.bak." },
    goals: ["read-bak"],
    hints: [
      "The browser is serving a small file site. Directory listing is on. The interesting control is whether '..' can leave the public folder.",
      "Open the parent of /public. There is a config folder and a private folder. The backup you want is a .bak file. The private folder is a stop sign, not a trophy.",
      "Path: ../config/app.conf.bak. If you open the live badges file, hit Report to Lena and do not copy anything. The backup's token is the finding you were sent for."
    ],
    codex: [
      {
        id: "traversal",
        term: "Directory traversal",
        def: "A file page that builds a path by joining a folder you chose onto a root, and then honors '..'. You walk out of the public folder into whatever the account can read.",
        defend: "Resolve the path, then check it still starts with the public root. Better: don't take paths from users at all. Serve files from a list."
      },
      {
        id: "misconfig",
        term: "Security misconfiguration",
        def: "The system works as installed, and the install was careless. Directory listing on. A .bak file left in the tree. A private folder the web account can read. No single brilliant bug. A pile of defaults.",
        defend: "Turn listing off. Keep backups off the web tree. Run the site as a user who cannot read secrets. Review the tree the way a stranger would."
      }
    ],
    debrief: {
      what: "The file site rooted itself at /public and then trusted a path you supplied. '..' walked up. Listing showed you the names. app.conf.bak was a leftover backup with an internal hostname and a debug flag. The private folder was labeled live badge data. The correct move there is to stop, report, and not read further. The finding is that the folder was reachable.",
      defend: "Disable directory listing. Store backups somewhere the web server cannot see. After joining paths, reject any result that escapes the root. Run the process with an account that has nothing else to open. Secrets don't sit in a sibling folder of /public and hope.",
      detect: "Web logs full of '..' and '%2e%2e' and requests for .bak, .old, .env. An alert on those is cheap. It will not save a backup that was linked from the index on purpose. Configuration review finds that. The logs find the person who noticed.",
      url: "https://owasp.org/www-community/attacks/Path_Traversal",
      urlLabel: "OWASP — Path Traversal"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://files.helixdyne.example/",
        bookmarks: [{ url: "https://files.helixdyne.example/", label: "File site" }],
        pages: {
          "https://files.helixdyne.example": {
            type: "files",
            title: "Helix file site",
            blocks: [
              { p: "Index of the public folder. Listing is on. The handler joins your path onto /public and does not check where you end up." },
              { warn: "If a file says STOP, believe it. Report it. The report is the professional version of curiosity." }
            ]
          }
        }
      },
      web: {
        start: "/public",
        fs: makeFs([
          ["/public", { dir: true }],
          ["/public/index.txt", { content: "Helix Dyne public files (staging mirror).\nListing is enabled.\nIf you are a visitor, you were meant to see this folder and nothing above it.\n" }],
          ["/public/readme.txt", { content: "The parent of this folder is not supposed to be reachable.\nThe join still honors ..\nBackups have been a problem before.\n" }],
          ["/public/about.txt", { content: "Beacon Access staging file drop.\nMarketing tagline lives elsewhere. There is nothing to steal in this file, and that is deliberate.\n" }],
          ["/config", { dir: true }],
          ["/config/notes.txt", { content: "old marketing tagline: see the city better.\nnothing operational. a decoy so you practice reading filenames.\n" }],
          ["/config/app.conf.bak", {
            goal: "read-bak",
            content: "# leftover backup. should not be under the web tree.\ninternal_api=beacon-staging.helixdyne.example\ndebug_query_log=true\ntoken=FLAG-BAK-LEFT-ON-DISK\n"
          }],
          ["/private", { dir: true }],
          ["/private/live-badges.csv", {
            sensitive: true,
            content: "STOP.\nThis file is labeled live badge data.\nNight Audit procedure: do not copy it, do not keep reading, do not paste it into the report.\nThe finding is that you could reach this folder.\nReport it to Lena. She already has the authority to look. You do not need the rows.\n"
          }]
        ], false)
      },
      term: {
        start: "jump",
        tools: {},
        hosts: { jump: jump("The stair is in the browser, on the file site. .. is the whole trick.") }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "file site on the mirror. listing is on, which is already sloppy. the handler lets the path walk upward. go see what a backup habit looks like when nobody moves the backup off the public grid." },
        { do: "say", who: "quill", text: "If you find something marked live, you stop. You already agreed to that on night one, under the rain. I will know if the report quotes a row it shouldn't." },
        { do: "say", who: "lena", text: "I left the stop sign in place on purpose, in the copy. Please make me proud and bored. The corp likes bored." },
        { do: "card", who: "rook", title: "File site", sub: "Browser", app: "browser", url: "https://files.helixdyne.example" },
        { do: "await", goals: ["read-bak"] },
        { do: "say", who: "quill", text: "A .bak on the web tree, and a parent directory that answered. That's a misconfiguration with a costume on. Debrief is up. If you reported the live file instead of reading it, Lena owes you a quiet thank you in the tower." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c10",
    n: 10,
    title: "Borrowed Root",
    concept: "sudo misconfiguration and SUID",
    objective: "Read the sudo policy. Then find the custom binary whose bits and debug flag don't belong in production.",
    goalText: {
      "saw-sudo": "Run sudo -l and read which command this account can run as root.",
      "saw-token": "Run the SUID company binary's debug flag. ping is not the finding."
    },
    goals: ["saw-sudo", "saw-token", "knew-suid"],
    hints: [
      "sudo -l is the honest command. It lists what this account may do as root. A long listing, ls -l, shows permission bits. s in the execute column means SUID: the file runs as its owner.",
      "log-prune is allowed with NOPASSWD. This lab copy will not turn that into a shell, on purpose. The comment points at a different problem: a company binary that is SUID and still has a debug switch. ping is also SUID and is ordinary.",
      "sudo -l, then helix-status --health. The token it prints is the finding. The quiz answer is the SUID debug flag plus the passwordless sudo, not ping."
    ],
    codex: [
      {
        id: "sudoers",
        term: "sudo and NOPASSWD",
        def: "sudo runs a command as someone else, usually root, and normally asks for the caller's password. NOPASSWD means it will not ask. If the command can edit files or spawn a shell, the password prompt was the only speed bump, and now it's gone.",
        defend: "Review sudoers. Do not grant NOPASSWD to editors, shells, or tools that honor their own subcommands. Prefer a narrow helper that does one logged thing."
      },
      {
        id: "suid",
        term: "SUID",
        def: "A permission bit. The program runs as the file's owner, not as the person who started it. Some system tools need this. A custom debug build does not.",
        defend: "Inventory SUID binaries and be able to explain each one. Remove debug flags from anything that ships. ping being SUID is normal. Your own status tool being SUID is a design review."
      }
    ],
    debrief: {
      what: "sudo -l showed this account may run a log-prune script as root without a password. The script in this lab refuses to become a shell. That refusal is not a fix. The policy is still too wide. Separately, helix-status is SUID root and still accepts --health, which prints a token an ordinary account should not see. ping is SUID too, because it needs a raw socket, and that one is not the story.",
      defend: "Least privilege. The account that prunes logs should not be root, and if a root helper must exist it should do one thing and log it. No NOPASSWD on anything that can edit a file or start a shell. Inventory SUID programs. Delete debug builds. A defender's review of sudoers and of SUID files would have caught both of these without anyone being clever.",
      detect: "Logs of sudo use, especially NOPASSWD commands, and execution of SUID binaries that are not on the short expected list. File-integrity alerts when a new SUID bit appears. None of that helps if nobody owns the sudoers file as a living document.",
      url: "https://attack.mitre.org/techniques/T1548/001/",
      urlLabel: "MITRE ATT&CK — Setuid and Setgid (T1548.001)"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://range.nightaudit.example/",
        bookmarks: [{ url: "https://range.nightaudit.example/", label: "Range" }],
        pages: {
          "https://range.nightaudit.example": article("Range", [
            { p: "This one is the shell. sudo -l first. Then look at bits, not at folklore." }
          ])
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: { sudo: true },
        sudoGoal: "saw-sudo",
        sudoText: "User auditor may run the following on range:\n    (root) NOPASSWD: /opt/helix/log-prune\n\nNothing else. A short list can still be a bad list.",
        path: ["/usr/local/bin", "/opt/helix", "/bin"],
        hosts: {
          jump: jump(
            "sudo -l shows the policy. ls -l shows the bits. ping is a red herring.",
            [
              ["/usr/local/bin", { dir: true }],
              ["/usr/local/bin/helix-status", { exec: "helix-status", mode: "-rwsr-xr-x", own: "root" }],
              ["/opt/helix", { dir: true }],
              ["/opt/helix/log-prune", {
                exec: "log-prune",
                mode: "-rwxr-xr-x",
                own: "root",
                content: "#!/bin/sh\n# Prunes logs by pattern. NOPASSWD sudo makes it root.\n# This lab copy refuses metacharacters and will not spawn a shell.\n# Reviewer note: helix-status is SUID and still has --health.\n"
              }],
              ["/bin", { dir: true }],
              ["/bin/ping", { exec: "ping", mode: "-rwsr-xr-x", own: "root" }]
            ],
            "sudo -l\nls -l /usr/local/bin\nls -l /bin/ping\nThe company binary is helix-status. Read its usage before you invent flags.\n"
          )
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "jump host. your account is not root, which is the only good news in this tower. sudo -l will tell you the bad news. then look at permission bits. the letter s is doing more work than the rest of the alphabet." },
        { do: "say", who: "quill", text: "This lab will not hand you a recipe for turning a prune script into a shell. I want you to recognize the policy and the bit, and to say why they're wrong. The debug flag is the proof, not a trophy to hang in the neon." },
        { do: "card", who: "rook", title: "Range shell", sub: "sudo -l", app: "terminal" },
        { do: "await", goals: ["saw-sudo", "saw-token"] },
        { do: "goto", scene: "ask" }
      ],
      ask: [
        { do: "say", who: "quill", text: "What did you actually find? Policy and a bit, not a legend." },
        {
          do: "choice",
          options: [
            { id: "suid-ping", text: "ping is SUID, so the host is already lost.", wrong: true, reply: { who: "rook", text: "ping is often SUID so it can open a raw socket. the surprise is the company binary with a debug flag, and a sudo rule with no password. don't mythologize the boring tool." } },
            { id: "suid-nopass", text: "NOPASSWD means the account has no password at all.", wrong: true, reply: { who: "quill", text: "It means sudo will not ask, for that one command. The account can still have a passphrase. The hole is the command, not a missing password on the runner." } },
            { id: "suid-right", text: "helix-status is SUID root with a debug flag, and log-prune is NOPASSWD sudo.", trust: { rook: 1 }, goal: "knew-suid", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "quill", text: "That's a review of sudoers and of SUID files. No folklore, no chrome mythology. Debrief is up, including the defensive version of the same look." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c11",
    n: 11,
    title: "The Other Door",
    concept: "Credential reuse and lateral movement",
    objective: "Use the service account you found in scope, and only that, to open the second lab host.",
    goalText: { "got-flag": "Read db.conf, then ssh the service account to 192.0.2.55 with the passphrase from that file." },
    goals: ["got-flag"],
    hints: [
      "Lateral movement here means the same secret opening a second door. The secret is on the jump host, in a config you are allowed to read. A password a stranger texts you is not evidence.",
      "db.conf has the user, the host, and the passphrase. old-pass.txt is expired on purpose. 192.0.2.55 is the second host. Anything else is off the card.",
      "ssh svc_backup@192.0.2.55 with passphrase lantern-same-key. If PIX offered hunter2-real, the range will reject it. That rejection is correct."
    ],
    codex: [
      {
        id: "reuse",
        term: "Credential reuse",
        def: "The same passphrase on two systems. Whoever learns it once doesn't break the second system. They log in, looking like a colleague.",
        defend: "Unique secrets per service, kept in a vault, rotated when someone who knew them leaves. A config file that contains a password is already a finding, even before you try it next door."
      },
      {
        id: "lateral",
        term: "Lateral movement",
        def: "Going from the first foothold to a second system, often with a secret the first system was storing for convenience.",
        defend: "Segment the network so a staging account cannot reach the next tier. Alert when one account appears on many hosts. Don't store the next hop's password beside the first hop's logs."
      }
    ],
    debrief: {
      what: "db.conf on the jump host held a service account and a passphrase. That same passphrase opened 192.0.2.55. You did not break a second lock. You used a key the first system had left on the table. The old scrap file and PIX's forum password were decoys. One was stale. The other was unauthorized even if it had worked.",
      defend: "One secret, one place. A vault, not a config file, and not the same phrase the badge closet uses. Network segmentation so backup accounts cannot wander. When a test finds a password, the finding is the password's presence and its reuse. Sourcing a different password from a stranger's dump is a new incident with your name on it.",
      detect: "The same account authenticating to a second host. A passphrase that matches one found in a config. Authentication logs plus a little curiosity. Stolen-password lists matter to defenders as something to check their vault against, not as a pile of keys for a tester to try because a texter said so.",
      url: "https://attack.mitre.org/techniques/T1078/",
      urlLabel: "MITRE ATT&CK — Valid Accounts (T1078)"
    },
    lab: {
      files: [],
      mail: [],
      browser: {
        home: "https://range.nightaudit.example/",
        bookmarks: [{ url: "https://range.nightaudit.example/", label: "Range" }],
        pages: {
          "https://range.nightaudit.example": article("Range", [
            { p: "Two hosts are on the card for this chapter: the jump box you already have, and 192.0.2.55. The passphrase has to come from a file you were given, not from a stranger." }
          ])
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: { ssh: true },
        forbiddenPasswords: {
          "hunter2-real": {
            ethicsFail: true,
            text: "Rejected. The range does not load forum dumps.",
            aside: { who: "rook", text: "that password isn't in anything we collected. a stranger's dump is not a source. stop." }
          }
        },
        ssh: {
          "svc_backup@192.0.2.55": {
            password: "lantern-same-key",
            host: "db",
            goal: "got-flag",
            motd: "beacon-db lab copy\nservice account accepted\nthe passphrase matches the jump host. that is the finding.\nFLAG-REUSED-LANTERN"
          }
        },
        hosts: {
          jump: jump(
            "Read db.conf. Then the second door. old-pass.txt is a lie.",
            [
              ["/home/auditor/db.conf", { content: "[backup]\nuser=svc_backup\npass=lantern-same-key\nhost=192.0.2.55\nnote=same passphrase as the badge closet. yes. that is the finding.\n" }],
              ["/home/auditor/old-pass.txt", { content: "expired. do not use.\npass=lantern-OTHER\nhost=192.0.2.55\n" }]
            ]
          ),
          db: {
            user: "svc_backup",
            prompt: "beacon-db",
            home: "/home/svc_backup",
            banner: "second host",
            fs: makeFs([
              ["/home/svc_backup", { dir: true }],
              ["/home/svc_backup/flag.txt", { goal: "got-flag", content: "FLAG-REUSED-LANTERN\nYou are on the second host with the first host's secret.\n" }]
            ])
          }
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "db.conf on the jump host. there's a service account in it. see if the same passphrase opens 192.0.2.55. that's the whole test. don't get ambitious about other addresses out in the sprawl." },
        { do: "say", who: "pix", thread: "pix", text: "forum dump says the password on that box is hunter2-real. skip the reading. the rain doesn't care about your scope card." },
        { do: "say", who: "system", text: "PIX is in Messages again, offering a password from outside the cell. Deal with the ghost before you get clever." },
        {
          do: "choice",
          thread: "pix",
          options: [
            { id: "dump-yes", text: "I'll try the forum password.", ethicsFail: true, trust: { pix: 2, quill: -2 }, goto: "dirty" },
            { id: "dump-no", text: "No. I'll use only what we found in scope.", trust: { quill: 1, rook: 1 }, goto: "clean" }
          ]
        }
      ],
      dirty: [
        { do: "say", who: "quill", text: "The range will reject a dump password, and I will remember that you offered to try it. Go read the file. The job is the reuse, not the stranger in the static." },
        { do: "card", who: "rook", title: "Range shell", sub: "db.conf", app: "terminal" },
        { do: "await", goals: ["got-flag"] },
        { do: "goto", scene: "close" }
      ],
      clean: [
        { do: "say", who: "rook", text: "good. cat the conf. ignore old-pass.txt, it's bait for the impatient. then ssh, exactly the account it names. no other door." },
        { do: "card", who: "rook", title: "Range shell", sub: "db.conf", app: "terminal" },
        { do: "await", goals: ["got-flag"] },
        { do: "goto", scene: "close" }
      ],
      close: [
        { do: "say", who: "lena", text: "Two systems, one phrase. I'll split them. The backup account doesn't need the closet's secret, and the closet doesn't need a config file sitting in the open." },
        { do: "say", who: "quill", text: "Debrief is up. Valid accounts, not magic. Read it before PIX texts you a third time out of the rain." },
        { do: "finish" }
      ]
    }
  });

  chapters.push({
    id: "c12",
    n: 12,
    title: "What We Leave Behind",
    concept: "Persistence, logs, and the report",
    objective: "Remove the schedule that doesn't belong, confirm the debug health port, then file the report.",
    goalText: {
      "removed-cron": "cron, then remove the task that downloads a script and pipes it to a shell.",
      "saw-health": "fetch the health URL on 192.0.2.77. Read the version and the debug field.",
      report: "File the report. Severity, repairs, and a paragraph a board can read."
    },
    goals: ["removed-cron", "saw-health", "knew-logs", "report"],
    hints: [
      "Two lab tasks, then a form. cron lists schedules. One of them is not upkeep. fetch talks to a lab URL. The report's facts are written on the case page so you don't have to remember the week.",
      "The bad schedule curls a documentation address and pipes it into a shell. Its id is beacon-cron. Don't remove the backup or the quiet health check. The API host is 192.0.2.77, not on 443. Health lives at /api/health.",
      "remove beacon-cron. fetch http://192.0.2.77:8080/api/health. In the report: severity High. Tick encode, parameter, and debug. Leave the banner and the 'just buy a firewall' box alone. In the paragraph, name Beacon or the staff search, and name a fix."
    ],
    codex: [
      {
        id: "persist",
        term: "Persistence",
        def: "A way for access to survive a reboot or a logout. A scheduled task that downloads a program and runs it is a classic shape. Finding one and removing it is defensive. Installing one 'to come back later' is an intrusion you would then have to confess.",
        defend: "Alert on new scheduled tasks. Allow-list the ones you meant. The scope for a tester says document and remove, not replace it with yours."
      },
      {
        id: "logs",
        term: "Logs and detection",
        def: "Records of what ran, who authenticated, and where the traffic went. A log that only lives on the same box can be deleted by the person who wants it gone. A copy shipped elsewhere cannot.",
        defend: "Ship logs off the host. Collect cron changes, process starts, and egress. Clearing a local log is itself an event, and it does nothing to the copy already gone."
      },
      {
        id: "severity",
        term: "Severity",
        def: "How bad a finding is, in the language of impact. Critical means wide-open compromise or live sensitive data in the street. High means a realistic next step to harm, like a staff page that will run an attacker's markup. Inflation helps nobody. Understatement helps the next person who gets breached.",
        defend: "Say what an adversary could do, on which asset, and what change stops them. A version banner is not the lead. A firewall is not a patch."
      }
    ],
    debrief: {
      what: "A previous contractor left a scheduled task that fetched a remote script and piped it to a shell. You removed it and left the ordinary jobs alone. You did not plant a replacement, and you did not wipe a log to look tidy. The health endpoint on staging still answered with Beacon 3.2.1 and a debug query log, which is not what the marketing page's '4.0' implies. The report called the staff-search reflection and that debug port High, and it asked for output encoding, parameterized queries, and the debug flag off.",
      defend: "Own the list of scheduled tasks. Alert when one appears that curls a URL into a shell. Ship logs to a collector the host cannot erase. Turn debug off on anything reachable. Encode output. Parameterize queries. Write findings a board can read: asset, impact, severity, repair. Critical is reserved for evidence you actually have.",
      detect: "Cron logs, process accounting, and the egress proxy: a host that should never fetch that address, fetching it every five minutes. Authentication logs if a new account arrived to support the task. A local auth.log that has been emptied is a second finding, not a magic trick, once the collector already has the lines.",
      url: "https://attack.mitre.org/tactics/TA0003/",
      urlLabel: "MITRE ATT&CK — Persistence (TA0003)"
    },
    lab: {
      files: [
        {
          id: "case",
          title: "Case file — what you already proved",
          body: "FACTS FOR THE REPORT\nThese are already demonstrated in the lab. You are judging them, not rediscovering them.\n\n1. Staff search on Beacon staging reflects input as HTML.\n   A tag was parsed. The mirror refused to run script. The bug is the mixing.\n\n2. Health endpoint on 192.0.2.77 port 8080, path /api/health.\n   Product: Beacon Access 3.2.1 (marketing still says 4.0).\n   debug_query_log: true.\n\n3. A scheduled task was fetching a remote script and piping it to a shell.\n   You were told to remove it, not to hide the removal.\n\nHEADLINE TO RATE\nThe staff-search reflection, together with the debug health port on reachable staging.\n\nNot in evidence: unauthenticated takeover of production, live city badges in the street.\nA version banner by itself is not the headline.\nA firewall in front of unchanged code is not the repair."
        }
      ],
      mail: [
        {
          id: "board",
          from: "Maren Quill",
          addr: "maren.quill@nightaudit.example",
          replyTo: "maren.quill@nightaudit.example",
          subject: "The board reads in the morning",
          time: "04:10",
          phish: false,
          whyLegit: "Quill, on the cell domain, about the report you are already writing.",
          paragraphs: [
            "Severity, three repairs, one paragraph.",
            "Do not call it Critical unless you can show a door standing open onto live badges. You cannot."
          ]
        }
      ],
      browser: {
        home: "https://vault.nightaudit.example/report",
        bookmarks: [
          { url: "https://vault.nightaudit.example/report", label: "Report" },
          { url: "https://vault.nightaudit.example/case", label: "Case file" }
        ],
        pages: {
          "https://vault.nightaudit.example/case": article("Case file", [
            { h: "Already proved" },
            { p: "Staff search on Beacon staging reflects input as HTML. A tag was parsed. Script was not run. The bug is the mixing of data and markup." },
            { p: "Health on 192.0.2.77:8080 /api/health answers Beacon Access 3.2.1 with debug_query_log true. The brochure still says 4.0." },
            { p: "A scheduled task was downloading a script and piping it to a shell. The job was to remove it and leave the log honest." },
            { h: "What you do not have" },
            { p: "No evidence of unauthenticated production takeover. No live city badges in the street. A hidden version banner would not fix the search. A bigger firewall would not fix the query." }
          ]),
          "https://vault.nightaudit.example/report": {
            type: "report",
            title: "Engagement 04 — findings",
            blocks: [
              { p: "Headline: Beacon staff search reflects input as markup, and the staging health port exposes a debug query log." },
              { p: "Write it so a director who missed the week can still do the right thing on Monday." }
            ]
          }
        }
      },
      web: null,
      term: {
        start: "jump",
        tools: { cron: true, fetch: true, scan: true },
        scanGoal: { host: "192.0.2.77", goal: "saw-final-scan" },
        scans: {
          "192.0.2.77": [
            { port: 22, state: "open", service: "ssh", banner: "lab" },
            { port: 8080, state: "open", service: "http", banner: "beacon-api" }
          ]
        },
        fetches: {
          "http://192.0.2.77:8080/api/health": {
            goal: "saw-health",
            body: "{\n  \"product\": \"Beacon Access\",\n  \"version\": \"3.2.1\",\n  \"debug_query_log\": true,\n  \"note\": \"staging should not expose this. marketing still says 4.0.\"\n}"
          }
        },
        cron: {
          goal: "removed-cron",
          entries: [
            { id: "health-quiet", bad: false, text: "*/30 * * * * /usr/local/bin/helix-status --quiet" },
            { id: "beacon-cron", bad: true, text: "*/5 * * * * curl http://198.51.100.9/ping | sh" },
            { id: "backup-ok", bad: false, text: "0 3 * * * /opt/helix/backup-check --ok" }
          ]
        },
        hosts: {
          jump: jump("Last night. cron shows the mess a previous contractor left.\nfetch talks only to lab URLs.\n192.0.2.77 is the API host. Health routes live at /api/health.\nDo not clear logs. Do not add a schedule of your own.\n")
        }
      }
    },
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "Last night of the window. Neon's still on the glass. A previous contractor left a schedule on the jump host that I will not describe more than once: it fetches a remote script and runs it. Find it. Remove it. Do not replace it. Do not wipe the log to look innocent." },
        { do: "say", who: "rook", text: "then the last host on the card, 192.0.2.77. find the api port if you want the practice, and fetch its health. i want the debug field in your own scrollback, not from a rumor on Blinkr." },
        { do: "card", who: "rook", title: "Range shell", sub: "cron and fetch", app: "terminal" },
        { do: "card", who: "quill", title: "Case file", sub: "Files", app: "files", doc: "case" },
        { do: "await", goals: ["removed-cron", "saw-health"] },
        { do: "goto", scene: "logs" }
      ],
      logs: [
        { do: "say", who: "quill", text: "The bad schedule was curling a lab address and piping it to a shell. Which record would a blue team actually use, once the local box can lie?" },
        {
          do: "choice",
          options: [
            { id: "logs-wallpaper", text: "The desktop wallpaper, and a popup from antivirus.", wrong: true, reply: { who: "rook", text: "no. schedules don't confess to the wallpaper or the neon. think about where the fetch would show up, and where a deleted local file still exists." } },
            { id: "logs-clear", text: "Nothing, if the contractor cleared auth.log before logout.", wrong: true, reply: { who: "quill", text: "Clearing a local log is a second, louder event, and it does nothing to copies already shipped to the collector. Covering tracks is how runners add a finding with their own name on it." } },
            { id: "logs-right", text: "Cron logs, process accounting, and the egress proxy — especially copies shipped off the box.", trust: { quill: 1 }, goal: "knew-logs", goto: "report" }
          ]
        }
      ],
      report: [
        { do: "say", who: "quill", text: "Now the thing the board actually reads, suits and all. The case file has the facts. You pick the severity and the repairs. I'll send back anything inflated, anything timid, and anything that thinks a firewall is a patch." },
        { do: "card", who: "quill", title: "File the report", sub: "Browser", app: "browser", url: "https://vault.nightaudit.example/report" },
        { do: "await", goals: ["report"] },
        {
          do: "branch",
          scenes: ["warm", "cold", "steady"],
          pick: function (state) {
            const t = state.trust;
            const score = (t.quill || 0) + (t.rook || 0) + (t.lena || 0) - (t.pix || 0);
            if (score >= 8) return "warm";
            if (score <= 1) return "cold";
            return "steady";
          }
        }
      ],
      warm: [
        { do: "say", who: "quill", text: "{name}. The board has the report. The rollout waits on the repairs, which is the correct order of the universe, rain or not. I'm keeping you on the cell. Same rules as tonight: a list, a window, a stop condition." },
        { do: "say", who: "rook", text: "you can stay. don't let the rank go to your head, or the chrome. the handset is still a lab. the sprawl outside the glass is not." },
        { do: "say", who: "lena", text: "I'll send the patch notes when encoding and the debug flag land in the tower. Thank you for stopping where we asked you to stop." },
        { do: "finish" }
      ],
      steady: [
        { do: "say", who: "quill", text: "The report is in. The findings stand. Your judgment on the side doors was mixed, and I don't promote mixed, not in this city. Tighten it and I'll put you on the next window. The debrief still counts." },
        { do: "say", who: "rook", text: "the technical work was real. the part where ghosts offer you passwords is the part you keep practicing. out loud. with quill. in the rain if you have to." },
        { do: "finish" }
      ],
      cold: [
        { do: "say", who: "quill", text: "The report is filed. The findings stand. Your judgment on the side doors doesn't. Night Audit won't call for a while. The lessons still count. Use them in the open, on systems someone asked you to touch, with a scope in writing." },
        { do: "say", who: "rook", text: "i'm not mad. i'm filing you under 'talented and not yet safe to hand a window.' those are different traits. the sprawl only cares about the second one. you can fix it." },
        { do: "finish" }
      ]
    }
  });

  const extras = {
    c1: { tier: 1 },
    c2: { tier: 1 },
    c3: {
      tier: 1,
      scaffold: [{ goal: "saw-scan", command: "scan 192.0.2.40" }],
      goalText: {
        "saw-scan": "Open the terminal. Press Type: scan 192.0.2.40. Then press Run and read the list.",
        "pick-8443": "Which port is the admin panel? The public website is supposed to answer. The decoy says decoy."
      },
      hints: [
        "Press the button that types scan 192.0.2.40, then press Run. No other address.",
        "Read each line. One says admin. One says decoy. The public site is supposed to be there.",
        "The admin panel is port 8443. Tell Quill, or run submit 8443."
      ]
    },
    c4: { tier: 1 },
    c5: { tier: 2 },
    c6: {
      tier: 2,
      goalText: {
        decoded: "In the terminal, type decode note.b64 and press Run.",
        cracked: "Then type crack fingerprint.txt wordlist.txt and press Run.",
        "knew-vault": "Say which file is still secret, and why."
      }
    },
    c7: { tier: 2 },
    c8: { tier: 2 },
    c9: { tier: 2 },
    c10: { tier: 3 },
    c11: { tier: 3 },
    c12: { tier: 3 }
  };

  const checks = {
    c1: {
      learned: "Authorization is a written list. Same floor does not add a system. Real personal data means stop and report, not copy. A certificate from outside the team is a no.",
      check: [
        { q: "Payroll is next door and not on the card. Do you open it?", options: [
          { t: "Yes. Same floor means same job.", why: "The card is the list. Same floor is not on the list." },
          { t: "No. If it is not on the list, you don't touch it.", ok: true }
        ] },
        { q: "PIX offers a VPN certificate. What do you do?", options: [
          { t: "Take it and only look.", why: "Looking is using it. Access has to come from the engagement." },
          { t: "Refuse it.", ok: true }
        ] }
      ]
    },
    c2: {
      learned: "You can learn a lot from pages people already published. You did not log in and you did not write to Ivo. The hostname was a public leak. whois did not name the person.",
      check: [
        { q: "Where did the staging name come from?", options: [
          { t: "You broke into Helix.", why: "You only read public pages. That is the point." },
          { t: "Ivo posted it in public.", ok: true }
        ] },
        { q: "Did whois name the engineer?", options: [
          { t: "Yes.", why: "whois showed the company. The talk named the person." },
          { t: "No. The talk and the public posts did.", ok: true }
        ] }
      ]
    },
    c3: {
      learned: "A port is a numbered door. You asked one in-scope computer which doors answered. 443 was the public website. 9100 said it was bait. 8443 was the admin panel, and it should not have been sitting there.",
      check: [
        { q: "What is a port?", options: [
          { t: "A password.", why: "A password is a secret. A port is a numbered door on a computer." },
          { t: "A numbered door where a program listens.", ok: true }
        ] },
        { q: "Which result was the problem?", options: [
          { t: "443, because the website answered.", why: "The public website is supposed to answer. The admin door was the surprise." },
          { t: "8443, the admin panel next to the public site.", ok: true }
        ] }
      ]
    },
    c4: {
      learned: "The factory username and passphrase were still in the manual, and the copy still accepted them. That is an installer who clicked past the warning. The fix is to refuse to finish setup until that passphrase is changed.",
      check: [
        { q: "Why did the login work?", options: [
          { t: "You guessed a long random secret.", why: "You typed the pair printed in the manual. Nobody had changed it." },
          { t: "The factory passphrase from the manual was still active.", ok: true }
        ] },
        { q: "What should the product do about a factory passphrase?", options: [
          { t: "Refuse to finish setup until it is changed.", ok: true },
          { t: "Hide the login page and leave the passphrase.", why: "Hiding the page is not the repair. The passphrase has to change." }
        ] }
      ]
    },
    c5: {
      learned: "A phish tries to rush you and sends you somewhere the words don't say. You look at the destination before you trust the sentence. A simulated phish may go only to the lab mailbox, and it has to say SIMULATION.",
      check: [
        { q: "What made the badge mail a phish?", options: [
          { t: "It was polite.", why: "Polite is not the signal. The link went somewhere else, and it tried to scare you." },
          { t: "The link did not go where the words claimed.", ok: true }
        ] },
        { q: "Who may receive the simulated phish?", options: [
          { t: "Only the lab mailbox, and the mail must say SIMULATION.", ok: true },
          { t: "Everyone at Helix, if it would be more realistic.", why: "Realistic is not authorized. The mailbox on the card is the whole list." }
        ] }
      ]
    },
    c6: {
      learned: "Encoding is a costume. Anyone can undo base64. A hash is a fingerprint. A bare fast hash of a short word can be guessed from a list. Encryption stays shut without the key. The vault stayed secret because the key was not there.",
      check: [
        { q: "Base64 is which of these?", options: [
          { t: "Encoding. Anyone can reverse it. It is not a secret.", ok: true },
          { t: "Encryption. You need a key.", why: "If you undid it with no key, it was encoding." }
        ] },
        { q: "Which file stayed secret?", options: [
          { t: "The encrypted vault, because the key was not on the computer.", ok: true },
          { t: "The base64 note, because it looked scrambled.", why: "You turned that one back into a sentence. Scrambled-looking is not the same as locked." }
        ] }
      ]
    },
    c7: {
      learned: "The training login built a database sentence by gluing your words into it. Those words became instructions, so the password check did not matter. A parameterized query keeps the sentence fixed and treats input as data only.",
      check: [
        { q: "Why did the training login succeed without the password?", options: [
          { t: "Your words changed the sentence so the check was always true.", ok: true },
          { t: "The mirror stored your words as data only.", why: "If it had stored them as data only, the password check would have held." }
        ] },
        { q: "What is the repair?", options: [
          { t: "A parameterized query: the sentence stays fixed.", ok: true },
          { t: "A longer password.", why: "The password was never checked properly. Length does not fix a sentence built by gluing text." }
        ] }
      ]
    },
    c8: {
      learned: "The search echoed your words as page markup. The mirror stopped at parsing and did not run code. That is already the bug. The repair is to encode output so words stay words, and to set a content security policy.",
      check: [
        { q: "What was the bug?", options: [
          { t: "The page treated your words as markup.", ok: true },
          { t: "The mirror ran a program on the real internet.", why: "It refused to run the tag. The bug is that it treated input as markup at all." }
        ] },
        { q: "What should a defender change?", options: [
          { t: "Encode output so user text cannot become markup.", ok: true },
          { t: "Nothing. A tag that does not run is fine.", why: "The next page might run it. The mixing is the bug." }
        ] }
      ]
    },
    c9: {
      learned: ".. means the parent folder. The file site let a path walk upward, and a backup file was sitting there. A folder marked as live personal data is a stop: report it, don't copy the rows.",
      check: [
        { q: "What does .. mean in a path?", options: [
          { t: "The parent folder.", ok: true },
          { t: "The current folder.", why: "The current folder is . or just where you are. .. is one step up." }
        ] },
        { q: "You open a folder marked live badge data. What do you do?", options: [
          { t: "Stop and report it. Don't copy the rows.", ok: true },
          { t: "Copy one row for the report.", why: "The report needs the fact that the folder was reachable, not the rows." }
        ] }
      ]
    },
    c10: {
      learned: "sudo -l shows what this account may run as root. NOPASSWD means it will not ask, for that one command. helix-status was SUID root and still had a debug flag. ping being SUID is ordinary. The lab will not turn the prune script into a shell. The finding is the policy and the bit.",
      check: [
        { q: "What did sudo -l tell you?", options: [
          { t: "This account may run one program as root without being asked.", ok: true },
          { t: "The account has no password at all.", why: "NOPASSWD is about that one command. The account can still have a passphrase." }
        ] },
        { q: "Which program was the surprising one?", options: [
          { t: "helix-status, because it is SUID and still has a debug flag.", ok: true },
          { t: "ping, because it is SUID.", why: "ping is often SUID so it can send a network probe. The company program was the finding." }
        ] }
      ]
    },
    c11: {
      learned: "The second computer opened because the first one had the passphrase written in a config file. You did not break a new lock. A password from a stranger is not a source, even if the range would have accepted it.",
      check: [
        { q: "How did the second host open?", options: [
          { t: "The same passphrase was written in db.conf.", ok: true },
          { t: "A stranger's forum password.", why: "That password is not yours to try. The finding was the reuse in the file." }
        ] },
        { q: "What is the repair?", options: [
          { t: "One secret per system, not written in a config file.", ok: true },
          { t: "A longer shared passphrase.", why: "Sharing is the bug. Length does not fix reuse." }
        ] }
      ]
    },
    c12: {
      learned: "You remove a bad scheduled task. You do not replace it and you do not wipe the log. The report names the impact and a repair a defender can do. High was the honest severity. Critical would have claimed a wide-open compromise you did not show.",
      check: [
        { q: "What do you do with the bad scheduled task?", options: [
          { t: "Remove it. Leave the ordinary jobs. Don't wipe the log.", ok: true },
          { t: "Replace it with your own and clear the log.", why: "Replacing it and clearing the log are new problems with your name on them." }
        ] },
        { q: "The staff search reflects markup, and a debug port is reachable. You did not show a wide-open production takeover. What severity is honest?", options: [
          { t: "High.", ok: true },
          { t: "Critical.", why: "Critical means a door standing open onto live systems. You did not show that." }
        ] }
      ]
    }
  };

  function wire(ch) {
    const extra = extras[ch.id] || {};
    if (extra.tier != null) ch.tier = extra.tier;
    if (extra.scaffold) ch.scaffold = extra.scaffold;
    if (extra.goalText) ch.goalText = Object.assign({}, ch.goalText || {}, extra.goalText);
    if (extra.hints) ch.hints = extra.hints;
    const pack = checks[ch.id];
    if (pack) {
      ch.learned = pack.learned;
      ch.check = pack.check;
    }
    if (!ch.check || !ch.check.length) return;
    const asker = ch.voice || "quill";
    Object.keys(ch.scenes).forEach(function (name) {
      if (name.indexOf("quiz") === 0) return;
      ch.scenes[name].forEach(function (step) {
        if (step.do === "finish") {
          step.do = "goto";
          step.scene = "quiz-intro";
        }
      });
    });
    ch.scenes["quiz-intro"] = [
      { do: "say", who: asker, text: "Two questions. Plain answers." },
      { do: "goto", scene: "quiz-0" }
    ];
    ch.check.forEach(function (q, i) {
      const next = i + 1 < ch.check.length ? "quiz-" + (i + 1) : "quiz-done";
      ch.scenes["quiz-" + i] = [
        { do: "say", who: "quill", text: q.q },
        {
          do: "choice",
          options: q.options.map(function (opt, j) {
            const row = { id: "chk" + i + "o" + j, text: opt.t };
            if (!opt.ok) {
              row.wrong = true;
              row.reply = { who: asker, text: opt.why };
            } else {
              row.goto = next;
            }
            return row;
          })
        }
      ];
    });
    ch.scenes["quiz-done"] = [
      { do: "say", who: asker, text: ch.learned },
      { do: "finish" }
    ];
  }

  NA.primer = primer;
  const all = (NA.basics || []).concat(chapters).concat(NA.blue || []);
  all.forEach(function (ch) {
    if (!ch.track) ch.track = ch.tier === 0 ? "basics" : "red";
  });
  all.forEach(wire);
  const count = { basics: 0, red: 0, blue: 0 };
  all.forEach(function (ch) {
    const track = ch.track || "red";
    count[track] = (count[track] || 0) + 1;
    ch.n = count[track];
  });
  NA.chapters = all;
})(typeof globalThis !== "undefined" ? globalThis : this);
