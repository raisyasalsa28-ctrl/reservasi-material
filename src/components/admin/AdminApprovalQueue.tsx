import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Reservation, PriorityLevel } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Clock,
  Package,
  ChevronDown,
  ChevronUp,
  Building,
  Check,
  X,
  MapPin,
  Calendar,
  ShoppingCart,
} from 'lucide-react';

export const AdminApprovalQueue: React.FC = () => {
  const { reservations, materials, verifyReservation, showToast } = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Approval Modal State
  const [approvingReservation, setApprovingReservation] = useState<Reservation | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('Stok telah diverifikasi dan dialokasikan untuk pemeliharaan.');
  const [pickupLocation, setPickupLocation] = useState('Gudang Sentral Material PT Pusri');
  const [pickupDeadline, setPickupDeadline] = useState('3 Hari Kerja (Pukul 08:00 - 15:30)');

  // Rejection Modal State
  const [rejectingReservation, setRejectingReservation] = useState<Reservation | null>(null);
  const [rejectionReasonPreset, setRejectionReasonPreset] = useState(
    'Stok dialokasikan untuk Turnaround / Emergency Plant Utama'
  );
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Pending reservations first, prioritized by EMERGENCY -> HIGH -> NORMAL -> LOW
  const pendingReservations = [...reservations]
    .filter((r) => r.status === 'PENDING')
    .sort((a, b) => {
      const pWeights: Record<PriorityLevel, number> = {
        EMERGENCY: 4,
        HIGH: 3,
        NORMAL: 2,
        LOW: 1,
      };
      return pWeights[b.priority] - pWeights[a.priority];
    });

  const processedReservations = [...reservations].filter((r) => r.status !== 'PENDING');

  const openApproveModal = (res: Reservation) => {
    // Determine suggested bin location from items
    const firstItem = materials.find((m) => m.id === res.items[0]?.materialId);
    setPickupLocation(firstItem ? firstItem.binLocation : 'Gudang Sentral Material');
    setApprovalNotes('Stok fisik tersedia di rak dan telah dialokasikan.');
    setApprovingReservation(res);
  };

  const openRejectModal = (res: Reservation) => {
    setRejectionReasonPreset('Stok fisik tidak mencukupi / dialokasikan untuk Turnaround');
    setRejectionNotes('');
    setRejectingReservation(res);
  };

  const handleConfirmApproval = () => {
    if (!approvingReservation) return;
    const ok = verifyReservation(
      approvingReservation.id,
      'APPROVED',
      approvalNotes,
      pickupLocation,
      pickupDeadline
    );
    if (ok) {
      setApprovingReservation(null);
    }
  };

  const handleConfirmRejection = () => {
    if (!rejectingReservation) return;
    const fullReason = rejectionNotes.trim()
      ? `${rejectionReasonPreset} — ${rejectionNotes.trim()}`
      : rejectionReasonPreset;

    const ok = verifyReservation(
      rejectingReservation.id,
      'REJECTED',
      fullReason,
      undefined,
      undefined,
      fullReason
    );
    if (ok) {
      setRejectingReservation(null);
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            EMERGENCY / SHUTDOWN
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            TINGGI (URGENT)
          </span>
        );
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            NORMAL (PM)
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            RENDAH (RUTIN)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Queue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Antrean Verifikasi Permohonan Material
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 font-mono">
              {pendingReservations.length} Butuh Tindakan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Departemen Pabrik bertindak sebagai verifikator tunggal alokasi inventaris gudang PT Pusri.
          </p>
        </div>
      </div>

      {/* Pending Items List */}
      {pendingReservations.length === 0 ? (
        <div className="p-10 rounded-xl bg-white border border-slate-200 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Semua Permohonan Telah Diverifikasi</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada permohonan material yang tertahan di antrean. Gudang dan pabrik dalam status sinkron.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReservations.map((res) => {
            const isExpanded = expandedId === res.id;

            // Check if any item requested exceeds stock
            const stockChecks = res.items.map((item) => {
              const currentMat = materials.find((m) => m.id === item.materialId);
              const available = currentMat ? currentMat.stock : 0;
              const hasEnough = available >= item.quantityRequested;
              return { item, currentMat, available, hasEnough };
            });

            const anyItemShortage = stockChecks.some((c) => !c.hasEnough);

            return (
              <div
                key={res.id}
                className={`rounded-xl border shadow-xs bg-white overflow-hidden transition-all ${
                  res.priority === 'EMERGENCY'
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">#{res.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-xs text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      WO: {res.workOrderNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {res.targetPlant}
                    </span>
                    {getPriorityBadge(res.priority)}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {/* Approve button */}
                    <button
                      onClick={() => openApproveModal(res)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
                      title="Setujui permohonan dan potong stok gudang"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui (Approve)</span>
                    </button>

                    {/* Purchasing button */}
                    <button
                      onClick={() => openRejectModal(res)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
                      title="Alihkan ke Purchasing"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-rose-600" />
                      <span>Purchasing</span>
                    </button>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : res.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Pemohon (NIP):</span>
                      <span className="font-semibold text-slate-900">
                        {res.requestedBy.name} ({res.requestedBy.nip})
                      </span>
                      <span className="text-[11px] text-slate-500 block">{res.requestedBy.division}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Sasaran Mesin / Tag:</span>
                      <span className="font-semibold text-slate-900">{res.equipmentTag}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Waktu Pengajuan:</span>
                      <span className="font-mono text-slate-700">{res.createdAt}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Justifikasi Urgensi:</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed italic">
                      "{res.reason}"
                    </p>
                  </div>

                  {/* Stock validation table */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Verifikasi Ketersediaan Stok Real-Time
                      </span>
                      {anyItemShortage && (
                        <span className="text-xs text-rose-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Peringatan: Stok fisik kurang dari permintaan!
                        </span>
                      )}
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-semibold">
                          <tr>
                            <th className="py-2 px-3">Kode SAP</th>
                            <th className="py-2 px-3">Nama Material & Spesifikasi</th>
                            <th className="py-2 px-3">Lokasi Rak Gudang</th>
                            <th className="py-2 px-3 text-right">Jumlah Diminta</th>
                            <th className="py-2 px-3 text-right">Stok Fisik Saat Ini</th>
                            <th className="py-2 px-3 text-center">Status Stok</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {stockChecks.map(({ item, currentMat, available, hasEnough }) => (
                            <tr key={item.materialId} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono font-medium text-slate-900">
                                {item.materialCode}
                              </td>
                              <td className="py-2 px-3 font-medium text-slate-800">
                                {item.materialName}
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-600">
                                {currentMat?.binLocation || '-'}
                              </td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-sky-900">
                                {item.quantityRequested} {item.unit}
                              </td>
                              <td className="py-2 px-3 text-right font-mono tabular-nums font-bold">
                                <span className={hasEnough ? 'text-emerald-700' : 'text-rose-600'}>
                                  {available} {item.unit}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                {hasEnough ? (
                                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                    Cukup
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                                    Kurang
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History of Processed Reservations */}
      <div className="pt-6 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Histori Permohonan yang Telah Diproses ({processedReservations.length})
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">No. Permintaan</th>
                <th className="py-2.5 px-3">Work Order</th>
                <th className="py-2.5 px-3">Unit Pabrik</th>
                <th className="py-2.5 px-3">Pemohon</th>
                <th className="py-2.5 px-3">Prioritas</th>
                <th className="py-2.5 px-3">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedReservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">#{res.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{res.workOrderNumber}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">{res.targetPlant}</td>
                  <td className="py-2.5 px-3 text-slate-600">{res.requestedBy.name}</td>
                  <td className="py-2.5 px-3">{getPriorityBadge(res.priority)}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        res.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.status === 'APPROVED'
                        ? 'Disetujui'
                        : res.status === 'COMPLETED'
                        ? 'Selesai'
                        : 'Purchasing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL MODAL */}
      {approvingReservation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Persetujuan Reservasi Material Pabrik</span>
              </div>
              <button
                onClick={() => setApprovingReservation(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Menyetujui permintaan <strong className="font-mono text-slate-900">#{approvingReservation.id}</strong> ({approvingReservation.workOrderNumber}). Stok fisik di gudang akan otomatis dipotong secara real-time.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi Rak / Gudang Pengambilan
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batas Waktu Pengambilan Suku Cadang
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={pickupDeadline}
                  onChange={(e) => setPickupDeadline(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Verifikator untuk Pemohon
              </label>
              <textarea
                rows={2}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApprovingReservation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                Setujui & Potong Stok Real-Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectingReservation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                <ShoppingCart className="w-5 h-5 text-rose-600" />
                <span>Pengalihan ke Purchasing Material</span>
              </div>
              <button
                onClick={() => setRejectingReservation(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Permohonan <strong className="font-mono text-slate-900">#{rejectingReservation.id}</strong> akan dialihkan ke bagian Purchasing. Pemohon akan menerima notifikasi transparan berisi alasan di bawah ini.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Alasan Pengalihan Purchasing
              </label>
              <select
                value={rejectionReasonPreset}
                onChange={(e) => setRejectionReasonPreset(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Stok fisik tidak mencukupi / dialokasikan untuk Turnaround">
                  Stok Terbatas: Dialokasikan untuk Critical Safety Turnaround Unit
                </option>
                <option value="Spesifikasi material tidak sesuai standar Work Order">
                  Spesifikasi Tidak Cocok: Gunakan alternatif material tipe lain
                </option>
                <option value="Batas alokasi pemeliharaan unit telah melampaui batas">
                  Batas Alokasi: Melebihi plafon alokasi pemeliharaan bulanan
                </option>
                <option value="Nomor Work Order belum tervalidasi di sistem SAP PM">
                  Validasi WO: Nomor Work Order belum terverifikasi SAP PM
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Penjelasan Tambahan / Rekomendasi Solusi Purchasing
              </label>
              <textarea
                rows={3}
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Berikan instruksi tambahan ke pemohon (misal: ajukan PO pengadaan darurat ke Dept Purchasing)..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingReservation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors"
              >
                Kirim ke Purchasing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
