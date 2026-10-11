import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialItem } from '../types';
import {
  Package,
  Search,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MaterialsCatalogViewProps {
  onSelectToReserve?: (materialId: string) => void;
}

export const MaterialsCatalogView: React.FC<MaterialsCatalogViewProps> = ({
  onSelectToReserve,
}) => {
  const { materials, activeRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredMaterials = materials.filter((mat) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      mat.name.toLowerCase().includes(q) ||
      mat.code.toLowerCase().includes(q) ||
      mat.specification.toLowerCase().includes(q) ||
      mat.binLocation.toLowerCase().includes(q);

    const matchCategory = selectedCategory === 'ALL' || mat.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Katalog Inventaris & Suku Cadang PT Pusri Palembang
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ketersediaan fisik suku cadang, reagen kimia, katup pipa, pelumas, dan instrumen terintegrasi real-time.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode SAP, nama suku cadang, rak..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'Semua Kategori' },
          { key: 'MEKANIKAL', label: 'Mekanikal & Rotating' },
          { key: 'LISTRIK_INSTRUMEN', label: 'Listrik & Instrumen' },
          { key: 'PIPING_VALVE', label: 'Piping & Valve' },
          { key: 'PELUMAS_GREASE', label: 'Pelumas & Oli' },
          { key: 'FASTENER_GASKET', label: 'Fastener & Gasket' },
          { key: 'KIMIA_KATALIS', label: 'Bahan Kimia & Katalis' },
          { key: 'SAFETY_APD', label: 'K3 & APD' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === cat.key
                ? 'bg-sky-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => {
          const isCritical = mat.stock <= mat.safetyStock;
          const isOut = mat.stock <= 0;

          return (
            <div
              key={mat.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {mat.code}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded tabular-nums ${
                      isOut
                        ? 'bg-rose-100 text-rose-800'
                        : isCritical
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Stok: {mat.stock} {mat.unit}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{mat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {mat.specification}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {mat.binLocation}
                  </span>
                  <span>Safety: {mat.safetyStock} {mat.unit}</span>
                </div>
              </div>

              {activeRole === 'user' && onSelectToReserve && (
                <div className="mt-4 pt-2">
                  <button
                    onClick={() => onSelectToReserve(mat.id)}
                    className="w-full py-2 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Ajukan Reservasi Material Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
