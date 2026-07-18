# DeviceHub Project Plan

## Status Inisiasi

- Blueprint dibaca dari `DeviceHub-Blueprint.md`.
- Fondasi proyek dibuat dengan Electron, React, Vite, TailwindCSS, dan electron-builder.
- Data vendor fallback tersedia di `src/data/vendors.json`.
- UI awal tersedia untuk Home, Wizard, Vendor Detail, Emergency Center, Settings, dan About.
- Portal vendor dibuka via browser eksternal sebagai default aman.
- Link checker awal berjalan; Huawei saat ini mengembalikan 502 dan ditandai perlu review.
- Redesign dashboard profesional dan dukungan multi bahasa awal tersedia untuk Indonesia, English US, dan Chinese.
- Custom frameless window, titlebar aplikasi, mobile nav, dan font lokal Plus Jakarta Sans sudah diterapkan.

## Prinsip Produk

DeviceHub adalah direktori tidak resmi menuju portal pemulihan resmi vendor. Aplikasi tidak melacak lokasi, tidak mengambil kredensial, tidak menggantikan login vendor, dan tidak melakukan script injection ke situs pihak ketiga.

## Milestone 0 — Foundation

- Scaffold Electron main, preload, dan renderer.
- Terapkan `contextIsolation: true`, `nodeIntegration: false`, dan preload API terbatas.
- Siapkan data vendor lokal sebagai fallback.
- Siapkan script link checker awal.
- Verifikasi build renderer.

## Milestone 1 — MVP Pemulihan

- Sempurnakan onboarding wizard berdasarkan jenis perangkat dan merek.
- Tambahkan pencarian vendor lokal yang lebih toleran terhadap alias seperti Redmi, POCO, OnePlus, dan realme.
- Simpan favorit dan recently opened secara lokal.
- Lengkapi Recovery Checklist per insiden, termasuk reset progress.
- Tambahkan disclaimer first-run sebelum pengguna membuka portal vendor.

## Milestone 2 — Data Vendor & Keamanan

- Implementasi fetch vendor list dari URL statis publik dengan cache lokal dan fallback.
- Tambahkan validasi schema untuk data vendor sebelum mengganti cache.
- Buat proses verifikasi manual untuk `loginMode: webview_ok`.
- Tambahkan daftar domain resmi yang diizinkan untuk redirect vendor.
- Jalankan link checker terjadwal di CI.

## Milestone 3 — Lokal Indonesia

- Tambahkan konten operator seluler Indonesia untuk blokir SIM.
- Lengkapi dan review copy multi bahasa untuk Indonesia, English US, dan Chinese.
- Tambahkan deteksi locale tanpa GPS untuk memilih konten regional.
- Review ketersediaan OPPO/OnePlus/realme untuk region target.

## Milestone 4 — Packaging

- Konfigurasi ikon dan metadata aplikasi.
- Packaging Windows NSIS, macOS DMG, Linux AppImage/deb.
- Siapkan code signing Windows.
- Siapkan notarization macOS.
- Buat smoke test instalasi per platform.

## Risiko & Keputusan

- OAuth vendor kemungkinan menolak embedded browser, jadi `external_only` tetap default.
- Nama DeviceHub perlu riset trademark sebelum distribusi publik.
- Logo vendor perlu digunakan hanya untuk identifikasi dan mengikuti prinsip nominative fair use.
- Portal OPPO perlu review regional sebelum status dinaikkan menjadi active.

## Definition of Done v1.0

- Pengguna bisa memilih vendor dari Home atau Wizard.
- Tombol buka selalu menuju URL HTTPS resmi.
- Favorit, riwayat, tema, dan checklist tersimpan lokal.
- Disclaimer unofficial tersedia di About dan first-run.
- Vendor list bisa diperbarui dari sumber statis dengan fallback offline.
- Build dan package berhasil di target platform yang dipilih.
