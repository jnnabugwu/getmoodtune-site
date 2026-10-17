# getmoodtune.com

Static landing + privacy page for MoodTune. Hosted on Vercel (Hobby team `jnnabugwus-projects`, project `getmoodtune-site`). No build step.

```sh
python3 -m http.server 8765        # preview at http://localhost:8765 (root-relative paths need a server)
vercel deploy --prod --scope jnnabugwus-projects
```

- `og.png` is the 1200×630 link-preview image. To regenerate it from `_build/og.html`, run:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=5000 --screenshot=og.png "file://$PWD/_build/og.html"`
- `_build/` and this README are kept out of deploys by `.vercelignore`.
- Universal / App Links files go in `.well-known/`; see `moodtune_app/docs/app_links_plan.md`.
- Brand colours and mood gradients mirror `moodtune_app/lib/app/theme/mood_theme.dart`.
