/* =====================================================
   FEATURED (MAIN) PRODUCT — AUTO LOOP VIDEO
   -----------------------------------------------------
   Cycle hair: 4 sec thumbnail (product pic) -> video
   voice ke sath chalti hai -> wapas 4 sec thumbnail ->
   phir video ... (hover/touch ki zaroorat nahi)

   Video kahan set karein (priority order):
     1) Admin > Product tab > "Video URL" field (featured product)
     2) Neeche wali FEATURED_VIDEO (code default: bundled .mp4)

   Video ke 2 tareeqe:
   - Apni file (ABHI SET HAI): frontend/public/videos/featured-video.mp4
     — aap ki 20s wali video pehle se bundled hai, kuch nahi karna
   - Naya link (ScreenPal / YouTube): Admin > featured product ki
     "Video URL" mein link paste karein — component khud iframe banata hai
   ===================================================== */
export const FEATURED_VIDEO = '/videos/featured-video.mp4'

/* Thumbnail kitne second dikhani hai */
export const THUMB_SECONDS = 4

/* Embed player (ScreenPal/YouTube) ki video ka time —
   uske baad wapas thumbnail cycle. Native .mp4 ka
   duration khud pata chal jata hai, isi liye zaroorat nahi. */
export const EMBED_SECONDS = 26
