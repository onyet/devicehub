# Blueprint — DeviceHub

### *Direktori tidak resmi untuk portal resmi pemulihan perangkat.*

---

## 1. Visi

**DeviceHub** adalah aplikasi desktop yang mengumpulkan portal resmi vendor untuk menemukan perangkat yang hilang, dalam satu antarmuka sederhana.

Bukan aplikasi pelacak. Bukan aplikasi yang mengambil lokasi perangkat. Bukan pengganti layanan resmi.

Ini adalah **direktori tepercaya**, sehingga pengguna tidak perlu mengingat atau mencari URL vendor saat sedang panik — dan tidak salah masuk ke situs phishing yang menyamar sebagai "Find My Device".

> "Buka DeviceHub → pilih vendor → login di situs resmi → selesai."

---

## 2. Filosofi Produk

Saat perangkat hilang, orang biasanya:

* panik
* lupa URL resmi
* mencari lewat Google, berisiko klik iklan/situs palsu
* tidak tahu vendor mana yang menyediakan layanan apa

DeviceHub menghilangkan langkah pencarian itu — bukan menggantikan proses login/verifikasi resmi.

---

## 3. Stack Teknis

* **Electron** (main + preload + renderer)
* **React + TailwindCSS** untuk renderer
* **electron-builder** untuk packaging Windows, macOS, Linux
* Tidak ada backend/server. Data lokal (JSON/SQLite ringan) untuk favorit, riwayat, dan checklist.

### Arsitektur proses

```
src/
  main/
    index.js          // window management, vendor list fetch, IPC handlers
    vendors.js         // logic fetch + cache + fallback lokal
    browserView.js      // buka portal vendor via BrowserView (untuk vendor webview_ok)
  preload/
    index.js           // expose API terbatas: openExternal, getVendors
  renderer/
    App.jsx
    pages/
      Home.jsx
      Wizard.jsx
      VendorDetail.jsx
      Emergency.jsx
      Settings.jsx
      About.jsx
    components/
    hooks/
    theme/
  data/
    vendors.json        // fallback lokal
scripts/
  link_checker.js
assets/
  logos/
  icons/
```

### Prinsip keamanan

* `contextIsolation: true`, `nodeIntegration: false` di semua `BrowserView` yang me-load situs vendor.
* `preload` hanya expose fungsi spesifik (`openExternal(url)`, `getVendors()`) — tidak expose Node API mentah ke renderer atau ke BrowserView.
* Tidak pakai `<webview>` tag (dihindari sesuai rekomendasi tim Electron karena riwayat isu keamanan) — pakai `BrowserView`/`WebContentsView` yang lebih terisolasi.
* Tidak ada modifikasi isi website, tidak ada script injection, tidak ada bypass login — sama persis seperti membuka browser biasa.

---

## 4. Login Mode

Google (dan kemungkinan besar Apple, Samsung, Xiaomi, Huawei) menolak login OAuth di embedded browser/WebView demi keamanan. Karena itu, **default aman untuk semua vendor adalah `external_only`** — tombol "Buka" memanggil `shell.openExternal()` ke browser default sistem. `BrowserView` internal hanya dipakai untuk vendor yang benar-benar terverifikasi bisa login di dalamnya (perlu testing manual per vendor sebelum diaktifkan).

DeviceHub tidak butuh tahu hasil login — hanya perlu mengantar pengguna ke portal yang benar — jadi tidak perlu custom protocol handler atau callback listener.

---

## 5. Daftar Vendor — Hanya yang Punya Portal Resmi Sendiri

Prinsip: vendor hanya ditambahkan kalau benar-benar punya portal web resmi dengan fitur pencarian perangkat yang berfungsi. Kalau tidak ada, lebih baik tidak ditampilkan daripada memberi ekspektasi keliru.

