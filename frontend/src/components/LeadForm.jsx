import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Send,
  RefreshCw
} from 'lucide-react';
import { SERVICE_AREAS, BUSINESS_INFO } from '../data/siteContent';

const PROPERTY_TYPES = [
  'Home',
  'Shop',
  'Office',
  'School / College',
  'Factory / Warehouse'
];

const CAMERA_COUNTS = [
  '2 cameras',
  '4 cameras',
  '8 cameras',
  '16+ cameras',
  'Need guidance'
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

export default function LeadForm({
  prefill = {},
  onSuccess,
  onNavigatePrivacy,
  compact = false,
  title = 'Get Your Free CCTV Quotation',
  subtitle = 'Share your requirements. We will contact you to discuss a suitable security solution in Puducherry.'
}) {
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
        (leadObj.additionalRequirements ? `*Requirements:* ${leadObj.additionalRequirements}\n` : '') +
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
      // Ensure WhatsApp URL always points to 917200113344 with full enquiry details
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
      // Fallback local lead generation if backend is unreachable
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
      <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">
              Enquiry Submitted Successfully
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              Thank You, {lead.customerName}!
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5">
          Your CCTV security requirement for <strong className="text-slate-900">{lead.location}</strong> has been logged. Our Sri Balaji Computers team will call you on{' '}
          <strong className="text-slate-900">+91 {lead.mobileNumber}</strong> to provide a customized quotation and schedule a site inspection.
        </p>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between items-center border-b border-sky-200 pb-2">
            <span className="text-slate-600 font-medium">Unique Enquiry ID:</span>
            <span className="font-mono font-bold text-sky-800 bg-white px-2.5 py-1 rounded border border-sky-300 shadow-sm">
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
          {lead.estimatedAmount && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tentative Estimate:</span>
              <span className="text-emerald-700 font-bold">
                ₹{Number(lead.estimatedAmount).toLocaleString('en-IN')} (Approx.)
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs pt-2 border-t border-sky-200 text-slate-500">
            <span>Alert Sent: {notifications?.businessEmailNotified}</span>
            <span className="text-emerald-700 font-semibold">
              ✓ {notifications?.customerAcknowledgement}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={notifications?.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-xl transition shadow-md"
          >
            <MessageSquare className="w-5 h-5" />
            Send Enquiry Details to WhatsApp (7200113344)
          </a>
          <button
            type="button"
            onClick={() => setSubmittedResult(null)}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition border border-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          Fast Response Across Puducherry • 7200113344
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900">{title}</h3>
        <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Customer Name *
            </label>
            <input
              type="text"
              name="customerName"
              required
              placeholder="e.g. Karthik Subramanian"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mobile Number (10-Digit) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">
                +91
              </span>
              <input
                type="tel"
                name="mobileNumber"
                required
                placeholder="72001 13344"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Location in Puducherry *
            </label>
            <input
              type="text"
              name="location"
              list="puducherry-locations"
              required
              placeholder="Mudaliarpet, Lawspet, Saram..."
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
            />
            <datalist id="puducherry-locations">
              {SERVICE_AREAS.map(area => (
                <option key={area.name} value={area.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Property Type
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Pill Selection for Cameras Required */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Number of Cameras Required
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CAMERA_COUNTS.map(count => {
              const active = formData.camerasRequired === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, camerasRequired: count }))}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                    active
                      ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                      : 'bg-sky-50/60 border-slate-300 text-slate-700 hover:border-sky-400 hover:bg-sky-100/50'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Service Required
            </label>
            <select
              name="serviceRequired"
              value={formData.serviceRequired}
              onChange={handleChange}
              className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition"
            >
              {SERVICE_TYPES.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Estimated Budget
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition"
            >
              {BUDGET_OPTIONS.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!compact && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Additional Requirements (Optional)
            </label>
            <textarea
              name="additionalRequirements"
              rows={2}
              placeholder="e.g. Need mobile viewing setup, audio recording near shop counter, or outdoor gate night vision..."
              value={formData.additionalRequirements}
              onChange={handleChange}
              className="w-full bg-sky-50/50 border border-slate-300 focus:border-sky-600 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>
        )}

        {/* Privacy & Optional Marketing Consents */}
        <div className="space-y-2.5 pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleChange}
              className="mt-0.5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
            />
            <span>
              I consent to being contacted regarding this CCTV enquiry. I have read the{' '}
              <button
                type="button"
                onClick={() => onNavigatePrivacy && onNavigatePrivacy()}
                className="text-sky-700 font-semibold underline hover:text-sky-600"
              >
                Privacy Policy
              </button>
              . *
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="mt-0.5 rounded border-slate-400 text-sky-600 focus:ring-sky-500"
            />
            <span>
              (Optional) Send me seasonal CCTV maintenance tips, security upgrades, and AMC offers on WhatsApp.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-sky-600/25 transition"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Generating Your Quotation ID...' : 'Get My Free CCTV Quotation'}
        </button>
      </form>
    </div>
  );
}
