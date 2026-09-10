MediaVault

<p align="center">
  <img src="https://media-vault-website.vercel.app/logo.svg" alt="MediaVault Logo" width="80" height="80" />
</p>

<h1 align="center">MediaVault</h1>

<p align="center">
  <em>Download. Stream. Enjoy.</em>
</p>

<p align="center">
  A free, complete media toolkit for downloading and streaming music, videos, and live TV — built for East Africa and the world.
</p>

<p align="center">
  <a href="https://media-vault-website.vercel.app">🌐 Website</a> •
  <a href="https://mediavault-o52i.onrender.com">⚙️ API</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-installation">📥 Installation</a> •
  <a href="#-support">📧 Support</a>
</p>

---

📖 About MediaVault

MediaVault is a free, powerful media toolkit that lets you download and stream your favorite content from across the internet — all in one place.

Whether you're looking for the latest Afrobeat hits, downloading MP4 videos in HD, or streaming live TV channels, MediaVault gives you the freedom to enjoy your media anywhere, anytime.

Built with love in Uganda 🇺🇬 for East Africa and beyond.

---

✨ Features

🎵 Music Downloads

· Search millions of songs from YouTube in seconds
· Download MP3 in high quality (128kbps – 320kbps)
· Trending music from across Africa and the world
· Genre browsing — Afrobeat, Bongo Flava, Dancehall, Gospel, Amapiano, Singeli, Zouk, Hip Hop, R&B, and more
· Smart suggestions — auto-complete as you type

🎬 Video Downloads

· Download MP4 videos in multiple qualities (360p, 480p, 720p, 1080p)
· Stream videos in HD directly in the browser
· Floating mini-player — keeps playing while you browse
· Related videos for endless discovery

📺 Live TV (Coming Soon)

· Free live TV channels from around the world
· Sports — Cricket, Football (EPL), Basketball, and more
· News, Music, Movies — 1000+ channels

📱 Progressive Web App

· Install as an app on any device (Android, iOS, Desktop)
· Offline support — browse what you've already seen
· Dark/Light theme — auto-matches your system

🔒 Privacy First

· No registration required — just search and download
· No tracking — your searches stay on your device
· Fast & free — no premium tiers, no hidden costs

---

🚀 Getting Started

🌐 Use the Website

Visit media-vault-website.vercel.app — no installation needed!

1. Search for any song or artist
2. Click a result to open the song page
3. Download MP3 or Video with one click
4. Enjoy your media offline!

📱 Install as an App

MediaVault works as a Progressive Web App (PWA):

On Android:

1. Open media-vault-website.vercel.app in Chrome
2. Tap the menu (⋮) → Add to Home screen
3. Tap Install

On iPhone/iPad:

1. Open the site in Safari
2. Tap Share → Add to Home Screen
3. Tap Add

On Desktop:

1. Open the site in Chrome or Edge
2. Click the install icon in the address bar
3. Click Install

---

🛠️ Tech Stack

MediaVault is built with modern, fast technology:

Layer Technology
Frontend Next.js 14, React, TypeScript
Styling Tailwind CSS, Framer Motion
Backend Python, FastAPI, yt-dlp
Hosting Vercel (frontend), Render (backend)
Analytics Google Analytics, Vercel Analytics
Ads Google AdSense

---

📁 Project Structure

```
MediaVault/
├── website/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── search/         # Search results
│   │   │   ├── song/[id]/      # Song detail page
│   │   │   ├── genre/[slug]/   # Genre pages
│   │   │   ├── tiktok/         # TikTok downloader
│   │   │   ├── about/          # About page
│   │   │   └── privacy/        # Privacy policy
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Utilities & API client
│   │   └── styles/             # Global CSS
│   └── public/                 # Static assets
│
├── backend-render/             # Python FastAPI backend
│   ├── main.py                 # App entry point
│   ├── api/routes.py           # API endpoints
│   └── services/extractor.py   # YouTube extraction logic
│
└── README.md
```

---

🔌 API Endpoints

The MediaVault API is public and free to use:

Endpoint Description
GET /api/search?q={query} Search YouTube for songs
GET /api/song/{video_id} Get song details
GET /api/trending Get trending music
GET /api/suggest?q={query} Search suggestions
GET /api/download/mp3/{video_id} Download MP3
GET /api/download/video/{video_id} Download MP4
GET /api/channels/trending Trending channels

Base URL: https://mediavault-o52i.onrender.com

---

💻 Development Setup

Want to run MediaVault locally? Here's how:

Prerequisites

· Node.js 18+
· Python 3.11+
· FFmpeg (for MP3 conversion)

1. Clone the repository

```bash
git clone https://github.com/jiangsalim/MediaVault.git
cd MediaVault
```

2. Start the backend

```bash
cd backend-render
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

3. Start the frontend

```bash
cd website
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
npm run dev
```

4. Open in browser

Visit http://localhost:3000

---

🤝 Contributing

We welcome contributions from the community! Here's how to get started:

1. Fork the repository
2. Create a branch for your feature (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m "Add amazing feature")
4. Push to your branch (git push origin feature/amazing-feature)
5. Open a Pull Request

Please read our Contributing Guide for details.

---

📜 Legal

Copyright Notice

MediaVault is a tool for personal use only. Users are responsible for complying with copyright laws in their jurisdiction.

· Don't redistribute copyrighted content
· Don't use for commercial purposes without permission
· Respect creators — buy music and videos when possible

Disclaimer

MediaVault is not affiliated with YouTube, Google, TikTok, or any of the platforms it interacts with. All trademarks belong to their respective owners.

---

📧 Support

Having issues? We're here to help!

Channel Contact
📧 Email infohermansoftware@gmail.com
🐛 Bug Reports GitHub Issues
💬 Discussions GitHub Discussions

---

🙏 Acknowledgements

MediaVault would not be possible without the incredible open-source community:

· yt-dlp — YouTube extraction
· FFmpeg — Audio/video processing
· Next.js — React framework
· FastAPI — Python backend
· Tailwind CSS — Styling
· Vercel & Render — Hosting

---

📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

<p align="center">
  <strong>Made with ❤️ in Uganda by HERMAN Software Solutions</strong>
</p>

<p align="center">
  ⭐ If you find MediaVault useful, please give it a star on GitHub!
</p>

---

🗺️ Roadmap

✅ Completed

☑ Music search & download
☑ Video download in HD
☑ Floating mini-player
☑ SEO optimization
☑ Dark/Light theme
☑ PWA support

🚧 In Progress

☐ Live TV channels
☐ Sports streaming
☐ User playlists
☐ Download history

🔮 Future

☐ Mobile app (Android/iOS)
☐ Desktop app (Windows/Mac/Linux)
☐ User accounts
☐ Social sharing
☐ Lyrics integration

---

Last updated: September 2026
