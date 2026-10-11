import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityLevel } from '../../types';
import { PLANT_UNITS } from '../../data/mockData';
import {
  AlertTriangle,
  Flame,
  Clock,
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
  Package,
  Wrench,
  Search,
  Sparkles,
} from 'lucide-react';

interface ReservationFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess, onCancel }) => {
  const { materials, createReservation, showToast } = useApp();

  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [targetPlant, setTargetPlant] = useState(PLANT_UNITS[0]);
  const [priority, setPriority] = useState<PriorityLevel>('NORMAL');
  const [equipmentTag, setEquipmentTag] = useState('');
  const [reason, setReason] = useState('');

  // Selected items list
  const [selectedItems, setSelectedItems] = useState<{
    materialId: string;
    quantity: number;
  }[]>([
    {
      materialId: materials[0]?.id || '',
      quantity: 1,
    },
  ]);

  // Quick auto-generate WO helper
  const handleGenerateWONumber = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = priority === 'EMERGENCY' ? 'SD' : priority === 'HIGH' ? 'UR' : 'PM';
    setWorkOrderNumber(`WO-2026-${prefix}-${randomSuffix}`);
  };

  const handleAddItemRow = () => {
    // Find first material not yet in selectedItems
    const unusedMat = materials.find(
      (m) => !selectedItems.some((item) => item.materialId === m.id)
    );
    setSelectedItems((prev) => [
      ...prev,
      {
        materialId: unusedMat ? unusedMat.id : materials[0]?.id || '',
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (selectedItems.length <= 1) {
      showToast('warning', 'Minimal Satu Item', 'Permohonan harus mencantumkan setidaknya satu material.');
      return;
    }
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'materialId' | 'quantity', value: any) => {
    setSelectedItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: field === 'quantity' ? Math.max(1, Number(value) || 1) : value,
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!workOrderNumber.trim()) {
      showToast('error', 'Form Belum Lengkap', 'Nomor Work Order (WO) wajib diisi.');
      return;
    }
    if (!equipmentTag.trim()) {
      showToast('error', 'Form Belum Lengkap', 'Tag Peralatan/Mesin sasaran wajib diisi.');
      return;
    }
    if (!reason.trim()) {
      showToast('error', 'Form Belum Lengkap', 'Deskripsi urgensi pekerjaan wajib diisi.');
      return;
    }

    const success = createReservation({
      workOrderNumber,
      targetPlant,
      priority,
      reason,
      equipmentTag,
      items: selectedItems,
    });

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Banner Title */}
      <div className="p-6 bg-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-sky-400 font-semibold tracking-wider uppercase">
              DEPARTEMEN PEMELIHARAAN · FORM PERMOHONAN MATERIAL
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Reservasi Material Pabrik Real-Time
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Terhubung langsung ke Gudang Sentral PT Pusri
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* PRIORITY LEVEL SELECTOR */}
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Priority Level (Tingkat Urgensi Kebutuhan) *
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Tingkat prioritas menentukan kecepatan verifikasi dan alokasi stok darurat oleh Departemen Pabrik.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* EMERGENCY */}
            <div
              onClick={() => setPriority('EMERGENCY')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                priority === 'EMERGENCY'
                  ? 'border-rose-600 bg-rose-50/80 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <Flame className="w-4 h-4 text-rose-600" />
                  EMERGENCY
                </span>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'EMERGENCY'}
                  onChange={() => setPriority('EMERGENCY')}
                  className="accent-rose-600"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 mt-2">
                Shutdown / Plant Trip
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Unit trip / bahaya K3 kritis. Verifikasi seketika oleh verifikator pabrik.
              </p>
            </div>

            {/* HIGH */}
            <div
              onClick={() => setPriority('HIGH')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                priority === 'HIGH'
                  ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <Clock className="w-4 h-4 text-amber-600" />
                  TINGGI (HIGH)
                </span>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'HIGH'}
                  onChange={() => setPriority('HIGH')}
                  className="accent-amber-600"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 mt-2">
                Urgent &lt; 24 Jam
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Kerusakan berpotensi menurunkan rate kapasitas pabrik jika terlambat.
              </p>
            </div>

            {/* NORMAL */}
            <div
              onClick={() => setPriority('NORMAL')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                priority === 'NORMAL'
                  ? 'border-sky-600 bg-sky-50/80 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  NORMAL
                </span>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'NORMAL'}
                  onChange={() => setPriority('NORMAL')}
                  className="accent-sky-600"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 mt-2">
                Preventive Maintenance
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Pekerjaan terjadwal rutin mingguan / bulanan sesuai jadwal PM.
              </p>
            </div>

            {/* LOW */}
            <div
              onClick={() => setPriority('LOW')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                priority === 'LOW'
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  RENDAH (LOW)
                </span>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'LOW'}
                  onChange={() => setPriority('LOW')}
                  className="accent-emerald-600"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 mt-2">
                Workshop & Rutin
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Persiapan cadangan workshop / pekerjaan sipil pemeliharaan umum.
              </p>
            </div>
          </div>
        </div>

        {/* WORK ORDER & TARGET PLANT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Nomor Work Order (SAP PM) *
              </label>
              <button
                type="button"
                onClick={handleGenerateWONumber}
                className="text-[10px] text-sky-600 hover:text-sky-800 inline-flex items-center gap-1"
                title="Buat acak nomor WO"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto WO</span>
              </button>
            </div>
            <input
              type="text"
              value={workOrderNumber}
              onChange={(e) => setWorkOrderNumber(e.target.value)}
              placeholder="Contoh: WO-2026-PM-0482"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Unit Pabrik Sasaran *
            </label>
            <select
              value={targetPlant}
              onChange={(e) => setTargetPlant(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {PLANT_UNITS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Tag Peralatan / Mesin *
            </label>
            <input
              type="text"
              value={equipmentTag}
              onChange={(e) => setEquipmentTag(e.target.value)}
              placeholder="Contoh: P-101A (Booster Pump Amonia)"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* REASON / JUSTIFIKASI TEKNIS */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Urgensi & Justifikasi Teknis Permohonan *
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Jelaskan kondisi kerusakan mesin, alasan permohonan material, dan rencana pemasangan..."
            required
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
          />
        </div>

        {/* MATERIAL ITEM SELECTION (INTEGRATED WITH REAL-TIME STOCK) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Material yang Dipesan (Stok Gudang Real-Time)
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih material dari database inventaris terintegrasi PT Pusri Palembang.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItemRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris Material</span>
            </button>
          </div>

          <div className="space-y-3">
            {selectedItems.map((row, index) => {
              const selectedMat = materials.find((m) => m.id === row.materialId);
              const isStockCritical = selectedMat && selectedMat.stock <= selectedMat.safetyStock;
              const isOutOfStock = selectedMat && selectedMat.stock <= 0;
              const isRequestExceedingStock = selectedMat && row.quantity > selectedMat.stock;

              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    {/* Material Dropdown */}
                    <div className="md:col-span-7">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Pilih Item Material (Katalog Pusri) #{index + 1}
                      </label>
                      <select
                        value={row.materialId}
                        onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            [{m.code}] {m.name} — (Stok: {m.stock} {m.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity requested */}
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Jumlah Diminta ({selectedMat?.unit || 'Item'})
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={row.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                          {selectedMat?.unit}
                        </span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="md:col-span-2 flex items-end justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(index)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus baris material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Info Bar */}
                  {selectedMat && (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200 text-[11px]">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">
                          Lokasi Rak: <strong className="text-slate-700">{selectedMat.binLocation}</strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">
                          Spesifikasi: <span className="text-slate-700 truncate max-w-xs inline-block align-bottom">{selectedMat.specification}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-600">Stok Tersedia:</span>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                            isOutOfStock
                              ? 'bg-rose-100 text-rose-800'
                              : isStockCritical
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {selectedMat.stock} {selectedMat.unit}
                        </span>
                      </div>
                    </div>
                  )}

                  {isRequestExceedingStock && (
                    <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Jumlah diminta ({row.quantity} {selectedMat?.unit}) melebihi stok fisik tersedia ({selectedMat?.stock} {selectedMat?.unit}). Pengajuan mungkin dialihkan ke Purchasing atau dialokasikan sebagian oleh verifikator pabrik.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Permohonan akan otomatis diverifikasi oleh Tim Departemen Pabrik berdasarkan ketersediaan fisik stok gudang.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-950 rounded-lg shadow-sm transition-colors"
            >
              Kirim Reservasi Material
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
