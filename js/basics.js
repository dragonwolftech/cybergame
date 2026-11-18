/* Tier 0. Plain lessons for someone who has never used a terminal. No real networks. */
(function (root) {
  "use strict";

  function shell(banner, rules, extra, tools) {
    const fs = {
      "/home": { dir: true },
      "/home/auditor": { dir: true },
      "/home/auditor/readme.txt": { content: "You are in your home folder.\nThis computer is a copy inside the handset.\nIt is not the real internet.\n" },
      "/home/auditor/badge.txt": { content: "A text file is just words saved under a name.\ncat badge.txt prints those words.\n" },
      "/home/auditor/notes": { dir: true },
      "/home/auditor/notes/hello.txt": { content: "You moved into the notes folder. cd only changes where you are looking.\n" }
    };
    (extra || []).forEach(function (pair) { fs[pair[0]] = pair[1]; });
    return {
      files: [],
      mail: [],
      browser: null,
      web: null,
      term: {
        start: "jump",
        tools: tools || {},
        basicGoals: rules || [],
        hosts: {
          jump: {
            user: "auditor",
            prompt: "range",
            home: "/home/auditor",
            banner: banner,
            fs: fs
          }
        }
      }
    };
  }

  function docChapter(file) {
    const lab = shell("You do not need the terminal for this chapter. The lesson is in Files.", []);
    lab.files = [file];
    return lab;
  }

  const basics = [];

  basics.push({
    id: "t0-net",
    tier: 0,
    title: "Computers Talk",
    concept: "What a network is",
    objective: "Read Quill. A network is just computers passing messages.",
    hints: [
      "You don't type anything yet. Read the chat.",
      "A network means computers can send messages to each other. Your home Wi-Fi is a small one. The internet is a huge one.",
      "The check has two questions. A network is computers passing messages. This handset's network is fake."
    ],
    learned: "A network is computers that can send messages to each other. The internet is one big network. This game's network is a copy. Nothing you type leaves the handset.",
    check: [
      {
        q: "What is a network?",
        options: [
          { t: "A password.", why: "A password is a secret. A network is the way computers pass messages." },
          { t: "Computers that can send messages to each other.", ok: true },
          { t: "A folder full of files.", why: "A folder holds files on one computer. A network connects computers." }
        ]
      },
      {
        q: "Does this handset talk to the real internet?",
        options: [
          { t: "Yes. Every command goes out to a real company.", why: "It does not. The companies and computers in here are invented." },
          { t: "No. The computers in this game are a copy inside the page.", ok: true }
        ]
      }
    ],
    codex: [
      {
        id: "network",
        term: "Network",
        def: "Computers that can send messages to each other. A home router, an office, and the internet are all networks, just different sizes.",
        defend: "If a computer is not supposed to receive messages, don't connect it. The smallest useful network is the safest one."
      }
    ],
    debrief: {
      what: "You learned the word network. It means computers passing messages. You did not connect to anything real.",
      defend: "People who run networks decide which computers are allowed to talk. That decision is written down. It is not a vibe.",
      detect: "Nothing to detect. This was a definition.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("You do not need the terminal yet.", []),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "{name}. I'm Quill. Before anyone touches a tool, you need the words." },
        { do: "say", who: "quill", text: "A network is computers that can send messages to each other. Your home Wi-Fi is a small network. The internet is a huge one." },
        { do: "say", who: "quill", text: "This handset holds a fake network. The city outside it is not connected. Nothing you type here leaves the page." },
        { do: "say", who: "rook", text: "rook. i build the fake computers. if one answers, it's mine. you are not on the real internet." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-ip",
    tier: 0,
    title: "Numbers and Names",
    concept: "IP addresses and domain names",
    objective: "Learn the difference between a computer's number and its name.",
    hints: [
      "An IP address is a number, like 192.0.2.40. A domain name is words, like helixdyne.example.",
      "People prefer names. Computers use numbers. A name is just a sticker on a number.",
      "192.0.2.40 is a lab number. It is not a real computer on the internet. .example names are fake on purpose."
    ],
    learned: "An IP address is the number of a computer on a network. A domain name is a human name that points at a number. helixdyne.example is a fake name. 192.0.2.40 is a fake lab number. Neither one is on the real internet.",
    check: [
      {
        q: "Which one is an IP address?",
        options: [
          { t: "helixdyne.example", why: "That is a domain name. It is made of words. An IP address is a number." },
          { t: "192.0.2.40", ok: true },
          { t: "Quill", why: "That is a person. An IP address is the number of a computer." }
        ]
      },
      {
        q: "What is a domain name for?",
        options: [
          { t: "So people can use words instead of memorizing a number.", ok: true },
          { t: "It is the password for the computer.", why: "A name is not a password. It only tells you which computer you mean." }
        ]
      }
    ],
    codex: [
      {
        id: "ip",
        term: "IP address",
        def: "The number of one computer on a network. 192.0.2.40 is an example used for labs and documentation. It is not a computer you can reach on the real internet.",
        defend: "Don't scan or log into numbers that are not on a written list. A number you found is not permission."
      },
      {
        id: "domain",
        term: "Domain name",
        def: "A word name that points at a computer, like helixdyne.example. People remember names. Computers still use the number underneath.",
        defend: "Names in this game end in .example so they cannot be real sites. On a real job, only names written into the scope are yours to touch."
      }
    ],
    debrief: {
      what: "You can now tell a computer's number from its name. The number is the IP address. The name is the domain.",
      defend: "Write both in the scope when a test begins, so nobody 'helps' by wandering off to a lookalike name.",
      detect: "Nothing to detect. This was a definition.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("Still no terminal. The numbers in chat are examples, not buttons.", []),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "Computers find each other with numbers. That number is called an IP address." },
        { do: "say", who: "quill", text: "192.0.2.40 is an IP address. Four numbers, with dots. This particular range is reserved for examples. It is not a real machine." },
        { do: "say", who: "rook", text: "people hate memorizing numbers. so we stick a name on them. helixdyne.example is a domain name. the .example part means it is fake on purpose." },
        { do: "say", who: "quill", text: "Name, then number. That is the whole idea. A domain name is a sticker. The IP address is the computer." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-port",
    tier: 0,
    title: "Doors on a Server",
    concept: "Servers and ports",
    objective: "Learn what a server is, and what a port number means.",
    hints: [
      "A server is a computer that waits for messages. A port is a numbered door on that computer.",
      "Port 443 is a common door for websites. Port 22 is a common door for terminals on another computer. You are not opening either one yet.",
      "One computer can have many doors. The door number tells you which program is listening."
    ],
    learned: "A server is a computer that sits and waits for requests. A port is a numbered door on that computer. One server can have many doors. Port 443 is often a website. You have not opened any door yet. You only learned the word.",
    check: [
      {
        q: "What is a server?",
        options: [
          { t: "A computer that waits for other computers to ask it for something.", ok: true },
          { t: "A password.", why: "A password is a secret you type. A server is a computer that waits for requests." },
          { t: "A kind of cable.", why: "A server is a computer, not the wire." }
        ]
      },
      {
        q: "What is a port?",
        options: [
          { t: "A numbered door on a computer. Different programs listen on different doors.", ok: true },
          { t: "The name of the company.", why: "The company name is a domain. A port is a number, like 443." }
        ]
      }
    ],
    codex: [
      {
        id: "server",
        term: "Server",
        def: "A computer that waits for requests and sends answers. A website lives on a server. So does mail.",
        defend: "Only run the programs you meant to run. A server that is listening is offering a conversation to anyone who can reach that door."
      },
      {
        id: "port",
        term: "Port",
        def: "A numbered door on one computer. Port 443 is commonly a website. Port 22 is commonly a remote terminal. The number does not prove the program is safe. It only says which door answered.",
        defend: "Close doors you don't need. Don't put an admin door on the same face as the public website."
      }
    ],
    debrief: {
      what: "A server waits. A port is one numbered door on it. You did not knock on any door.",
      defend: "Extra open doors are how strangers find programs nobody remembered was running. Close the ones you don't use.",
      detect: "Nothing to detect yet. Later you will look at a list of doors, and only on a computer that is on the list.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("No knocking yet. Ports are an idea in this chapter, not a command.", []),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "A server is a computer that waits for messages and answers them. A website is one kind of answer." },
        { do: "say", who: "quill", text: "That computer can run more than one program. Each program listens on a port, which is a numbered door." },
        { do: "say", who: "rook", text: "door 443 is usually the website. door 22 is usually a terminal you can log into. same building, different doors. you are not opening them yet." },
        { do: "say", who: "quill", text: "Remember the picture: one computer, many numbered doors. The number is the port. The waiting computer is the server." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-term",
    tier: 0,
    title: "The Terminal",
    concept: "What a terminal is",
    objective: "Open the terminal and run help.",
    goalText: { "did-help": "Open the terminal. Press the button that types help. Then press Run." },
    goals: ["did-help"],
    scaffold: [{ goal: "did-help", command: "help" }],
    hints: [
      "The terminal is the black panel with a blinking place to type. A command is a short instruction, like help.",
      "Press the Type: help button. That fills the line for you. Then press Run. Don't add extra words.",
      "The command is exactly: help"
    ],
    learned: "A terminal is a text window where you type a command and the computer answers with text. help lists the commands this chapter actually has. You do not need to memorize them.",
    check: [
      {
        q: "What is a terminal?",
        options: [
          { t: "A place where you type a short command and read the text that comes back.", ok: true },
          { t: "A picture of the city.", why: "The rain is just the wallpaper. The terminal is the text window where commands run." }
        ]
      },
      {
        q: "What does help do?",
        options: [
          { t: "It lists the commands you can use here.", ok: true },
          { t: "It emails the real company.", why: "help never leaves the handset. It only prints a list." }
        ]
      }
    ],
    codex: [
      {
        id: "terminal",
        term: "Terminal",
        def: "A text window. You type a command. The computer prints an answer. There are no pictures in it on purpose.",
        defend: "On a real job, the terminal is powerful. Only use one on a machine you are allowed to touch, and only the commands the scope allows."
      },
      {
        id: "command",
        term: "Command",
        def: "One instruction typed into a terminal, then Run. help, ls, and cat are commands. Extra words on the end can change what they do, so copy them exactly while you are learning.",
        defend: "If you don't know what a command will do, don't run it on a real computer. Read help, or ask."
      }
    ],
    debrief: {
      what: "You opened a terminal and ran help. The computer printed a list. That list is the whole menu for this copy.",
      defend: "A real terminal is not a toy. The habit you want is: read the command, know what it will do, then run it.",
      detect: "Nothing to detect. help only reads a list that already lives in the page.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("Type help and press Run. This list is the menu.", [{ cmd: "help", goal: "did-help" }]),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "terminal time. it is a text window. you type one line. it answers with text." },
        { do: "say", who: "quill", text: "Your only job: open the terminal, use the button that types help, and press Run." },
        { do: "card", who: "rook", title: "Terminal", sub: "Type help, then Run", app: "terminal" },
        { do: "await", goals: ["did-help"] },
        { do: "say", who: "rook", text: "that list is the menu. if a command is not on it, this chapter does not have it." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-who",
    tier: 0,
    title: "Who You Are",
    concept: "The whoami command",
    objective: "Run whoami. It prints the lab username.",
    goalText: { "did-who": "In the terminal, run whoami. Use the button, then press Run." },
    goals: ["did-who"],
    scaffold: [{ goal: "did-who", command: "whoami" }],
    hints: [
      "whoami asks the copy: which user am I? It prints a name, not a password.",
      "Press Type: whoami, then Run.",
      "The command is exactly: whoami"
    ],
    learned: "whoami prints the username you are using on this pretend computer. Here that name is auditor. A username is not a password. It only says which account is typing.",
    check: [
      {
        q: "What did whoami tell you?",
        options: [
          { t: "The username of the account that is typing.", ok: true },
          { t: "The password for that account.", why: "It printed a name. A password is a secret, and whoami does not show one." }
        ]
      },
      {
        q: "The name it printed was auditor. What is that?",
        options: [
          { t: "The lab account Rook made for you on this copy.", ok: true },
          { t: "Your real name on the internet.", why: "auditor is a pretend account inside the handset." }
        ]
      }
    ],
    codex: [
      {
        id: "username",
        term: "Username",
        def: "The name of an account, like auditor. It is not a secret. The secret is the password, and you have not used one yet.",
        defend: "Shared accounts hide who did a thing. Prefer one person, one account, on real systems."
      }
    ],
    debrief: {
      what: "whoami printed auditor. That is the lab account. You did not log into anything real.",
      defend: "Know which account you are before you do anything else. On a real machine, the wrong account is how accidents become incidents.",
      detect: "Nothing to detect.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("Run whoami. It prints the lab username.", [{ cmd: "whoami", goal: "did-who" }]),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "Next command: whoami. It answers one question. Which account is typing?" },
        { do: "say", who: "rook", text: "press the button. then run. the word that comes back is a username, not a password." },
        { do: "card", who: "rook", title: "Terminal", sub: "whoami", app: "terminal" },
        { do: "await", goals: ["did-who"] },
        { do: "say", who: "quill", text: "auditor is the account we made for you. It exists only in this copy." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-ls",
    tier: 0,
    title: "What's in the Folder",
    concept: "The ls command",
    objective: "Run ls to list the files in this folder.",
    goalText: { "did-ls": "In the terminal, run ls. It lists names. It does not open them." },
    goals: ["did-ls"],
    scaffold: [{ goal: "did-ls", command: "ls" }],
    hints: [
      "ls means list. It prints the names of files and folders here.",
      "Press Type: ls, then Run. You should see names like readme.txt and badge.txt.",
      "The command is exactly: ls"
    ],
    learned: "ls lists the names in the current folder. It does not open the files and it does not change them. A folder is a place that holds files. You are standing in one folder at a time.",
    check: [
      {
        q: "What does ls do?",
        options: [
          { t: "It prints the names in the current folder.", ok: true },
          { t: "It deletes the folder.", why: "ls only looks. It does not delete or change anything." },
          { t: "It sends the files to Helix.", why: "Nothing leaves the handset. ls only prints names." }
        ]
      },
      {
        q: "You saw badge.txt in the list. Have you read it yet?",
        options: [
          { t: "No. ls only showed the name.", ok: true },
          { t: "Yes. Listing a file always opens it.", why: "Listing shows the name. Opening it is a different command. That one is next." }
        ]
      }
    ],
    codex: [
      {
        id: "ls",
        term: "ls",
        def: "The list command. It prints the names of files and folders in the place you are standing. It does not open them.",
        defend: "Looking at names is not the same as reading secrets. On a real system, even listing can be more access than you were given. Stay on the scope."
      }
    ],
    debrief: {
      what: "You listed a folder. The names appeared. The files stayed closed.",
      defend: "Get used to looking before opening. Names tell you what is there. They are not the contents.",
      detect: "Nothing to detect.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("Run ls. It lists names in this folder.", [{ cmd: "ls", goal: "did-ls" }]),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "rook", text: "ls lists the folder you are standing in. names only. it does not open anything." },
        { do: "say", who: "quill", text: "Run ls. You should see a couple of file names. Don't open them yet." },
        { do: "card", who: "rook", title: "Terminal", sub: "ls", app: "terminal" },
        { do: "await", goals: ["did-ls"] },
        { do: "say", who: "quill", text: "Those names are files. A file is words, or a program, saved under a name. You have only seen the names." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-cat",
    tier: 0,
    title: "Read a File",
    concept: "The cat command",
    objective: "Run cat readme.txt to read that one file.",
    goalText: { "did-cat": "In the terminal, run cat readme.txt. Copy it exactly, then press Run." },
    goals: ["did-cat"],
    scaffold: [{ goal: "did-cat", command: "cat readme.txt" }],
    hints: [
      "cat prints a file. The word after cat is the file's name.",
      "Press Type: cat readme.txt, then Run.",
      "The command is exactly: cat readme.txt"
    ],
    learned: "cat filename prints that file on the screen. cat readme.txt reads one file, readme.txt. It does not change the file. The name has to match, including the .txt.",
    check: [
      {
        q: "What does cat readme.txt do?",
        options: [
          { t: "It prints the contents of the file named readme.txt.", ok: true },
          { t: "It lists every file on the computer.", why: "That was ls. cat reads the one file you name." }
        ]
      },
      {
        q: "Did cat change the file?",
        options: [
          { t: "No. It only printed it.", ok: true },
          { t: "Yes. Reading a file deletes it.", why: "Reading prints a copy to the screen. The file is still there." }
        ]
      }
    ],
    codex: [
      {
        id: "cat",
        term: "cat",
        def: "Prints one file. You write cat, then a space, then the file name. cat readme.txt reads readme.txt.",
        defend: "Reading a file you were not given is still reading it. On a job, the scope says which files are in bounds."
      }
    ],
    debrief: {
      what: "You read one file by naming it. The command was cat, the file was readme.txt.",
      defend: "The space matters. catreadme.txt is not a command the computer understands. Copy the line while the commands are new.",
      detect: "Nothing to detect.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("Run cat readme.txt. It prints that file.", [{ cmd: "cat readme.txt", goal: "did-cat", exact: true }]),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "ls showed you the name readme.txt. cat reads it. The command is cat, then a space, then the file name." },
        { do: "say", who: "rook", text: "use the button. it already has the space in the right place." },
        { do: "card", who: "rook", title: "Terminal", sub: "cat readme.txt", app: "terminal" },
        { do: "await", goals: ["did-cat"] },
        { do: "say", who: "quill", text: "You printed the file. You did not change it. That is reading." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-cd",
    tier: 0,
    title: "Change Folder",
    concept: "The cd command",
    objective: "Run cd notes to move into the notes folder.",
    goalText: { "did-cd": "In the terminal, run cd notes. Then you are standing in that folder." },
    goals: ["did-cd"],
    scaffold: [{ goal: "did-cd", command: "cd notes" }],
    hints: [
      "cd means change directory. Directory is another word for folder.",
      "Press Type: cd notes, then Run. notes is a folder inside the one you are in.",
      "The command is exactly: cd notes"
    ],
    learned: "cd notes moves you into the notes folder. After that, ls would list what is inside notes, not what was outside. cd .. would mean the parent folder, but you don't need that yet. One move was the whole lesson.",
    check: [
      {
        q: "What did cd notes do?",
        options: [
          { t: "It moved you into the notes folder.", ok: true },
          { t: "It deleted the notes folder.", why: "cd only moves you. It does not delete." },
          { t: "It emailed the notes to Quill.", why: "Nothing is emailed. cd changes which folder you are looking at." }
        ]
      },
      {
        q: "You are in notes now. What would ls show?",
        options: [
          { t: "The names inside notes, not the folder you just left.", ok: true },
          { t: "Every file on the real internet.", why: "ls only lists the folder you are standing in, on this copy." }
        ]
      }
    ],
    codex: [
      {
        id: "cd",
        term: "cd",
        def: "Change directory. cd notes moves you into a folder named notes. After that, ls and cat look inside that folder.",
        defend: "Know where you are before you read or change anything. pwd prints the folder you are standing in if you get lost."
      }
    ],
    debrief: {
      what: "You moved from your home folder into notes. The computer did not go anywhere in the real world. Your place in the file tree changed.",
      defend: "pwd prints where you are. Use it when a path feels confusing. A path is just the list of folders from the top down to here.",
      detect: "Nothing to detect.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: shell("Run cd notes. It moves you into that folder.", [{ cmd: "cd notes", goal: "did-cd", exact: true }]),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "You are standing in one folder. cd moves you to another. There is a folder here named notes." },
        { do: "say", who: "rook", text: "command is cd notes. after it, you are inside notes. ls would then list what is in there." },
        { do: "card", who: "rook", title: "Terminal", sub: "cd notes", app: "terminal" },
        { do: "await", goals: ["did-cd"] },
        { do: "say", who: "quill", text: "You changed folder. That is all cd does. It does not open a network and it does not read a secret." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-web",
    tier: 0,
    title: "Asking for a Page",
    concept: "What a website request is",
    objective: "Open the note in Files. It shows what a browser asks a server.",
    goalText: { "read-http": "Open Files and read the note about a web request." },
    goals: ["read-http"],
    hints: [
      "A website visit is a request. Your browser asks a server for a page. The server sends the page back.",
      "HTTP is the name of that request language. You do not need to memorize codes. 200 means the server said yes and sent the page.",
      "The note is in Files. Open it. You are not sending a real request."
    ],
    learned: "A website is a conversation. The browser sends a request: please give me this page. The server sends a response: here it is, or no. HTTP is the name of that conversation. In this chapter the conversation is written on a card. Nothing was sent to a real server.",
    check: [
      {
        q: "When you open a website, what happens first?",
        options: [
          { t: "The browser asks the server for a page.", ok: true },
          { t: "The server guesses what you wanted without being asked.", why: "The browser has to ask. That ask is the request." }
        ]
      },
      {
        q: "What is HTTP?",
        options: [
          { t: "The way a browser and a server talk about pages.", ok: true },
          { t: "A password.", why: "HTTP is the request language, not a secret." },
          { t: "A folder.", why: "A folder is on one computer. HTTP is a message between two." }
        ]
      }
    ],
    codex: [
      {
        id: "http",
        term: "HTTP",
        def: "The ordinary language of websites. The browser sends a request for a page. The server sends a response. A response that starts with 200 means the page was sent.",
        defend: "Treat every page your users can open as something the world can open, unless you have actually checked that a login stands in front of it."
      },
      {
        id: "request",
        term: "Request",
        def: "The message that asks for something. A browser request asks a server for one page. The response is the answer.",
        defend: "Log requests on real servers so you can see who asked for what. In this game, requests are fictional and stay in the page."
      }
    ],
    debrief: {
      what: "You read a pretend web request. The browser asked. The server answered with a page. That pair of messages is HTTP.",
      defend: "When a finding says 'the server answered,' it means this conversation happened. The fix is usually on the server: don't answer strangers with things they should not have.",
      detect: "Web logs are a list of these requests. Later chapters will care. This one only needed the idea.",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
      urlLabel: "MDN: An overview of HTTP"
    },
    lab: docChapter({
      id: "http-note",
      title: "A web request, in one card",
      goal: "read-http",
      body: "THIS IS NOT A LIVE REQUEST. Nothing was sent.\n\nThe browser says:\n  please give me the page /\n  on the server helixdyne.example\n\nThe server says:\n  200 OK\n  here is the page\n\nThat ask is a request.\nThat answer is a response.\nThe language they share is called HTTP.\n\n200 means yes, here is the page.\nYou do not need other codes yet."
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "A website is not magic. Your browser asks a server for a page. The server sends the page back, or it refuses." },
        { do: "say", who: "quill", text: "That ask is called a request. The language is called HTTP. Open the note in Files. It shows one request in plain words." },
        { do: "card", who: "quill", title: "A web request", sub: "Files", app: "files", doc: "http-note" },
        { do: "await", goals: ["read-http"] },
        { do: "say", who: "rook", text: "you did not send that. i wrote it on a card. real requests are later, and only at computers on the list." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-hash",
    tier: 0,
    title: "Secrets and Fingerprints",
    concept: "Passwords and hashes",
    objective: "Run hash lantern. See that a hash is a fingerprint, not a lock you can reverse.",
    goalText: { "did-hash": "In the terminal, run hash lantern. Then read the two lines under it." },
    goals: ["did-hash"],
    scaffold: [{ goal: "did-hash", command: "hash lantern" }],
    hints: [
      "A password is a secret you type. A hash is a fingerprint of that secret. The fingerprint is not the secret.",
      "Press Type: hash lantern, then Run. lantern is the word. The long line is the fingerprint.",
      "The command is exactly: hash lantern. You cannot turn the fingerprint back into the word."
    ],
    learned: "A password is a secret. A hash is a fingerprint of a secret. The same word always makes the same fingerprint. You cannot run the fingerprint backward to get the word. Defenders store fingerprints so a stolen file is not a list of passwords.",
    check: [
      {
        q: "What is a password?",
        options: [
          { t: "A secret you type to prove you are allowed in.", ok: true },
          { t: "The number of a computer.", why: "That is an IP address. A password is a secret." }
        ]
      },
      {
        q: "Can you turn a hash back into the password?",
        options: [
          { t: "No. A hash is a one-way fingerprint.", ok: true },
          { t: "Yes. A hash is just a scrambled password you unscramble.", why: "Scrambling you can undo is encoding, not a hash. A hash does not undo." }
        ]
      }
    ],
    codex: [
      {
        id: "password",
        term: "Password",
        def: "A secret you type. Anyone who knows it can pretend to be the account. It should be long, and it should not be reused.",
        defend: "Store passwords in a password manager. Don't share them in chat. Don't leave the factory one written in the manual."
      },
      {
        id: "hash",
        term: "Hash",
        def: "A fingerprint of some text. The same text always gives the same fingerprint. You cannot turn the fingerprint back into the text. Password stores should keep fingerprints, not the passwords.",
        defend: "Use a slow password hash with a unique salt. A bare fast hash of a short word is a weak fingerprint. You will see why in a later chapter, on a word we give you."
      }
    ],
    debrief: {
      what: "You hashed the word lantern. The terminal printed a long fingerprint and told you it cannot be reversed. lantern was not a real person's password. We chose it.",
      defend: "If a database stores passwords as plain words, anyone who copies the database has the passwords. Fingerprints are the replacement. They have to be the slow kind. You will meet a bad fingerprint later, on purpose, in the lab.",
      detect: "Nothing to detect. You fingerprinted a word we handed you.",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
      urlLabel: "OWASP Password Storage Cheat Sheet"
    },
    lab: shell(
      "Run hash lantern. The long line is a fingerprint of that word.",
      [{ cmd: "hash lantern", goal: "did-hash", exact: true }],
      [],
      { hash: true }
    ),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "A password is a secret you type. If someone else knows it, they are you, as far as the computer can tell." },
        { do: "say", who: "quill", text: "A hash is a fingerprint of a secret. Same word, same fingerprint. You cannot turn the fingerprint back into the word." },
        { do: "say", who: "rook", text: "run hash lantern. lantern is a word we picked. it is not anyone's real password. read the line under the fingerprint." },
        { do: "card", who: "rook", title: "Terminal", sub: "hash lantern", app: "terminal" },
        { do: "await", goals: ["did-hash"] },
        { do: "say", who: "quill", text: "Defenders store the fingerprint, not the password. A stolen list of fingerprints is not yet a list of secrets. A stolen list of passwords is." },
        { do: "finish" }
      ]
    }
  });

  basics.push({
    id: "t0-auth",
    tier: 0,
    title: "Permission",
    concept: "Red teaming and authorization",
    objective: "Read the short scope card. Then refuse the thing that is not on it.",
    goalText: {
      "read-mini": "Open Files and read the short scope card.",
      "q-payroll": "Answer Quill. Payroll is not on the card."
    },
    goals: ["read-mini", "q-payroll"],
    hints: [
      "Red teaming means a company hired you to try to break a copy, then write a report. Authorization is that written permission.",
      "The card is the whole list. Payroll is not on it. Nearby does not count.",
      "Open the card in Files. Then choose: No. Payroll is not on the card."
    ],
    learned: "A red team is hired to test, then to write down what they found. Authorization is the written permission: who asked, what you may touch, and when you stop. If it is not on that list, you don't touch it. This game is not permission to touch a real network.",
    check: [
      {
        q: "What is authorization?",
        options: [
          { t: "Written permission that names what you may test.", ok: true },
          { t: "Any computer you are clever enough to open.", why: "Being able to open it is not permission. The list is the permission." }
        ]
      },
      {
        q: "Payroll is next door to the system you were hired to test. Do you open it?",
        options: [
          { t: "No. It is not on the list.", ok: true },
          { t: "Yes, if you only look.", why: "A look is still a test. Off the list means you stop." }
        ]
      }
    ],
    codex: [
      {
        id: "redteam",
        term: "Red team",
        def: "People a company hires to try to break a system the way an attacker would, then report what to fix. Without the hire, the same actions are an intrusion.",
        defend: "Hire them in writing. Give them a list, a time window, and a person to call when something unexpected appears."
      },
      {
        id: "authorization",
        term: "Authorization",
        def: "Permission. For this work, permission is a written scope: the systems, the dates, the techniques, and the moment you stop. A verbal 'while you are there' is not it.",
        defend: "If it is not written down, you don't have it. Stop and ask."
      }
    ],
    debrief: {
      what: "You read a scope card and refused payroll because it was not on the card. That refusal is the job.",
      defend: "Write the list before any tool runs. Name who may add to it. Name what 'stop' means.",
      detect: "This control is a contract, not a sensor. The failures show up later, as a tester found in a system nobody named.",
      url: "https://csrc.nist.gov/pubs/sp/800/115/final",
      urlLabel: "NIST SP 800-115, Technical Guide to Information Security Testing"
    },
    lab: docChapter({
      id: "mini-scope",
      title: "Scope card — the short version",
      goal: "read-mini",
      body: "WHAT YOU MAY TOUCH\n- The pretend computers inside this handset\n- Only when a chapter tells you to\n\nWHAT YOU MAY NOT TOUCH\n- Payroll\n- Real badge photos\n- Anything on the real internet\n- A gift from someone who is not on the team\n\nAuthorization means this list.\nIf it is not on the list, you do not open it."
    }),
    start: "start",
    scenes: {
      start: [
        { do: "say", who: "quill", text: "A red team is hired to break a copy and write a report. The hire is the difference between a test and a crime." },
        { do: "say", who: "quill", text: "Authorization is the written list. Open the short card in Files. Then answer one question." },
        { do: "card", who: "quill", title: "Short scope card", sub: "Files", app: "files", doc: "mini-scope" },
        { do: "await", goals: ["read-mini"] },
        { do: "say", who: "rook", text: "payroll sits on the same floor as the system we were hired to test. one login page. it is not on the card." },
        {
          do: "choice",
          options: [
            { id: "pay-yes", text: "Open it. Same floor is close enough.", wrong: true, reply: { who: "quill", text: "Close enough is not on the list. If the card does not name it, you do not open it." } },
            { id: "pay-no", text: "No. Payroll is not on the card.", goal: "q-payroll", goto: "close" }
          ]
        }
      ],
      close: [
        { do: "say", who: "quill", text: "Good. The next tier practices that rule three more times. The rule will not change." },
        { do: "finish" }
      ]
    }
  });

  root.NightAudit = root.NightAudit || {};
  root.NightAudit.basics = basics;
})(typeof globalThis !== "undefined" ? globalThis : this);
