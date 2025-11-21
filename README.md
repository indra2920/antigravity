# 🏫 YAYASAN DARULHUDA - School Management System

Sistem Manajemen Sekolah berbasis web untuk YAYASAN DARULHUDA. Aplikasi ini membantu mengelola data siswa, guru, kelas, jadwal, dan absensi dengan mudah dan efisien.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192)

---

## ✨ Features

### 📊 Master Data Management
- **Tingkatan (Levels)**: Kelola tingkat kelas (X, XI, XII)
- **Kelas (Classes)**: Manajemen kelas per tingkat
- **Mata Pelajaran (Subjects)**: Daftar mata pelajaran
- **Guru (Teachers)**: Data lengkap guru dengan foto
- **Siswa (Students)**: Data lengkap siswa dengan foto

### 📅 Scheduling & Attendance
- **Jadwal Pelajaran**: Atur jadwal per kelas
- **Absensi**: Sistem absensi dengan QR Code & Face Recognition
- **Notifikasi WhatsApp**: Kirim notifikasi ke orang tua

### 🎨 UI/UX
- **Modern Design**: Interface yang menarik dan user-friendly
- **Mobile First**: Responsive di semua perangkat
- **Dark Mode Ready**: Siap untuk dark mode
- **Smooth Animations**: Animasi dengan Framer Motion

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- PostgreSQL (untuk production) atau SQLite (untuk development)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/darulhuda-school-system.git
   cd darulhuda-school-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` dan isi `DATABASE_URL`:
   ```env
   # For local development (SQLite)
   DATABASE_URL="file:./dev.db"
   
   # For production (PostgreSQL)
   # DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   
   Buka [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) / [SQLite](https://www.sqlite.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: Custom components with [Lucide Icons](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **QR Code**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Face Recognition**: [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- **Excel Export**: [xlsx](https://www.npmjs.com/package/xlsx)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

---

## 🗂️ Project Structure

```
darulhuda-school-system/
├── app/                      # Next.js App Router
│   ├── master/              # Master data pages
│   │   ├── levels/          # Tingkatan
│   │   ├── classes/         # Kelas
│   │   ├── subjects/        # Mata Pelajaran
│   │   ├── teachers/        # Guru
│   │   └── students/        # Siswa
│   ├── schedule/            # Jadwal pelajaran
│   ├── attendance/          # Absensi
│   └── page.tsx             # Homepage
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── components/              # Reusable components (if any)
└── package.json
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

Aplikasi ini sudah siap untuk di-deploy ke Vercel dengan PostgreSQL database.

**📖 Lihat panduan lengkap**: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deploy**:

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Setup Vercel Postgres database
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/darulhuda-school-system)

---

## 📝 Database Schema

```prisma
model Level {
  id      Int      @id @default(autoincrement())
  name    String   // X, XI, XII
  classes Class[]
}

model Class {
  id       Int       @id @default(autoincrement())
  name     String    // IPA 1, IPS 2
  levelId  Int
  level    Level     @relation(fields: [levelId], references: [id], onDelete: Cascade)
  students Student[]
}

model Subject {
  id       Int       @id @default(autoincrement())
  name     String    // Matematika, Fisika, etc
  teachers Teacher[]
}

model Teacher {
  id        Int        @id @default(autoincrement())
  name      String
  nip       String     @unique
  photo     String?
  subjectId Int?
  subject   Subject?   @relation(fields: [subjectId], references: [id])
}

model Student {
  id          Int      @id @default(autoincrement())
  name        String
  nis         String   @unique
  photo       String?
  classId     Int
  class       Class    @relation(fields: [classId], references: [id])
  parentPhone String
}
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database Commands

```bash
npx prisma studio           # Open Prisma Studio (GUI)
npx prisma generate         # Generate Prisma Client
npx prisma db push          # Push schema to database
npx prisma migrate dev      # Create migration
npx prisma migrate deploy   # Apply migrations (production)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed with ❤️ for YAYASAN DARULHUDA

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:

- 📧 Email: support@darulhuda.sch.id
- 📱 WhatsApp: +62 xxx xxxx xxxx
- 🌐 Website: https://darulhuda.sch.id

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment Platform
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Made with 💚 for Education**
