import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Heart,
  Home,
  Info,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import fallbackVendors from "../data/vendors.json";

const api = window.devicehub ?? {
  getVendors: async () => fallbackVendors,
  openExternal: async (url) => window.open(url, "_blank", "noopener,noreferrer")
};

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "emergency", label: "Darurat", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "about", label: "Tentang", icon: Info }
];

const checklistItems = [
  "Bunyikan perangkat dari portal resmi",
  "Kunci perangkat dan tampilkan pesan pemulihan",
  "Cek lokasi terakhir dari portal vendor",
  "Hapus data jarak jauh jika perangkat tidak bisa dipulihkan",
  "Blokir kartu SIM ke operator",
  "Ganti password akun vendor",
  "Amankan email utama",
  "Cek akses perbankan dan e-wallet"
];

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [vendors, setVendors] = useState(fallbackVendors);
  const [route, setRoute] = useState("home");
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useLocalStorage("devicehub:favorites", []);
  const [history, setHistory] = useLocalStorage("devicehub:history", []);
  const [checkedItems, setCheckedItems] = useLocalStorage("devicehub:checklist", []);
  const [theme, setTheme] = useLocalStorage("devicehub:theme", "light");

  useEffect(() => {
    api.getVendors().then(setVendors).catch(() => setVendors(fallbackVendors));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const filteredVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return vendors;

    return vendors.filter((vendor) => {
      return [vendor.name, vendor.category, vendor.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, vendors]);

  const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId);

  async function openVendor(vendor) {
    await api.openExternal(vendor.officialUrl);
    setHistory((items) => [vendor.id, ...items.filter((item) => item !== vendor.id)].slice(0, 6));
  }

  function toggleFavorite(vendorId) {
    setFavorites((items) =>
      items.includes(vendorId) ? items.filter((item) => item !== vendorId) : [...items, vendorId]
    );
  }

  function openVendorDetail(vendorId) {
    setSelectedVendorId(vendorId);
    setRoute("vendor");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-zinc-800 dark:bg-zinc-950 lg:block">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded bg-emerald-600 text-white">
              <ShieldCheck size={21} />
            </div>
            <div>
              <p className="text-lg font-semibold">DeviceHub</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Direktori portal resmi</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => setRoute(item.id)}
                className={`flex h-11 w-full items-center gap-3 rounded px-3 text-sm font-medium transition ${
                  route === item.id
                    ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/92 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/92 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={20} />
                DeviceHub
              </div>
              <button
                type="button"
                title="Ubah tema"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="grid size-10 place-items-center rounded border border-slate-200 dark:border-zinc-800"
              >
                <Moon size={18} />
              </button>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {route === "home" && (
              <HomePage
                vendors={vendors}
                filteredVendors={filteredVendors}
                query={query}
                setQuery={setQuery}
                favorites={favorites}
                history={history}
                onStartWizard={() => setRoute("wizard")}
                onOpenDetail={openVendorDetail}
                onOpenVendor={openVendor}
                onToggleFavorite={toggleFavorite}
              />
            )}
            {route === "wizard" && (
              <WizardPage vendors={vendors} onBack={() => setRoute("home")} onOpenVendor={openVendor} />
            )}
            {route === "vendor" && selectedVendor && (
              <VendorDetailPage
                vendor={selectedVendor}
                isFavorite={favorites.includes(selectedVendor.id)}
                onBack={() => setRoute("home")}
                onOpenVendor={openVendor}
                onToggleFavorite={toggleFavorite}
              />
            )}
            {route === "emergency" && (
              <EmergencyPage checkedItems={checkedItems} setCheckedItems={setCheckedItems} />
            )}
            {route === "settings" && (
              <SettingsPage
                theme={theme}
                setTheme={setTheme}
                onClearHistory={() => setHistory([])}
                onClearFavorites={() => setFavorites([])}
              />
            )}
            {route === "about" && <AboutPage />}
          </div>
        </section>
      </div>
    </main>
  );
}

function HomePage({
  vendors,
  filteredVendors,
  query,
  setQuery,
  favorites,
  history,
  onStartWizard,
  onOpenDetail,
  onOpenVendor,
  onToggleFavorite
}) {
  const favoriteVendors = vendors.filter((vendor) => favorites.includes(vendor.id));
  const recentVendors = history.map((id) => vendors.find((vendor) => vendor.id === id)).filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="border-b border-slate-200 pb-7 dark:border-zinc-800">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle size={18} />
          <span>Direktori tidak resmi. Selalu login hanya di portal vendor resmi.</span>
        </div>
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">DeviceHub</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-zinc-300">
              Satu tempat untuk membuka portal resmi pemulihan perangkat saat waktu terasa sempit.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartWizard}
            className="inline-flex h-12 items-center justify-center gap-2 rounded bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Sparkles size={18} />
            Mulai Wizard Pemulihan
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-semibold">Cari Vendor</h2>
          <label className="flex h-11 w-full items-center gap-2 rounded border border-slate-300 bg-white px-3 md:max-w-sm dark:border-zinc-700 dark:bg-zinc-900">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari Google, Apple, Samsung..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              isFavorite={favorites.includes(vendor.id)}
              onOpenDetail={onOpenDetail}
              onOpenVendor={onOpenVendor}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <BookmarkPanel title="Favorit" vendors={favoriteVendors} empty="Belum ada favorit." onOpenDetail={onOpenDetail} />
        <BookmarkPanel title="Perangkat Terbaru" vendors={recentVendors} empty="Riwayat masih kosong." onOpenDetail={onOpenDetail} />
      </section>
    </div>
  );
}

function VendorCard({ vendor, isFavorite, onOpenDetail, onOpenVendor, onToggleFavorite }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <button type="button" onClick={() => onOpenDetail(vendor.id)} className="text-left">
          <p className="text-lg font-semibold">{vendor.name}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{vendor.category}</p>
        </button>
        <button
          type="button"
          title={isFavorite ? "Hapus dari favorit" : "Tambah favorit"}
          onClick={() => onToggleFavorite(vendor.id)}
          className={`grid size-9 shrink-0 place-items-center rounded border ${
            isFavorite
              ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950"
              : "border-slate-200 text-slate-500 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="min-h-16 text-sm leading-6 text-slate-600 dark:text-zinc-300">{vendor.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className={`rounded px-2 py-1 text-xs font-medium ${statusClass(vendor.status)}`}>
          {vendor.status === "active" ? "Aktif" : "Perlu review"}
        </span>
        <button
          type="button"
          onClick={() => onOpenVendor(vendor)}
          className="inline-flex h-10 items-center gap-2 rounded bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950"
        >
          <ExternalLink size={16} />
          Buka
        </button>
      </div>
    </article>
  );
}

function WizardPage({ vendors, onBack, onOpenVendor }) {
  const [deviceType, setDeviceType] = useState("android");
  const choices = deviceType === "apple" ? vendors.filter((vendor) => vendor.id === "apple") : vendors.filter((vendor) => vendor.category === "Android");

  return (
    <div className="max-w-4xl space-y-7">
      <BackButton onBack={onBack} />
      <section>
        <h1 className="text-3xl font-semibold">Wizard Pemulihan</h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-300">Pilih jenis perangkat, lalu buka portal vendor resminya.</p>
      </section>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["android", "Android"],
          ["apple", "iPhone/iPad"],
          ["unsure", "Tidak yakin"]
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setDeviceType(id)}
            className={`h-12 rounded border text-sm font-semibold ${
              deviceType === id
                ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                : "border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {(deviceType === "unsure" ? vendors : choices).map((vendor) => (
          <button
            key={vendor.id}
            type="button"
            onClick={() => onOpenVendor(vendor)}
            className="flex min-h-20 items-center justify-between rounded border border-slate-200 bg-white px-4 text-left hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span>
              <span className="block font-semibold">{vendor.name}</span>
              <span className="mt-1 block text-sm text-slate-500 dark:text-zinc-400">{vendor.officialUrl}</span>
            </span>
            <ExternalLink size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}

function VendorDetailPage({ vendor, isFavorite, onBack, onOpenVendor, onToggleFavorite }) {
  return (
    <div className="max-w-3xl space-y-6">
      <BackButton onBack={onBack} />
      <section className="rounded border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-slate-500 dark:text-zinc-400">{vendor.category}</p>
            <h1 className="mt-1 text-3xl font-semibold">{vendor.name}</h1>
          </div>
          <button
            type="button"
            title={isFavorite ? "Hapus dari favorit" : "Tambah favorit"}
            onClick={() => onToggleFavorite(vendor.id)}
            className="grid size-10 place-items-center rounded border border-slate-200 dark:border-zinc-700"
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="mt-5 leading-7 text-slate-600 dark:text-zinc-300">{vendor.description}</p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <DetailTerm label="Mode login" value={vendor.loginMode === "external_only" ? "Browser eksternal" : "BrowserView terverifikasi"} />
          <DetailTerm label="Terakhir diverifikasi" value={vendor.lastVerified} />
          <DetailTerm label="Status" value={vendor.status === "active" ? "Aktif" : "Perlu review region"} />
          <DetailTerm label="URL resmi" value={vendor.officialUrl} />
        </dl>
        <button
          type="button"
          onClick={() => onOpenVendor(vendor)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <ExternalLink size={17} />
          Buka Portal Resmi
        </button>
      </section>
    </div>
  );
}

function EmergencyPage({ checkedItems, setCheckedItems }) {
  function toggleItem(item) {
    setCheckedItems((items) => (items.includes(item) ? items.filter((value) => value !== item) : [...items, item]));
  }

  return (
    <div className="max-w-3xl space-y-5">
      <section>
        <h1 className="text-3xl font-semibold">Emergency Center</h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-300">Checklist lokal untuk membantu langkah pemulihan tetap runtut.</p>
      </section>
      <div className="rounded border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {checklistItems.map((item) => {
          const checked = checkedItems.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(item)}
              className="flex min-h-14 w-full items-center gap-3 border-b border-slate-100 px-4 text-left last:border-b-0 dark:border-zinc-800"
            >
              <CheckCircle2 size={20} className={checked ? "text-emerald-600" : "text-slate-300 dark:text-zinc-600"} />
              <span className={checked ? "text-slate-400 line-through dark:text-zinc-500" : ""}>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPage({ theme, setTheme, onClearHistory, onClearFavorites }) {
  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <section className="rounded border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Tema</p>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Light atau dark mode lokal.</p>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 px-3 text-sm font-semibold dark:border-zinc-700"
          >
            <Moon size={16} />
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>
      </section>
      <section className="rounded border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-semibold">Data lokal</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={onClearHistory} className="h-10 rounded border border-slate-200 px-3 text-sm font-semibold dark:border-zinc-700">
            Clear History
          </button>
          <button type="button" onClick={onClearFavorites} className="h-10 rounded border border-slate-200 px-3 text-sm font-semibold dark:border-zinc-700">
            Clear Favorites
          </button>
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-3xl font-semibold">Tentang DeviceHub</h1>
      <section className="rounded border border-slate-200 bg-white p-5 leading-7 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        <p>
          DeviceHub adalah direktori tidak resmi untuk portal resmi pemulihan perangkat. Aplikasi ini tidak berafiliasi
          dengan Google, Apple, Samsung, Xiaomi, Huawei, OPPO, atau vendor lain.
        </p>
        <p className="mt-4">
          DeviceHub tidak melacak lokasi, tidak meminta kredensial, dan tidak menggantikan verifikasi resmi vendor.
          Semua portal dibuka melalui browser eksternal secara default.
        </p>
      </section>
    </div>
  );
}

function BookmarkPanel({ title, vendors, empty, onOpenDetail }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <div className="rounded border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {vendors.length === 0 && <p className="px-4 py-5 text-sm text-slate-500 dark:text-zinc-400">{empty}</p>}
        {vendors.map((vendor) => (
          <button
            key={vendor.id}
            type="button"
            onClick={() => onOpenDetail(vendor.id)}
            className="flex min-h-14 w-full items-center justify-between border-b border-slate-100 px-4 text-left last:border-b-0 dark:border-zinc-800"
          >
            <span className="font-medium">{vendor.name}</span>
            <span className="text-sm text-slate-500 dark:text-zinc-400">{vendor.category}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function DetailTerm({ label, value }) {
  return (
    <div className="rounded bg-slate-50 p-3 dark:bg-zinc-950">
      <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words text-slate-800 dark:text-zinc-200">{value}</dd>
    </div>
  );
}

function BackButton({ onBack }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 px-3 text-sm font-semibold dark:border-zinc-700"
    >
      <ArrowLeft size={17} />
      Kembali
    </button>
  );
}

function statusClass(status) {
  if (status === "active") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  }

  return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
}
