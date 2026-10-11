import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface NotificationDropdownProps {
  onSelectReservation?: (reservationId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onSelectReservation }) => {
  const { notifications, activeRole, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications relevant to current role or all
  const filteredNotifications = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === activeRole
  );

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-500 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        title="Notifikasi Persetujuan & Real-Time"
        aria-label="Buka notifikasi"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Notifikasi Sistem</h3>
              <p className="text-xs text-slate-500">
                Pembaruan status & alokasi material
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai dibaca</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada notifikasi baru untuk sesi ini.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.reservationId && onSelectReservation) {
                      onSelectReservation(notif.reservationId);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                    !notif.read ? 'bg-sky-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.reservationId && (
                      <span className="inline-block mt-1.5 text-[10px] font-mono font-medium text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded">
                        #{notif.reservationId}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/50 text-center">
            <span className="text-[11px] text-slate-500">
              Terhubung Real-Time ke Gudang PT Pusri Palembang
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
