# 🚀 Deployment Guide - Vercel (Firebase Edition)

Panduan lengkap untuk deploy aplikasi **YAYASAN DARULHUDA School Management System** ke Vercel dengan database **Google Firestore**.

---

## 📋 Prerequisites

Sebelum deploy, pastikan Anda memiliki:

- [x] Akun GitHub (untuk menyimpan kode)
- [x] Akun Vercel (gratis) - [Daftar di sini](https://vercel.com/signup)
- [x] File `serviceAccountKey.json` dari Firebase Console (untuk credential)

---

## 🗄️ Step 1: Setup GitHub Repository

### 1.1 Inisialisasi Git (jika belum)

```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

### 1.2 Buat Repository di GitHub

1. Buka [GitHub](https://github.com/new)
2. Buat repository baru (misalnya: `darulhuda-school-system`)
3. **Jangan** centang "Initialize with README"
4. Klik **Create repository**

### 1.3 Push ke GitHub

```bash
git remote add origin https://github.com/USERNAME/darulhuda-school-system.git
git branch -M main
git push -u origin main
```

> Ganti `USERNAME` dengan username GitHub Anda

---

## ☁️ Step 2: Deploy ke Vercel

### 2.1 Import Project

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New** → **Project**
3. Import repository GitHub yang baru dibuat
4. Klik **Import**

### 2.2 Configure Project

Vercel akan otomatis mendeteksi Next.js. Pastikan:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)

### 2.3 Setup Environment Variables (PENTING!)

Aplikasi ini menggunakan Firebase, jadi Anda WAJIB menambahkan environment variables berikut di Vercel:

Buka file `serviceAccountKey.json` Anda, dan salin isinya ke variable berikut:

| Variable Name | Value dari `serviceAccountKey.json` |
| :--- | :--- |
| `FIREBASE_PROJECT_ID` | `project_id` |
| `FIREBASE_CLIENT_EMAIL` | `client_email` |
| **`FIREBASE_PRIVATE_KEY`** | `private_key` (Lihat catatan di bawah!) |

> [!IMPORTANT]
> **Format FIREBASE_PRIVATE_KEY**:
> Value private key dari JSON biasanya berisi baris baru (`\n`).
> Saat paste di Vercel, pastikan Anda menyalin **SELURUH** isi string termasuk `-----BEGIN PRIVATE KEY-----` sampai `-----END PRIVATE KEY-----`.
> Vercel biasanya otomatis menangani newlines, tapi jika error, coba ganti `\n` dengan baris baru enter yang sebenarnya.

**Variable Tambahan (Wajib):**

| Variable Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `https://nama-project-anda.vercel.app` (isi setelah deploy nanti) |

Klik **Save** tapi **JANGAN klik Deploy yet!** (Save dulu environment variables-nya).

---

## 🚢 Step 3: Deploy!

1. Klik **Deploy**
2. Tunggu proses build (~1-3 menit)
3. Jika berhasil, Anda akan diarahkan ke halaman "Congratulations!"

---

## 🔧 Troubleshooting

### 1. Error: `Error parsing private key`
Ini masalah paling umum. Cek `FIREBASE_PRIVATE_KEY`:
- Pastikan tidak ada tanda kutip ganda `"` di awal/akhir jika Anda copy manual dari JSON (tergantung cara copy-nya).
- Pastikan header `-----BEGIN PRIVATE KEY-----` terbawa.

### 2. Build Error: Type Check Failed
Jika build gagal karena error TypeScript yang ketat, Anda bisa meminta developer untuk mematikan `typescript ignoreBuildErrors: true` di `next.config.js` untuk sementara.

### 3. Halaman "Unknown" / Blank
- Cek tab **Logs** di dashboard deployment Vercel.
- Biasanya karena environment variable belum terbaca/salah. Redeploy setelah update env var.

---

## 🎉 Success!

Aplikasi Anda sekarang live! Database Firestore yang digunakan adalah database **Production** yang sama dengan development (jika Anda pakai project ID yang sama).

**Deployment URL**: `https://darulhuda-school-system.vercel.app`

Selamat! Aplikasi YAYASAN DARULHUDA sudah online! 🎊
