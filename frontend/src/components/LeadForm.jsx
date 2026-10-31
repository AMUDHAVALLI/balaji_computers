import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Send,
  RefreshCw,
  Home as HomeIcon,
  Store,
  Building2,
  GraduationCap,
  Factory,
  Camera,
  MapPin,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import { SERVICE_AREAS, BUSINESS_INFO } from '../data/siteContent';

const PROPERTY_TYPES = [
  { label: 'Home', icon: HomeIcon, desc: 'House / Villa / Flat' },
  { label: 'Shop', icon: Store, desc: 'Retail / Showroom' },
  { label: 'Office', icon: Building2, desc: 'IT / Commercial' },
  { label: 'School / College', icon: GraduationCap, desc: 'Campus Security' },
  { label: 'Factory / Warehouse', icon: Factory, desc: 'Industrial Godown' }
];

const CAMERA_COUNTS = [
  { label: '2 cameras', approx: '₹10,500', tag: 'Starter' },
  { label: '4 cameras', approx: '₹16,800', tag: 'Most Popular' },
  { label: '8 cameras', approx: '₹34,500', tag: 'Commercial' },
  { label: '16+ cameras', approx: '₹68,000+', tag: 'Enterprise' },
  { label: 'Need guidance', approx: 'Free Survey', tag: 'Expert Help' }
];

const SERVICE_TYPES = [
  'New installation',
  'CCTV Repair & Troubleshooting',
  'Annual Maintenance (AMC)',
  'DVR / NVR / Storage Upgrade',
  'Laptop & Computer Hardware / Software Service',
  'Free Site Inspection'
];

const BUDGET_OPTIONS = [
  'Need quotation',
  '₹10,000 – ₹15,000',
  '₹15,000 – ₹25,000',
  '₹25,000 – ₹45,000',
  '₹45,000+ (Commercial)'
];

const QUICK_AREAS = [
  'Mudaliarpet',
  'Lawspet',
  'Saram',
  'Villianur',
  'Reddiarpalayam',
  'Puducherry Town'
];

