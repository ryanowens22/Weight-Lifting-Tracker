# Ryan & Sara Lifting — Weight Lifting Tracker

A web app version of the 5-day rotating lifting routine, with shared cloud history so both phones see the same logs. Everything here is free.

The app code is already in this repo. Remaining setup:

---

## Step 1 — Upload the two icon files

The app icons (`icon-192.png`, `icon-512.png`) are binary files that need a manual upload once:

1. On this repo's main page, click **Add file → Upload files**
2. Drag in `icon-192.png` and `icon-512.png` from `Dropbox → Claude → Projects → Workout Routine → App → workout-app`
3. **Commit changes**

(The app works without them — you just won't get a pretty home-screen icon until they're up.)

---

## Step 2 — Turn on GitHub Pages (your free hosting)

1. Repo **Settings → Pages** (left sidebar)
2. Under "Branch": pick **main** and **/(root)** → **Save**
3. Wait a minute, refresh — Pages shows your URL, like `https://ryanowens22.github.io/Weight-Lifting-Tracker/`

Open that URL — the app works now, in "Local only" mode (no sync yet).

---

## Step 3 — Set up the shared database (Supabase)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign in with GitHub
2. **New project** → name it `workout`, set a database password (save it), pick the closest region, **Free** plan
3. Wait ~2 minutes for it to spin up
4. Left sidebar → **SQL Editor** → **New query** → paste the entire contents of `supabase-setup.sql` (in this repo) → **Run**. Should say "Success"
5. Create the shared login: **Authentication → Users → Add user → Create new user**. Enter the email + password you and Sara will both use. Check "Auto Confirm User" if shown
6. (Recommended) **Authentication → Sign In / Up → disable "Allow new users to sign up"**
7. Get your keys: **Project Settings (gear) → API** — copy the **Project URL** and the **anon public** key

---

## Step 4 — Connect the app to the database

1. In this repo, open `config.js` → click the **pencil** (Edit)
2. Paste your two values between the quotes:

```js
window.WORKOUT_CONFIG = {
  SUPABASE_URL: "https://abcdefgh.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi..."
};
```

3. **Commit changes** — Pages republishes automatically in about a minute

(The anon key is designed to be public — it can't touch your data without the login, thanks to the row-level security from the SQL.)

---

## Step 5 — Install on your phones

1. Open the Pages URL on each phone
2. Sign in with the shared email/password (once per device)
3. Add to home screen:
   - **iPhone (Safari):** Share → **Add to Home Screen**
   - **Android (Chrome):** Menu (⋮) → **Add to Home screen**

Done. Both phones share one history — the Ryan/Sara toggle in the app picks whose log you're writing. Works offline at the gym; syncs when you're back online.

---

## Troubleshooting

- **"Local only (cloud not configured)"** — `config.js` values are empty or mistyped
- **Login fails** — check the user exists under Supabase → Authentication → Users
- **Supabase pauses after ~1 week of no activity** (free tier) — open the Supabase dashboard and click Restore; data is kept. Regular app use counts as activity.
