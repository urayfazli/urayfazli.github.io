# Portfolio - Uray Fazli Alman (Blockchain Node Operator)

A modern, responsive portfolio website for **Uray Fazli Alman**, showcasing validator node infrastructure across **Aptos Network**, **Sei Network**, and **SubQuery Network**.

---

## 🚀 Panduan Deploy ke GitHub Pages (`username.github.io`)

### Metode 1: Otomatis via GitHub Actions (Direkomendasikan)

1. **Push kode ini ke repositori GitHub Anda**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Uray Fazli Alman Portfolio"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages**:
   - Buka repositori Anda di GitHub.
   - Masuk ke tab **Settings** → **Pages** (di sidebar kiri).
   - Di bagian **Build and deployment** → **Source**, pilih **GitHub Actions**.
   - Selesai! Workflow otomatis `.github/workflows/deploy.yml` akan langsung mem-build dan mempublikasikan website ke:
     `https://<USERNAME>.github.io/<REPO_NAME>/` atau `https://<USERNAME>.github.io/`

---

### Metode 2: Deploy Manual via `dist/`

1. **Jalankan build lokal**:
   ```bash
   npm install
   npm run build
   ```
2. Folder `dist/` yang dihasilkan siap langsung di-upload ke GitHub Pages atau hosting statis apa pun (Vercel, Netlify, Cloudflare Pages).

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Motion
- **Fonts**: Fredoka, Plus Jakarta Sans, JetBrains Mono, Patrick Hand
- **Icons & Doodles**: Custom Hand-crafted SVGs
