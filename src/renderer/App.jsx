import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Grid2X2,
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
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import appleLogo from "../../icons/apple-logo-svgrepo-com.svg";
import googleLogo from "../../icons/google-icon-logo-svgrepo-com.svg";
import huaweiLogo from "../../icons/huawei.svg";
import oppoLogo from "../../icons/OPPO_logo.svg";
import samsungLogo from "../../icons/samsung-s-svgrepo-com.svg";
import xiaomiLogo from "../../icons/xiaomi-mi-logo-icon.svg";
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
    directory: "Direktori Vendor",
    emergency: "Darurat",
    settings: "Pengaturan",
    about: "Tentang",
    recoveryWizard: "Wizard Pemulihan",
    startWizard: "Mulai Wizard",
    headline: "Cari perangkat yang hilang?",
    supporting: "Akses cepat ke portal resmi dari semua vendor.",
    searchVendor: "Cari vendor",
    searchPlaceholder: "Cari Google, Apple, Samsung...",
    vendorDirectory: "Direktori Vendor",
    quickActions: "Aksi Cepat",
    openPortal: "Buka Portal",
    viewDetails: "Detail",
    favorites: "Favorit",
    checklist: "Checklist",
    history: "Riwayat",
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
    trustTitle: "Aman & Resmi",
    trustCopy: "Semua portal adalah situs resmi dari masing-masing vendor.",
    learnMore: "Pelajari lebih lanjut",
    learnTitle: "Tentang portal resmi",
    learnIntro:
      "DeviceHub hanya membantu membuka portal resmi vendor. Proses login, verifikasi, pelacakan, penguncian, dan penghapusan data tetap dilakukan di situs vendor.",
    learnPointOfficial: "Link vendor dicek dari sumber resmi dan dibuka sebagai halaman HTTPS.",
    learnPointExternal: "Portal dibuka di browser eksternal agar alur login vendor tetap normal.",
    learnPointLocal: "Favorit, riwayat, dan checklist tersimpan lokal di perangkat ini.",
    learnPointNoAccount: "DeviceHub tidak meminta akun baru, password, OTP, atau akses lokasi.",
    addFavorite: "Tambah favorit",
    removeFavorite: "Hapus favorit"
  },
  "en-US": {
    appSubtitle: "Official portal directory",
    unofficial: "Unofficial directory. Not affiliated with vendors.",
    home: "Home",
    directory: "Vendor Directory",
    emergency: "Emergency",
    settings: "Settings",
    about: "About",
    recoveryWizard: "Recovery Wizard",
    startWizard: "Start Wizard",
    headline: "Find a missing device?",
    supporting: "Fast access to official portals from every listed vendor.",
    searchVendor: "Search vendor",
    searchPlaceholder: "Search Google, Apple, Samsung...",
    vendorDirectory: "Vendor Directory",
    quickActions: "Quick Actions",
    openPortal: "Open Portal",
    viewDetails: "Details",
    favorites: "Favorites",
    checklist: "Checklist",
    history: "History",
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
    trustTitle: "Official Portals",
    trustCopy: "Each portal links to the vendor's official website.",
    learnMore: "Learn more",
    learnTitle: "About official portals",
    learnIntro:
      "DeviceHub only helps open official vendor portals. Login, verification, tracking, locking, and remote wipe remain inside the vendor website.",
    learnPointOfficial: "Vendor links are checked against official HTTPS destinations.",
    learnPointExternal: "Portals open in the external browser so vendor login flows work normally.",
    learnPointLocal: "Favorites, history, and checklist progress stay local on this device.",
    learnPointNoAccount: "DeviceHub does not ask for a new account, password, OTP, or location access.",
    addFavorite: "Add favorite",
    removeFavorite: "Remove favorite"
  },
  "zh-CN": {
    appSubtitle: "官方门户目录",
    unofficial: "非官方目录。与厂商没有隶属关系。",
    home: "首页",
    directory: "厂商目录",
    emergency: "紧急",
    settings: "设置",
    about: "关于",
    recoveryWizard: "恢复向导",
    startWizard: "开始向导",
    headline: "查找丢失的设备？",
    supporting: "快速访问已列厂商的官方门户。",
    searchVendor: "搜索厂商",
    searchPlaceholder: "搜索 Google、Apple、Samsung...",
    vendorDirectory: "厂商目录",
    quickActions: "快捷操作",
    openPortal: "打开门户",
    viewDetails: "详情",
    favorites: "收藏",
    checklist: "清单",
    history: "历史",
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
    trustTitle: "官方门户",
    trustCopy: "每个入口都指向对应厂商的官方网站。",
    learnMore: "了解更多",
    learnTitle: "关于官方门户",
    learnIntro: "DeviceHub 只帮助打开厂商官方门户。登录、验证、定位、锁定和远程清除仍在厂商网站内完成。",
    learnPointOfficial: "厂商链接会按官方 HTTPS 地址进行检查。",
    learnPointExternal: "门户默认在外部浏览器打开，以保持厂商登录流程正常。",
    learnPointLocal: "收藏、历史记录和清单进度只保存在本设备。",
    learnPointNoAccount: "DeviceHub 不要求新账号、密码、OTP 或位置权限。",
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
  { id: "directory", labelKey: "directory", icon: Grid2X2 },
  { id: "emergency", labelKey: "checklist", icon: ClipboardCheck },
  { id: "favorites", labelKey: "favorites", icon: Heart },
  { id: "history", labelKey: "history", icon: History },
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
    <main className="flex h-screen overflow-hidden bg-white text-slate-950 transition dark:bg-neutral-950 dark:text-neutral-50">
      <aside className="hidden w-[316px] shrink-0 border-r border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:flex lg:flex-col">
        <div className="drag-region flex h-16 items-center px-7">
          <div className="no-drag">
            <Brand t={t} />
          </div>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-7">
          {navItems.map((item, index) => (
            <div key={item.id}>
              <NavButton
                item={item}
                active={route === item.id}
                label={t[item.labelKey]}
                onClick={() => setRoute(item.id)}
              />
              {index === 4 && <div className="my-6 h-px bg-slate-200 dark:bg-neutral-800" />}
            </div>
          ))}
        </nav>
        <div className="px-7 pb-7">
          <SecuritySummary t={t} />
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="drag-region flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950 sm:px-6 lg:px-12">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="no-drag lg:hidden">
              <Brand t={t} compact />
            </div>
            <div className="hidden lg:block" />
            <div className="no-drag flex items-center gap-2">
              <LanguageSwitch language={language} setLanguage={setLanguage} />
              <button
                type="button"
                title={theme === "dark" ? t.light : t.dark}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="grid size-9 place-items-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <WindowButton title="Minimize" onClick={api.window.minimize} icon={Minimize2} />
              <WindowButton title="Maximize" onClick={api.window.toggleMaximize} icon={Maximize2} />
              <WindowButton title="Close" onClick={api.window.close} icon={X} />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 pb-24 sm:px-6 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-[1120px]">
            {(route === "home" || route === "directory") && (
              <HomePage
                t={t}
                vendors={vendors}
                filteredVendors={filteredVendors}
                query={query}
                setQuery={setQuery}
                favorites={favorites}
                history={history}
                onStartWizard={() => setRoute("wizard")}
                onLearnMore={() => setRoute("learn")}
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
            {route === "favorites" && (
              <CollectionPage
                title={t.favorites}
                empty={t.emptyFavorites}
                vendors={vendors.filter((vendor) => favorites.includes(vendor.id))}
                onOpenDetail={openVendorDetail}
                onOpenVendor={openVendor}
              />
            )}
            {route === "history" && (
              <CollectionPage
                title={t.history}
                empty={t.emptyRecent}
                vendors={history.map((id) => vendors.find((vendor) => vendor.id === id)).filter(Boolean)}
                onOpenDetail={openVendorDetail}
                onOpenVendor={openVendor}
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
            {route === "learn" && <LearnMorePage t={t} onBack={() => setRoute("home")} />}
          </div>
        </div>
        <MobileNav t={t} route={route} setRoute={setRoute} />
      </section>
    </main>
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
      <DeviceHubMark compact={compact} />
      <div className="min-w-0">
        <p className={`${compact ? "text-base" : "text-lg"} font-semibold leading-tight text-slate-950 dark:text-neutral-50`}>DeviceHub</p>
        {!compact && <p className="sr-only">{t.appSubtitle}</p>}
      </div>
    </div>
  );
}

function DeviceHubMark({ compact = false }) {
  return (
    <div className={`${compact ? "h-7 w-8" : "h-7 w-10"} relative shrink-0`}>
      <div className="absolute left-2 top-0 h-5 w-6 rounded-[7px] bg-slate-950 shadow-sm dark:bg-neutral-100" />
      <div className="absolute left-0 top-2 h-5 w-6 rounded-[7px] bg-slate-950 shadow-sm dark:bg-neutral-100" />
      <div className="absolute left-[5px] top-[13px] size-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-neutral-950" />
      <div className="absolute left-[15px] top-[9px] size-1.5 rounded-full bg-sky-400" />
    </div>
  );
}

function NavButton({ item, active, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-between rounded-lg px-4 text-[15px] font-semibold transition ${
        active
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "text-slate-950 hover:bg-slate-50 dark:text-neutral-100 dark:hover:bg-neutral-900"
      }`}
    >
      <span className="flex items-center gap-3">
        <item.icon size={21} strokeWidth={active ? 2.2 : 2} />
        {label}
      </span>
    </button>
  );
}

function MobileNav({ t, route, setRoute }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-7 border-t border-slate-200 bg-white/96 px-1 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/96 lg:hidden">
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
    <label className="flex h-9 items-center gap-2 rounded-md px-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-900">
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
  filteredVendors,
  query,
  setQuery,
  onLearnMore,
  onOpenDetail,
  onOpenVendor
}) {
  const androidVendors = filteredVendors.filter((vendor) => vendor.category === "Android");
  const appleVendors = filteredVendors.filter((vendor) => vendor.category !== "Android");

  return (
    <div className="space-y-9">
      <section className="max-w-4xl">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-normal text-slate-950 dark:text-neutral-50 sm:text-[38px]">
          {t.headline}
        </h1>
        <p className="mt-3 text-base font-medium text-slate-500 dark:text-neutral-400">{t.supporting}</p>
        <label className="mt-7 flex h-[58px] w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] focus-within:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-950">
          <Search size={22} className="shrink-0 text-slate-900 dark:text-neutral-100" strokeWidth={2} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </label>
      </section>

      {androidVendors.length > 0 && (
        <VendorSection title={t.android}>
          {androidVendors.map((vendor) => (
            <VendorCard key={vendor.id} t={t} vendor={vendor} onOpenDetail={onOpenDetail} onOpenVendor={onOpenVendor} />
          ))}
        </VendorSection>
      )}

      {appleVendors.length > 0 && (
        <VendorSection title="Apple">
          {appleVendors.map((vendor) => (
            <VendorCard key={vendor.id} t={t} vendor={vendor} onOpenDetail={onOpenDetail} onOpenVendor={onOpenVendor} />
          ))}
        </VendorSection>
      )}

      <section className="flex min-h-[92px] items-center justify-between gap-5 rounded-xl bg-emerald-50/70 px-5 py-4 dark:bg-emerald-950/30 sm:px-7">
        <div className="flex items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
            <ShieldCheck size={23} />
          </div>
          <div>
            <h2 className="font-bold text-slate-950 dark:text-neutral-50">{t.trustTitle}</h2>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-neutral-300">{t.trustCopy}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLearnMore}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
        >
          {t.learnMore}
          <ExternalLink size={16} />
        </button>
      </section>
    </div>
  );
}

function VendorSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-extrabold text-slate-950 dark:text-neutral-50">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function VendorCard({ t, vendor, onOpenDetail, onOpenVendor }) {
  const meta = getVendorPresentation(vendor);

  return (
    <article className="group relative flex min-h-[140px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700">
      <button type="button" onClick={() => onOpenDetail(vendor.id)} className="flex min-w-0 flex-1 items-start gap-5 text-left">
        <VendorLogo meta={meta} />
        <span className="min-w-0 pt-1">
          <span className="block truncate text-[17px] font-extrabold text-slate-950 dark:text-neutral-50">{vendor.name}</span>
          <span className="mt-1 block text-[15px] font-medium text-slate-600 dark:text-neutral-300">{meta.service}</span>
          <span className="mt-2 block max-w-[220px] text-[14px] font-medium leading-6 text-slate-500 dark:text-neutral-400">
            {meta.summary}
          </span>
        </span>
      </button>
      <button
        type="button"
        title={t.openPortal}
        onClick={() => onOpenVendor(vendor)}
        className="absolute right-5 top-5 grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
      >
        <ExternalLink size={20} strokeWidth={1.8} />
      </button>
    </article>
  );
}

function VendorLogo({ meta }) {
  if (meta.logoUrl) {
    return (
      <span className="flex size-12 shrink-0 items-center justify-center">
        <img
          src={meta.logoUrl}
          alt=""
          aria-hidden="true"
          className={`block max-h-10 max-w-11 object-contain ${meta.logoImageClass ?? ""}`}
        />
      </span>
    );
  }

  return (
    <span className={`grid size-12 shrink-0 place-items-center rounded-full text-[25px] font-extrabold ${meta.logoClass}`}>
      {meta.mark}
    </span>
  );
}

function getVendorPresentation(vendor) {
  const summaries = {
    google: {
      service: "Find My Device",
      summary: "Temukan, kunci, atau hapus perangkat Android.",
      mark: "G",
      logoClass: "bg-white text-blue-600",
      logoUrl: googleLogo,
      id: "google"
    },
    samsung: {
      service: "SmartThings Find",
      summary: "Temukan perangkat Galaxy Anda.",
      mark: "S",
      logoClass: "bg-blue-50 text-blue-600 dark:bg-blue-950",
      logoUrl: samsungLogo,
      id: "samsung"
    },
    xiaomi: {
      service: "Xiaomi Cloud",
      summary: "Temukan, kunci, atau hapus perangkat Xiaomi.",
      mark: "mi",
      logoClass: "bg-orange-500 text-white text-[19px]",
      logoUrl: xiaomiLogo,
      id: "xiaomi"
    },
    huawei: {
      service: "Huawei Cloud",
      summary: "Temukan perangkat Huawei Anda.",
      mark: "H",
      logoClass: "bg-red-50 text-red-600 dark:bg-red-950",
      logoUrl: huaweiLogo,
      id: "huawei"
    },
    oppo: {
      service: "OPPO Cloud",
      summary: "Temukan perangkat OPPO Anda.",
      mark: "oppo",
      logoClass: "text-emerald-600",
      logoUrl: oppoLogo,
      logoImageClass: "max-w-14",
      id: "oppo"
    },
    apple: {
      service: "Find My",
      summary: "Temukan perangkat iPhone, iPad, Mac, dan lainnya.",
      mark: "●",
      logoClass: "bg-white text-black dark:bg-neutral-950 dark:text-white",
      logoUrl: appleLogo,
      logoImageClass: "dark:invert",
      id: "apple"
    }
  };

  return summaries[vendor.id] ?? {
    service: vendor.name,
    summary: vendor.description,
    mark: vendor.name.slice(0, 1),
    logoClass: "bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-200",
    id: vendor.id
  };
}

function CollectionPage({ title, empty, vendors, onOpenDetail, onOpenVendor }) {
  return (
    <div className="space-y-6">
      <h1 className="text-[34px] font-extrabold leading-tight tracking-normal text-slate-950 dark:text-neutral-50">{title}</h1>
      {vendors.length === 0 ? (
        <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{empty}</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} t={{ openPortal: title }} vendor={vendor} onOpenDetail={onOpenDetail} onOpenVendor={onOpenVendor} />
          ))}
        </div>
      )}
    </div>
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

function LearnMorePage({ t, onBack }) {
  const points = [
    t.learnPointOfficial,
    t.learnPointExternal,
    t.learnPointLocal,
    t.learnPointNoAccount
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <BackButton label={t.back} onBack={onBack} />
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
        <div className="flex items-start gap-5">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-[30px] font-extrabold leading-tight tracking-normal text-slate-950 dark:text-neutral-50">
              {t.learnTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] font-medium leading-7 text-slate-600 dark:text-neutral-300">
              {t.learnIntro}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {points.map((point) => (
          <div
            key={point}
            className="flex min-h-24 items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-neutral-800 dark:bg-neutral-950"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <p className="text-sm font-medium leading-6 text-slate-600 dark:text-neutral-300">{point}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function SecuritySummary({ t }) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <ShieldCheck size={22} />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-[14px] font-extrabold text-slate-950 dark:text-neutral-50">{t.privacyTitle}</p>
        <p className="mt-1 text-[13px] font-medium leading-5 text-slate-600 dark:text-neutral-400">{t.privacyCopy}</p>
      </div>
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
