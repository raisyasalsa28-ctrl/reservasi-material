import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginFormPage } from './components/auth/LoginFormPage';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ToastContainer';
import { UserDashboard } from './components/user/UserDashboard';
import { ReservationForm } from './components/user/ReservationForm';
import { UserReservationList } from './components/user/UserReservationList';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminApprovalQueue } from './components/admin/AdminApprovalQueue';
import { AdminInventoryManager } from './components/admin/AdminInventoryManager';
import { AdminHistoryView } from './components/admin/AdminHistoryView';
import { MaterialsCatalogView } from './components/MaterialsCatalogView';
import {
  Wrench,
  Building2,
  Package,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, activeRole, resetDemoData, logout } = useApp();

  const [currentTab, setCurrentTab] = useState<string>(
    activeRole === 'user' ? 'user-overview' : 'admin-overview'
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showFullLoginPage, setShowFullLoginPage] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  // When clicking a notification that references a reservation
  const handleSelectReservationFromNotif = (id: string) => {
    setSelectedReservationId(id);
    if (activeRole === 'user') {
      setCurrentTab('user-my-reservations');
    } else {
      setCurrentTab('admin-queue');
    }
  };

  const handleSelectMaterialToReserve = (_materialId: string) => {
    setCurrentTab('user-new-request');
  };

  // If user explicitly logged out or requested full login form
  if (!currentUser || showFullLoginPage) {
    return (
      <div className="relative">
        {currentUser && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setShowFullLoginPage(false)}
              className="px-3.5 py-1.5 rounded-lg bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold shadow-lg transition-colors border border-sky-400/30"
            >
              ← Kembali ke Dashboard Aktif ({currentUser.name})
            </button>
          </div>
        )}
        <LoginFormPage
          onSuccess={() => {
            setShowFullLoginPage(false);
            setCurrentTab(activeRole === 'user' ? 'user-overview' : 'admin-overview');
          }}
        />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLogin={() => setShowFullLoginPage(true)}
        onSelectReservation={handleSelectReservationFromNotif}
      />

      {/* Sub-header Context Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              {activeRole === 'user' ? (
                <>
                  <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Portal Staff Pemeliharaan</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-sky-800" />
                  <span>Portal Admin Pabrik & Gudang</span>
                </>
              )}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">
              {currentTab === 'user-overview' && 'Ringkasan Pemeliharaan'}
              {currentTab === 'user-new-request' && 'Formulir Reservasi Baru'}
              {currentTab === 'user-my-reservations' && 'Pelacakan Permohonan'}
              {currentTab === 'admin-overview' && 'Ringkasan Verifikator Pabrik'}
              {currentTab === 'admin-queue' && 'Antrean Persetujuan & Alokasi Stok'}
              {currentTab === 'admin-inventory' && 'Inventaris Real-Time Gudang Pusri'}
              {currentTab === 'admin-history' && 'Log & Rekapitulasi Alokasi'}
              {currentTab === 'materials-catalog' && 'Katalog Stok Gudang'}
            </span>
          </div>

          {/* Active User Information aligned to the right */}
          <div className="ml-auto text-right">
            <span className="text-xs text-slate-600">
              Login Aktif: <strong className="text-slate-900 font-semibold">{currentUser?.name}</strong> (NIP: {currentUser?.nip})
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User (Departemen Pemeliharaan) Views */}
        {activeRole === 'user' && (
          <>
            {currentTab === 'user-overview' && (
              <UserDashboard onNavigateTab={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'user-new-request' && (
              <ReservationForm
                onSuccess={() => setCurrentTab('user-my-reservations')}
                onCancel={() => setCurrentTab('user-overview')}
              />
            )}

            {currentTab === 'user-my-reservations' && (
              <UserReservationList
                onNewRequest={() => setCurrentTab('user-new-request')}
                selectedReservationId={selectedReservationId}
              />
            )}

            {currentTab === 'materials-catalog' && (
              <MaterialsCatalogView onSelectToReserve={handleSelectMaterialToReserve} />
            )}
          </>
        )}

        {/* Admin (Departemen Pabrik & Gudang) Views */}
        {activeRole === 'admin' && (
          <>
            {currentTab === 'admin-overview' && (
              <AdminDashboard onNavigateTab={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'admin-queue' && <AdminApprovalQueue />}

            {currentTab === 'admin-inventory' && <AdminInventoryManager />}

            {currentTab === 'admin-history' && <AdminHistoryView />}

            {currentTab === 'materials-catalog' && <MaterialsCatalogView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-sky-900 text-white font-bold text-xs flex items-center justify-center">
              P
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                PT PUPUK SRIWIDJAJA PALEMBANG
              </p>
              <p className="text-[11px] text-slate-500">
                Member of PT Pupuk Indonesia (Persero) · Kompleks Pabrik Jl. Mayor Zen, Palembang 30118
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-[11px] font-medium"
              title="Kembalikan semua reservasi dan stok ke sampel awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultRole={activeRole}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
