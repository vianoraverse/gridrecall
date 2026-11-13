# GridRecall: Spatial Memory Challenge

A 10-stage visual memory game. Memorize which object sits in which numbered box, then find it again once the boxes close. Pure HTML, CSS and JavaScript: no build step, no dependencies, no backend.

## How to play

Each test runs through the same phases:

1. **Ready** – a 2-second briefing shows the test number and difficulty tier.
2. **Memorize** – a grid of numbered boxes opens, each holding one object. Study it until the countdown runs out (9–14 seconds). The seconds left are shown as a number next to the bar.
3. **Recall** – the boxes close and only their numbers stay visible. Answer 2–4 questions:
   - *"Where is the X?"* – tap 1 box.
   - *"Where are the X and Y?"* – tap 2 boxes, in any order. Tap a selected box again to undo it.
   - Correct picks turn green, wrong picks turn red, and the correct boxes open briefly.
4. **Bonus** (after Test 10) – six objects are shown: five that appeared during the run and one that never did. Pick the one that never appeared.

You can also answer with the keyboard: keys `1`–`9` pick boxes 1–9 and `0` picks box 10.

### Host Control (for events)

The **Host Control** switch on the menu is on by default and removes every timer. One button under the scoreboard drives the game instead:

| Button | When it appears | What it does |
| --- | --- | --- |
| Flip Boxes | while the boxes are open | closes the boxes and asks the first question |
| Reveal Answer | during a question | marks the picked boxes and opens the correct ones |
| Next Question / Next Test / Bonus Round / See Results | after an answer is revealed | moves on |

Before pressing **Reveal Answer** you can tap the box (or boxes) the audience chose; tapping another box replaces the pick. Revealing with nothing picked counts as a miss. `Space`, `Right Arrow` and `Page Down` press the button, so a presentation clicker works. There is no speed bonus in this mode.

Turn the switch off for solo play with countdown timers. The choice is remembered.

### Modes

| Mode | What it does |
| --- | --- |
| Challenge | Tests 1–10 in sequence, then the bonus round. Updates the saved high score and highest level reached. |
| Practice | Play any single test. Nothing is saved. |

### Level table

| Test | Tier | Boxes | Memorize | Questions |
| --- | --- | --- | --- | --- |
| 1 | Easy | 6 | 12s | single, single |
| 2 | Easy | 6 | 12s | single, dual |
| 3 | Medium | 8 | 14s | single, dual |
| 4 | Medium | 8 | 14s | dual, single |
| 5 | Difficult | 8 | 10s | dual, single, single |
| 6 | Difficult | 8 | 9s | dual, dual, single |
| 7 | Very Difficult | 10 | 12s | single, single, single |
| 8 | Very Difficult | 10 | 11s | single, dual, single |
| 9 | Very Difficult | 10 | 10s | dual, single, dual |
| 10 | Extreme | 10 | 10s | dual, single, dual, single |

### Scoring

- Each correct box is worth the tier's base points: Easy 100, Medium 150, Difficult 200, Very Difficult 250, Extreme 300.
- Getting both boxes of a dual question adds 50% of the base.
- A fully correct answer earns a speed bonus of up to 50% of the base, depending on how much answer time is left. Answer time is 15s for single and 20s for dual questions on Easy and Medium, and 10s / 14s from Difficult up.
- **Streak multiplier:** every fully correct answer in a row adds ×0.25, up to ×3. Any miss or timeout resets it to ×1.
- The bonus round is worth a flat 1,000 points.

## Files

```
index.html   markup for the menu, game and results screens
style.css    theme and responsive layout
script.js    icon pool, level config, game state machine, sound, storage
README.md
```

Tunable values live at the top of `script.js`: `LEVELS` (the progression table), `TIERS` (points and answer time per tier) and `SETTINGS` (timings, bonus points, multiplier).

## Deploying to GitHub Pages

1. Create a repository and put the four files in its root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.
4. After a minute or so the site is live.

URL structure:

| Repository name | URL |
| --- | --- |
| `<username>.github.io` (user site) | `https://<username>.github.io/` |
| anything else, e.g. `gridrecall` (project site) | `https://<username>.github.io/gridrecall/` |

All asset paths are relative (`./style.css`, `./script.js`), so the game works at either location, and also when `index.html` is opened straight from disk.

## Technical notes

- **Icons:** 60 objects stored as inline SVG paths in `script.js`. Nothing is loaded from a CDN. 59 come from [Lucide](https://lucide.dev) (ISC licence); the cactus is drawn by hand.
- **Bonus decoy:** four icons are held back at the start of every run and never dealt into a grid, so the decoy is guaranteed never to have appeared.
- **Sound:** tick, flip, select, correct chime, error buzz and fanfare are synthesized with the Web Audio API. The mute button's state is remembered.
- **Storage:** `localStorage` keys `gridrecall.highScore`, `gridrecall.highestLevel`, `gridrecall.muted` and `gridrecall.hostMode`. To reset your records, clear site data for the page.
- **Browsers:** current Chrome, Edge, Firefox and Safari.
