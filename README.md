# Auto Unmerge for Google Meet

A tiny Chrome extension that stops Google Meet from merging your audio with nearby devices.

When you join a call near other people in the same meeting, Meet often merges your audio with theirs. This extension notices the "Your audio is merged with nearby devices" notice and clicks through Meet's own **Stop merging audio with nearby devices** option for you — whenever it happens during the call.

## Install

**From source:**
1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.

## How it works

`content.js` runs only on `meet.google.com`. A `MutationObserver` re-checks the page (at most twice a second) and advances one step at a time:

1. Click the "audio is merged" pill.
2. Click the ⋮ menu on your own row (`(You)`) inside the **Merged audio** group.
3. Click **Stop merging audio with nearby devices**.

Meet's class names are obfuscated and change between builds, so everything is matched by visible text / `aria-label`.

## Limitations

- English Meet UI only (it matches English labels).
- If Google renames those labels, the extension stops working until updated.

## Privacy

No permissions beyond running on `meet.google.com`. Collects no data and makes no network requests.

## License

MIT — see [LICENSE](LICENSE).

*Not affiliated with or endorsed by Google.*
