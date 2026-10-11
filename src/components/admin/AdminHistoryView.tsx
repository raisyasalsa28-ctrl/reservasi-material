import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Search } from 'lucide-react';

export const AdminHistoryView: React.FC = () => {
  const { reservations } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = reservations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.workOrderNumber.toLowerCase().includes(q) ||
      r.requestedBy.name.toLowerCase().includes(q) ||
      r.targetPlant.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'WorkOrder', 'UnitPabrik', 'Prioritas', 'Status', 'Pemohon', 'WaktuPengajuan'];
    const rows = filtered.map((r) => [
      r.id,
      r.workOrderNumber,
      r.targetPlant,
      r.priority,
      r.status,
      r.requestedBy.name,
      r.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_reservasi_material_pusri_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Log & Rekapitulasi Alokasi Material PT Pusri
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arsip digital seluruh transaksi pengeluaran dan verifikasi antar departemen pabrik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari arsip permintaan..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3.5">No. Permintaan</th>
              <th className="py-3 px-3.5">Work Order</th>
              <th className="py-3 px-3.5">Unit Pabrik</th>
              <th className="py-3 px-3.5">Departemen Pemohon</th>
              <th className="py-3 px-3.5">Prioritas</th>
              <th className="py-3 px-3.5">Status Akhir</th>
              <th className="py-3 px-3.5 font-mono text-right">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3.5 font-mono font-bold text-slate-900">#{res.id}</td>
                <td className="py-3 px-3.5 font-mono text-slate-600">{res.workOrderNumber}</td>
                <td className="py-3 px-3.5 font-medium text-slate-800">{res.targetPlant}</td>
                <td className="py-3 px-3.5 text-slate-600">{res.requestedBy.name}</td>
                <td className="py-3 px-3.5 font-mono font-semibold">{res.priority}</td>
                <td className="py-3 px-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      res.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : res.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : res.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {res.status === 'APPROVED'
                      ? 'Disetujui'
                      : res.status === 'COMPLETED'
                      ? 'Selesai'
                      : res.status === 'PENDING'
                      ? 'Menunggu'
                      : 'Purchasing'}
                  </span>
                </td>
                <td className="py-3 px-3.5 font-mono text-slate-500 text-right">{res.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
