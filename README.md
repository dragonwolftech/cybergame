# Night Audit

A browser game in the shape of a secure-chat client. You are a tech journalist hired onto **Night Audit**, a licensed red team in the fictional city of Cinderwharf. Helix Dyne wants its Beacon Access staging tested before the city puts the badges on real doors. The story arrives as messages in a channel. The work happens in panels on the same site: a terminal, a mailbox, a browser, and a file drawer.

Nothing in the game touches a real network. Every company, person, hostname, and address is invented. The only links that leave the site are the debrief references (NIST, MITRE ATT&CK, OWASP), and those open in a new tab.

## Play

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8741
```

Then open `http://127.0.0.1:8741`.

1. Join the channel and give the cell a name.
2. **Dispatch**, in the sidebar, holds the twelve chapters. They unlock in order.
3. **Beacon Cell** is the story. Reply when buttons appear. If PIX texts you, open that channel — the main one will wait.
4. Cards in the chat open a lab tab: Terminal, Mail, Browser, or Files. The objective strip says what's left. **Hint** spends score: −10, then −20, then −30.
5. Finish a chapter and read the debrief. It says what you did, what a defender would change, how it gets caught, and where to read further.
6. Rank runs from Script Kiddie to Ghost, and Ghost still means you finished the hard ending. Score and the codex live in this browser (`localStorage`). Settings can wipe the client, speed the messages up, or turn on a local synth hum. Sound stays off until you ask. Dotted words have a plain definition. Tap one.

Add `?fast=1` to the URL if you want messages to arrive quickly.

### The client

On a phone, **Channels** opens the sidebar. A tool (terminal, mail, browser, files) fills the screen and **← Chat** closes it. On a wide screen the chat stays beside the tool. Keys 1–5 switch those panels when you are not typing. Esc goes back.

| Place | What it's for |
| --- | --- |
| Beacon Cell / PIX | The story, and the stranger |
| Dispatch | Chapter select, debriefs, replay |
| Terminal | The sealed lab shell. `help` lists the commands this chapter actually has |
| Mail | The phishing chapter |
| Browser | Clipped pages only: OSINT, the training login, the file site, the report |
| Files | Documents the cell hands you |
| Codex | Terms fill in as you file chapters |
| Settings | Faster text, optional synth, reset |

Standing with the cell moves when you keep the scope, and when you don't. PIX is not on the contract.

## Chapters

Tier 0 is for someone who has never used a terminal. Each early chapter is one idea. A button types the command. Hints are free until Tier 2. Old saves are cleared when the lesson list changes.

### Tier 0 · Basics

1. **Computers Talk** — what a network is
2. **Numbers and Names** — IP addresses and domain names
3. **Doors on a Server** — servers and ports
4. **The Terminal** — type `help`
5. **Who You Are** — `whoami`
6. **What's in the Folder** — `ls`
7. **Read a File** — `cat`
8. **Change Folder** — `cd`
9. **Asking for a Page** — what HTTP is
10. **Secrets and Fingerprints** — passwords and hashes
11. **Permission** — red teaming and authorization

### Tier 1 · Beginner

12. **After Hours** — rules of engagement and scope
13. **Public Light** — OSINT and reconnaissance
14. **Open Ports** — one scan, then read the banners
15. **Factory Settings** — default credentials, copied from the manual

### Tier 2 · Intermediate

16. **The Polite Lie** — phishing and pretext
17. **Three Kinds of Secret** — encoding, hashing, encryption
18. **The Query Speaks** — SQL injection on a training login
19. **Echo** — cross-site scripting, stopped at the parsed tag
20. **The Back Stair** — directory traversal and misconfiguration

### Tier 3 · Advanced

21. **Borrowed Root** — sudo policy and SUID
22. **The Other Door** — credential reuse and lateral movement
23. **What We Leave Behind** — persistence, logs, and the findings report

## Deploy

The site is static. Upload the folder to any host that serves files: GitHub Pages, Netlify, S3, a school web directory. No build step and no server code. `index.html` also opens directly from disk.

Progress stays on the device. There is no account.

## Checks

```bash
node test/playthrough.js
```

That plays every chapter to the end, including the wrong doors: an out-of-scope scan, a false phishing flag, a forum password, and removing the wrong scheduled task.

With the site already being served, `node test/ui-smoke.js` clicks through the client in headless Chrome.

## A limit, on purpose

The labs teach the shape of a mistake and the repair. They do not ship weaponized payloads, and they will not talk to a real host. Practice this on systems someone hired you, in writing, to test.