| Vendor | Portal Resmi | Catatan |
|---|---|---|
| Google | Find Hub (dulu bernama Find My Device) — `google.com/android/find` | |
| Apple | Find My / Find Devices — `icloud.com/find` | |
| Samsung | SmartThings Find — `smartthingsfind.samsung.com` | |
| Xiaomi (termasuk Redmi, POCO) | Xiaomi Cloud, fitur Find device — `i.mi.com` (auto-redirect regional, mis. `us.i.mi.com`) | |
| Huawei | HUAWEI Cloud, Find Device — `cloud.huawei.com` | |
| OPPO / OnePlus / realme | Portal bersama satu grup BBK — `cloud.oppo.com/findindex.html` | Halaman ini berorientasi pasar Tiongkok; verifikasi ketersediaan & bahasa di region target sebelum dirilis |

Merek lain (ASUS, Sony, dll.) baru ditambahkan setelah dipastikan punya portal resmi yang berfungsi lewat pengecekan manual — sampai saat itu, tidak ditampilkan.

---

## 6. Model Data Vendor

```js
// vendors.json
{
  id: "google",
  name: "Google",
  category: "Android",
  description: "Find Hub — lacak, kunci, dan hapus perangkat Android.",
  logo: "logos/google.svg",
  officialUrl: "https://www.google.com/android/find",
  loginMode: "external_only",     // webview_ok | external_only
  countryAvailability: ["global"],
  lastVerified: "2026-07-19",
  status: "active"                 // active | needs_review | deprecated
}
```

---

## 7. Sumber Data & Update

* `vendors.json` di-fetch dari lokasi statis publik (mis. GitHub raw) saat online, fallback ke salinan lokal di `data/vendors.json` kalau offline — supaya URL vendor yang berubah tidak butuh rilis ulang aplikasi.
* Field `lastVerified` per vendor untuk proses verifikasi manual berkala.
* Script CI mingguan yang HTTP-check semua `officialUrl` dan melapor kalau ada yang mati atau redirect ke domain tak dikenal.

---

## 8. Onboarding Wizard

Entry point utama — bukan fitur tambahan, karena inilah yang mewujudkan janji "kurangi panik" di Bagian 2.

```
Perangkat apa yang hilang?
○ Android   ○ iPhone/iPad   ○ Tidak yakin

  ↓ Android dipilih

Merek apa?
[Google] [Samsung] [Xiaomi] [Huawei] [OPPO] [OnePlus] [realme]

  ↓ Samsung dipilih

→ Langsung buka Samsung SmartThings Find
→ Sekaligus tampilkan Recovery Checklist yang relevan
```

---

## 9. Home

```
DeviceHub

────────────────────────
[!] Direktori tidak resmi. Bukan afiliasi vendor.
────────────────────────

Baru kehilangan perangkat?
→ [ Mulai Wizard Pemulihan ]

Cari Vendor
  Google · Apple · Samsung · Xiaomi · Huawei
  OPPO · OnePlus · realme

────────────────────────

Darurat
  Recovery Checklist
  Blokir SIM
  Amankan Akun

────────────────────────

Bookmark
  Perangkat Terbaru
  Favorit
```

---

## 10. Vendor Card & Portal (BrowserView / Browser Eksternal)

```
Samsung

Official SmartThings Find
Find, ring, lock, and erase Galaxy devices.

Status login: Buka di browser eksternal
Terakhir diverifikasi: [tanggal]

[ Buka ]
```

Untuk vendor `external_only` (default), tombol "Buka" langsung memanggil browser default sistem — tanpa mencoba BrowserView dulu, menghindari layar error login yang membingungkan pengguna panik.

Untuk vendor `webview_ok` (hanya setelah verifikasi manual):

```
┌─────────────────────────┐
← Kembali

Samsung SmartThings Find
─────────────────────────
(BrowserView)
─────────────────────────
Refresh · Buka di Browser · Salin URL
```

---

## 11. Emergency Center

