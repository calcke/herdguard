# HerdGuard

The app draws the boundary and sends it to the collar. The collar does the alarms.

## Use it
1. Open the app. Walk the edge of the field and tap **Point** at each corner (or **GPS** to use your phone's position). Up to 20 points.
2. Tap **Send**, then **Send to collar**. Your phone must first join the collar's Wi-Fi, named `HerdGuard_XXXX`, with the password on the collar's setup page.
3. The collar confirms the boundary on its screen.

## Put it online
1. Create a public repository and upload the contents of this folder (check that `.github` came across).
2. Settings → Pages → Source: **GitHub Actions**.
3. The website is at `https://YOUR-USER.github.io/YOUR-REPO/`.
4. The APK is built into the release `app-latest`: `https://github.com/YOUR-USER/YOUR-REPO/releases/download/app-latest/herdguard.apk`

## Offline maps
- Open the app once with signal. Map tiles you look at are kept on the phone.
- For a field you will visit without signal: draw the boundary, open **Saved**, tap **Save map for offline**. This stores the satellite map around the boundary (up to about 900 tiles).
