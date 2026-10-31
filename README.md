# 🌿 EcoIntelligence - Sustainability & Climate Metrics Dashboard

![EcoIntelligence Banner](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**EcoIntelligence** adalah platform dashboard web interaktif yang dirancang untuk memantau, menganalisis, dan melaporkan metrik keberlanjutan lingkungan serta emisi karbon perusahaan secara terpusat dan *real-time*. Proyek ini dikembangkan sebagai bagian dari **Capstone Project IBM SkillsBuild x Hacktiv8** menggunakan metode *vibe coding* dan *Prompt Engineering* berbasis **IBM Bob**.

---

## 📌 Fitur Utama

- **Monitoring Metrik Utama (KPI):** Memantau emisi emisi karbon ($\text{CO}_2$), tingkat penggunaan energi terbarukan, konsumsi air, dan *waste recycling rate*.
- **Visualisasi Data Interaktif:** Grafik tren bulanan dan grafik distribusi limbah berbasis **Chart.js**.
- **Filter Dinamis:** Memantau data berdasarkan filter kawasan (*Region*) dan departemen perusahaan.
- **Manajemen Profil Terintegrasi:** Fitur pembaruan profil pengguna (nama & avatar) yang tersimpan secara persisten menggunakan `localStorage`.
- **Autentikasi Sederhana:** Halaman login terpisah (`login.html`) serta alur *Sign Out* yang aman.
- **Desain Modern & Responsif:** Tampilan UI/UX modern bernuansa keberlanjutan yang dibangun menggunakan **Tailwind CSS**.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6+)
- **Visualisasi Data:** Chart.js
- **Penyimpanan Lokal:** `localStorage` API
- **AI Development Assistant:** IBM Bob (Vibe Coding with 3-Layer Prompt Engineering)

---

## 📂 Struktur Direktori Proyek

```text
Eco-Intelligence/
├── index.html       # Halaman utama (Dashboard)
├── login.html       # Halaman autentikasi login
├── script.js        # Logika aplikasi, grafik Chart.js, & interaktivitas
├── style.css        # Styling kustom & penyesuaian tata letak
└── README.md        # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/username/Eco-Intelligence.git
   ```
2. **Masuk ke direktori proyek:**
   ```bash
   cd Eco-Intelligence
   ```
3. **Jalankan aplikasi:**
   - Buka file `login.html` langsung di browser kamu, atau
   - Gunakan ekstensi **Live Server** di VS Code / IBM Bob dengan mengeklik kanan pada `login.html` lalu pilih **Open with Live Server**.

---

## 🧠 Arsitektur Prompt (IBM Bob)

Proyek ini dibangun melalui pendekatan **3-Layer Prompting**:
1. **Layer 1 (Role & Context):** Mengarahkan AI sebagai *Senior Frontend Engineer* dan *Data Analyst*.
2. **Layer 2 (Task & Requirements):** Mendefinisikan komponen UI, visualisasi data, serta fungsionalitas interaktif secara spesifik.
3. **Layer 3 (Constraints & Output):** Menerapkan standar kode modular, bebas dari *dependency* berat, dan persistensi data berbasis `localStorage`.

---

## 👤 Developed By

**Akfina N.**  
*Capstone Project - IBM SkillsBuild x Hacktiv8*

