import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  Warehouse,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, reservations, materials } = useApp();

  const pendingRequests = reservations.filter((r) => r.status === 'PENDING');
  const emergencyRequests = pendingRequests.filter((r) => r.priority === 'EMERGENCY');
  const criticalStockMaterials = materials.filter((m) => m.stock <= m.safetyStock);
  const approvedTotal = reservations.filter((r) => r.status === 'APPROVED' || r.status === 'COMPLETED').length;
  const approvalRate = reservations.length > 0 ? Math.round((approvedTotal / reservations.length) * 100) : 100;

  // Breakdown per plant
  const plantDistribution = [
    'Pusri III',
    'Pusri IV',
    'Pusri IB',
    'Pusri II-B',
    'NPK Fusion',
    'NPK Fusion II',
  ].map((plant) => {
    const count = reservations.filter((r) => r.targetPlant === plant).length;
    return { plant, count };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-6 sm:p-8 text-white overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
            DEPARTEMEN PABRIK & GUDANG MATERIAL · PT PUSRI PALEMBANG
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
            Pusat Kendali Verifikasi & Distribusi Material
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Selamat datang, {currentUser?.name || 'Verifikator Pabrik'}. Otoritas Anda mengatur persetujuan pengeluaran material pemeliharaan berdasarkan ketersediaan stok fisik real-time gudang.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('admin-queue')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi Antrean Permohonan ({pendingRequests.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('admin-inventory')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Kelola Inventaris & Stok</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 hidden md:block">
          <img
            src="/src/assets/images/pusri_warehouse_logistics_1791703399338.jpg"
            alt="Gudang Pusri"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Emergency Alert Callout if exists */}
      {emergencyRequests.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Prioritas Darurat Kritis: {emergencyRequests.length} Permohonan Membutuhkan Keputusan Cepat!
              </h4>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                Permohonan status EMERGENCY dari Pemeliharaan untuk unit{' '}
                <strong>{emergencyRequests.map((e) => e.targetPlant).join(', ')}</strong> berpotensi memicu downtime pabrik jika tidak diverifikasi segera.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('admin-queue')}
            className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Review Sekarang
          </button>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Antrean Pending */}
        <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-semibold">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-amber-900 tabular-nums">
            {pendingRequests.length}
          </p>
          <span className="text-[10px] text-amber-700 mt-1 block">Permintaan siap diproses</span>
        </div>

        {/* Stok Kritis */}
        <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-[11px] font-semibold">Stok &le; Safety Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-rose-900 tabular-nums">
            {criticalStockMaterials.length}
          </p>
          <span className="text-[10px] text-rose-700 mt-1 block">Perlu restock segera</span>
        </div>

        {/* Total Material Terdaftar */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold">Katalog SKU Gudang</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
            {materials.length}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Item aktif di sistem</span>
        </div>

        {/* Approval Rate */}
        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-semibold">Tingkat Persetujuan</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-900 tabular-nums">
            {approvalRate}%
          </p>
          <span className="text-[10px] text-emerald-700 mt-1 block">{approvedTotal} dari {reservations.length} permintaan disetujui</span>
        </div>
      </div>

      {/* Main Grid: Pending Action Feed & Plant Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Permohonan Masuk Menunggu Verifikasi ({pendingRequests.length})
              </h3>
              <p className="text-xs text-slate-500">
                Persetujuan langsung memotong ketersediaan stok fisik gudang
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('admin-queue')}
              className="inline-flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900 font-semibold"
            >
              <span>Buka Seluruh Antrean</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                Antrean bersih. Tidak ada permohonan material yang pending.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 4).map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">#{res.id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-[11px] text-slate-600">{res.workOrderNumber}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-semibold text-slate-800">{res.targetPlant}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium mt-1 truncate">
                      {res.equipmentTag} ({res.items.map((i) => `${i.materialName} x${i.quantityRequested}`).join(', ')})
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      Diajukan oleh {res.requestedBy.name} · {res.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigateTab('admin-queue')}
                      className="px-3 py-1.5 rounded-lg bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Verifikasi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Plant Units Request Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi per Unit Pabrik</h3>
              <p className="text-xs text-slate-500">Volume permohonan material</p>
            </div>
            <Warehouse className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {plantDistribution.map((item) => {
              const max = Math.max(1, ...plantDistribution.map((p) => p.count));
              const pct = Math.round((item.count / max) * 100);

              return (
                <div key={item.plant}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-800">{item.plant}</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {item.count} Permintaan
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-sky-800 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              Departemen Pabrik & Pengendalian Material berhak membatasi atau menolak alokasi material jika melanggar kuota safety stock darurat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
