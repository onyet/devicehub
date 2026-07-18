import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe2,
  Heart,
  History,
  Home,
  Info,
  Languages,
  Maximize2,
  Minimize2,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Wrench,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import fallbackVendors from "../data/vendors.json";

const api = window.devicehub ?? {
  getVendors: async () => fallbackVendors,
  openExternal: async (url) => window.open(url, "_blank", "noopener,noreferrer"),
  window: {
    minimize: async () => {},
    toggleMaximize: async () => {},
    close: async () => window.close()
  }
};

const languages = [
  { id: "id-ID", short: "ID", label: "Indonesia" },
  { id: "en-US", short: "EN", label: "English US" },
  { id: "zh-CN", short: "中", label: "中文" }
];

const dictionaries = {
  "id-ID": {
    appSubtitle: "Direktori portal resmi",
    unofficial: "Direktori tidak resmi. Bukan afiliasi vendor.",
    home: "Beranda",
    emergency: "Darurat",
    settings: "Pengaturan",
    about: "Tentang",
    recoveryWizard: "Wizard Pemulihan",
    startWizard: "Mulai Wizard",
    headline: "Portal resmi pemulihan perangkat dalam satu aplikasi.",
    supporting: "Pilih vendor, buka portal resminya, lalu ikuti checklist pemulihan lokal.",
    searchVendor: "Cari vendor",
    searchPlaceholder: "Cari Google, Apple, Samsung...",
    vendorDirectory: "Direktori Vendor",
    quickActions: "Aksi Cepat",
    openPortal: "Buka Portal",
    viewDetails: "Detail",
    favorites: "Favorit",
    recent: "Terakhir Dibuka",
    emptyFavorites: "Belum ada favorit.",
    emptyRecent: "Riwayat masih kosong.",
    active: "Aktif",
    needsReview: "Perlu review",
    externalLogin: "Browser eksternal",
    verifiedAt: "Diverifikasi",
    loginMode: "Mode login",
    status: "Status",
    officialUrl: "URL resmi",
    category: "Kategori",
    back: "Kembali",
    deviceQuestion: "Perangkat apa yang hilang?",
    chooseBrand: "Pilih merek perangkat",
    android: "Android",
    appleDevice: "iPhone/iPad",
    unsure: "Tidak yakin",
    checklistTitle: "Recovery Checklist",
    checklistSubtitle: "Checklist tersimpan di perangkat ini saja.",
    theme: "Tema",
    language: "Bahasa",
    localData: "Data lokal",
    clearHistory: "Hapus riwayat",
    clearFavorites: "Hapus favorit",
    light: "Terang",
    dark: "Gelap",
    privacyTitle: "Privasi",
    privacyCopy: "DeviceHub tidak meminta akun, tidak membaca lokasi, dan tidak menyimpan kredensial.",
    aboutCopy:
      "DeviceHub adalah direktori tidak resmi menuju portal pemulihan resmi vendor. Semua nama dan merek dagang adalah milik pemegangnya masing-masing.",
    aboutSafety:
      "Portal dibuka melalui browser eksternal secara default untuk menghindari masalah login OAuth di embedded browser.",
    linkHealth: "Kesehatan Link",
    huaweiReview: "Huawei sedang ditandai perlu review karena pemeriksaan otomatis terakhir menerima 502.",
    secureDefaults: "Browser Eksternal",
    localOnly: "Data",
    noTracking: "Backend",
    addFavorite: "Tambah favorit",
    removeFavorite: "Hapus favorit"
  },
  "en-US": {
    appSubtitle: "Official portal directory",
    unofficial: "Unofficial directory. Not affiliated with vendors.",
    home: "Home",
    emergency: "Emergency",
    settings: "Settings",
    about: "About",
    recoveryWizard: "Recovery Wizard",
    startWizard: "Start Wizard",
    headline: "Official device recovery portals in one app.",
    supporting: "Choose a vendor, open its official portal, and follow a local recovery checklist.",
    searchVendor: "Search vendor",
    searchPlaceholder: "Search Google, Apple, Samsung...",
    vendorDirectory: "Vendor Directory",
    quickActions: "Quick Actions",
    openPortal: "Open Portal",
    viewDetails: "Details",
    favorites: "Favorites",
    recent: "Recently Opened",
    emptyFavorites: "No favorites yet.",
    emptyRecent: "No recent portals yet.",
    active: "Active",
    needsReview: "Needs review",
    externalLogin: "External browser",
    verifiedAt: "Verified",
    loginMode: "Login mode",
    status: "Status",
    officialUrl: "Official URL",
    category: "Category",
    back: "Back",
    deviceQuestion: "Which device is missing?",
    chooseBrand: "Choose the device brand",
    android: "Android",
    appleDevice: "iPhone/iPad",
    unsure: "Not sure",
    checklistTitle: "Recovery Checklist",
    checklistSubtitle: "This checklist is stored only on this device.",
    theme: "Theme",
    language: "Language",
    localData: "Local data",
    clearHistory: "Clear history",
    clearFavorites: "Clear favorites",
    light: "Light",
    dark: "Dark",
    privacyTitle: "Privacy",
    privacyCopy: "DeviceHub does not ask for accounts, read location, or store credentials.",
    aboutCopy:
      "DeviceHub is an unofficial directory for official vendor recovery portals. All names and trademarks belong to their respective owners.",
    aboutSafety:
      "Portals open in the external browser by default to avoid OAuth login issues in embedded browsers.",
    linkHealth: "Link Health",
    huaweiReview: "Huawei is marked for review because the latest automated check received a 502 response.",
    secureDefaults: "External Browser",
    localOnly: "Data",
    noTracking: "Backend",
    addFavorite: "Add favorite",
    removeFavorite: "Remove favorite"
  },
  "zh-CN": {
    appSubtitle: "官方门户目录",
    unofficial: "非官方目录。与厂商没有隶属关系。",
    home: "首页",
    emergency: "紧急",
    settings: "设置",
    about: "关于",
    recoveryWizard: "恢复向导",
    startWizard: "开始向导",
    headline: "一个应用打开官方设备恢复门户。",
    supporting: "选择厂商，打开官方门户，并使用本地恢复清单。",
    searchVendor: "搜索厂商",
    searchPlaceholder: "搜索 Google、Apple、Samsung...",
    vendorDirectory: "厂商目录",
    quickActions: "快捷操作",
    openPortal: "打开门户",
    viewDetails: "详情",
    favorites: "收藏",
    recent: "最近打开",
    emptyFavorites: "暂无收藏。",
    emptyRecent: "暂无历史记录。",
    active: "可用",
    needsReview: "需复核",
    externalLogin: "外部浏览器",
    verifiedAt: "已验证",
    loginMode: "登录模式",
    status: "状态",
    officialUrl: "官方 URL",
    category: "类别",
    back: "返回",
    deviceQuestion: "丢失的是哪种设备？",
    chooseBrand: "选择设备品牌",
    android: "Android",
    appleDevice: "iPhone/iPad",
    unsure: "不确定",
    checklistTitle: "恢复清单",
    checklistSubtitle: "此清单只保存在当前设备。",
    theme: "主题",
    language: "语言",
    localData: "本地数据",
    clearHistory: "清除历史",
    clearFavorites: "清除收藏",
    light: "浅色",
    dark: "深色",
    privacyTitle: "隐私",
    privacyCopy: "DeviceHub 不要求账号，不读取位置，也不保存凭据。",
    aboutCopy: "DeviceHub 是通往官方厂商恢复门户的非官方目录。所有名称和商标均归各自所有者。",
    aboutSafety: "默认使用外部浏览器打开门户，以避免嵌入式浏览器中的 OAuth 登录问题。",
    linkHealth: "链接状态",
    huaweiReview: "Huawei 已标记为需复核，因为最近的自动检查收到 502 响应。",
    secureDefaults: "外部浏览器",
    localOnly: "数据",
    noTracking: "后端",
    addFavorite: "添加收藏",
    removeFavorite: "取消收藏"
  }
};

