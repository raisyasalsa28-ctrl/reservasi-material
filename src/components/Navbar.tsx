import React from 'react';
import { useApp } from '../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Shield, Wrench, Building2, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLogin: () => void;
  onSelectReservation?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLogin,
  onSelectReservation,
}) => {
  const { currentUser, activeRole, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab(activeRole === 'user' ? 'user-overview' : 'admin-overview')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-900 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                PSI
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap block">
                  SIM-PUSRI
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight block -mt-1">
                  Reservasi Material Pabrik
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {currentUser && activeRole === 'user' ? (
              <>
                <button
                  onClick={() => setCurrentTab('user-overview')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'user-overview' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Dashboard Pemeliharaan
                </button>
                <button
                  onClick={() => setCurrentTab('user-new-request')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'user-new-request' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Buat Reservasi Baru
                </button>
                <button
                  onClick={() => setCurrentTab('user-my-reservations')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'user-my-reservations' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Lacak Permohonan
                </button>
                <button
                  onClick={() => setCurrentTab('materials-catalog')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'materials-catalog' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Katalog Stok Gudang
                </button>
              </>
            ) : currentUser && activeRole === 'admin' ? (
              <>
                <button
                  onClick={() => setCurrentTab('admin-overview')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'admin-overview' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Dashboard Verifikator
                </button>
                <button
                  onClick={() => setCurrentTab('admin-queue')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'admin-queue' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Verifikasi Permohonan
                </button>
                <button
                  onClick={() => setCurrentTab('admin-inventory')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'admin-inventory' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Kelola Stok Gudang
                </button>
                <button
                  onClick={() => setCurrentTab('admin-history')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                    currentTab === 'admin-history' ? 'text-sky-700 font-semibold border-b-2 border-sky-700 pb-0.5' : ''
                  }`}
                >
                  Log & Rekapitulasi
                </button>
              </>
            ) : null}
          </nav>

          {/* Zone 3: 1 primary action group */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Notification Dropdown */}
                <NotificationDropdown onSelectReservation={onSelectReservation} />

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
                    {activeRole === 'admin' ? (
                      <Building2 className="w-4 h-4 text-sky-800" />
                    ) : (
                      <Wrench className="w-4 h-4 text-emerald-800" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                      {activeRole === 'admin' ? 'Dept. Pabrik' : 'Dept. Pemeliharaan'}
                    </p>
                  </div>
                </div>

                {/* Logout / Switch Account */}
                <button
                  onClick={onOpenLogin}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Ganti Akun / Buka Portal Login"
                  aria-label="Ganti Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                Masuk Sistem
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
