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
6. Rank runs from Script Kiddie to Ghost. Score and the codex live in this browser (`localStorage`). Settings can wipe the client or speed the messages up.

Add `?fast=1` to the URL if you want messages to arrive quickly.

### The client

On a narrow screen, **Channels** opens the sidebar. It closes again when you pick somewhere to go.

| Place | What it's for |
| --- | --- |
| Beacon Cell / PIX | The story, and the stranger |
| Dispatch | Chapter select, debriefs, replay |
| Terminal | The sealed lab shell. `help` lists the commands this chapter actually has |
| Mail | The phishing chapter |
| Browser | Clipped pages only: OSINT, the training login, the file site, the report |
| Files | Documents the cell hands you |
| Codex | Terms fill in as you file chapters |
| Settings | Faster text, reset |

Standing with the cell moves when you keep the scope, and when you don't. PIX is not on the contract.

## Chapters

1. **After Hours** — rules of engagement and scope
2. **Public Light** — OSINT and reconnaissance
3. **Open Ports** — scanning and service banners
4. **Factory Settings** — default credentials
5. **The Polite Lie** — phishing and pretext
6. **Three Kinds of Secret** — encoding, hashing, encryption
7. **The Query Speaks** — SQL injection on a training login
8. **Echo** — cross-site scripting, stopped at the parsed tag
9. **The Back Stair** — directory traversal and misconfiguration
10. **Borrowed Root** — sudo policy and SUID
11. **The Other Door** — credential reuse and lateral movement
12. **What We Leave Behind** — persistence, logs, and the findings report

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
