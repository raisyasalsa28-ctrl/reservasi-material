import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialItem, MaterialCategory } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Layers,
  ArrowUpDown,
  MapPin,
  X,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

export const AdminInventoryManager: React.FC = () => {
  const { materials, updateMaterialStock, addNewMaterial, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'CRITICAL' | 'NORMAL'>('ALL');

  // Stock Adjustment Modal
  const [adjustingMaterial, setAdjustingMaterial] = useState<MaterialItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<'ADD' | 'SUBTRACT' | 'SET'>('ADD');
  const [adjustReason, setAdjustReason] = useState('Penerimaan PO Baru dari Supplier / Vendor');

  // Add Material Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMatCode, setNewMatCode] = useState('');
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<MaterialCategory>('MEKANIKAL');
  const [newMatSpec, setNewMatSpec] = useState('');
  const [newMatStock, setNewMatStock] = useState<number>(10);
  const [newMatSafetyStock, setNewMatSafetyStock] = useState<number>(3);
  const [newMatUnit, setNewMatUnit] = useState('Pcs');
  const [newMatBinLocation, setNewMatBinLocation] = useState('Gudang Sentral - Rak M-01');
  const [newMatPrice, setNewMatPrice] = useState<number>(1500000);

  // Filter materials
  const filteredMaterials = materials.filter((mat) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      mat.name.toLowerCase().includes(query) ||
      mat.code.toLowerCase().includes(query) ||
      mat.specification.toLowerCase().includes(query) ||
      mat.binLocation.toLowerCase().includes(query);

    const matchCategory = categoryFilter === 'ALL' || mat.category === categoryFilter;

    let matchStock = true;
    if (stockStatusFilter === 'CRITICAL') {
      matchStock = mat.stock <= mat.safetyStock;
    } else if (stockStatusFilter === 'NORMAL') {
      matchStock = mat.stock > mat.safetyStock;
    }

    return matchSearch && matchCategory && matchStock;
  });

  const criticalCount = materials.filter((m) => m.stock <= m.safetyStock).length;

  const handleOpenAdjustModal = (mat: MaterialItem) => {
    setAdjustingMaterial(mat);
    setAdjustQty(5);
    setAdjustType('ADD');
    setAdjustReason('Penerimaan kiriman vendor pabrik');
  };

  const handleSaveStockAdjustment = () => {
    if (!adjustingMaterial) return;

    let calculatedStock = adjustingMaterial.stock;
    if (adjustType === 'ADD') {
      calculatedStock += adjustQty;
    } else if (adjustType === 'SUBTRACT') {
      calculatedStock = Math.max(0, calculatedStock - adjustQty);
    } else {
      calculatedStock = Math.max(0, adjustQty);
    }

    updateMaterialStock(adjustingMaterial.id, calculatedStock, adjustReason);
    setAdjustingMaterial(null);
  };

  const handleSaveNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatCode.trim() || !newMatName.trim()) {
      showToast('error', 'Form Belum Lengkap', 'Kode dan Nama Material wajib diisi.');
      return;
    }

    addNewMaterial({
      code: newMatCode.toUpperCase(),
      name: newMatName,
      category: newMatCategory,
      specification: newMatSpec,
      stock: Number(newMatStock) || 0,
      safetyStock: Number(newMatSafetyStock) || 0,
      unit: newMatUnit,
      binLocation: newMatBinLocation,
      priceEstimate: Number(newMatPrice) || 0,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewMatCode('');
    setNewMatName('');
    setNewMatSpec('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500">Total Material Terdaftar</span>
            <p className="text-2xl font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
              {materials.length} Item
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500">Stok Kritis (&le; Safety Stock)</span>
            <p className="text-2xl font-mono font-bold text-rose-600 mt-0.5 tabular-nums">
              {criticalCount} Item
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500">Kondisi Pergudangan Pusri</span>
            <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sistem Sinkron Real-Time
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kode SAP, rak, spesifikasi..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MEKANIKAL">Mekanikal & Rotating</option>
            <option value="LISTRIK_INSTRUMEN">Listrik & Instrumen</option>
            <option value="PIPING_VALVE">Piping & Valve</option>
            <option value="PELUMAS_GREASE">Pelumas & Oli</option>
            <option value="FASTENER_GASKET">Fastener & Gasket</option>
            <option value="KIMIA_KATALIS">Bahan Kimia & Katalis</option>
            <option value="SAFETY_APD">K3 & APD</option>
          </select>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">Semua Status Stok</option>
            <option value="CRITICAL">Stok Kritis (&le; Safety)</option>
            <option value="NORMAL">Stok Aman</option>
          </select>
        </div>
      </div>

      {/* Materials Inventory Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3.5 font-mono">Kode SAP</th>
              <th className="py-3 px-3.5">Nama Material & Spesifikasi</th>
              <th className="py-3 px-3.5">Kategori</th>
              <th className="py-3 px-3.5">Lokasi Rak Gudang</th>
              <th className="py-3 px-3.5 text-right">Stok Fisik</th>
              <th className="py-3 px-3.5 text-right">Safety Stock</th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMaterials.map((mat) => {
              const isCritical = mat.stock <= mat.safetyStock;

              return (
                <tr key={mat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {mat.code}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-slate-900">{mat.name}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{mat.specification}</div>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {mat.category}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {mat.binLocation}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                    <span className={isCritical ? 'text-rose-600' : 'text-slate-900'}>
                      {mat.stock} {mat.unit}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {mat.safetyStock} {mat.unit}
                  </td>
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        <AlertTriangle className="w-3 h-3" />
                        Kritis
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Aman
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenAdjustModal(mat)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sesuaikan Stok</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADJUST STOCK MODAL */}
      {adjustingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Edit3 className="w-5 h-5 text-sky-700" />
                <span>Penyesuaian Stok Gudang Real-Time</span>
              </div>
              <button
                onClick={() => setAdjustingMaterial(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <p className="font-mono text-slate-500 font-semibold">{adjustingMaterial.code}</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{adjustingMaterial.name}</p>
              <p className="text-slate-600 mt-1">
                Stok Fisik Saat Ini: <strong className="font-mono text-sky-900">{adjustingMaterial.stock} {adjustingMaterial.unit}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Penyesuaian
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('ADD')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    adjustType === 'ADD'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  + Tambah Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('SUBTRACT')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    adjustType === 'SUBTRACT'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  - Kurang Keluar
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('SET')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    adjustType === 'SET'
                      ? 'bg-sky-50 border-sky-500 text-sky-800 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  = Set Total Fisik
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kuantitas ({adjustingMaterial.unit})
              </label>
              <input
                type="number"
                min={0}
                value={adjustQty}
                onChange={(e) => setAdjustQty(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tabular-nums font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan / Referensi Berita Acara
              </label>
              <input
                type="text"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Contoh: Kiriman PO-2026-902 atau Hasil Stock Opname Triwulan"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdjustingMaterial(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStockAdjustment}
                className="px-5 py-2 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-950 rounded-lg shadow-xs transition-colors"
              >
                Simpan Penyesuaian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MATERIAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Plus className="w-5 h-5 text-sky-700" />
                <span>Tambah Material Baru ke Inventaris Pusri</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMaterial} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kode SAP Material *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMatCode}
                    onChange={(e) => setNewMatCode(e.target.value)}
                    placeholder="MP-MECH-0992"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kategori Material *
                  </label>
                  <select
                    value={newMatCategory}
                    onChange={(e) => setNewMatCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="MEKANIKAL">Mekanikal & Rotating</option>
                    <option value="LISTRIK_INSTRUMEN">Listrik & Instrumen</option>
                    <option value="PIPING_VALVE">Piping & Valve</option>
                    <option value="PELUMAS_GREASE">Pelumas & Oli</option>
                    <option value="FASTENER_GASKET">Fastener & Gasket</option>
                    <option value="KIMIA_KATALIS">Bahan Kimia & Katalis</option>
                    <option value="SAFETY_APD">K3 & APD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Barang / Spare Part *
                </label>
                <input
                  type="text"
                  required
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  placeholder="Contoh: Impeller Pompa Air Umpan Boiler Multi-Stage"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Spesifikasi Teknis & Standar
                </label>
                <input
                  type="text"
                  value={newMatSpec}
                  onChange={(e) => setNewMatSpec(e.target.value)}
                  placeholder="Material SS316, Diameter 280mm, Seri Sulzer MSD"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newMatStock}
                    onChange={(e) => setNewMatStock(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Safety Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newMatSafetyStock}
                    onChange={(e) => setNewMatSafetyStock(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Satuan Unit
                  </label>
                  <input
                    type="text"
                    value={newMatUnit}
                    onChange={(e) => setNewMatUnit(e.target.value)}
                    placeholder="Pcs / Set / Drum"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lokasi Rak Gudang (Bin / Aisle)
                </label>
                <input
                  type="text"
                  value={newMatBinLocation}
                  onChange={(e) => setNewMatBinLocation(e.target.value)}
                  placeholder="Gudang Sentral - Rak M-08"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-950 rounded-lg shadow-xs transition-colors"
                >
                  Simpan Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
