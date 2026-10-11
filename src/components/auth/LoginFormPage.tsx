import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import {
  Wrench,
  Building2,
  ShieldCheck,
  Key,
  UserCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

interface LoginFormPageProps {
  onSuccess?: () => void;
}

export const LoginFormPage: React.FC<LoginFormPageProps> = ({ onSuccess }) => {
  const { loginAs, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'staff' | 'admin'>('staff');

  // Staff Form State
  const [staffNip, setStaffNip] = useState(DEMO_USERS.user.nip);
  const [staffPassword, setStaffPassword] = useState('password123');
  const [staffDivision, setStaffDivision] = useState(
    'Seksi Pemeliharaan Mekanikal & Rotating Pabrik 1B'
  );
  const [staffShift, setStaffShift] = useState('Non-Shift Normal Day (07:30 - 16:30)');
  const [rememberStaff, setRememberStaff] = useState(true);
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Admin Form State
  const [adminNip, setAdminNip] = useState(DEMO_USERS.admin.nip);
  const [adminPassword, setAdminPassword] = useState('adminsecure2026');
  const [adminUnit, setAdminUnit] = useState('Pusri III');
  const [adminSecurityToken, setAdminSecurityToken] = useState('PSI-VRF-2026');
  const [confirmAdminTerms, setConfirmAdminTerms] = useState(true);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Error hints
  const [errorMessage, setErrorMessage] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!staffNip.trim()) {
      setErrorMessage('Nomor Induk Pegawai (NIP) wajib diisi.');
      return;
    }
    if (!staffPassword.trim()) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    loginAs('user', {
      nip: staffNip.trim(),
      division: staffDivision,
    });
    if (onSuccess) onSuccess();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!adminNip.trim()) {
      setErrorMessage('NIP Verifikator Pabrik wajib diisi.');
      return;
    }
    if (!adminPassword.trim()) {
      setErrorMessage('Kata sandi verifikator wajib diisi.');
      return;
    }
    if (!adminSecurityToken.trim()) {
      setErrorMessage('Kode token otorisasi verifikator wajib diisi.');
      return;
    }

    loginAs('admin', {
      nip: adminNip.trim(),
      plantLocation: adminUnit,
    });
    if (onSuccess) onSuccess();
  };

  const handleQuickDemoStaff = () => {
    setStaffNip(DEMO_USERS.user.nip);
    setStaffPassword('password123');
    setStaffDivision(DEMO_USERS.user.division);
    loginAs('user');
    if (onSuccess) onSuccess();
  };

  const handleQuickDemoAdmin = () => {
    setAdminNip(DEMO_USERS.admin.nip);
    setAdminPassword('adminsecure2026');
    setAdminUnit(DEMO_USERS.admin.plantLocation);
    setAdminSecurityToken('PSI-VRF-2026');
    loginAs('admin');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Header Branding */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-sky-900 text-white font-extrabold flex items-center justify-center text-lg shadow-md border border-sky-500/30">
              PSI
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block">
                PT PUPUK SRIWIDJAJA PALEMBANG
              </span>
              <span className="text-[11px] text-sky-400 font-medium tracking-tight block">
                Sistem Informasi & Reservasi Material Pabrik (SIM-Pusri)
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Gudang: Real-Time
            </span>
            <span className="text-slate-700">|</span>
            <span>SAP PM & ERP Terintegrasi</span>
          </div>
        </div>
      </header>

      {/* Main Login Split Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950/90 backdrop-blur-xl">
          {/* Left Column: Industrial Visual & Context */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 text-white overflow-hidden bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950">
            <img
              src="/src/assets/images/pusri_plant_complex_1791703384950.jpg"
              alt="Kompleks Pabrik PT Pusri Palembang"
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

            {/* Top Info */}
            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight uppercase">
                SISTEM INFORMASI & RESERVASI MATERIAL PABRIK PT PUPUK SRIWIDJAJA
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistem pengelolaan dan reservasi material yang terintegrasi untuk memantau ketersediaan stok, mempermudah proses permintaan material, serta mendukung efisiensi operasional dan kelancaran kegiatan pemeliharaan pabrik.
              </p>
            </div>


            {/* Bottom Footer Note */}
            <div className="relative z-10 pt-4 border-t border-slate-800 text-center">
              <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">
                PT PUPUK SRIWIDJAJA
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Login Forms */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Portal Selector Tabs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Pilih Portal Masuk
                  </h3>
                  <span className="text-xs text-slate-500">
                    Sistem Otentikasi Terpisah
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('staff');
                      setErrorMessage('');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'staff'
                        ? 'bg-white text-emerald-900 shadow-sm border border-emerald-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Wrench className={`w-4 h-4 ${activeTab === 'staff' ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>Staff Pemeliharaan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin');
                      setErrorMessage('');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'admin'
                        ? 'bg-white text-sky-900 shadow-sm border border-sky-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${activeTab === 'admin' ? 'text-sky-800' : 'text-slate-500'}`} />
                    <span>Admin Pabrik & Gudang</span>
                  </button>
                </div>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ---------------- FORM 1: STAFF PEMELIHARAAN ---------------- */}
              {activeTab === 'staff' && (
                <form onSubmit={handleStaffLogin} className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-emerald-950 text-xs flex items-start gap-2.5">
                    <UserCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Portal Teknisi & Supervisor Pemeliharaan</strong>
                      <span className="text-[11px] text-emerald-800">
                        Gunakan NIP PT Pusri Anda untuk mengajukan permintaan material dan memantau status secara langsung.
                      </span>
                    </div>
                  </div>

                  {/* NIP Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nomor Induk Pegawai (NIP) *
                    </label>
                    <input
                      type="text"
                      value={staffNip}
                      onChange={(e) => setStaffNip(e.target.value)}
                      placeholder="Contoh: 19880412-201201-1-002"
                      required
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">
                        Kata Sandi SSO Pusri *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                      >
                        {showStaffPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Sembunyikan</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Sandi</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showStaffPassword ? 'text' : 'password'}
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white pr-10"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>



                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={rememberStaff}
                        onChange={(e) => setRememberStaff(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>Ingat identitas NIP di perangkat ini</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Bantuan Helpdesk: Ext. 4102</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Masuk Portal Staff Pemeliharaan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Click Demo Login */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuickDemoStaff}
                      className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Masuk Cepat Demo Staff (Ir. Bambang Hermanto)</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ---------------- FORM 2: ADMIN PABRIK & GUDANG ---------------- */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3 bg-sky-50/80 border border-sky-200/80 rounded-xl text-sky-950 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Portal Verifikator Departemen Pabrik & Gudang</strong>
                      <span className="text-[11px] text-sky-800">
                        Otoritas pemeriksaan ketersediaan stok fisik, persetujuan/penolakan permintaan, dan manajemen gudang sentral.
                      </span>
                    </div>
                  </div>

                  {/* Admin NIP */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      NIP Administrator / Verifikator *
                    </label>
                    <input
                      type="text"
                      value={adminNip}
                      onChange={(e) => setAdminNip(e.target.value)}
                      placeholder="Contoh: 19840215-200903-1-001"
                      required
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-sky-700 bg-white"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">
                        Kata Sandi Otoritas Pabrik *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                      >
                        {showAdminPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Sembunyikan</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Sandi</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-sky-700 bg-white pr-10"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  {/* Warehouse Unit & Security Token */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Unit Pabrik / Pergudangan
                      </label>
                      <select
                        value={adminUnit}
                        onChange={(e) => setAdminUnit(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-700"
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
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Kode Token Otorisasi Verifikator *
                      </label>
                      <div className="relative">
                        <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={adminSecurityToken}
                          onChange={(e) => setAdminSecurityToken(e.target.value)}
                          placeholder="PSI-VRF-2026"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-sky-700 bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Compliance Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={confirmAdminTerms}
                        onChange={(e) => setConfirmAdminTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-sky-800 focus:ring-sky-700"
                      />
                      <span className="text-[11px] leading-relaxed">
                        Saya mengonfirmasi bertindak sebagai verifikator resmi Departemen Pabrik sesuai SOP Pengeluaran Material Pusri.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Masuk Portal Admin Verifikator Pabrik</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Click Demo Login */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuickDemoAdmin}
                      className="w-full py-2.5 px-4 rounded-xl border border-sky-300 bg-sky-50/70 hover:bg-sky-100/70 text-sky-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-800" />
                      <span>Masuk Cepat Demo Admin (Hendra Wijaya, S.T.)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Form Note */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sistem Terenkripsi SSL 256-Bit</span>
              <span className="font-mono">SIM-Pusri Production v2.4</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500 bg-slate-950/70">
        <p>
          © 2026 PT Pupuk Sriwidjaja Palembang. Hak Cipta Dilindungi Undang-Undang. Member of PT Pupuk Indonesia (Persero).
        </p>
      </footer>
    </div>
  );
};