const checklistItems = [
  {
    id: "ring",
    label: {
      "id-ID": "Bunyikan perangkat dari portal resmi",
      "en-US": "Ring the device from the official portal",
      "zh-CN": "从官方门户让设备响铃"
    }
  },
  {
    id: "lock",
    label: {
      "id-ID": "Kunci perangkat dan tampilkan pesan pemulihan",
      "en-US": "Lock the device and show a recovery message",
      "zh-CN": "锁定设备并显示恢复信息"
    }
  },
  {
    id: "location",
    label: {
      "id-ID": "Cek lokasi terakhir dari portal vendor",
      "en-US": "Check the last known location from the vendor portal",
      "zh-CN": "从厂商门户查看最后位置"
    }
  },
  {
    id: "wipe",
    label: {
      "id-ID": "Hapus data jarak jauh jika perangkat tidak bisa dipulihkan",
      "en-US": "Remote wipe if the device cannot be recovered",
      "zh-CN": "无法找回时远程清除数据"
    }
  },
  {
    id: "sim",
    label: {
      "id-ID": "Blokir kartu SIM ke operator",
      "en-US": "Block the SIM card with the carrier",
      "zh-CN": "联系运营商停用 SIM 卡"
    }
  },
  {
    id: "vendor-password",
    label: {
      "id-ID": "Ganti password akun vendor",
      "en-US": "Change the vendor account password",
      "zh-CN": "更改厂商账号密码"
    }
  },
  {
    id: "email",
    label: {
      "id-ID": "Amankan email utama",
      "en-US": "Secure the primary email account",
      "zh-CN": "保护主邮箱账号"
    }
  },
  {
    id: "finance",
    label: {
      "id-ID": "Cek akses perbankan dan e-wallet",
      "en-US": "Review banking and wallet access",
      "zh-CN": "检查银行和钱包访问权限"
    }
  }
];

