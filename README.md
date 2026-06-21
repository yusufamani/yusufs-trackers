# Lift Log 🏋️

A simple, mobile-first workout tracker. Browse exercises by muscle group, build day routines, and log every lift (weight × sets × reps) with full history and personal-best tracking. Everything is one self-contained `index.html` — no install, no server, no accounts. Your data is saved in your browser.

## Use it locally

Just **double-click `index.html`** to open it in your browser. That's it.

To try it on your phone over Wi-Fi (same network as your Mac), run this in the folder:

```bash
cd ~/Desktop/Workout-Tracker
python3 -m http.server 9200
```

Then open `http://<your-mac-ip>:9200` on your phone (find your IP in System Settings → Wi-Fi → Details).

## Put it on your phone (GitHub Pages)

This makes a real URL you can open at the gym and "Add to Home Screen" like an app.

1. Create a new repo on GitHub, e.g. `lift-log` (Public).
2. Upload `index.html` (drag-and-drop in the GitHub web UI works, or use git):
   ```bash
   cd ~/Desktop/Workout-Tracker
   git init && git add . && git commit -m "Lift Log"
   git branch -M main
   git remote add origin https://github.com/<you>/lift-log.git
   git push -u origin main
   ```
3. Repo → **Settings** → **Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: `main` / `(root)`**, Save.
5. Wait ~1 minute, then open `https://<you>.github.io/lift-log/` on your phone.

On iPhone Safari: tap **Share → Add to Home Screen** to get an app icon that opens fullscreen.

## Your data

- Data lives in your browser's `localStorage`, **per device** — what's on your phone isn't automatically on your laptop.
- To move data between devices: **Exercises tab → Backup → Export**, then **Import** the file on the other device.
- "Reset all data" restores the starter exercises and routines.

## What's included

- 10 muscle groups with ~60 common exercises pre-loaded (all editable).
- 3 starter routines: Push Day, Pull Day, Leg Day.
- Add/rename/delete your own categories, exercises, and routines.
- Quick-log pre-fills your last session so you just nudge the numbers.
- **Goal Log** — a daily-habit vision map (Body, Spirit, Appearance, Career, Relationships, UX, Creativity, Home).

## Installable app (PWA)

This is set up as an installable app. The folder includes:

- `manifest.json` — app name, colors, icons
- `sw.js` — service worker (offline caching)
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — app icons
- `make-icons.js` — regenerates the icons (`node make-icons.js`); optional, safe to delete

**Deploy note:** upload the *whole folder* to GitHub Pages, not just `index.html`, so the icons/manifest/service worker come along. Offline mode and install prompts only work over **https** (i.e. on Pages or `localhost`), not when opening the file directly.

Once hosted: **iPhone Safari → Share → Add to Home Screen** for a full-screen, offline app icon.
