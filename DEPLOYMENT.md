# 🚀 Deployment Guide - Vercel

Panduan lengkap untuk deploy aplikasi **YAYASAN DARULHUDA School Management System** ke Vercel.

---

## 📋 Prerequisites

Sebelum deploy, pastikan Anda memiliki:

- [x] Akun GitHub (untuk menyimpan kode)
- [x] Akun Vercel (gratis) - [Daftar di sini](https://vercel.com/signup)
- [x] Git terinstall di komputer

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
- **Build Command**: `npm run build` (sudah di-set di package.json)
- **Output Directory**: `.next` (default)

### 2.3 Setup Environment Variables

**JANGAN DEPLOY DULU!** Klik **Environment Variables** dan tambahkan:

```
DATABASE_URL = (akan diisi setelah membuat database)
```

Klik **Save** tapi **JANGAN klik Deploy yet!**

---

## 🗃️ Step 3: Setup Vercel Postgres Database

### 3.1 Create Database

1. Di Vercel Dashboard, buka tab **Storage**
2. Klik **Create Database**
3. Pilih **Postgres**
4. Pilih region **Singapore (sin1)** (terdekat dengan Indonesia)
5. Klik **Create**

### 3.2 Connect Database to Project

1. Setelah database dibuat, klik **Connect Project**
2. Pilih project yang baru dibuat
3. Vercel akan otomatis menambahkan environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_URL_NO_SSL`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 3.3 Set DATABASE_URL

1. Kembali ke **Settings** → **Environment Variables**
2. Edit variable `DATABASE_URL`
3. Isi dengan value dari `POSTGRES_PRISMA_URL`
4. Klik **Save**

---

## 🚢 Step 4: Deploy!

### 4.1 Trigger Deployment

1. Kembali ke tab **Deployments**
2. Klik **Redeploy** (atau push commit baru ke GitHub)
3. Tunggu proses build (~2-3 menit)

### 4.2 Run Database Migration

Setelah deployment berhasil, jalankan migration:

1. Di Vercel Dashboard, buka project
2. Klik **Settings** → **Functions**
3. Atau gunakan Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.production
npx prisma migrate deploy
```

**ATAU** lebih mudah, gunakan Prisma Data Platform:

1. Buka terminal di project
2. Jalankan:

```bash
npx prisma db push
```

3. Masukkan `DATABASE_URL` dari Vercel saat diminta

---

## 🌱 Step 5: Seed Initial Data

Setelah migration berhasil, seed data awal:

### Option 1: Via Browser

1. Buka aplikasi yang sudah di-deploy
2. Tambahkan data manual:
   - **Tingkat**: X, XI, XII
   - **Mata Pelajaran**: Matematika, Bahasa Indonesia, dll
   - **Kelas**: X IPA 1, X IPS 1, dll

### Option 2: Via API (Advanced)

Buat file `seed.ts` dan jalankan:

```bash
npx tsx prisma/seed.ts
```

---

## ✅ Step 6: Verification

### 6.1 Test Aplikasi

Buka URL deployment (misalnya: `https://darulhuda-school-system.vercel.app`)

Test semua fitur:

- [ ] Homepage loading
- [ ] Tambah Tingkat baru
- [ ] Tambah Kelas baru
- [ ] Tambah Mata Pelajaran
- [ ] Tambah Guru
- [ ] Tambah Siswa
- [ ] Hapus data (test delete buttons)
- [ ] Data persist setelah refresh

### 6.2 Check Database

1. Buka Vercel Dashboard → Storage → Postgres
2. Klik **Data** tab
3. Verify data tersimpan dengan benar

---

## 🔧 Troubleshooting

### Build Failed

**Error**: `Prisma Client not generated`

**Solution**:
```bash
# Pastikan postinstall script ada di package.json
"postinstall": "prisma generate"
```

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
1. Check `DATABASE_URL` di Environment Variables
2. Pastikan menggunakan `POSTGRES_PRISMA_URL` (bukan `POSTGRES_URL`)
3. Pastikan SSL mode enabled: `?sslmode=require`

### Migration Failed

**Error**: `Migration failed to apply`

**Solution**:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema directly
npx prisma db push
```

### 404 Error on Routes

**Solution**:
- Pastikan semua routes ada di folder `app/`
- Check `next.config.js` tidak ada custom routing

---

## 🎯 Post-Deployment Checklist

- [ ] Custom domain (optional) - Settings → Domains
- [ ] Enable Vercel Analytics - Analytics tab
- [ ] Set up monitoring - Integrations → Sentry/LogRocket
- [ ] Configure CORS if needed
- [ ] Add OG images for social sharing
- [ ] Test on mobile devices
- [ ] Set up automated backups

---

## 📊 Monitoring & Maintenance

### Check Logs

```bash
vercel logs <deployment-url>
```

### Database Backup

1. Vercel Dashboard → Storage → Postgres
2. Klik **Backups** tab
3. Enable automated backups (Pro plan)

**Free tier**: Export manual via Prisma Studio

### Update Deployment

Setiap kali push ke GitHub, Vercel otomatis deploy:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## 💰 Cost Estimate

**Vercel Hobby Plan** (FREE):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

**Vercel Postgres** (FREE):
- ✅ 256 MB storage
- ✅ 60 hours compute time/month
- ✅ 256 MB data transfer

**Total**: **$0/month** untuk penggunaan sekolah

> [!TIP]
> Untuk production dengan traffic tinggi, upgrade ke Pro plan ($20/month)

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎉 Success!

Aplikasi Anda sekarang live di internet! 🚀

**Next Steps**:
1. Share URL ke tim/pengguna
2. Monitor usage di Vercel Analytics
3. Collect feedback
4. Iterate and improve

---

**Deployment URL**: `https://your-project.vercel.app`

Selamat! Aplikasi YAYASAN DARULHUDA sudah online! 🎊