const navItems = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "emergency", labelKey: "emergency", icon: ShieldCheck },
  { id: "settings", labelKey: "settings", icon: Settings },
  { id: "about", labelKey: "about", icon: Info }
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
  const [language, setLanguage] = useLocalStorage("devicehub:language", "id-ID");

  const t = dictionaries[language] ?? dictionaries["id-ID"];
  useEffect(() => {
    api.getVendors().then(setVendors).catch(() => setVendors(fallbackVendors));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = language;
  }, [theme, language]);

  const filteredVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return vendors;

    return vendors.filter((vendor) => {
      return [vendor.name, vendor.category, vendor.description, vendor.officialUrl]
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
    <main className="flex min-h-screen flex-col bg-slate-100 text-slate-950 transition dark:bg-neutral-950 dark:text-neutral-50">
      <TitleBar />
      <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-neutral-800">
            <Brand t={t} />
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={route === item.id}
                label={t[item.labelKey]}
                onClick={() => setRoute(item.id)}
              />
            ))}
          </nav>
          <div className="border-t border-slate-200 p-4 dark:border-neutral-800">
            <SecuritySummary t={t} />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 sm:px-6">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="lg:hidden">
                <Brand t={t} compact />
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{t.unofficial}</p>
              </div>
              <div className="no-drag flex items-center gap-2">
                <LanguageSwitch language={language} setLanguage={setLanguage} />
                <button
                  type="button"
                  title={theme === "dark" ? t.light : t.dark}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-8">
            {route === "home" && (
              <HomePage
                t={t}
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
              <WizardPage t={t} vendors={vendors} onBack={() => setRoute("home")} onOpenVendor={openVendor} />
            )}
            {route === "vendor" && selectedVendor && (
              <VendorDetailPage
                t={t}
                vendor={selectedVendor}
                isFavorite={favorites.includes(selectedVendor.id)}
                onBack={() => setRoute("home")}
                onOpenVendor={openVendor}
                onToggleFavorite={toggleFavorite}
              />
            )}
            {route === "emergency" && (
              <EmergencyPage
                t={t}
                checklistItems={checklistItems}
                language={language}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
              />
            )}
            {route === "settings" && (
              <SettingsPage
                t={t}
                theme={theme}
                setTheme={setTheme}
                language={language}
                setLanguage={setLanguage}
                onClearHistory={() => setHistory([])}
                onClearFavorites={() => setFavorites([])}
              />
            )}
            {route === "about" && <AboutPage t={t} />}
          </div>
          <MobileNav t={t} route={route} setRoute={setRoute} />
        </section>
      </div>
    </main>
  );
}