```
Recovery Checklist
□ Ring perangkat
□ Kunci perangkat
□ Lacak lokasi
□ Hapus data (remote wipe)
□ Blokir kartu SIM ke operator
□ Ganti password akun vendor
□ Amankan akun email
□ Amankan akun perbankan/e-wallet
```

Checklist tersimpan lokal, progres per insiden. Untuk versi Indonesia, blokir SIM butuh nomor call center operator (Telkomsel, Indosat, XL, dll) — bisa jadi konten statis lokal tanpa melanggar prinsip "no data collection".

---

## 12. Bookmark, Riwayat, Pencarian, Pengaturan

* **Bookmark**: Favorit, tersimpan lokal.
* **Riwayat**: Recently Opened, tersimpan lokal.
* **Pencarian**: lokal terhadap `vendors.json` yang sudah di-fetch/cache.
* **Pengaturan**: Light/Dark Mode, Bahasa, Default Browser vs BrowserView (khusus vendor `webview_ok`), Update Daftar Vendor (manual refresh), Clear History/Favorites, Privacy.

---

## 13. Legal & Trademark

Karena aplikasi menampilkan logo dan nama vendor pihak ketiga tanpa afiliasi resmi:

* Disclaimer wajib di halaman **Tentang** dan saat pertama kali buka app: *"DeviceHub adalah direktori tidak resmi. Tidak berafiliasi dengan Google, Apple, Samsung, dll. Semua logo adalah milik pemegang mereknya masing-masing."*
* Logo dipakai apa adanya (tanpa modifikasi), hanya untuk tujuan identifikasi (nominative fair use).
* Riset nama "DeviceHub" sebelum listing di toko aplikasi — nama ini berpotensi bentrok dengan produk lain (termasuk fitur Azure IoT bernama serupa).

---

## 14. Distribusi & Packaging

| Platform | Tooling | Catatan |
|---|---|---|
| Windows | `electron-builder` target `nsis` | Code signing agar tidak kena warning SmartScreen |
| macOS | `electron-builder` target `dmg` + `afterSign` hook (`electron-notarize`) | **Wajib notarization** — tanpa ini Gatekeeper blokir app dari developer tak dikenal |
| Linux | `electron-builder` target `AppImage`/`deb` | Chromium sudah bundled, tidak ada dependency sistem tambahan |

---

## 15. Fitur v1.0

* ✅ Onboarding wizard "perangkat apa yang hilang"
* ✅ Daftar vendor dengan portal resmi terverifikasi
* ✅ Buka portal vendor via browser eksternal (default) atau BrowserView (hanya vendor terverifikasi kompatibel)
* ✅ Fetch vendor list dari sumber statis + fallback lokal
* ✅ Favorit, Riwayat, Pencarian cepat
* ✅ Recovery Checklist per insiden
* ✅ Tema gelap/terang, multi-bahasa
* ✅ Disclaimer trademark & unofficial directory
* ✅ Signing/notarization Windows & macOS

## 16. Roadmap

### v1.1
* Verifikasi vendor tambahan (ASUS, Sony, dll.) — tambahkan hanya jika terbukti punya portal resmi yang berfungsi
* Direktori operator seluler Indonesia untuk blokir SIM
* Dukungan tablet & smartwatch

### v1.2
* Deteksi locale untuk filter ketersediaan vendor otomatis (bukan GPS)
* Status link checker tampil di Settings

### v2.0
* Export/import favorit & riwayat secara lokal (bukan cloud sync milik DeviceHub)
* Dukungan kategori perangkat lebih luas

---

## 17. Nilai Jual

* 🟢 Satu aplikasi untuk semua portal resmi yang benar-benar ada, dengan status login yang sudah diverifikasi.
* 🟢 Mengurangi risiko salah masuk situs tidak resmi saat panik.
* 🟢 Tidak meminta akun tambahan atau kredensial pengguna.
* 🟢 Transparan soal status "unofficial directory".
* 🟢 Data vendor bisa diperbarui tanpa perlu rilis ulang aplikasi.
