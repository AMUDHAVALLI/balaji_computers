import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Camera,
  HardDrive,
  Cpu,
  Wifi,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Volume2
} from 'lucide-react';

export default function InteractiveConfigurator({ onApplyToQuote }) {
  const [config, setConfig] = useState({
    propertyType: 'Home',
    indoorCameras: 2,
    outdoorCameras: 2,
    resolution: '4MP',
    nightVisionType: 'Full-Color Night Vision',
    recordingDays: 15,
    cableMeters: 60,
    includeAudio: true,
    includeInstallation: true
  });

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchEstimate() {
      setLoading(true);
      try {
        const res = await fetch('/api/estimator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
        const data = await res.json();
        if (isMounted && data.summary) {
          setEstimate(data.summary);
        }
      } catch (e) {
        // Client-side fallback calculation
        const totalCameras = Number(config.indoorCameras) + Number(config.outdoorCameras);
        const channels = totalCameras <= 4 ? 4 : totalCameras <= 8 ? 8 : 16;
        const camCost = totalCameras * (config.resolution === '2MP' ? 1700 : config.resolution === '4MP' ? 2450 : 3200);
        const recCost = channels === 4 ? 4200 : channels === 8 ? 6800 : 12500;
        const hddTb = totalCameras * config.recordingDays > 120 ? 2 : 1;
        const hddCost = hddTb === 1 ? 3800 : 5900;
        const cableCost = config.cableMeters * 28 + totalCameras * 350;
        const installCost = config.includeInstallation ? totalCameras * 550 + 800 : 0;
        const total = camCost + recCost + hddCost + cableCost + installCost;
        if (isMounted) {
          setEstimate({
            propertyType: config.propertyType,
            totalCameras,
            indoorCameras: config.indoorCameras,
            outdoorCameras: config.outdoorCameras,
            resolution: config.resolution,
            nightVisionType: config.nightVisionType,
            recommendedRecorder: `${channels}-Channel H.265+ DVR/NVR`,
            recommendedStorage: `${hddTb} TB Surveillance HDD (~${config.recordingDays} Days Backup)`,
            estimatedStorageGb: totalCameras * config.recordingDays * 18,
            breakdown: {
              cameras: camCost,
              recorder: recCost,
              storage: hddCost,
              cablingAndAccessories: cableCost,
              installationAndMobileSetup: installCost
            },
            estimatedTotal: total,
            priceRangeMin: Math.round(total * 0.92),
            priceRangeMax: Math.round(total * 1.08)
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEstimate();
    return () => {
      isMounted = false;
    };
  }, [config]);

  const handleLockQuote = () => {
    if (!estimate) return;
    const total = estimate.totalCameras;
    const camerasLabel =
      total <= 2 ? '2 cameras' : total <= 4 ? '4 cameras' : total <= 8 ? '8 cameras' : '16+ cameras';

    const requirementSummary = `Custom Configurator Build: ${config.indoorCameras} Indoor + ${config.outdoorCameras} Outdoor (${config.resolution}, ${config.nightVisionType}), ${estimate.recommendedRecorder}, ${estimate.recommendedStorage}, Audio: ${config.includeAudio ? 'Yes' : 'No'}.`;

    onApplyToQuote({
      propertyType: config.propertyType,
      camerasRequired: camerasLabel,
      serviceRequired: 'New installation',
      budget: `₹${estimate.priceRangeMin.toLocaleString('en-IN')} - ₹${estimate.priceRangeMax.toLocaleString('en-IN')}`,
      additionalRequirements: requirementSummary,
      estimatedAmount: estimate.estimatedTotal
    });
  };

  return (
    <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 lg:p-10 shadow-xl text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-sky-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-sky-700" />
            Interactive CCTV System Planner & HDD Storage Calculator
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Design Your Puducherry CCTV Setup in 30 Seconds
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Customize cameras, resolution, night vision, and recording days to see your recommended DVR/NVR & storage configuration.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Home', 'Shop', 'Office', 'School / College', 'Factory / Warehouse'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => {
                const presets = {
                  Home: { indoorCameras: 2, outdoorCameras: 2, cableMeters: 60, recordingDays: 15 },
                  Shop: { indoorCameras: 3, outdoorCameras: 1, cableMeters: 50, recordingDays: 30 },
                  Office: { indoorCameras: 6, outdoorCameras: 2, cableMeters: 120, recordingDays: 30 },
                  'School / College': { indoorCameras: 8, outdoorCameras: 4, cableMeters: 200, recordingDays: 30 },
                  'Factory / Warehouse': { indoorCameras: 4, outdoorCameras: 6, cableMeters: 220, recordingDays: 30 }
                };
                setConfig(prev => ({
                  ...prev,
                  propertyType: type,
                  ...(presets[type] || {})
                }));
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                config.propertyType === type
                  ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                  : 'bg-sky-50 border-sky-200 text-slate-700 hover:bg-sky-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Camera Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-600" />
                  Indoor Dome Cameras
                </span>
                <span className="text-xl font-black text-sky-700">{config.indoorCameras}</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                For living rooms, billing counters, corridors & offices
              </p>
              <input
                type="range"
                min="0"
                max="16"
                value={config.indoorCameras}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    indoorCameras: Math.max(0, Number(e.target.value))
                  }))
                }
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
              </div>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Outdoor Bullet Cameras
                </span>
                <span className="text-xl font-black text-emerald-700">{config.outdoorCameras}</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                IP67 weatherproof for gates, parking, street & compound walls
              </p>
              <input
                type="range"
                min="0"
                max="16"
                value={config.outdoorCameras}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    outdoorCameras: Math.max(0, Number(e.target.value))
                  }))
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
              </div>
            </div>
          </div>

          {/* Resolution & Night Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Camera Resolution Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['2MP', '4MP', '5MP', '8MP (4K)'].map(res => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, resolution: res }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                      config.resolution === res
                        ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {res} {res === '4MP' && '★'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Night Vision Technology
              </label>
              <div className="space-y-2">
                {['Full-Color Night Vision', 'Smart IR (Black & White at Night)'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, nightVisionType: mode }))}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      config.nightVisionType === mode
                        ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {mode.includes('Color') ? (
                        <Sun className="w-3.5 h-3.5" />
                      ) : (
                        <Moon className="w-3.5 h-3.5" />
                      )}
                      {mode}
                    </span>
                    {config.nightVisionType === mode && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recording Days & Addons */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recording Backup Retention (Days)
              </span>
              <div className="flex gap-2">
                {[7, 15, 30, 60].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, recordingDays: days }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      config.recordingDays === days
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-sky-200">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeAudio}
                  onChange={e => setConfig(prev => ({ ...prev, includeAudio: e.target.checked }))}
                  className="rounded border-slate-400 text-sky-600"
                />
                <Volume2 className="w-4 h-4 text-sky-600" />
                Include Built-in Audio Recording Mic
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeInstallation}
                  onChange={e =>
                    setConfig(prev => ({ ...prev, includeInstallation: e.target.checked }))
                  }
                  className="rounded border-slate-400 text-sky-600"
                />
                <Wifi className="w-4 h-4 text-emerald-600" />
                Include Installation & Mobile Viewing Setup
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Summary */}
        <div className="lg:col-span-5 bg-gradient-to-b from-sky-50 to-white border-2 border-sky-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
              Recommended System Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
              {estimate?.totalCameras || 0} Total Cameras
            </span>
          </div>

          {estimate ? (
            <>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 bg-white border border-sky-200 p-3.5 rounded-xl shadow-sm">
                  <Cpu className="w-6 h-6 text-sky-600 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">DVR / NVR Unit</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {estimate.recommendedRecorder}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white border border-sky-200 p-3.5 rounded-xl shadow-sm">
                  <HardDrive className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">
                      Surveillance Storage Needed
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {estimate.recommendedStorage}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Est. H.265+ Data: ~{estimate.estimatedStorageGb} GB for {config.recordingDays} days
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-sky-200 pt-4 mb-5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>
                    Cameras ({estimate.indoorCameras} Dome + {estimate.outdoorCameras} Bullet • {estimate.resolution})
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{estimate.breakdown.cameras.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{estimate.recommendedRecorder}</span>
                  <span className="font-bold text-slate-900">
                    ₹{estimate.breakdown.recorder.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Surveillance Hard Disk</span>
                  <span className="font-bold text-slate-900">
                    ₹{estimate.breakdown.storage.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Power Supply, Connectors & Cabling</span>
                  <span className="font-bold text-slate-900">
                    ₹{estimate.breakdown.cablingAndAccessories.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Professional Installation & Mobile App Setup</span>
                  <span className="font-bold text-slate-900">
                    ₹{estimate.breakdown.installationAndMobileSetup.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-sky-100/80 border border-sky-300 rounded-xl p-4 mb-5">
                <div className="text-xs text-sky-800 font-bold">
                  Estimated Package Range in Puducherry
                </div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  ₹{estimate.priceRangeMin.toLocaleString('en-IN')} – ₹{estimate.priceRangeMax.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  *Final quotation prepared after free on-site cable distance & blind-spot check.
                </div>
              </div>

              <button
                type="button"
                onClick={handleLockQuote}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-5 rounded-xl shadow-md transition"
              >
                <span>Lock Configuration & Request Official Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              Select at least 1 camera to calculate your custom CCTV system.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
