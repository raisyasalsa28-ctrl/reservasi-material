import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockData';
import { ShieldCheck, Wrench, Building2, Key, UserCheck, AlertCircle, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'user' | 'admin';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'user',
}) => {
  const { loginAs, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>(defaultRole);

  // User form states
  const [userNip, setUserNip] = useState('19880412-201201-1-002');
  const [userPassword, setUserPassword] = useState('••••••••••••');
  const [userDivision, setUserDivision] = useState('Mekanikal & Rotating');
  const [userShift, setUserShift] = useState('Non-Shift Normal Day');

  // Admin form states
  const [adminNip, setAdminNip] = useState('19840215-200903-1-001');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminPlantUnit, setAdminPlantUnit] = useState('Pusri III');
  const [adminAuthPin, setAdminAuthPin] = useState('PSI-VRF-2026');

  if (!isOpen) return null;

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('user', {
      nip: userNip || DEMO_USERS.user.nip,
      division: `Seksi Pemeliharaan ${userDivision}`,
    });
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('admin', {
      nip: adminNip || DEMO_USERS.admin.nip,
      plantLocation: adminPlantUnit,
    });
    onClose();
  };

  const handleQuickDemoUser = () => {
    loginAs('user');
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    loginAs('admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        {/* Header with Pusri visual banner */}
        <div className="relative h-28 bg-sky-950 overflow-hidden flex items-end p-6">
          <img
            src="/src/assets/images/pusri_plant_complex_1791703384950.jpg"
            alt="PT Pusri Palembang"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/70 to-transparent" />
          
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-sky-300 uppercase block font-semibold">
                PT PUPUK SRIWIDJAJA PALEMBANG
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Portal Otentikasi SIM-Pusri
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'user'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4 text-emerald-700" />
              <span>Departemen Pemeliharaan (User)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-800" />
              <span>Departemen Pabrik (Admin / Verifikator)</span>
            </button>
          </div>

          {/* Form 1: Departemen Pemeliharaan (User) */}
          {selectedRole === 'user' ? (
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Akses Pemohon Material Lapangan</span>
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Khusus teknisi dan supervisor pemeliharaan untuk mengajukan reservasi spare part & melacak status approval.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Pegawai Pemeliharaan
                  </label>
                  <input
                    type="text"
                    value={userNip}
                    onChange={(e) => setUserNip(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="19880412-201201-1-002"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi SSO Pusri
                  </label>
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>


              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  Masuk sebagai Pemohon Pemeliharaan
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoUser}
                  className="py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Demo User (Ir. Bambang)
                </button>
              </div>
            </form>
          ) : (
            /* Form 2: Departemen Pabrik & Verifikator Gudang (Admin) */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-lg text-sky-950 text-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>Otoritas Verifikator Departemen Pabrik & Gudang</span>
                </p>
                <p className="text-[11px] text-sky-700 mt-0.5">
                  Mengelola alokasi stok, persetujuan dan penolakan permohonan material, serta inventaris real-time PT Pusri.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Verifikator Pabrik
                  </label>
                  <input
                    type="text"
                    value={adminNip}
                    onChange={(e) => setUserNip(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="19840215-200903-1-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Otoritas
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Pabrik & Pengendalian Gudang
                  </label>
                  <select
                    value={adminPlantUnit}
                    onChange={(e) => setAdminPlantUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Pusri III">Pusri III</option>
                    <option value="Pusri IV">Pusri IV</option>
                    <option value="Pusri IB">Pusri IB</option>
                    <option value="Pusri II-B">Pusri II-B</option>
                    <option value="NPK Fusion">NPK Fusion</option>
                    <option value="NPK Fusion II">NPK Fusion II</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kode Token Otorisasi Verifikator
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={adminAuthPin}
                      onChange={(e) => setAdminAuthPin(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                      placeholder="PSI-VRF-2026"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-sky-900 hover:bg-sky-950 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  Masuk sebagai Verifikator Pabrik
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Demo Admin (Hendra Wijaya)
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sistem Terintegrasi SAP PM & ERP PT Pusri</span>
            <span className="font-mono">Security Level: Enterprise Class</span>
          </div>
        </div>
      </div>
    </div>
  );
};
