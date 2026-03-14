# Hero video on mobile (iOS)

The hero uses **WebM** (desktop) and **MP4** (iOS/Safari). iOS Safari does not support WebM, so the hero video will not play on iPhone until an MP4 version is available.

## Add MP4 for mobile

1. Convert the existing WebM to MP4 and save as `public/images/Cinematic.mp4`.

   **Using ffmpeg** (install via `brew install ffmpeg` if needed):

   ```bash
   ffmpeg -i public/images/Cinematic.webm -c:v libx264 -movflags +faststart public/images/Cinematic.mp4
   ```

2. Restart the dev server and test on your iPhone; the hero video should autoplay (muted) in mobile view.