function TitleBar() {
  return (
    <div className="drag-region flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white/96 px-3 dark:border-neutral-800 dark:bg-neutral-950/96">
      <div className="flex min-w-0 items-center gap-2 pl-1">
        <div className="grid size-6 place-items-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <ShieldCheck size={14} strokeWidth={2.4} />
        </div>
        <span className="truncate text-[13px] font-semibold text-slate-700 dark:text-neutral-200">DeviceHub</span>
      </div>
      <div className="no-drag flex items-center gap-1">
        <WindowButton title="Minimize" onClick={api.window.minimize} icon={Minimize2} />
        <WindowButton title="Maximize" onClick={api.window.toggleMaximize} icon={Maximize2} />
        <WindowButton title="Close" onClick={api.window.close} icon={X} danger />
      </div>
    </div>
  );
}

function WindowButton({ title, onClick, icon: Icon, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-md transition ${
        danger
          ? "text-slate-500 hover:bg-red-500 hover:text-white dark:text-neutral-400"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
      }`}
    >
      <Icon size={15} strokeWidth={2.2} />
    </button>
  );
}

function Brand({ t, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? "size-9" : "size-11"} grid shrink-0 place-items-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950`}>
        <ShieldCheck size={compact ? 19 : 22} />
      </div>
      <div className="min-w-0">
        <p className={`${compact ? "text-base" : "text-lg"} font-semibold leading-tight`}>DeviceHub</p>
        <p className="truncate text-xs font-medium text-slate-500 dark:text-neutral-400">{t.appSubtitle}</p>
      </div>
    </div>
  );
}

