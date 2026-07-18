# DeviceHub

DeviceHub adalah aplikasi desktop berbasis Electron untuk membuka portal resmi pemulihan perangkat dan layanan self-check privasi. Aplikasi ini berperan sebagai direktori, bukan alat pelacakan, scraping, atau enumerasi data.

## Fitur Utama

- Direktori portal resmi vendor perangkat.
- Dashboard dengan pencarian vendor.
- Emergency Center berisi checklist pemulihan dan Privacy Check.
- Link eksternal dibuka lewat browser sistem dengan `shell.openExternal()`.
- Tidak ada input yang dikirim ke server DeviceHub.
- UI desktop dengan custom window, custom titlebar, scrollbar konsisten, dan icon dari asset lokal.
- Multi bahasa: Indonesia, English (en-US), dan Chinese (zh-CN).
- Font lokal dari folder `fonts/`.
- Auto updater untuk build packaged melalui GitHub Releases.

## Vendor Saat Ini

| Vendor | Kategori | URL | Status |
| --- | --- | --- | --- |
| Google | Android | `https://www.google.com/android/find` | active |
| Apple | iPhone/iPad | `https://www.icloud.com/find` | active |
| Samsung | Android | `https://smartthingsfind.samsung.com` | active |
| Xiaomi | Android | `https://i.mi.com` | active |
| Huawei | Android | `https://cloud.huawei.com` | needs_review |
| OPPO | Android | `https://cloud.oppo.com/findindex.html` | needs_review |
| Microsoft | Windows | `https://account.microsoft.com/devices` | needs_review |
| Have I Been Pwned | privacy | `https://haveibeenpwned.com` | active |

`needs_review` berarti perlu validasi manual atau pemeriksaan ulang karena hasil otomatis belum stabil, wilayah layanan perlu dicek, atau endpoint memberi respons yang tidak sukses pada link checker.

## Menjalankan Proyek

Pastikan Node.js dan npm sudah tersedia.

```bash
npm install
npm run dev
```

Script `npm run dev` menjalankan Vite dan Electron bersamaan.

## Build

```bash
npm run build
```

Untuk membuat paket aplikasi:

```bash
npm run package
```

Target package mengikuti konfigurasi `electron-builder`:

- macOS: `dmg`
- Windows: `nsis`
- Linux: `AppImage` dan `deb`

## Auto Updater

Auto updater memakai `electron-updater` dengan provider GitHub:

```text
owner: onyet
repo: devicehub
```

Updater aktif hanya saat aplikasi berjalan sebagai packaged build. Di mode development, panel update tetap muncul di Pengaturan tetapi statusnya ditandai nonaktif.

Alur update:

1. Aplikasi packaged otomatis mengecek update beberapa detik setelah dibuka.
2. Jika ada release baru, update diunduh otomatis.
3. Setelah download selesai, pengguna dapat memilih `Restart & pasang` dari halaman Pengaturan.

Untuk publikasi release, gunakan tag versi yang sesuai dengan `version` di `package.json`, lalu unggah artifact hasil `electron-builder` ke GitHub Releases repo `onyet/devicehub`.

## Validasi Link

```bash
npm run check:links
```

Link checker memeriksa domain resmi setiap entri di `src/data/vendors.json`. Beberapa portal vendor bisa mengembalikan status seperti `404`, `405`, `502`, timeout, atau redirect khusus login saat diakses otomatis. Jika itu terjadi, tandai vendor sebagai `needs_review` sampai selesai diverifikasi manual.

## Struktur Penting

```text
src/main/              Electron main process
src/preload/           Preload bridge untuk renderer
src/renderer/          React UI
src/data/vendors.json  Data vendor dan layanan privacy
icons/                 Asset icon aplikasi dan logo vendor
fonts/                 Font lokal aplikasi
scripts/               Helper script, termasuk link checker
```

## Menambah Vendor

1. Tambahkan entri baru ke `src/data/vendors.json`.
2. Pastikan `officialUrl` mengarah ke domain resmi vendor.
3. Tambahkan domain vendor ke `allowedDomains` di `scripts/link_checker.js`.
4. Tambahkan logo ke folder `icons/` bila tersedia.
5. Tambahkan presentasi multi bahasa di `getVendorPresentation()` pada `src/renderer/App.jsx`.
6. Jalankan `npm run build` dan `npm run check:links`.

Contoh prinsip data:

- `category` dipakai untuk grouping dashboard.
- `loginMode` saat ini memakai `external_only`.
- `status` memakai `active` atau `needs_review`.
- Layanan privacy memakai `category: "privacy"` supaya bisa dikelola lewat struktur data yang sama.

## Prinsip Privasi

DeviceHub hanya menautkan ke layanan resmi yang didesain untuk self-check oleh pemilik data. Aplikasi tidak menyediakan form server-side, tidak mengirim input pengguna ke backend DeviceHub, dan tidak mencoba mengambil data dari vendor melalui API tidak resmi.

## Catatan

DeviceHub adalah direktori tidak resmi. Nama, logo, dan merek dagang vendor tetap menjadi milik masing-masing pemegang merek.
