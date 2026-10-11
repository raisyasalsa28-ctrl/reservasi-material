import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Reservation, PriorityLevel, ReservationStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  Building,
  ShieldCheck,
  UserCheck,
  Check,
  ShoppingCart,
} from 'lucide-react';

interface UserReservationListProps {
  onNewRequest: () => void;
  selectedReservationId?: string | null;
}

export const UserReservationList: React.FC<UserReservationListProps> = ({
  onNewRequest,
  selectedReservationId,
}) => {
  const { reservations, completeReservation, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(selectedReservationId || null);

  // Complete Receipt Modal State
  const [confirmReceiptId, setConfirmReceiptId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState('Teknisi Pemeliharaan Lapangan');
  const [handoverNotes, setHandoverNotes] = useState('Barang diterima sesuai spesifikasi dan dalam kondisi baik.');

  // Filtering
  const filteredReservations = reservations.filter((r) => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchSearch =
      r.id.toLowerCase().includes(query) ||
      r.workOrderNumber.toLowerCase().includes(query) ||
      r.equipmentTag.toLowerCase().includes(query) ||
      r.targetPlant.toLowerCase().includes(query) ||
      r.items.some((item) =>
        item.materialName.toLowerCase().includes(query) ||
        item.materialCode.toLowerCase().includes(query)
      );

    // Status filter
    let matchStatus = true;
    if (statusFilter === 'IN_PROGRESS') {
      matchStatus = r.status === 'PENDING' || r.status === 'APPROVED';
    } else if (statusFilter === 'COMPLETED') {
      matchStatus = r.status === 'COMPLETED';
    } else if (statusFilter === 'REJECTED') {
      matchStatus = r.status === 'REJECTED';
    }

    // Priority filter
    const matchPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            EMERGENCY / SHUTDOWN
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            TINGGI (&lt; 24 JAM)
          </span>
        );
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            NORMAL (PM)
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            RENDAH (RUTIN)
          </span>
        );
    }
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            Menunggu Verifikasi Pabrik
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disetujui (Siap Diambil)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" />
            Selesai (Material Diterima)
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShoppingCart className="w-3 h-3 text-rose-600" />
            Purchasing
          </span>
        );
    }
  };

  const handleConfirmReceipt = (id: string) => {
    completeReservation(id, receiverName, handoverNotes);
    setConfirmReceiptId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari No. Permintaan, Work Order, Tag Mesin, Material..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Status Segmented Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({reservations.length})
            </button>
            <button
              onClick={() => setStatusFilter('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'IN_PROGRESS'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diproses ({reservations.filter((r) => r.status === 'PENDING' || r.status === 'APPROVED').length})
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'COMPLETED'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Selesai ({reservations.filter((r) => r.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'REJECTED'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Purchasing ({reservations.filter((r) => r.status === 'REJECTED').length})
            </button>
          </div>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="HIGH">Tinggi</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Rendah</option>
          </select>

          <button
            onClick={onNewRequest}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            + Buat Reservasi
          </button>
        </div>
      </div>

      {/* Reservation List Cards */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak Ada Permohonan Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Tidak ada permintaan reservasi material yang sesuai dengan kriteria pencarian atau filter yang dipilih.
          </p>
          <button
            onClick={onNewRequest}
            className="px-4 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
          >
            Ajukan Reservasi Material Baru
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => {
            const isExpanded = expandedId === res.id;

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      #{res.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      WO: {res.workOrderNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {res.targetPlant}
                    </span>
                    {getPriorityBadge(res.priority)}
                  </div>

                  <div className="flex items-center gap-3 justify-between lg:justify-end">
                    {getStatusBadge(res.status)}

                    <div className="flex items-center gap-2">
                      {res.status === 'APPROVED' && (
                        <button
                          onClick={() => setConfirmReceiptId(res.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                          title="Konfirmasi barang sudah diambil di gudang"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Konfirmasi Diterima</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : res.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label={isExpanded ? 'Tutup detail' : 'Buka detail'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary Info */}
                <div className="p-4 sm:p-5 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tag Mesin / Sasaran:</span>
                      <span className="font-semibold text-slate-900">{res.equipmentTag}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Rincian Material:</span>
                      <span className="text-slate-800 font-medium">
                        {res.items.map((i) => `${i.materialName} (${i.quantityRequested} ${i.unit})`).join(', ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Waktu Pengajuan:</span>
                      <span className="font-mono text-slate-700">{res.createdAt}</span>
                    </div>
                  </div>

                  {/* Rejection Alert Banner if rejected */}
                  {res.status === 'REJECTED' && res.verificationDetails?.rejectionReason && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Alasan Penolakan oleh Verifikator Pabrik:</strong>
                        <p className="mt-0.5 text-rose-800 leading-relaxed">
                          {res.verificationDetails.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Approved Pickup Notice */}
                  {res.status === 'APPROVED' && res.verificationDetails && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold text-emerald-950">
                            Material Disetujui & Siap Diambil di Gudang:
                          </strong>
                          <p className="mt-0.5 text-emerald-800">
                            Lokasi: <span className="font-bold">{res.verificationDetails.pickupLocation}</span> · Batas Waktu: <span className="font-mono">{res.verificationDetails.pickupDeadline}</span>
                          </p>
                          {res.verificationDetails.notes && (
                            <p className="text-[11px] text-emerald-700 mt-0.5 italic">
                              "{res.verificationDetails.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Detailed Audit Trail / Stepper */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in fade-in-50 duration-150">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Justifikasi & Deskripsi Kebutuhan Teknis
                      </h4>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {res.reason}
                      </p>
                    </div>

                    {/* Material Table Breakdown */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Detail Item Material & Status Alokasi Fisik
                      </h4>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-semibold">
                            <tr>
                              <th className="py-2 px-3">Kode SAP</th>
                              <th className="py-2 px-3">Nama Material</th>
                              <th className="py-2 px-3 text-right">Kuantitas Diminta</th>
                              <th className="py-2 px-3 text-center">Satuan</th>
                              <th className="py-2 px-3 text-right">Stok Gudang (Saat Pengajuan)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {res.items.map((item) => (
                              <tr key={item.materialId} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-mono font-medium text-slate-900">
                                  {item.materialCode}
                                </td>
                                <td className="py-2 px-3 font-medium text-slate-800">
                                  {item.materialName}
                                </td>
                                <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-sky-900">
                                  {item.quantityRequested}
                                </td>
                                <td className="py-2 px-3 text-center text-slate-600">
                                  {item.unit}
                                </td>
                                <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                                  {item.availableStockSnapshot} {item.unit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Audit Trail & Tracking Stepper */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Audit Trail & Riwayat Verifikasi Transparan
                      </h4>
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {res.timeline.map((event, idx) => (
                          <div key={event.id || idx} className="relative">
                            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-sky-700 border-2 border-white shadow-xs" />
                            <div className="text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{event.step}</span>
                                <span className="text-slate-400">·</span>
                                <span className="font-mono text-[11px] text-slate-500">{event.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5">
                                Pelaku / Otoritas: <strong className="text-slate-800">{event.actor}</strong>
                              </p>
                              {event.notes && (
                                <p className="text-[11px] text-slate-500 mt-1 italic bg-slate-50 p-2 rounded border border-slate-100">
                                  {event.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}


      {/* Receipt Confirmation Modal */}
      {confirmReceiptId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Konfirmasi Pengambilan Material</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan menandai bahwa material untuk permintaan{' '}
              <strong className="font-mono text-slate-900">#{confirmReceiptId}</strong> telah diambil dari gudang PT Pusri dan siap digunakan untuk pekerjaan pemeliharaan.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Petugas Penerima Lapangan
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Kondisi Fisik Material
              </label>
              <textarea
                rows={2}
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmReceiptId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmReceipt(confirmReceiptId)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                Konfirmasi Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