function NavButton({ item, active, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`flex h-11 w-full items-center justify-between rounded-md px-3 text-sm font-medium transition ${
        active
          ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
          : "text-slate-600 hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
      }`}
    >
      <span className="flex items-center gap-3">
        <item.icon size={18} />
        {label}
      </span>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

function MobileNav({ t, route, setRoute }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-slate-200 bg-white/96 px-2 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/96 lg:hidden">
      {navItems.map((item) => {
        const active = route === item.id;
        return (
          <button
            key={item.id}
            type="button"
            title={t[item.labelKey]}
            onClick={() => setRoute(item.id)}
            className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold ${
              active ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500 dark:text-neutral-400"
            }`}
          >
            <item.icon size={19} strokeWidth={active ? 2.4 : 2} />
            <span className="max-w-full truncate">{t[item.labelKey]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function LanguageSwitch({ language, setLanguage }) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
      <Languages size={16} />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-sm outline-none"
      >
        {languages.map((item) => (
          <option key={item.id} value={item.id}>
            {item.short}
          </option>
        ))}
      </select>
    </label>
  );
}

function HomePage({
  t,
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
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <AlertTriangle size={17} />
            {t.unofficial}
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">{t.headline}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-neutral-300">{t.supporting}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStartWizard}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Wrench size={17} />
              {t.startWizard}
            </button>
            <a
              href="#vendors"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Globe2 size={17} />
              {t.vendorDirectory}
            </a>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <MetricCard label={t.secureDefaults} value="external_only" />
          <MetricCard label={t.localOnly} value="favorites + checklist" />
          <MetricCard label={t.noTracking} value="no credentials" />
        </div>
      </section>

      <section id="vendors" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">{t.vendorDirectory}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">{t.searchVendor}</p>
            </div>
            <label className="flex h-11 w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 md:max-w-sm dark:border-neutral-700 dark:bg-neutral-900">
              <Search size={18} className="text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                t={t}
                vendor={vendor}
                isFavorite={favorites.includes(vendor.id)}
                onOpenDetail={onOpenDetail}
                onOpenVendor={onOpenVendor}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <BookmarkPanel title={t.favorites} vendors={favoriteVendors} empty={t.emptyFavorites} onOpenDetail={onOpenDetail} icon={Heart} />
          <BookmarkPanel title={t.recent} vendors={recentVendors} empty={t.emptyRecent} onOpenDetail={onOpenDetail} icon={History} />
        </div>
      </section>
    </div>
  );
}

function VendorCard({ t, vendor, isFavorite, onOpenDetail, onOpenVendor, onToggleFavorite }) {
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
      <div className="mb-4 flex items-start justify-between gap-3">
        <button type="button" onClick={() => onOpenDetail(vendor.id)} className="min-w-0 text-left">
          <p className="truncate text-lg font-semibold">{vendor.name}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">{vendor.category}</p>
        </button>
        <button
          type="button"
          title={isFavorite ? t.removeFavorite : t.addFavorite}
          onClick={() => onToggleFavorite(vendor.id)}
          className={`grid size-9 shrink-0 place-items-center rounded-md border ${
            isFavorite
              ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950"
              : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          }`}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="min-h-20 text-sm leading-6 text-slate-600 dark:text-neutral-300">{vendor.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-neutral-800">
        <StatusBadge t={t} status={vendor.status} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenDetail(vendor.id)}
            className="h-9 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {t.viewDetails}
          </button>
          <button
            type="button"
            onClick={() => onOpenVendor(vendor)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
          >
            <ExternalLink size={15} />
            {t.openPortal}
          </button>
        </div>
      </div>
    </article>
  );
}

function WizardPage({ t, vendors, onBack, onOpenVendor }) {
  const [deviceType, setDeviceType] = useState("android");
  const choices =
    deviceType === "apple"
      ? vendors.filter((vendor) => vendor.id === "apple")
      : vendors.filter((vendor) => vendor.category === "Android");

  return (
    <div className="max-w-5xl space-y-6">
      <BackButton label={t.back} onBack={onBack} />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-3xl font-semibold">{t.recoveryWizard}</h1>
        <p className="mt-2 text-slate-600 dark:text-neutral-300">{t.deviceQuestion}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["android", t.android],
            ["apple", t.appleDevice],
            ["unsure", t.unsure]
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setDeviceType(id)}
              className={`h-12 rounded-md border text-sm font-semibold ${
                deviceType === id
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.chooseBrand}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(deviceType === "unsure" ? vendors : choices).map((vendor) => (
            <button
              key={vendor.id}
              type="button"
              onClick={() => onOpenVendor(vendor)}
              className="flex min-h-20 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left shadow-sm hover:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="min-w-0">
                <span className="block font-semibold">{vendor.name}</span>
                <span className="mt-1 block truncate text-sm text-slate-500 dark:text-neutral-400">{vendor.officialUrl}</span>
              </span>
              <ExternalLink size={18} className="shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function VendorDetailPage({ t, vendor, isFavorite, onBack, onOpenVendor, onToggleFavorite }) {
  return (
    <div className="max-w-4xl space-y-5">
      <BackButton label={t.back} onBack={onBack} />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{vendor.category}</p>
            <h1 className="mt-1 text-3xl font-semibold">{vendor.name}</h1>
          </div>
          <button
            type="button"
            title={isFavorite ? t.removeFavorite : t.addFavorite}
            onClick={() => onToggleFavorite(vendor.id)}
            className="grid size-10 place-items-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="mt-5 leading-7 text-slate-600 dark:text-neutral-300">{vendor.description}</p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <DetailTerm label={t.loginMode} value={t.externalLogin} />
          <DetailTerm label={t.verifiedAt} value={vendor.lastVerified} />
          <DetailTerm label={t.status} value={vendor.status === "active" ? t.active : t.needsReview} />
          <DetailTerm label={t.officialUrl} value={vendor.officialUrl} />
        </dl>
        <button
          type="button"
          onClick={() => onOpenVendor(vendor)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <ExternalLink size={17} />
          {t.openPortal}
        </button>
      </section>
    </div>
  );
}

function EmergencyPage({ t, checklistItems, language, checkedItems, setCheckedItems }) {
  function toggleItem(itemId) {
    setCheckedItems((items) => (items.includes(itemId) ? items.filter((value) => value !== itemId) : [...items, itemId]));
  }

  return (
    <div className="max-w-4xl space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-3xl font-semibold">{t.checklistTitle}</h1>
        <p className="mt-2 text-slate-600 dark:text-neutral-300">{t.checklistSubtitle}</p>
      </section>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {checklistItems.map((item) => {
          const checked = checkedItems.includes(item.id);
          const label = item.label[language] ?? item.label["id-ID"];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex min-h-14 w-full items-center gap-3 border-b border-slate-100 px-4 text-left last:border-b-0 hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              <CheckCircle2 size={20} className={checked ? "text-emerald-600" : "text-slate-300 dark:text-neutral-600"} />
              <span className={checked ? "text-slate-400 line-through dark:text-neutral-500" : ""}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPage({ t, theme, setTheme, language, setLanguage, onClearHistory, onClearFavorites }) {
  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-3xl font-semibold">{t.settings}</h1>
      <section className="grid gap-4 md:grid-cols-2">
        <SettingBlock title={t.theme} description={theme === "dark" ? t.dark : t.light}>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            {theme === "dark" ? t.dark : t.light}
          </button>
        </SettingBlock>
        <SettingBlock title={t.language} description={languages.find((item) => item.id === language)?.label ?? "Indonesia"}>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none dark:border-neutral-700 dark:bg-neutral-900"
          >
            {languages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </SettingBlock>
      </section>
      <SettingBlock title={t.localData} description={t.privacyCopy}>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onClearHistory} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
            {t.clearHistory}
          </button>
          <button type="button" onClick={onClearFavorites} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
            {t.clearFavorites}
          </button>
        </div>
      </SettingBlock>
      <SettingBlock title={t.linkHealth} description={t.huaweiReview} />
    </div>
  );
}

function AboutPage({ t }) {
  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-3xl font-semibold">{t.about}</h1>
      <section className="rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        <p>{t.aboutCopy}</p>
        <p className="mt-4">{t.aboutSafety}</p>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard label={t.secureDefaults} value="shell.openExternal" />
        <MetricCard label={t.localOnly} value="localStorage" />
        <MetricCard label={t.noTracking} value="no backend" />
      </section>
    </div>
  );
}

function SecuritySummary({ t }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-semibold">{t.privacyTitle}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-neutral-400">{t.privacyCopy}</p>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold">{value}</p>
    </div>
  );
}

function BookmarkPanel({ title, vendors, empty, onOpenDetail, icon: Icon }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-12 items-center gap-2 border-b border-slate-100 px-4 dark:border-neutral-800">
        <Icon size={17} />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {vendors.length === 0 && <p className="px-4 py-5 text-sm text-slate-500 dark:text-neutral-400">{empty}</p>}
      {vendors.map((vendor) => (
        <button
          key={vendor.id}
          type="button"
          onClick={() => onOpenDetail(vendor.id)}
          className="flex min-h-14 w-full items-center justify-between border-b border-slate-100 px-4 text-left last:border-b-0 hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
        >
          <span className="font-medium">{vendor.name}</span>
          <span className="text-sm text-slate-500 dark:text-neutral-400">{vendor.category}</span>
        </button>
      ))}
    </section>
  );
}

function DetailTerm({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-3 dark:bg-neutral-950">
      <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-neutral-500">{label}</dt>
      <dd className="mt-1 break-words text-slate-800 dark:text-neutral-200">{value}</dd>
    </div>
  );
}

function SettingBlock({ title, description, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold">{title}</p>
          {description && <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-neutral-400">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function BackButton({ label, onBack }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      <ArrowLeft size={17} />
      {label}
    </button>
  );
}

function StatusBadge({ t, status }) {
  const isActive = status === "active";

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      }`}
    >
      {isActive ? t.active : t.needsReview}
    </span>
  );
}
