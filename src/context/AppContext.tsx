import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  MaterialItem,
  Reservation,
  AppNotification,
  PriorityLevel,
  MaterialReservationItem,
  TimelineEntry,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_MATERIALS,
  INITIAL_RESERVATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole;
  materials: MaterialItem[];
  reservations: Reservation[];
  notifications: AppNotification[];
  toasts: Toast[];
  loginAs: (role: UserRole, customUser?: Partial<User>) => void;
  logout: () => void;
  showToast: (type: Toast['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
  createReservation: (data: {
    workOrderNumber: string;
    targetPlant: string;
    priority: PriorityLevel;
    reason: string;
    equipmentTag: string;
    items: { materialId: string; quantity: number }[];
  }) => boolean;
  verifyReservation: (
    reservationId: string,
    decision: 'APPROVED' | 'REJECTED',
    notes: string,
    pickupLocation?: string,
    pickupDeadline?: string,
    rejectionReason?: string
  ) => boolean;
  completeReservation: (
    reservationId: string,
    receiverName: string,
    handoverNotes?: string
  ) => boolean;
  updateMaterialStock: (
    materialId: string,
    newStock: number,
    reason: string
  ) => boolean;
  addNewMaterial: (material: Omit<MaterialItem, 'id' | 'lastRestocked'>) => boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'pusri_sim_current_user',
  MATERIALS: 'pusri_sim_materials',
  RESERVATIONS: 'pusri_sim_reservations',
  NOTIFICATIONS: 'pusri_sim_notifications',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      // Default to Maintenance User for immediate inspection
      return DEMO_USERS.user;
    } catch {
      return DEMO_USERS.user;
    }
  });

  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
      if (saved) return JSON.parse(saved);
      return INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (saved) return JSON.parse(saved);
      return INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Synchronize to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginAs = (role: UserRole, customUser?: Partial<User>) => {
    const base = DEMO_USERS[role];
    const userToSet: User = {
      ...base,
      ...customUser,
      role,
    };
    setCurrentUser(userToSet);
    showToast(
      'info',
      `Masuk Berhasil`,
      `Login sebagai ${userToSet.name} (${role === 'admin' ? 'Dept. Pabrik / Verifikator' : 'Dept. Pemeliharaan'})`
    );
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('info', 'Keluar Akun', 'Anda telah keluar dari sesi SIM-Pusri');
  };

  const createReservation = (data: {
    workOrderNumber: string;
    targetPlant: string;
    priority: PriorityLevel;
    reason: string;
    equipmentTag: string;
    items: { materialId: string; quantity: number }[];
  }): boolean => {
    if (!currentUser) return false;

    // Check material validation
    const reservationItems: MaterialReservationItem[] = [];
    for (const item of data.items) {
      const foundMat = materials.find((m) => m.id === item.materialId);
      if (!foundMat) {
        showToast('error', 'Item Tidak Ditemukan', `Material ID ${item.materialId} tidak terdaftar di sistem.`);
        return false;
      }
      if (item.quantity <= 0) {
        showToast('error', 'Kuantitas Tidak Valid', 'Jumlah barang harus lebih dari 0.');
        return false;
      }
      reservationItems.push({
        materialId: foundMat.id,
        materialCode: foundMat.code,
        materialName: foundMat.name,
        quantityRequested: item.quantity,
        unit: foundMat.unit,
        availableStockSnapshot: foundMat.stock,
      });
    }

    const newId = `RSV-2026-${String(reservations.length + 90).padStart(4, '0')}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReservation: Reservation = {
      id: newId,
      workOrderNumber: data.workOrderNumber,
      requestedBy: {
        id: currentUser.id,
        name: currentUser.name,
        nip: currentUser.nip,
        department: currentUser.department,
        division: currentUser.division,
      },
      targetPlant: data.targetPlant,
      priority: data.priority,
      reason: data.reason,
      equipmentTag: data.equipmentTag,
      items: reservationItems,
      status: 'PENDING',
      createdAt: formattedDate,
      updatedAt: formattedDate,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          step: 'Pengajuan Reservasi Material',
          actor: `${currentUser.name} (${currentUser.division})`,
          timestamp: formattedDate,
          status: 'SUBMITTED',
          notes: `Permohonan baru diajukan untuk Work Order ${data.workOrderNumber} (Prioritas: ${data.priority}).`,
        },
        {
          id: `tl-${Date.now()}-2`,
          step: 'Menunggu Verifikasi & Alokasi Stok Pabrik',
          actor: 'Departemen Pabrik & Verifikator Gudang',
          timestamp: formattedDate,
          status: 'PENDING',
          notes: 'Dalam antrean verifikasi ketersediaan material di gudang.',
        },
      ],
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Send notification to Admin (Departemen Pabrik)
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Permohonan Material Masuk (${data.priority})`,
      message: `${newReservation.id} diajukan oleh ${currentUser.name} untuk unit ${data.targetPlant}. Memerlukan verifikasi stok.`,
      type: data.priority === 'EMERGENCY' ? 'ALERT' : 'INFO',
      targetRole: 'admin',
      timestamp: 'Baru saja',
      read: false,
      reservationId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      'success',
      'Reservasi Berhasil Diajukan',
      `Nomor permintaan #${newId} telah diteruskan ke Departemen Pabrik untuk verifikasi ketersediaan stok.`
    );
    return true;
  };

  const verifyReservation = (
    reservationId: string,
    decision: 'APPROVED' | 'REJECTED',
    notes: string,
    pickupLocation?: string,
    pickupDeadline?: string,
    rejectionReason?: string
  ): boolean => {
    if (!currentUser) return false;

    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) {
      showToast('error', 'Gagal Verifikasi', 'Permintaan reservasi tidak ditemukan.');
      return false;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (decision === 'APPROVED') {
      // Check if stock is sufficient
      for (const item of reservation.items) {
        const mat = materials.find((m) => m.id === item.materialId);
        if (!mat || mat.stock < item.quantityRequested) {
          showToast(
            'error',
            'Stok Tidak Cukup',
            `Stok untuk ${item.materialName} tidak mencukupi (Tersedia: ${mat ? mat.stock : 0} ${item.unit}, Diminta: ${item.quantityRequested} ${item.unit}).`
          );
          return false;
        }
      }

      // Deduct stock in real-time
      setMaterials((prev) =>
        prev.map((mat) => {
          const reqItem = reservation.items.find((item) => item.materialId === mat.id);
          if (reqItem) {
            return {
              ...mat,
              stock: Math.max(0, mat.stock - reqItem.quantityRequested),
            };
          }
          return mat;
        })
      );

      const timelineEntry: TimelineEntry = {
        id: `tl-${Date.now()}`,
        step: 'Disetujui oleh Verifikator Pabrik',
        actor: `${currentUser.name} (${currentUser.division})`,
        timestamp: formattedDate,
        status: 'APPROVED',
        notes: `Permohonan disetujui. Stok telah dialokasikan. Lokasi pengambilan: ${pickupLocation || 'Gudang Material Sentral'}. Catatan: ${notes}`,
      };

      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId
            ? {
                ...r,
                status: 'APPROVED',
                updatedAt: formattedDate,
                verificationDetails: {
                  verifiedBy: {
                    name: currentUser.name,
                    nip: currentUser.nip,
                    title: currentUser.division,
                  },
                  verifiedAt: formattedDate,
                  decision: 'APPROVED',
                  notes,
                  pickupLocation: pickupLocation || 'Gudang Sentral Material PT Pusri',
                  pickupDeadline: pickupDeadline || '3 Hari Kerja',
                },
                timeline: [...r.timeline, timelineEntry],
              }
            : r
        )
      );

      // Notification to maintenance user
      const userNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Reservasi #${reservation.id} DISETUJUI`,
        message: `Permohonan material untuk WO ${reservation.workOrderNumber} telah disetujui oleh Pabrik. Silakan ambil material di ${pickupLocation || 'Gudang Pusat'}.`,
        type: 'SUCCESS',
        targetRole: 'user',
        timestamp: 'Baru saja',
        read: false,
        reservationId: reservation.id,
      };
      setNotifications((prev) => [userNotif, ...prev]);

      showToast(
        'success',
        'Reservasi Disetujui',
        `Permohonan #${reservation.id} disetujui. Stok gudang telah dipotong otomatis secara real-time.`
      );
      return true;
    } else {
      // REJECTED
      const timelineEntry: TimelineEntry = {
        id: `tl-${Date.now()}`,
        step: 'Permohonan Dialihkan ke Purchasing',
        actor: `${currentUser.name} (${currentUser.division})`,
        timestamp: formattedDate,
        status: 'REJECTED',
        notes: `Catatan Purchasing: ${rejectionReason || notes}`,
      };

      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId
            ? {
                ...r,
                status: 'REJECTED',
                updatedAt: formattedDate,
                verificationDetails: {
                  verifiedBy: {
                    name: currentUser.name,
                    nip: currentUser.nip,
                    title: currentUser.division,
                  },
                  verifiedAt: formattedDate,
                  decision: 'REJECTED',
                  notes,
                  rejectionReason: rejectionReason || notes,
                },
                timeline: [...r.timeline, timelineEntry],
              }
            : r
        )
      );

      // Notification to maintenance user
      const userNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `Permintaan #${reservation.id} Dialihkan ke Purchasing`,
        message: `Permintaan material Anda dialihkan ke Purchasing: ${rejectionReason || notes}`,
        type: 'WARNING',
        targetRole: 'user',
        timestamp: 'Baru saja',
        read: false,
        reservationId: reservation.id,
      };
      setNotifications((prev) => [userNotif, ...prev]);

      showToast(
        'warning',
        'Dialihkan ke Purchasing',
        `Status permintaan #${reservation.id} diperbarui menjadi Purchasing.`
      );
      return true;
    }
  };

  const completeReservation = (
    reservationId: string,
    receiverName: string,
    handoverNotes?: string
  ): boolean => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return false;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const timelineEntry: TimelineEntry = {
      id: `tl-${Date.now()}`,
      step: 'Serah Terima Material Selesai',
      actor: receiverName || 'Penerima Lapangan',
      timestamp: formattedDate,
      status: 'COMPLETED',
      notes: handoverNotes || 'Material telah diterima secara lengkap dan diverifikasi fisik di gudang.',
    };

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'COMPLETED',
              updatedAt: formattedDate,
              completionDetails: {
                receivedBy: receiverName,
                receivedAt: formattedDate,
                handoverNotes,
              },
              timeline: [...r.timeline, timelineEntry],
            }
          : r
      )
    );

    const finishNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Serah Terima #${reservation.id} Tuntas`,
      message: `Material untuk ${reservation.equipmentTag} telah diambil dan dikonfirmasi tuntas oleh ${receiverName}.`,
      type: 'INFO',
      targetRole: 'all',
      timestamp: 'Baru saja',
      read: false,
      reservationId: reservation.id,
    };
    setNotifications((prev) => [finishNotif, ...prev]);

    showToast('success', 'Material Dikonfirmasi Diterima', `Reservasi #${reservation.id} kini berstatus Selesai.`);
    return true;
  };

  const updateMaterialStock = (materialId: string, newStock: number, reason: string): boolean => {
    if (newStock < 0) {
      showToast('error', 'Nilai Stok Tidak Valid', 'Stok tidak boleh negatif.');
      return false;
    }

    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
              ...m,
              stock: newStock,
              lastRestocked: new Date().toISOString().split('T')[0],
            }
          : m
      )
    );

    showToast('success', 'Stok Gudang Diperbarui', `Penyesuaian stok berhasil disimpan (${reason}).`);
    return true;
  };

  const addNewMaterial = (materialData: Omit<MaterialItem, 'id' | 'lastRestocked'>): boolean => {
    const newId = `mat-${String(materials.length + 1).padStart(3, '0')}`;
    const newMat: MaterialItem = {
      ...materialData,
      id: newId,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    setMaterials((prev) => [newMat, ...prev]);
    showToast('success', 'Material Baru Ditambahkan', `${newMat.name} (${newMat.code}) telah masuk ke katalog inventaris.`);
    return true;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setMaterials(INITIAL_MATERIALS);
    setReservations(INITIAL_RESERVATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('info', 'Data Direset', 'Semua data telah dikembalikan ke kondisi awal demonstrasi PT Pusri.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole: currentUser?.role || 'user',
        materials,
        reservations,
        notifications,
        toasts,
        loginAs,
        logout,
        showToast,
        dismissToast,
        createReservation,
        verifyReservation,
        completeReservation,
        updateMaterialStock,
        addNewMaterial,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
