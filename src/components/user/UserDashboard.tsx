import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  ArrowRight,
  Package,
  Calendar,
  AlertTriangle,
  Building2,
  ShoppingCart,
} from 'lucide-react';

interface UserDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, reservations, materials } = useApp();

  const totalCount = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reservations.filter((r) => r.status === 'APPROVED').length;
  const completedCount = reservations.filter((r) => r.status === 'COMPLETED').length;
  const rejectedCount = reservations.filter((r) => r.status === 'REJECTED').length;

  const emergencyActive = reservations.filter(
    (r) => r.priority === 'EMERGENCY' && (r.status === 'PENDING' || r.status === 'APPROVED')
  );

  const recentReservations = reservations.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 p-6 sm:p-8 text-white overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
            DEPARTEMEN PEMELIHARAAN (MAINTENANCE) · PT PUSRI PALEMBANG
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
            Selamat Datang, {currentUser?.name || 'Teknisi Pemeliharaan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Pantau status reservasi material secara langsung dan transparan, ajukan kebutuhan suku cadang darurat maupun terjadwal dengan integrasi stok gudang real-time.
          </p>

        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block">
          <img
            src="/src/assets/images/pusri_plant_complex_1791703384950.jpg"
            alt="Pabrik Pusri"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Emergency Alert Callout if exists */}
      {emergencyActive.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Perhatian: {emergencyActive.length} Permintaan Prioritas Emergency Aktif!
              </h4>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                {emergencyActive.map((e) => `#${e.id} (${e.targetPlant} - ${e.equipmentTag})`).join(', ')} sedang dalam penanganan prioritas tertinggi. Verifikator pabrik telah menerima alert otomatis.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('user-my-reservations')}
            className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Lihat Permintaan
          </button>
        </div>
      )}

      {/* KPI Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium">Total Permintaan</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-slate-900">
            {totalCount}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Seluruh riwayat sesi</span>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-semibold">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-amber-900">
            {pendingCount}
          </p>
          <span className="text-[10px] text-amber-700 mt-1 block">Antrean Dept. Pabrik</span>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-semibold">Disetujui (Siap Ambil)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-emerald-900">
            {approvedCount}
          </p>
          <span className="text-[10px] text-emerald-700 mt-1 block">Stok gudang dialokasikan</span>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-[11px] font-semibold">Selesai (Diterima)</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-blue-900">
            {completedCount}
          </p>
          <span className="text-[10px] text-blue-700 mt-1 block">Tuntas serah terima</span>
        </div>

        {/* Purchasing */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-[11px] font-semibold">Purchasing</span>
            <ShoppingCart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-rose-900">
            {rejectedCount}
          </p>
          <span className="text-[10px] text-rose-700 mt-1 block">Stok minim</span>
        </div>
      </div>

      {/* Main Grid: Recent Requests */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Histori Permintaan Terakhir</h3>
            <p className="text-xs text-slate-500">Permintaan yang baru-baru ini diajukan</p>
          </div>
          <button
            onClick={() => onNavigateTab('user-my-reservations')}
            className="inline-flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900 font-semibold"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recentReservations.map((res) => {
            const statusColor =
              res.status === 'APPROVED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : res.status === 'PENDING'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : res.status === 'COMPLETED'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-rose-50 text-rose-700 border-rose-200';

            return (
              <div
                key={res.id}
                onClick={() => onNavigateTab('user-my-reservations')}
                className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">#{res.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-[11px] text-slate-600">{res.workOrderNumber}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-600 font-medium">{res.targetPlant}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium truncate mt-1">
                    {res.equipmentTag} — {res.items.map((i) => i.materialName).join(', ')}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{res.createdAt}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColor}`}>
                    {res.status === 'PENDING'
                      ? 'Menunggu Verifikasi'
                      : res.status === 'APPROVED'
                      ? 'Disetujui'
                      : res.status === 'COMPLETED'
                      ? 'Selesai'
                      : 'Purchasing'}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-1 font-semibold">
                    {res.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
