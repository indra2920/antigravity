---
description: Deploy aplikasi ke Vercel dengan database PostgreSQL
---

# Workflow: Deploy ke Vercel

Ikuti langkah-langkah berikut untuk deploy aplikasi ke Vercel.

## Prerequisites

Sebelum memulai, pastikan:
- Anda sudah memiliki akun GitHub
- Anda sudah memiliki akun Vercel (gratis di https://vercel.com/signup)
- Git sudah terinstall di komputer

---

## Step 1: Push ke GitHub

// turbo
1. Cek status git dan commit semua perubahan:
```bash
git status
git add .
git commit -m "Ready for Vercel deployment"
```

2. Jika belum ada remote repository, buat repository baru di GitHub:
   - Buka https://github.com/new
   - Buat repository baru (misalnya: `darulhuda-school-system`)
   - **JANGAN** centang "Initialize with README"
   - Copy URL repository

// turbo
3. Tambahkan remote dan push:
```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

> Ganti `USERNAME` dan `REPO_NAME` dengan username GitHub dan nama repository Anda

---

## Step 2: Import Project ke Vercel

1. Login ke Vercel Dashboard: https://vercel.com/dashboard
2. Klik **Add New** → **Project**
3. Pilih repository GitHub yang baru dibuat
4. Klik **Import**

---

## Step 3: Configure Project Settings

Di halaman konfigurasi project:

1. **Framework Preset**: Next.js (otomatis terdeteksi)
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (sudah dikonfigurasi)
4. **Install Command**: `npm install --legacy-peer-deps`

> **PENTING**: Jangan klik Deploy dulu!

---

## Step 4: Setup Database PostgreSQL

1. Buka tab **Storage** di Vercel Dashboard
2. Klik **Create Database**
3. Pilih **Postgres**
4. Pilih region **Singapore (sin1)** (terdekat dengan Indonesia)
5. Beri nama database (misalnya: `school-db`)
6. Klik **Create**

---

## Step 5: Connect Database ke Project

1. Setelah database dibuat, klik **Connect Project**
2. Pilih project yang baru Anda import
3. Vercel akan otomatis menambahkan environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - dll.

---

## Step 6: Set Environment Variables

1. Kembali ke project settings
2. Buka **Settings** → **Environment Variables**
3. Tambahkan variable baru:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy value dari `POSTGRES_PRISMA_URL`
   - **Environment**: Production, Preview, Development (centang semua)
4. Klik **Save**

---

## Step 7: Deploy!

1. Kembali ke tab **Deployments**
2. Klik **Deploy** atau push commit baru ke GitHub
3. Tunggu proses build selesai (~2-5 menit)
4. Vercel akan memberikan URL deployment (misalnya: `https://your-project.vercel.app`)

---

## Step 8: Run Database Migration

Setelah deployment berhasil, jalankan migration untuk membuat tabel database.

**Option A: Via Vercel CLI (Recommended)**

// turbo-all
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Link project:
```bash
vercel link
```

4. Pull environment variables:
```bash
vercel env pull .env.production
```

5. Run migration:
```bash
npx prisma migrate deploy
```

**Option B: Via Prisma Studio (Lebih Mudah)**

1. Buka Vercel Dashboard → Storage → Postgres
2. Copy `POSTGRES_PRISMA_URL`
3. Di terminal, jalankan:
```bash
DATABASE_URL="paste-url-here" npx prisma db push
```

---

## Step 9: Verify Deployment

1. Buka URL deployment di browser
2. Test fitur-fitur utama:
   - Tambah data Tingkat (Level)
   - Tambah data Kelas
   - Tambah data Mata Pelajaran
   - Tambah data Guru
   - Tambah data Siswa
   - Refresh halaman dan pastikan data tersimpan

---

## Step 10: Setup Continuous Deployment

Setelah setup awal, setiap kali Anda push ke GitHub, Vercel akan otomatis deploy:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel akan otomatis:
- Build aplikasi
- Run tests (jika ada)
- Deploy ke production
- Memberikan preview URL untuk setiap commit

---

## Troubleshooting

### Build Failed - Prisma Client Error

Jika build gagal dengan error "Prisma Client not generated":

1. Pastikan `package.json` memiliki build script yang benar:
```json
"build": "prisma generate --schema=./schema.prisma && next build"
```

2. Redeploy dari Vercel Dashboard

### Database Connection Error

Jika ada error koneksi database:

1. Cek environment variable `DATABASE_URL`
2. Pastikan menggunakan `POSTGRES_PRISMA_URL` (bukan `POSTGRES_URL`)
3. Pastikan URL memiliki `?sslmode=require` di akhir

### Migration Failed

Jika migration gagal:

```bash
# Push schema langsung (lebih aman untuk production baru)
DATABASE_URL="your-postgres-url" npx prisma db push
```

---

## Success! 🎉

Aplikasi Anda sekarang live di internet!

**Next Steps:**
1. Share URL ke pengguna
2. Monitor usage di Vercel Analytics
3. Setup custom domain (optional)
4. Enable Vercel Analytics untuk monitoring

**Deployment URL**: Cek di Vercel Dashboard → Deployments