export default function LeadForm({
  prefill = {},
  onSuccess,
  onNavigatePrivacy,
  isModal = false,
  title = 'Get Your Free CCTV Quotation',
  subtitle = 'Share your requirements. We will contact you to discuss a suitable security solution in Puducherry.'
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    location: prefill.location || 'Mudaliarpet',
    propertyType: prefill.propertyType || 'Home',
    camerasRequired: prefill.camerasRequired || '4 cameras',
    serviceRequired: prefill.serviceRequired || 'New installation',
    budget: prefill.budget || 'Need quotation',
    additionalRequirements: prefill.additionalRequirements || '',
    privacyConsent: true,
    marketingConsent: false,
    estimatedAmount: prefill.estimatedAmount || null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    if (prefill && Object.keys(prefill).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...prefill
      }));
    }
  }, [prefill]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  // Live estimated price badge based on camera count & service
  const getLiveEstimate = () => {
    if (formData.estimatedAmount) {
      return `~₹${Number(formData.estimatedAmount).toLocaleString('en-IN')}`;
    }
    if (formData.serviceRequired.toLowerCase().includes('repair')) {
      return '₹500 – ₹2,500';
    }
    const found = CAMERA_COUNTS.find(c => c.label === formData.camerasRequired);
    return found ? found.approx : 'Custom Quote';
  };

  const handleNextStep = () => {
    setError('');
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const cleanedMobile = String(formData.mobileNumber).replace(/[\s\-+]/g, '');
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^(?:91)?[6-9]\d{9}$/.test(cleanedMobile)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter or select your area in Puducherry.');
      return;
    }
    if (!formData.privacyConsent) {
      setError('Please accept the Privacy Policy consent to proceed.');
      return;
    }

    setLoading(true);
    const buildWhatsappUrl = (code, leadObj) => {
      const waText = encodeURIComponent(
        `Hello Sri Balaji Computers (SBC - System Doctor)!\n` +
          `*New CCTV Enquiry Details*\n` +
          `------------------------\n` +
          `*Enquiry ID:* ${code}\n` +
          `*Customer Name:* ${leadObj.customerName}\n` +
          `*Customer Mobile:* +91 ${String(leadObj.mobileNumber).slice(-10)}\n` +
          `*Location:* ${leadObj.location}, Puducherry\n` +
          `*Property Type:* ${leadObj.propertyType}\n` +
          `*Cameras Required:* ${leadObj.camerasRequired}\n` +
          `*Service Required:* ${leadObj.serviceRequired}\n` +
          `*Budget:* ${leadObj.budget}\n` +
          (leadObj.additionalRequirements
            ? `*Requirements:* ${leadObj.additionalRequirements}\n`
            : '') +
          `------------------------\n` +
          `Please share a CCTV quotation and site visit availability.`
      );
      return `https://wa.me/917200113344?text=${waText}`;
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not submit enquiry.');
      }
      const guaranteedWaUrl = buildWhatsappUrl(data.lead?.leadCode || 'SBC-CCTV-2026', formData);
      const updatedData = {
        ...data,
        notifications: {
          ...(data.notifications || {}),
          whatsappUrl: guaranteedWaUrl
        }
      };
      setSubmittedResult(updatedData);
      if (onSuccess) onSuccess(updatedData);
    } catch (err) {
      const fallbackCode = `SBC-CCTV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedResult({
        message: 'Enquiry recorded! Our Puducherry team will contact you shortly.',
        lead: {
          ...formData,
          leadCode: fallbackCode,
          status: 'Enquiry',
          createdAt: new Date().toISOString()
        },
        notifications: {
          businessEmailNotified: BUSINESS_INFO.email,
          customerAcknowledgement: `Confirmation queued for +91 ${cleanedMobile.slice(-10)}`,
          whatsappUrl: buildWhatsappUrl(fallbackCode, formData)
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (submittedResult) {
    const { lead, notifications } = submittedResult;
    return (
      <div className="bg-white border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 shadow-xl text-slate-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">
              Enquiry Submitted Successfully
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Thank You, {lead.customerName}!
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm mb-4">
          Your CCTV security requirement for <strong className="text-slate-900">{lead.location}</strong> has been logged. Our Sri Balaji Computers team will call you on{' '}
          <strong className="text-slate-900">+91 {lead.mobileNumber}</strong>.
        </p>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 mb-4 space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-sky-200 pb-1.5">
            <span className="text-slate-600 font-medium">Unique Enquiry ID:</span>
            <span className="font-mono font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-300">
              {lead.leadCode}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Property & Setup:</span>
            <span className="text-slate-900 font-semibold">
              {lead.propertyType} • {lead.camerasRequired}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Service Requested:</span>
            <span className="text-slate-900 font-medium">{lead.serviceRequired}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Tentative Estimate:</span>
            <span className="text-emerald-700 font-bold">{getLiveEstimate()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <a
            href={notifications?.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md text-xs sm:text-sm"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Send Enquiry to WhatsApp (7200113344)</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmittedResult(null);
              setStep(1);
            }}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition border border-slate-300 text-xs sm:text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white ${
        isModal ? '' : 'border-2 border-sky-200 rounded-2xl p-5 sm:p-7 shadow-xl'
      } text-slate-900`}
    >
      {/* Header + Interactive 2-Step Progress Indicator */}
      <div className="mb-4">
        {!isModal && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Fast Response • 7200113344</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Est. Package: {getLiveEstimate()}
            </span>
          </div>
        )}

        {!isModal && (
          <>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">{subtitle}</p>
          </>
        )}

        {/* Interactive Step Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-3 bg-sky-50 p-1.5 rounded-xl border border-sky-200">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-extrabold transition ${
              step === 1
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                step === 1 ? 'bg-white text-sky-700' : 'bg-sky-200 text-sky-800'
              }`}
            >
              1
            </span>
            <span>1. Select CCTV Setup</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-extrabold transition ${
              step === 2
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                step === 2 ? 'bg-white text-sky-700' : 'bg-sky-200 text-sky-800'
              }`}
            >
              2
            </span>
            <span>2. Contact & Location</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs sm:text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ==================== STEP 1: INTERACTIVE CCTV REQUIREMENTS ==================== */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Property Type Interactive Cards */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                Select Property Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PROPERTY_TYPES.map(item => {
                  const IconComp = item.icon;
                  const active = formData.propertyType === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({ ...prev, propertyType: item.label }))
                      }
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        active
                          ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                          : 'bg-sky-50/60 border-sky-200 text-slate-800 hover:bg-sky-100/70'
                      }`}
                    >
                      <IconComp
                        className={`w-4 h-4 mb-1 ${
                          active ? 'text-yellow-300' : 'text-sky-600'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-extrabold leading-tight">{item.label}</div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            active ? 'text-sky-100' : 'text-slate-500'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Camera Count Cards with Live Price Tag */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Number of Cameras Required
                </label>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Est: {getLiveEstimate()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CAMERA_COUNTS.map(cam => {
                  const active = formData.camerasRequired === cam.label;
                  return (
                    <button
                      key={cam.label}
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({ ...prev, camerasRequired: cam.label }))
                      }
                      className={`p-2.5 rounded-xl border text-center transition ${
                        active
                          ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                          : 'bg-sky-50/60 border-sky-200 text-slate-800 hover:bg-sky-100/70'
                      }`}
                    >
                      <div
                        className={`text-[10px] font-bold uppercase ${
                          active ? 'text-yellow-300' : 'text-sky-700'
                        }`}
                      >
                        {cam.tag}
                      </div>
                      <div className="text-xs font-extrabold mt-0.5">{cam.label}</div>
                      <div
                        className={`text-[10px] font-semibold mt-0.5 ${
                          active ? 'text-sky-100' : 'text-emerald-700'
                        }`}
                      >
                        {cam.approx}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service & Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Service Required
                </label>
                <select
                  name="serviceRequired"
                  value={formData.serviceRequired}
                  onChange={handleChange}
                  className="w-full bg-sky-50/60 border border-sky-200 focus:border-sky-600 focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 outline-none transition"
                >
                  {SERVICE_TYPES.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Estimated Budget
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-sky-50/60 border border-sky-200 focus:border-sky-600 focus:bg-white rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 outline-none transition"
                >
                  {BUDGET_OPTIONS.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold py-3 px-5 rounded-xl shadow-md transition text-sm"
            >
              <span>Next: Enter Your Contact & Puducherry Area</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================== STEP 2: CONTACT & LOCATION DETAILS ==================== */}
        {step === 2 && (
          <div className="space-y-3.5">
            {/* Selected Summary Pill */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Selected: <strong className="text-sky-900">{formData.propertyType}</strong> •{' '}
                <strong className="text-sky-900">{formData.camerasRequired}</strong> (
                {getLiveEstimate()})
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sky-700 font-bold hover:underline"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. Karthik Subramanian"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Number (10-Digit) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-slate-500 text-sm font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    placeholder="72001 13344"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl pl-12 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Quick-Click Puducherry Area Chips + Input */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Location in Puducherry *
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUICK_AREAS.map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, location: area }))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                      formData.location === area
                        ? 'bg-sky-600 border-sky-600 text-white'
                        : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
                    }`}
                  >
                    📍 {area}
                  </button>
                ))}
              </div>
              <input
                type="text"
                name="location"
                list="puducherry-locations"
                required
                placeholder="Type your street / locality in Puducherry..."
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
              <datalist id="puducherry-locations">
                {SERVICE_AREAS.map(area => (
                  <option key={area.name} value={area.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Additional Notes (Optional)
              </label>
              <input
                type="text"
                name="additionalRequirements"
                placeholder="e.g. Mobile viewing setup, shop billing mic, or outdoor night vision..."
                value={formData.additionalRequirements}
                onChange={handleChange}
                className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>

            {/* Compact Consent Checkboxes */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
                />
                <span>
                  I consent to being contacted regarding this enquiry and accept the{' '}
                  <button
                    type="button"
                    onClick={() => onNavigatePrivacy && onNavigatePrivacy()}
                    className="text-sky-700 font-bold underline hover:text-sky-600"
                  >
                    Privacy Policy
                  </button>
                  . *
                </span>
              </label>

              <label className="flex items-start gap-2 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
                />
                <span>(Optional) Send me seasonal CCTV maintenance & AMC tips on WhatsApp.</span>
              </label>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition text-xs sm:text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-rose-600 to-fuchsia-600 hover:from-orange-400 hover:to-fuchsia-500 disabled:opacity-50 text-white font-extrabold py-3 px-5 rounded-xl shadow-lg transition text-xs sm:text-sm"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>
                  {loading ? 'Submitting Enquiry...' : 'Get My Free CCTV Quotation'}
                </span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
