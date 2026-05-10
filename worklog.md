
---
Task ID: hero-frames-fix
Agent: Main Agent
Task: Fix incomplete hero scrollytelling frames and optimize

Work Log:
- Diagnosed corrupted frame 047 (48KB vs ~139KB for adjacent frames)
- Fixed frame 047 via interpolation between frames 046 and 048
- Generated 171 interpolated frames from 86 originals (2x smoother scrub)
- Created WebP versions at 1920x1080 (62% smaller: 26MB JPG → 9.8MB WebP)
- Rewrote HeroScrub component from DOM-based opacity toggle to canvas-based rendering
- Canvas approach uses requestAnimationFrame for smooth frame updates
- Added preloading with progress bar
- Verified all 171 WebP frames accessible via dev server
- Build passes successfully

Stage Summary:
- 86 original 4K JPG frames → 171 interpolated 1080p WebP frames
- HeroScrub now uses canvas + GSAP ScrollTrigger with scrub: 1.5
- Frame 047 corruption fixed
- Average WebP frame: 59KB (total 9.8MB)
- Site running at http://127.0.0.1:3000/ - all frames 200 OK

---
Task ID: server-stability-fix
Agent: Main Agent
Task: Fix 502 Bad Gateway error on preview URL

Work Log:
- Diagnosed that the Next.js standalone server was getting OOM-killed
- Root cause: Linux OOM killer targets processes with high OOM scores (~673)
- Node.js processes have high VSZ (~1.5GB virtual memory) which drives OOM score up
- The root Caddy proxy creates concurrent connections that spike memory pressure
- Tried: Node.js standalone, dev mode, Python http.server, serve, custom static server
- ALL backends get OOM-killed after several concurrent Caddy requests
- Solution: Use Caddy as file_server (2MB RSS vs 84MB for Node.js) with auto-restart supervisor
- Built Next.js with output:export for static HTML
- Created serve-Caddyfile with file_server directive
- Created supervise-caddy.sh for auto-restart on OOM kill

Stage Summary:
- Site served as static export via Caddy file_server on port 3000
- Root Caddy on port 81 proxies to our Caddy on port 3000
- Preview URL: https://preview-chat-43a09ff5-16bf-4d72-9dbb-60432c3f5e5c.space-z.ai/
- Auto-restart supervisor handles OOM kills with ~0.2s restart time
- All pages and 171 WebP hero frames accessible
- Site is functional but may have brief 502s during OOM restart cycles
