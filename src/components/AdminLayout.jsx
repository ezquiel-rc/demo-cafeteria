import React, { useEffect, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { subscribeToOrders } from '../firebase/pedidos';
import {
    LayoutDashboard,
    Coffee,
    QrCode,
    LogOut,
    Wallet,
    ClipboardList
} from 'lucide-react';

// 🔔 AUDIO GLOBAL (una sola vez)
const audioPedido = new Audio('/sonido-notificacionPedido.mp3');

export default function AdminLayout() {
    const location = useLocation();

    const prevPendingIdsRef = useRef(new Set());
    const firstLoadRef = useRef(true);

    // 🔥 LISTENER GLOBAL DE PEDIDOS
    useEffect(() => {
        const unsubscribe = subscribeToOrders((orders) => {
            const pendientes = orders.filter(o => o.status === 'pendiente');
            const currentIds = new Set(pendientes.map(o => o.id));

            // ⛔ Ignorar primera carga (al entrar / navegar)
            if (firstLoadRef.current) {
                firstLoadRef.current = false;
                prevPendingIdsRef.current = currentIds;
                return;
            }

            // 🔍 Detectar pedido nuevo REAL
            let hayNuevo = false;
            currentIds.forEach(id => {
                if (!prevPendingIdsRef.current.has(id)) {
                    hayNuevo = true;
                }
            });

            if (hayNuevo) {
                audioPedido.currentTime = 0;
                audioPedido.play().catch(() => { });
            }

            prevPendingIdsRef.current = currentIds;
        });

        return () => unsubscribe();
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Coffee className="h-8 w-8 text-amber-600" />
                        Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin/pedidos"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/pedidos')
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Pedidos
                    </Link>

                    <Link
                        to="/admin/menu"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/menu')
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Coffee className="h-5 w-5" />
                        Menú
                    </Link>

                    <Link
                        to="/admin/qr"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/qr')
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <QrCode className="h-5 w-5" />
                        Códigos QR
                    </Link>

                    <Link
                        to="/admin/caja"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/caja')
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Wallet className="h-5 w-5" />
                        Caja
                    </Link>

                    <Link
                        to="/admin/registros"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/registros')
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <ClipboardList className="h-5 w-5" />
                        Registros
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full">
                        <LogOut className="h-5 w-5" />
                        Salir
                    </button>
                </div>
            </aside>

            {/* CONTENIDO */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}








