import React, { useState, useEffect } from 'react';
import {
  Shield,
  Camera,
  PhoneCall,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Calculator,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Smartphone,
  Mail,
  Grid,
  Maximize2,
  Home as HomeIcon,
  Building2,
  Wrench,
  HelpCircle,
  Cpu,
  Award,
  Clock
} from 'lucide-react';
import {
  BUSINESS_INFO,
  SERVICE_AREAS,
  SEO_CONFIG,
  SERVICES_LIST,
  FAQ_ITEMS,
  LIVE_CAMERA_FEEDS
} from './data/siteContent';
import LeadForm from './components/LeadForm';
import InteractiveConfigurator from './components/InteractiveConfigurator';

const INITIAL_PRODUCTS_FALLBACK = [
  {
    id: 1,
    slug: '4mp-outdoor-bullet-cctv-camera',
    name: '4MP Outdoor Bullet CCTV Camera',
    category: 'Outdoor Bullet',
    resolution: '4MP Super HD',
    badge: 'Best Seller in Puducherry',
    summary:
      'Protect your home and business with a reliable outdoor CCTV camera built for coastal weather in Puducherry.',
    priceRange: '₹2,400 – ₹3,200',
    warranty: '2 Years Manufacturer Warranty',
    ipRating: 'IP67 Weatherproof',
    nightVision: '30m Smart IR / Color Night Vision',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80',
    features: [
      '4MP image resolution (2560 × 1440 Super HD)',
      'Day and night surveillance with automatic IR cut filter',
      'Outdoor weather protection (IP67 — check exact IP rating on datasheet)',
      'High-quality H.265+ video recording',
      'Compatible DVR/NVR (subject to model compatibility)',
      'Suitable for residential and commercial security'
    ],
    suitableFor: ['Homes', 'Shops', 'Offices', 'Warehouses', 'Commercial buildings'],
    availableServices: [
      'CCTV camera supply',
      'Professional installation',
      'DVR/NVR configuration',
      'Mobile viewing setup'
    ]
  }
];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS_FALLBACK);
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [activeCameraFeed, setActiveCameraFeed] = useState(LIVE_CAMERA_FEEDS[0]);
  const [quadViewMode, setQuadViewMode] = useState(false);
  const [nightVisionSim, setNightVisionSim] = useState(false);
  const [selectedArea, setSelectedArea] = useState(SERVICE_AREAS[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [faqCategory, setFaqCategory] = useState('All');

  // Modal state for "Get Your Free CCTV Quotation" from any button
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState({});

  // Dynamically update document title & meta description for SEO
  useEffect(() => {
    const seo = SEO_CONFIG[activePage] || SEO_CONFIG.home;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Fetch products catalog from backend
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const openQuoteWithPrefill = (prefillData = {}) => {
    setQuotePrefill(prefillData);
    setQuoteModalOpen(true);
  };

  const navigateTo = pageKey => {
    setActivePage(pageKey);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const allNavItems = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About Us' },
    { key: 'products', label: 'CCTV Cameras' },
    { key: 'services', label: 'CCTV Installation' },
    { key: 'homeSolutions', label: 'Home CCTV' },
    { key: 'businessSolutions', label: 'Business CCTV' },
    { key: 'repairAmc', label: 'AMC & Repair' },
    { key: 'consultation', label: 'Free Consultation' },
    { key: 'faqPrivacy', label: 'FAQ & Privacy' },
    { key: 'contact', label: 'Contact Us' }
  ];

  const serviceSubPages = [
    {
      key: 'services',
      label: 'All CCTV Installation',
      desc: 'Complete DVR/NVR & Camera Setup',
      icon: Camera
    },
    {
      key: 'homeSolutions',
      label: 'Home CCTV Solutions',
      desc: 'Houses, Villas & Apartments',
      icon: HomeIcon
    },
    {
      key: 'businessSolutions',
      label: 'Business & Shop CCTV',
      desc: 'Retail, Offices & Warehouses',
      icon: Building2
    },
    {
      key: 'repairAmc',
      label: 'AMC & Repair Service',
      desc: 'CCTV, Laptop & PC Troubleshooting',
      icon: Wrench
    }
  ];

  const isServicePageActive = ['services', 'homeSolutions', 'businessSolutions', 'repairAmc'].includes(
    activePage
  );

  const filteredProducts =
    selectedProductCategory === 'All'
      ? products
      : products.filter(p => p.category === selectedProductCategory);

  const filteredFaqs =
    faqCategory === 'All'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter(item => item.category === faqCategory);

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/40 text-slate-900">
      {/* 1. Top Sri Balaji Computers Business Card Bar */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border-b border-sky-400/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex flex-wrap items-center gap-3 text-white">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-rose-900 border border-white/50 text-white font-extrabold tracking-wide text-[11px] shadow-sm whitespace-nowrap">
              GSTE: {BUSINESS_INFO.gstin}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-white/95 font-medium text-xs">
              <MapPin className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              {BUSINESS_INFO.address}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <a
              href={`tel:${BUSINESS_INFO.rawPhone}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-900 hover:bg-rose-800 border border-white/50 font-extrabold text-white transition shadow-sm whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span>{BUSINESS_INFO.phoneFormatted}</span>
            </a>
            <a
              href={`tel:${BUSINESS_INFO.rawAltPhone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-900 hover:bg-rose-800 border border-white/50 font-extrabold text-white transition shadow-sm whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span>{BUSINESS_INFO.altPhoneFormatted}</span>
            </a>
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
                'Hello Sri Balaji Computers (SBC)! I need a CCTV quotation in Puducherry.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 border border-white/50 text-white font-bold transition shadow-sm whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Perfectly Aligned Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Brand Logo + Single-Line Neat Title Block */}
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left group shrink-0"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-md shrink-0 bg-white group-hover:scale-105 transition">
                <img
                  src={BUSINESS_INFO.logoUrl}
                  alt="SBC System Doctor - Sri Balaji Computers Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl font-black tracking-tight text-rose-950 whitespace-nowrap">
                    {BUSINESS_INFO.name}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300 whitespace-nowrap">
                    {BUSINESS_INFO.subHeader}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs font-extrabold text-indigo-900 tracking-wide whitespace-nowrap mt-0.5">
                  {BUSINESS_INFO.specialties} •{' '}
                  <span className="text-orange-600">SBC SYSTEM DOCTOR</span>
                </div>
              </div>
            </button>

            {/* Desktop Primary Navigation (Zero Text Wrapping, Crisp Single-Line Pills) */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activePage === 'home'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => navigateTo('about')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activePage === 'about'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                About Us
              </button>

              <button
                type="button"
                onClick={() => navigateTo('products')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activePage === 'products'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                CCTV Cameras
              </button>

              {/* Interactive Services & Solutions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isServicePageActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  <span>Services & Solutions</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      servicesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {servicesDropdownOpen && (
                  <div className="absolute left-0 top-full pt-2 w-72 z-50">
                    <div className="bg-white border-2 border-sky-200 rounded-2xl shadow-xl p-2 space-y-1">
                      {serviceSubPages.map(sub => {
                        const IconComp = sub.icon;
                        const active = activePage === sub.key;
                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => navigateTo(sub.key)}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                              active
                                ? 'bg-sky-600 text-white'
                                : 'hover:bg-sky-50 text-slate-800'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg shrink-0 ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-sky-100 text-sky-700'
                              }`}
                            >
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-extrabold">{sub.label}</div>
                              <div
                                className={`text-[11px] ${
                                  active ? 'text-sky-100' : 'text-slate-500'
                                }`}
                              >
                                {sub.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigateTo('consultation')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activePage === 'consultation'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                Cost Calculator
              </button>

              <button
                type="button"
                onClick={() => navigateTo('faqPrivacy')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activePage === 'faqPrivacy'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                FAQ & Privacy
              </button>

              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activePage === 'contact'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                Contact Us
              </button>
            </nav>

            {/* Primary Header CTA (Single Line, Properly Aligned) */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openQuoteWithPrefill({})}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-rose-600 to-fuchsia-600 hover:from-orange-400 hover:to-fuchsia-500 text-white text-xs font-extrabold py-2.5 px-4 rounded-xl shadow-md transition whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Free CCTV Quote</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Interactive Quick-Access Solution Strip (Desktop Sub-Bar) */}
          <div className="hidden lg:flex items-center justify-between py-2 border-t border-sky-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Solutions:
              </span>
              {serviceSubPages.map(item => {
                const IconComp = item.icon;
                const active = activePage === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigateTo(item.key)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
                      active
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 text-sky-600" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Same-Day Site Inspection in Puducherry
              </span>
              <button
                type="button"
                onClick={() => navigateTo('consultation')}
                className="text-sky-700 hover:underline font-bold"
              >
                Calculate Camera & HDD Cost →
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-sky-200 px-4 pt-3 pb-5 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {allNavItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigateTo(item.key)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activePage === item.key
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteWithPrefill({});
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-fuchsia-600 text-white text-xs font-bold shadow-md"
            >
              Get Your Free CCTV Quotation
            </button>
          </div>
        )}
      </header>

      {/* Main Page View Router */}
      <main className="flex-1">
        {/* ==================== 1. HOMEPAGE ==================== */}
        {activePage === 'home' && (
          <div className="space-y-16 pb-20">
            {/* Hero Section Styled after Sri Balaji Computers Business Card */}
            <section className="relative overflow-hidden pt-8 pb-14 lg:py-14 sbc-hero-gradient border-b border-sky-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  {/* Left Hero Copy Inspired by the Business Card */}
                  <div className="lg:col-span-6 space-y-5">
                    {/* Business Card Identity Pill */}
                    <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-300 text-sky-900 text-xs font-extrabold shadow-sm">
                      <img
                        src={BUSINESS_INFO.logoUrl}
                        alt="SBC"
                        className="w-5 h-5 rounded-full border border-orange-500"
                      />
                      <span>SBC • SYSTEM DOCTOR • MUDALIARPET, PUDUCHERRY</span>
                    </div>

                    {/* Cleanly Aligned Business Card Title Block */}
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-rose-950 sbc-title-shadow">
                          {BUSINESS_INFO.name}
                        </h1>
                        <span className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white font-black tracking-wider text-xs sm:text-sm uppercase shadow-sm whitespace-nowrap">
                          {BUSINESS_INFO.subHeader}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-base sm:text-xl font-black text-indigo-950">
                        <span>{BUSINESS_INFO.specialties}</span>
                        <span className="text-sky-400">•</span>
                        <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-800 bg-white/80 px-2.5 py-0.5 rounded-md border border-sky-200">
                          HARDWARE <span className="text-red-600">/</span> SOFTWARES{' '}
                          <span className="text-red-600">/</span> AMC
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      Smart CCTV Security Solutions for Your Home & Business in Puducherry
                    </h2>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      Protect your property, family and business with reliable CCTV camera systems, neat concealed installation, mobile live-view setup, and complete Laptop & Computer support.
                    </p>

                    {/* Primary Hero CTA Card */}
                    <div className="bg-white border-2 border-sky-300 rounded-2xl p-5 space-y-4 shadow-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            Get Your Free CCTV Quotation
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                            Share your security requirements. Our team will recommend the best camera & DVR/NVR package for your budget.
                          </p>
                        </div>
                        <span className="hidden sm:inline-block shrink-0 px-3 py-1 rounded-lg bg-indigo-900 text-white font-black italic text-xs shadow-sm whitespace-nowrap">
                          Best Service
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => openQuoteWithPrefill({ serviceRequired: 'New installation' })}
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition text-xs sm:text-sm whitespace-nowrap"
                        >
                          <PhoneCall className="w-4 h-4 shrink-0" />
                          <span>Request Callback</span>
                        </button>
                        <a
                          href={`tel:${BUSINESS_INFO.rawPhone}`}
                          className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition text-xs sm:text-sm whitespace-nowrap"
                        >
                          <PhoneCall className="w-4 h-4 shrink-0" />
                          <span>{BUSINESS_INFO.phoneFormatted}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => navigateTo('consultation')}
                          className="inline-flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold py-3 px-4 rounded-xl transition text-xs sm:text-sm whitespace-nowrap"
                        >
                          <Calculator className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>Price Calculator</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Interactive Live CCTV Monitor Preview (Single / Quad-Grid Switcher) */}
                  <div className="lg:col-span-6">
                    <div className="bg-white border-2 border-sky-300 rounded-3xl p-4 sm:p-5 shadow-xl">
                      {/* Monitor Control Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 border border-red-300 text-red-700 text-xs font-mono font-bold">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                            LIVE NVR MONITOR
                          </span>
                          <span className="hidden sm:inline text-xs font-mono font-semibold text-slate-600">
                            {activeCameraFeed.resolution}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQuadViewMode(!quadViewMode)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                              quadViewMode
                                ? 'bg-sky-600 border-sky-600 text-white'
                                : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
                            }`}
                          >
                            {quadViewMode ? (
                              <>
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Single View</span>
                              </>
                            ) : (
                              <>
                                <Grid className="w-3.5 h-3.5" />
                                <span>Quad Grid</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setNightVisionSim(!nightVisionSim)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                              nightVisionSim
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100'
                            }`}
                          >
                            {nightVisionSim ? '🌙 Night IR' : '☀️ Day ColorVu'}
                          </button>
                        </div>
                      </div>

                      {/* Camera Viewport: Quad Grid Mode vs Single Channel Mode */}
                      {quadViewMode ? (
                        <div className="grid grid-cols-2 gap-2 aspect-video bg-slate-950 p-2 rounded-2xl border border-sky-200">
                          {[...LIVE_CAMERA_FEEDS, LIVE_CAMERA_FEEDS[0]].map((feed, idx) => (
                            <button
                              key={`${feed.id}-${idx}`}
                              type="button"
                              onClick={() => {
                                setActiveCameraFeed(feed);
                                setQuadViewMode(false);
                              }}
                              className="relative rounded-xl overflow-hidden border border-slate-700 group text-left"
                            >
                              <img
                                src={feed.image}
                                onError={e => {
                                  e.currentTarget.src = feed.fallbackImage;
                                }}
                                alt={feed.label}
                                className={`w-full h-full object-cover group-hover:scale-105 transition ${
                                  nightVisionSim ? 'grayscale contrast-125 brightness-90' : ''
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2 flex flex-col justify-between">
                                <span className="self-start text-[10px] font-mono font-bold bg-slate-950/80 text-emerald-400 px-1.5 py-0.5 rounded">
                                  CH 0{idx + 1}
                                </span>
                                <span className="text-[10px] font-semibold text-white truncate">
                                  {feed.type} (Click to Expand)
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-sky-200 aspect-video shadow-inner">
                          <img
                            src={activeCameraFeed.image}
                            onError={e => {
                              e.currentTarget.src = activeCameraFeed.fallbackImage;
                            }}
                            alt={activeCameraFeed.label}
                            className={`w-full h-full object-cover transition duration-500 ${
                              nightVisionSim ? 'grayscale contrast-125 brightness-90' : ''
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 p-3.5 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2 text-xs font-mono">
                              <span className="bg-white/95 border border-sky-300 px-2.5 py-1 rounded text-emerald-700 font-bold shadow-sm truncate">
                                {activeCameraFeed.label}
                              </span>
                              <span className="bg-white/95 border border-sky-300 px-2.5 py-1 rounded text-slate-800 font-bold shadow-sm whitespace-nowrap">
                                {activeCameraFeed.type}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs bg-sky-600/95 backdrop-blur px-3 py-1 rounded-lg text-white font-semibold shadow">
                                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                                <span>Mobile View • {activeCameraFeed.aiAlert}</span>
                              </span>
                              <span className="text-[11px] font-mono text-rose-900 bg-white/95 px-2.5 py-1 rounded border border-sky-300 font-extrabold shadow-sm">
                                SBC • 7200113344
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Camera Channel Switcher Buttons */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {LIVE_CAMERA_FEEDS.map((feed, idx) => (
                          <button
                            key={feed.id}
                            type="button"
                            onClick={() => {
                              setActiveCameraFeed(feed);
                              setQuadViewMode(false);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition ${
                              activeCameraFeed.id === feed.id && !quadViewMode
                                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                                : 'bg-sky-50/70 border-sky-200 text-slate-700 hover:bg-sky-100'
                            }`}
                          >
                            <div
                              className={`text-[11px] font-mono font-bold ${
                                activeCameraFeed.id === feed.id && !quadViewMode
                                  ? 'text-yellow-300'
                                  : 'text-sky-700'
                              }`}
                            >
                              CAM 0{idx + 1}
                            </div>
                            <div className="text-xs font-bold truncate">{feed.type}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Digital Business Card Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="sbc-card-gradient border-2 border-sky-300 rounded-3xl p-6 md:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
                  <div className="rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md bg-white">
                    <img
                      src={BUSINESS_INFO.businessCardUrl}
                      alt="Sri Balaji Computers Official Business Card"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={BUSINESS_INFO.logoUrl}
                      alt="SBC Logo"
                      className="w-14 h-14 rounded-full border-2 border-orange-500 shadow-sm bg-white shrink-0"
                    />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                        Official Puducherry Showroom & Service Center
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-rose-950">
                        {BUSINESS_INFO.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Your trusted Puducherry partner for <strong className="text-sky-800">CCTV Camera Sales & Installation</strong>, <strong className="text-fuchsia-800">Laptop & Desktop Computers</strong>, Hardware, Software, and Annual Maintenance Contracts (AMC).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <a
                      href={`tel:${BUSINESS_INFO.rawPhone}`}
                      className="flex items-center gap-3 bg-white hover:bg-sky-50 border border-sky-300 p-3.5 rounded-xl transition shadow-sm"
                    >
                      <PhoneCall className="w-5 h-5 text-orange-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">Primary Mobile / WhatsApp</div>
                        <div className="text-base font-black text-rose-900">
                          {BUSINESS_INFO.phoneFormatted}
                        </div>
                      </div>
                    </a>

                    <a
                      href={`tel:${BUSINESS_INFO.rawAltPhone}`}
                      className="flex items-center gap-3 bg-white hover:bg-sky-50 border border-sky-300 p-3.5 rounded-xl transition shadow-sm"
                    >
                      <PhoneCall className="w-5 h-5 text-sky-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">Alternate Contact</div>
                        <div className="text-base font-black text-rose-900">
                          {BUSINESS_INFO.altPhoneFormatted}
                        </div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="flex items-center gap-3 bg-white hover:bg-sky-50 border border-sky-300 p-3.5 rounded-xl transition shadow-sm"
                    >
                      <Mail className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">Official Email</div>
                        <div className="text-sm font-bold text-slate-900">{BUSINESS_INFO.email}</div>
                      </div>
                    </a>

                    <div className="flex items-center gap-3 bg-white border border-sky-300 p-3.5 rounded-xl shadow-sm">
                      <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">GST Registration</div>
                        <div className="text-sm font-bold text-emerald-700">
                          {BUSINESS_INFO.gstin}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-sky-300 rounded-xl p-3.5 flex items-start gap-3 text-xs shadow-sm">
                    <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Showroom & Service Address:</div>
                      <div className="text-slate-700 font-medium mt-0.5">{BUSINESS_INFO.address}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Our CCTV Services Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                    Complete Surveillance & IT Portfolio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Our CCTV & Computer Services in Puducherry
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('services')}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-600"
                >
                  <span>Explore All Installation & Repair Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SERVICES_LIST.filter(s =>
                  ['home-cctv', 'shop-cctv', 'office-cctv', 'repair-amc'].includes(s.id)
                ).map(service => (
                  <div
                    key={service.id}
                    className="group bg-white border-2 border-sky-100 hover:border-sky-400 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <div>
                      <div className="h-44 overflow-hidden bg-sky-100 relative">
                        <img
                          src={service.image}
                          onError={e => {
                            e.currentTarget.src = service.fallbackImage;
                          }}
                          alt={service.shortTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-sky-800 border border-sky-200 shadow-sm">
                          {service.shortTitle}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                          {service.shortTitle}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-sky-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          openQuoteWithPrefill({
                            propertyType:
                              service.id === 'home-cctv'
                                ? 'Home'
                                : service.id === 'shop-cctv'
                                ? 'Shop'
                                : 'Office',
                            serviceRequired:
                              service.id === 'repair-amc'
                                ? 'CCTV Repair & Troubleshooting'
                                : 'New installation'
                          })
                        }
                        className="text-xs font-extrabold text-sky-700 hover:text-sky-600 inline-flex items-center gap-1"
                      >
                        <span>Request Quotation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Choose Us & Interactive Puducherry Service Areas */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Why Choose Us */}
              <div className="lg:col-span-5 bg-white border-2 border-sky-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    SBC System Doctor Promise
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-6">
                    Why Choose {BUSINESS_INFO.name}?
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Professional installation',
                        desc: 'Trained technicians ensuring neat concealed wiring and zero blind spots.'
                      },
                      {
                        title: 'Solutions based on your budget',
                        desc: 'Transparent options from affordable 2-camera kits to commercial IP systems.'
                      },
                      {
                        title: 'Remote mobile viewing setup',
                        desc: 'Watch live and playback feeds on your smartphone from anywhere.'
                      },
                      {
                        title: 'Technical support & Fast Service',
                        desc: 'Local support in Mudaliarpet & across Puducherry for CCTV, Laptops & PCs.'
                      },
                      {
                        title: 'After-sales service & AMC',
                        desc: 'Dependable warranty handling and Annual Maintenance Contracts (AMC).'
                      }
                    ].map(point => (
                      <div key={point.title} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{point.title}</div>
                          <div className="text-xs text-slate-600">{point.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-sky-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 font-medium">
                    Need help choosing the right camera?
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuoteWithPrefill({ camerasRequired: 'Need guidance' })}
                    className="text-xs font-extrabold text-sky-700 hover:text-sky-600"
                  >
                    Talk to SBC Technician →
                  </button>
                </div>
              </div>

              {/* Interactive Puducherry Service Areas Coverage */}
              <div className="lg:col-span-7 bg-white border-2 border-sky-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                    Fast On-Site Inspection & Installation
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Our Service Areas in Puducherry
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
                    Puducherry, Lawspet, Mudaliarpet, Thengaithittu, Saram, Villianur, Reddiarpalayam and nearby areas, subject to service availability. Click your locality below:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    {SERVICE_AREAS.map(area => {
                      const active = selectedArea.name === area.name;
                      return (
                        <button
                          key={area.name}
                          type="button"
                          onClick={() => setSelectedArea(area)}
                          className={`p-3 rounded-2xl border text-left transition ${
                            active
                              ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                              : 'bg-sky-50/70 border-sky-200 text-slate-800 hover:bg-sky-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <MapPin
                              className={`w-3.5 h-3.5 ${
                                active ? 'text-yellow-300' : 'text-sky-600'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-bold ${
                                active ? 'text-emerald-200' : 'text-emerald-700'
                              }`}
                            >
                              {area.responseTime}
                            </span>
                          </div>
                          <div className="text-xs font-bold mt-1.5 truncate">{area.name}</div>
                          <div
                            className={`text-[10px] ${
                              active ? 'text-sky-100' : 'text-slate-500'
                            }`}
                          >
                            {area.tag}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Locality Highlight Box */}
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-sky-800 font-bold">
                      Selected Locality: {selectedArea.name}
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                      Site Inspection Response: ~{selectedArea.responseTime} • {selectedArea.activeInstallations}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Home, Shop, Office CCTV & Computer service available in {selectedArea.name}.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuoteWithPrefill({ location: selectedArea.name })}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 px-4 rounded-xl transition shadow-sm whitespace-nowrap"
                  >
                    Book Visit in {selectedArea.name}
                  </button>
                </div>
              </div>
            </section>

            {/* Interactive System Configurator Section on Homepage */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <InteractiveConfigurator
                onApplyToQuote={prefillData => openQuoteWithPrefill(prefillData)}
              />
            </section>

            {/* Lead Generation Form Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                  Direct CCTV Supply, Installation & IT Support
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Ready to Secure Your Property in Puducherry?
                </h2>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Contact <strong className="text-slate-900">{BUSINESS_INFO.name} (SBC - System Doctor)</strong> at Mudaliarpet, Puducherry. Get a customized security assessment, genuine cameras with warranty, and neat cabling by our local technicians.
                </p>

                <div className="bg-white border-2 border-sky-200 rounded-2xl p-5 space-y-3 text-xs text-slate-700 shadow-md">
                  <div className="font-extrabold text-slate-900 text-sm">
                    What happens when you submit?
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      1
                    </span>
                    <span>
                      Instant unique Enquiry ID (`SBC-CCTV-2026-XXXX`) generated for your request.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      2
                    </span>
                    <span>Our Sri Balaji Computers specialist reviews your camera & property needs.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                      3
                    </span>
                    <span>
                      Send your enquiry directly to our WhatsApp (`7200113344`) with 1 click.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <LeadForm onNavigatePrivacy={() => navigateTo('faqPrivacy')} />
              </div>
            </section>
          </div>
        )}

        {/* ==================== 2. ABOUT US PAGE ==================== */}
        {activePage === 'about' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
            <div className="bg-white border-2 border-sky-200 rounded-3xl p-8 md:p-12 space-y-6 shadow-md">
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={BUSINESS_INFO.logoUrl}
                  alt="SBC System Doctor Logo"
                  className="w-16 h-16 rounded-full border-2 border-orange-500 shadow-md"
                />
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold">
                    GSTIN: {BUSINESS_INFO.gstin} • Mudaliarpet, Puducherry
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-rose-950 mt-1">
                    About Us – {BUSINESS_INFO.name}
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                Welcome to <strong className="text-slate-900">{BUSINESS_INFO.name} (SBC – System Doctor)</strong>, your trusted CCTV camera, laptop, computer and security solutions provider in Puducherry.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Located at <strong className="text-slate-900">{BUSINESS_INFO.address}</strong>, we help homeowners, shops, offices and commercial establishments improve their security through reliable CCTV camera systems, professional installation services, and complete computer hardware/software support. Our goal is to make security simple, affordable and accessible to everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white border-2 border-sky-200 rounded-3xl p-8 shadow-md">
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">What We Do</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    'CCTV camera sales and installation',
                    'Home and commercial security systems',
                    'Indoor and outdoor CCTV solutions',
                    'DVR and NVR installation',
                    'Mobile phone remote viewing configuration',
                    'CCTV troubleshooting, repair & AMC',
                    'Laptop & Desktop Computer Sales & Service',
                    'Computer Hardware, Software & Networking AMC'
                  ].map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-3 bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl text-sm font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 shadow-md">
                  <h3 className="text-lg font-extrabold text-sky-800 mb-2">Our Mission</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    To provide dependable security and IT solutions that help protect homes, businesses and valuable assets across Puducherry.
                  </p>
                </div>

                <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 shadow-md">
                  <h3 className="text-lg font-extrabold text-emerald-700 mb-2">Our Commitment</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    We focus on understanding each customer&apos;s security requirements and recommending suitable products and installation solutions based on their needs and budget.
                  </p>
                </div>
              </div>
            </div>

            {/* Official Business Card Preview on About Page */}
            <div className="sbc-card-gradient border-2 border-sky-300 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-lg">
              <img
                src={BUSINESS_INFO.businessCardUrl}
                alt="Sri Balaji Computers Business Card"
                className="rounded-2xl border-2 border-white shadow-lg w-full"
              />
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Need CCTV Installation or Computer Service?
                </h3>
                <p className="text-sm text-slate-700">
                  Call us directly on <strong className="text-rose-900">{BUSINESS_INFO.phoneFormatted}</strong> / <strong className="text-rose-900">{BUSINESS_INFO.altPhoneFormatted}</strong> or request an online quotation today.
                </p>
                <button
                  type="button"
                  onClick={() => openQuoteWithPrefill({})}
                  className="bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition text-sm"
                >
                  Get Free CCTV Quotation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. CCTV CAMERAS (PRODUCTS PAGE) ==================== */}
        {activePage === 'products' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                  Target SEO: CCTV Camera Price Puducherry • {BUSINESS_INFO.name}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                  CCTV Cameras & Security Products
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Explore individual camera models and complete DVR/NVR security kits supplied and installed by {BUSINESS_INFO.name}.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'All',
                  'Outdoor Bullet',
                  'Indoor Dome',
                  'AI Color Night IP',
                  'Smart Wi-Fi / PTZ',
                  'Complete Combo Kit'
                ].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedProductCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
                      selectedProductCategory === cat
                        ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                        : 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Flagship Product Spotlight (4MP Outdoor Bullet CCTV Camera) */}
            <div className="bg-white border-2 border-sky-300 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden bg-sky-50 border border-sky-200 aspect-video relative">
                  <img
                    src={products[0]?.image}
                    alt="4MP Outdoor Bullet CCTV Camera"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    Featured Flagship Model
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="text-xs text-sky-700 font-extrabold uppercase">
                    Individual Product Specification Sheet • {BUSINESS_INFO.name}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    4MP Outdoor Bullet CCTV Camera
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Protect your home and business with a reliable outdoor CCTV camera.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                    <div className="font-extrabold text-slate-900 mb-2">Product Features</div>
                    <ul className="space-y-1.5 text-slate-700">
                      <li>• 4MP image resolution</li>
                      <li>• Day and night surveillance</li>
                      <li>• Outdoor weather protection (check exact IP rating)</li>
                      <li>• High-quality video recording</li>
                      <li>• Compatible DVR/NVR (subject to model compatibility)</li>
                      <li>• Suitable for residential & commercial security</li>
                    </ul>
                  </div>

                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                    <div className="font-extrabold text-slate-900 mb-2">Suitable For</div>
                    <ul className="space-y-1.5 text-slate-700">
                      <li>• Homes</li>
                      <li>• Shops</li>
                      <li>• Offices</li>
                      <li>• Warehouses</li>
                      <li>• Commercial buildings</li>
                    </ul>
                  </div>

                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                    <div className="font-extrabold text-slate-900 mb-2">Available Services</div>
                    <ul className="space-y-1.5 text-slate-700">
                      <li>• CCTV camera supply</li>
                      <li>• Professional installation</li>
                      <li>• DVR/NVR configuration</li>
                      <li>• Mobile viewing setup</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-sky-100">
                  <div className="text-[11px] text-slate-500">
                    Note: Exact specifications, warranty and compatibility are confirmed from the manufacturer&apos;s datasheet before installation.
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openQuoteWithPrefill({
                        additionalRequirements:
                          'Interested in 4MP Outdoor Bullet CCTV Camera quotation & installation.'
                      })
                    }
                    className="shrink-0 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-3 px-5 rounded-xl transition shadow-sm whitespace-nowrap"
                  >
                    Need a CCTV Camera Quotation? Contact Us
                  </button>
                </div>
              </div>
            </div>

            {/* All Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white border-2 border-sky-100 hover:border-sky-400 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <div>
                    <div className="h-48 bg-sky-50 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 border border-sky-200 text-sky-800 text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                        {product.resolution}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                        {product.priceRange}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="text-[11px] text-sky-700 font-bold uppercase">
                        {product.category} • {product.ipRating}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900">{product.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{product.summary}</p>

                      <div className="space-y-1.5 pt-2">
                        {(product.features || []).slice(0, 4).map(feat => (
                          <div key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {(product.suitableFor || []).map(place => (
                          <span
                            key={place}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-900"
                          >
                            {place}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-sky-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProductDetail(product)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-bold text-sky-900 transition"
                    >
                      View Specs
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openQuoteWithPrefill({
                          additionalRequirements: `Enquiry for Product: ${product.name} (${product.priceRange})`
                        })
                      }
                      className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition shadow-sm"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. SERVICES HUB / HOME / BUSINESS / REPAIR PAGES ==================== */}
        {['services', 'homeSolutions', 'businessSolutions', 'repairAmc'].includes(activePage) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
            {/* Dynamic Page Hero */}
            <div className="bg-white border-2 border-sky-200 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                  {SEO_CONFIG[activePage]?.keyword} • {BUSINESS_INFO.name}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {activePage === 'homeSolutions' && 'Home CCTV Solutions in Puducherry'}
                  {activePage === 'businessSolutions' &&
                    'Shop & Office Business CCTV Solutions in Puducherry'}
                  {activePage === 'repairAmc' &&
                    'CCTV, Laptop & Computer Repair & AMC in Puducherry'}
                  {activePage === 'services' &&
                    'Professional CCTV Installation & IT Maintenance Services'}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  {SEO_CONFIG[activePage]?.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'services', label: 'All Services' },
                  { key: 'homeSolutions', label: 'Home CCTV' },
                  { key: 'businessSolutions', label: 'Shop & Office' },
                  { key: 'repairAmc', label: 'Repair & AMC' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => navigateTo(tab.key)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
                      activePage === tab.key
                        ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                        : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Sections List */}
            <div className="space-y-8">
              {SERVICES_LIST.filter(s => {
                if (activePage === 'homeSolutions')
                  return s.id === 'home-cctv' || s.id === 'dvr-nvr-installation';
                if (activePage === 'businessSolutions')
                  return (
                    s.id === 'shop-cctv' ||
                    s.id === 'office-cctv' ||
                    s.id === 'dvr-nvr-installation'
                  );
                if (activePage === 'repairAmc')
                  return s.id === 'repair-amc' || s.id === 'dvr-nvr-installation';
                return true;
              }).map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white border-2 border-sky-200 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md"
                >
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="rounded-2xl overflow-hidden bg-sky-50 border border-sky-200 aspect-video">
                      <img
                        src={service.image}
                        onError={e => {
                          e.currentTarget.src = service.fallbackImage;
                        }}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className={`lg:col-span-7 space-y-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold">
                      Target Keyword: {service.keyword}
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">{service.title}</h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.highlights.map(h => (
                        <div
                          key={h}
                          className="flex items-start gap-2.5 bg-sky-50/70 border border-sky-200 p-3 rounded-xl text-xs font-medium text-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Mandatory CTA from Prompt */}
                    <div className="bg-sky-50 border border-sky-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          &ldquo;Need CCTV installation? Contact us today for a quotation and site inspection.&rdquo;
                        </div>
                        <div className="text-xs text-sky-800 font-semibold mt-0.5">
                          Recommended: {service.recommendedPackage}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openQuoteWithPrefill({
                            propertyType:
                              service.id === 'home-cctv'
                                ? 'Home'
                                : service.id === 'shop-cctv'
                                ? 'Shop'
                                : 'Office',
                            serviceRequired:
                              service.id === 'repair-amc'
                                ? 'CCTV Repair & Troubleshooting'
                                : 'New installation',
                            additionalRequirements: `Service Page Enquiry: ${service.title}`
                          })
                        }
                        className="shrink-0 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-3 px-5 rounded-xl transition shadow-sm whitespace-nowrap"
                      >
                        Get Quotation & Site Inspection
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 5. FREE CCTV CONSULTATION PAGE ==================== */}
        {activePage === 'consultation' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
            <InteractiveConfigurator
              onApplyToQuote={prefillData => openQuoteWithPrefill(prefillData)}
            />
            <div className="max-w-3xl mx-auto">
              <LeadForm
                prefill={quotePrefill}
                onNavigatePrivacy={() => navigateTo('faqPrivacy')}
                title="Book Your Free On-Site CCTV Consultation in Puducherry"
                subtitle={`Our ${BUSINESS_INFO.name} technician will visit your home, shop, or office to check camera angles, cabling distance, and provide an exact quotation.`}
              />
            </div>
          </div>
        )}

        {/* ==================== 6. FAQ & PRIVACY POLICY PAGE ==================== */}
        {activePage === 'faqPrivacy' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
            {/* Section 8: Frequently Asked Questions */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                    Got Questions? • {BUSINESS_INFO.name}
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                    Frequently Asked Questions (FAQ)
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['All', 'Pricing', 'Features', 'Services', 'Commercial', 'Repair'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFaqCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        faqCategory === cat
                          ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                          : 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={item.q}
                      className="bg-white border-2 border-sky-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-sky-50/60 transition"
                      >
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-sky-600 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-slate-700 leading-relaxed border-t border-sky-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 9: Privacy Policy */}
            <section className="bg-white border-2 border-sky-200 rounded-3xl p-8 md:p-10 space-y-6 shadow-md">
              <div className="border-b border-sky-100 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Data Protection & Transparency
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Privacy Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Last Updated: {BUSINESS_INFO.lastUpdatedPrivacy}
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                At <strong className="text-slate-900">{BUSINESS_INFO.name} (SBC – System Doctor)</strong>, we respect your privacy and are committed to protecting the personal information you provide through our website.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900">Information We Collect</h3>
                  <ul className="space-y-1 text-slate-700 text-xs">
                    <li>• Name</li>
                    <li>• Mobile number</li>
                    <li>• Location</li>
                    <li>• CCTV & IT service requirements</li>
                    <li>• Other information voluntarily submitted through enquiry forms</li>
                  </ul>
                </div>

                <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900">How We Use Your Information</h3>
                  <ul className="space-y-1 text-slate-700 text-xs">
                    <li>• Respond to CCTV & computer enquiries.</li>
                    <li>• Prepare quotations.</li>
                    <li>• Schedule site visits and installations.</li>
                    <li>• Provide requested technical support.</li>
                    <li>• Communicate about services requested by customers.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div>
                  <h3 className="font-extrabold text-slate-900 mb-1">Information Sharing</h3>
                  <p className="text-xs leading-relaxed">
                    We do not sell customers&apos; personal information. We only share information with service providers when necessary for delivering requested services or when legally required.
                  </p>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 mb-1">
                    Data Security & Separate Marketing Consent
                  </h3>
                  <p className="text-xs leading-relaxed">
                    We take reasonable measures to protect customer information against unauthorized access, disclosure or misuse. Our enquiry forms provide a separate, optional marketing consent checkbox rather than treating a quotation enquiry as permission for ongoing promotions.
                  </p>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 mb-1">Customer Choices</h3>
                  <p className="text-xs leading-relaxed">
                    Customers can contact us to request access, correction or deletion of their information, subject to applicable Indian data-protection and legal requirements.
                  </p>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs space-y-1 text-slate-700">
                  <div className="font-extrabold text-slate-900 mb-1">
                    For privacy-related questions, contact:
                  </div>
                  <div>
                    Business Name: {BUSINESS_INFO.name} (GSTIN: {BUSINESS_INFO.gstin})
                  </div>
                  <div>Email: {BUSINESS_INFO.email}</div>
                  <div>
                    Phone: {BUSINESS_INFO.phone} / {BUSINESS_INFO.altPhone}
                  </div>
                  <div>Address: {BUSINESS_INFO.address}</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== 7. CONTACT US PAGE ==================== */}
        {activePage === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={BUSINESS_INFO.logoUrl}
                      alt="SBC Logo"
                      className="w-12 h-12 rounded-full border-2 border-orange-500"
                    />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                        Target Keyword: CCTV Dealer Near Me
                      </span>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-rose-950">
                        Contact {BUSINESS_INFO.name}
                      </h1>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700">
                    Looking for reliable CCTV camera installation, repair, security solutions, or Laptop/Computer service in Puducherry? Contact our team to discuss your requirements.
                  </p>

                  {/* Business Card Image Preview inside Contact Page */}
                  <div className="rounded-2xl overflow-hidden border-2 border-sky-300 shadow-md">
                    <img
                      src={BUSINESS_INFO.businessCardUrl}
                      alt="Sri Balaji Computers Business Card"
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="space-y-3 pt-2 text-sm">
                    <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500">Business Name</div>
                        <div className="font-extrabold text-slate-900">
                          {BUSINESS_INFO.name} (SBC)
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                        GST: {BUSINESS_INFO.gstin}
                      </span>
                    </div>

                    <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl">
                      <div className="text-xs text-slate-500">Showroom & Office Location</div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
                        {BUSINESS_INFO.address}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`tel:${BUSINESS_INFO.rawPhone}`}
                        className="bg-sky-50/70 border border-sky-200 hover:border-orange-500 p-3.5 rounded-xl block transition"
                      >
                        <div className="text-xs text-slate-500">Primary Mobile & WhatsApp</div>
                        <div className="font-black text-rose-900 text-base">
                          {BUSINESS_INFO.phoneFormatted}
                        </div>
                      </a>
                      <a
                        href={`tel:${BUSINESS_INFO.rawAltPhone}`}
                        className="bg-sky-50/70 border border-sky-200 hover:border-sky-500 p-3.5 rounded-xl block transition"
                      >
                        <div className="text-xs text-slate-500">Secondary Mobile</div>
                        <div className="font-black text-sky-800 text-base">
                          {BUSINESS_INFO.altPhoneFormatted}
                        </div>
                      </a>
                    </div>

                    <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl">
                      <div className="text-xs text-slate-500">Email & Working Hours</div>
                      <div className="font-bold text-slate-900">{BUSINESS_INFO.email}</div>
                      <div className="text-xs text-slate-600 mt-1">{BUSINESS_INFO.workingHours}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sky-100">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      Service Areas
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Mudaliarpet, Thengaithittu, Puducherry Town, Lawspet, Saram, Villianur, Reddiarpalayam and nearby locations, subject to availability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <LeadForm
                  onNavigatePrivacy={() => navigateTo('faqPrivacy')}
                  title="Request a Quotation"
                  subtitle={`Send your CCTV or computer requirements to ${BUSINESS_INFO.name}. Our team will get in touch with you shortly.`}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Specification Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-sky-300 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-5 relative shadow-2xl text-slate-900">
            <button
              type="button"
              onClick={() => setSelectedProductDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-extrabold uppercase text-sky-700">
              {selectedProductDetail.category} • {selectedProductDetail.warranty}
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {selectedProductDetail.name}
            </h3>
            <p className="text-sm text-slate-600">{selectedProductDetail.summary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-1.5">
                <div className="font-extrabold text-slate-900 mb-1">Key Features</div>
                {(selectedProductDetail.features || []).map(f => (
                  <div key={f} className="text-slate-700">
                    • {f}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                  <div className="font-extrabold text-slate-900 mb-1">Suitable For</div>
                  <div className="text-slate-700">
                    {(selectedProductDetail.suitableFor || []).join(', ')}
                  </div>
                </div>
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                  <div className="font-extrabold text-slate-900 mb-1">Available Services</div>
                  <div className="text-slate-700">
                    {(selectedProductDetail.availableServices || []).join(' • ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sky-100">
              <div>
                <div className="text-xs text-slate-500">Indicative Price Range</div>
                <div className="text-lg font-black text-emerald-700">
                  {selectedProductDetail.priceRange}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const prod = selectedProductDetail;
                  setSelectedProductDetail(null);
                  openQuoteWithPrefill({
                    additionalRequirements: `Quotation request for ${prod.name} (${prod.priceRange})`
                  });
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-3 px-6 rounded-xl transition shadow-md"
              >
                Request Quotation for This Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Lead Generation Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full my-8">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-white hover:bg-sky-50 border-2 border-sky-300 text-slate-800 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <LeadForm
              prefill={quotePrefill}
              onNavigatePrivacy={() => {
                setQuoteModalOpen(false);
                navigateTo('faqPrivacy');
              }}
            />
          </div>
        </div>
      )}

      {/* Floating WhatsApp + Quick Call Action Buttons */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
        <a
          href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
            'Hello Sri Balaji Computers (SBC - 7200113344)! I would like a free CCTV quotation in Puducherry.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 px-4 rounded-full shadow-xl transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp: {BUSINESS_INFO.phoneFormatted}</span>
        </a>
      </div>

      {/* Footer Styled in Light Sky-Blue Business Card Theme */}
      <footer className="bg-gradient-to-b from-sky-100 to-sky-200/70 border-t-2 border-sky-300 text-slate-700 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={BUSINESS_INFO.logoUrl}
                alt="SBC System Doctor Logo"
                className="w-11 h-11 rounded-full border-2 border-orange-500 bg-white shadow-sm"
              />
              <div>
                <div className="text-base font-black text-rose-950">{BUSINESS_INFO.name}</div>
                <div className="text-[11px] font-extrabold text-orange-600">
                  SBC – SYSTEM DOCTOR
                </div>
              </div>
            </div>
            <p className="leading-relaxed text-slate-700 font-medium">
              {BUSINESS_INFO.specialties} • {BUSINESS_INFO.subSpecialties}. Professional CCTV installation, mobile viewing setup, repair & AMC in Puducherry.
            </p>
            <div className="text-rose-950 font-extrabold">
              📞 {BUSINESS_INFO.phoneFormatted} / {BUSINESS_INFO.altPhoneFormatted}
            </div>
            <div className="text-sky-900 font-bold">✉️ {BUSINESS_INFO.email}</div>
            <div className="text-emerald-800 font-mono font-bold text-[11px]">
              GSTIN: {BUSINESS_INFO.gstin}
            </div>
          </div>

          <div>
            <div className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Website Pages
            </div>
            <ul className="space-y-2 font-medium">
              {allNavItems.slice(0, 6).map(item => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item.key)}
                    className="hover:text-sky-700 transition"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Customer Support & Legal
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('repairAmc')}
                  className="hover:text-sky-700 transition"
                >
                  CCTV, Laptop & Computer AMC & Repair
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('consultation')}
                  className="hover:text-sky-700 transition"
                >
                  Interactive Cost & Storage Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('faqPrivacy')}
                  className="hover:text-sky-700 transition"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('faqPrivacy')}
                  className="hover:text-sky-700 transition"
                >
                  Privacy Policy (Indian Data Protection)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="hover:text-sky-700 transition"
                >
                  Contact Sri Balaji Computers
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Showroom & Service Areas
            </div>
            <p className="leading-relaxed mb-2 text-slate-900 font-bold">
              {BUSINESS_INFO.address}
            </p>
            <p className="leading-relaxed mb-3 text-slate-700">
              Serving Mudaliarpet, Thengaithittu, Puducherry, Lawspet, Saram, Villianur, Reddiarpalayam & nearby areas.
            </p>
            <button
              type="button"
              onClick={() => openQuoteWithPrefill({})}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold transition shadow-md"
            >
              Get Free CCTV Quotation
            </button>
          </div>
        </div>
        <div className="border-t border-sky-300/80 py-4 text-center text-[11px] text-slate-600 font-medium">
          © {new Date().getFullYear()} {BUSINESS_INFO.name} (SBC - System Doctor), Puducherry. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
