import React, { useState, useEffect } from 'react';
import { Cpu, Monitor, MemoryStick, HardDrive, Layers, CheckCircle2, RotateCcw, Save, Trash2, Edit3, Sparkles } from 'lucide-react';
import { PCSpecs, VALID_RAM_OPTIONS, VALID_OS_OPTIONS } from '../../types/pc-specs';
import { SupportedOS } from '../../types/game';

interface PCSpecsFormProps {
  currentSpecs: PCSpecs | null;
  onSave: (specs: PCSpecs) => void;
  onClear: () => void;
}

export const PCSpecsForm: React.FC<PCSpecsFormProps> = ({
  currentSpecs,
  onSave,
  onClear,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(!currentSpecs);

  const [ramGB, setRamGB] = useState<number>(currentSpecs?.ramGB ?? 8);
  const [cpu, setCpu] = useState<string>(currentSpecs?.cpu ?? '');
  const [gpu, setGpu] = useState<string>(currentSpecs?.gpu ?? '');
  const [storageGB, setStorageGB] = useState<string>(
    currentSpecs ? String(currentSpecs.storageGB) : '150'
  );
  const [operatingSystem, setOperatingSystem] = useState<SupportedOS>(
    currentSpecs?.operatingSystem ?? 'Windows 10'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (currentSpecs) {
      setRamGB(currentSpecs.ramGB);
      setCpu(currentSpecs.cpu);
      setGpu(currentSpecs.gpu);
      setStorageGB(String(currentSpecs.storageGB));
      setOperatingSystem(currentSpecs.operatingSystem);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [currentSpecs]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!ramGB || ramGB <= 0) {
      newErrors.ramGB = 'Please select a valid RAM capacity.';
    }

    if (!cpu.trim()) {
      newErrors.cpu = 'CPU model cannot be blank (e.g. Intel Pentium P6200).';
    }

    if (!gpu.trim()) {
      newErrors.gpu = 'GPU / Graphics model cannot be blank (e.g. Intel HD Graphics).';
    }

    const storageNum = parseFloat(storageGB);
    if (isNaN(storageNum) || storageNum <= 0) {
      newErrors.storageGB = 'Please enter a valid positive storage capacity in GB.';
    }

    if (!operatingSystem) {
      newErrors.operatingSystem = 'Please select an operating system.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newSpecs: PCSpecs = {
      ramGB,
      cpu: cpu.trim(),
      gpu: gpu.trim(),
      storageGB: Math.round(parseFloat(storageGB)),
      operatingSystem,
    };

    onSave(newSpecs);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const applyTestPreset = (presetType: 'regression' | 'modern-budget' | 'mid-range') => {
    if (presetType === 'regression') {
      // The Critical Regression Test Configuration:
      // RAM: 3 GB, CPU: Intel Pentium P6200, GPU: Intel HD Graphics, Available Storage: 200 GB, OS: Windows 7
      setRamGB(3);
      setCpu('Intel Pentium P6200');
      setGpu('Intel HD Graphics');
      setStorageGB('200');
      setOperatingSystem('Windows 7');
    } else if (presetType === 'modern-budget') {
      setRamGB(8);
      setCpu('Intel Core i3-10100');
      setGpu('Intel UHD Graphics 630');
      setStorageGB('256');
      setOperatingSystem('Windows 10');
    } else {
      setRamGB(16);
      setCpu('AMD Ryzen 5 3600');
      setGpu('NVIDIA GeForce GTX 1660 Super');
      setStorageGB('500');
      setOperatingSystem('Windows 11');
    }
    setErrors({});
    setIsEditing(true);
  };

  return (
    <div className="bg-[#111D2D] border border-[#243247] rounded-xl p-6 sm:p-8 shadow-lg max-w-3xl mx-auto space-y-6">
      {/* Header and status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#243247]">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#10B981]" />
            <span>PC Hardware Specifications</span>
          </h2>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {isEditing
              ? 'Enter your computer specifications to discover which games you can run.'
              : 'Your active saved configuration for game compatibility checking.'}
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Specifications saved!</span>
          </span>
        )}
      </div>

      {/* Preset Quick-Fill Bar */}
      {isEditing && (
        <div className="p-3.5 rounded-lg bg-[#080D18] border border-[#243247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Quick Test Presets:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => applyTestPreset('regression')}
              className="px-2.5 py-1 rounded-md bg-[#172438] hover:bg-[#10B981]/20 hover:text-[#10B981] text-slate-200 border border-white/5 transition-colors font-mono text-[11px]"
              title="Loads: 3GB RAM, Intel Pentium P6200, Intel HD Graphics, 200GB, Win 7"
            >
              Test Low-End Laptop (3GB / P6200 / Intel HD)
            </button>
            <button
              type="button"
              onClick={() => applyTestPreset('modern-budget')}
              className="px-2.5 py-1 rounded-md bg-[#172438] hover:bg-white/10 text-slate-300 border border-white/5 transition-colors font-mono text-[11px]"
            >
              Budget Desktop (8GB / i3 / UHD 630)
            </button>
          </div>
        </div>
      )}

      {/* View Mode Summary Card */}
      {!isEditing && currentSpecs && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* RAM */}
            <div className="p-4 rounded-lg bg-[#080D18] border border-[#243247]">
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase flex items-center gap-1.5 mb-1">
                <MemoryStick className="w-3.5 h-3.5" /> Memory (RAM)
              </span>
              <p className="text-lg font-bold text-white font-mono">{currentSpecs.ramGB} GB</p>
            </div>

            {/* CPU */}
            <div className="p-4 rounded-lg bg-[#080D18] border border-[#243247]">
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5" /> Processor
              </span>
              <p className="text-sm font-semibold text-white truncate" title={currentSpecs.cpu}>
                {currentSpecs.cpu}
              </p>
            </div>

            {/* GPU */}
            <div className="p-4 rounded-lg bg-[#080D18] border border-[#243247]">
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase flex items-center gap-1.5 mb-1">
                <Monitor className="w-3.5 h-3.5" /> Graphics Card
              </span>
              <p className="text-sm font-semibold text-white truncate" title={currentSpecs.gpu}>
                {currentSpecs.gpu}
              </p>
            </div>

            {/* Storage */}
            <div className="p-4 rounded-lg bg-[#080D18] border border-[#243247]">
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5" /> Free Storage
              </span>
              <p className="text-lg font-bold text-white font-mono">{currentSpecs.storageGB} GB</p>
            </div>

            {/* OS */}
            <div className="p-4 rounded-lg bg-[#080D18] border border-[#243247] sm:col-span-2">
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5" /> Operating System
              </span>
              <p className="text-sm font-semibold text-white">{currentSpecs.operatingSystem}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#243247] flex-wrap gap-3">
            <span className="text-xs text-[#94A3B8]">
              Saved locally in this browser · Available offline
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#172438] hover:bg-[#243247] text-white transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Specifications</span>
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Input Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* RAM Select */}
            <div>
              <label htmlFor="ramGB" className="block text-xs font-mono uppercase text-[#94A3B8] mb-1.5">
                Installed Memory (RAM) <span className="text-emerald-400">*</span>
              </label>
              <select
                id="ramGB"
                value={ramGB}
                onChange={(e) => {
                  setRamGB(Number(e.target.value));
                  if (errors.ramGB) setErrors((prev) => ({ ...prev, ramGB: '' }));
                }}
                className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-hidden transition-colors"
              >
                {VALID_RAM_OPTIONS.map((val) => (
                  <option key={val} value={val} className="bg-[#111D2D] text-white">
                    {val} GB
                  </option>
                ))}
              </select>
              {errors.ramGB && <p className="mt-1 text-xs text-rose-400">{errors.ramGB}</p>}
            </div>

            {/* Operating System */}
            <div>
              <label htmlFor="operatingSystem" className="block text-xs font-mono uppercase text-[#94A3B8] mb-1.5">
                Operating System <span className="text-emerald-400">*</span>
              </label>
              <select
                id="operatingSystem"
                value={operatingSystem}
                onChange={(e) => {
                  setOperatingSystem(e.target.value as SupportedOS);
                  if (errors.operatingSystem) setErrors((prev) => ({ ...prev, operatingSystem: '' }));
                }}
                className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-hidden transition-colors"
              >
                {VALID_OS_OPTIONS.map((os) => (
                  <option key={os} value={os} className="bg-[#111D2D] text-white">
                    {os}
                  </option>
                ))}
              </select>
              {errors.operatingSystem && <p className="mt-1 text-xs text-rose-400">{errors.operatingSystem}</p>}
            </div>

            {/* CPU Input */}
            <div>
              <label htmlFor="cpu" className="block text-xs font-mono uppercase text-[#94A3B8] mb-1.5">
                Processor (CPU) <span className="text-emerald-400">*</span>
              </label>
              <input
                id="cpu"
                type="text"
                placeholder="e.g. Intel Pentium P6200"
                value={cpu}
                onChange={(e) => {
                  setCpu(e.target.value);
                  if (errors.cpu) setErrors((prev) => ({ ...prev, cpu: '' }));
                }}
                className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-hidden transition-colors"
              />
              {errors.cpu && <p className="mt-1 text-xs text-rose-400">{errors.cpu}</p>}
            </div>

            {/* GPU Input */}
            <div>
              <label htmlFor="gpu" className="block text-xs font-mono uppercase text-[#94A3B8] mb-1.5">
                Graphics Card (GPU) <span className="text-emerald-400">*</span>
              </label>
              <input
                id="gpu"
                type="text"
                placeholder="e.g. Intel HD Graphics"
                value={gpu}
                onChange={(e) => {
                  setGpu(e.target.value);
                  if (errors.gpu) setErrors((prev) => ({ ...prev, gpu: '' }));
                }}
                className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-hidden transition-colors"
              />
              {errors.gpu && <p className="mt-1 text-xs text-rose-400">{errors.gpu}</p>}
            </div>

            {/* Free Storage Input */}
            <div className="sm:col-span-2">
              <label htmlFor="storageGB" className="block text-xs font-mono uppercase text-[#94A3B8] mb-1.5">
                Available Storage (GB) <span className="text-emerald-400">*</span>
              </label>
              <input
                id="storageGB"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 200"
                value={storageGB}
                onChange={(e) => {
                  setStorageGB(e.target.value);
                  if (errors.storageGB) setErrors((prev) => ({ ...prev, storageGB: '' }));
                }}
                className="w-full bg-[#080D18] border border-[#243247] focus:border-[#10B981] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-hidden transition-colors"
              />
              {errors.storageGB && <p className="mt-1 text-xs text-rose-400">{errors.storageGB}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#243247]">
            {currentSpecs && (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#10B981] hover:bg-[#34D399] text-black transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save PC Specifications</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
