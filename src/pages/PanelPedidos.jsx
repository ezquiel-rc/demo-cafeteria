import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ChefHat, Truck } from 'lucide-react';

import {
    subscribeToOrders,
    updateOrderStatus,
    archivarPedidosEntregados
} from '../firebase/pedidos';

import { formatPrice } from '../utils/formatPrice';
import { formatDateTime } from '../utils/formatDateTime';

export default function PanelPedidos() {
    const [orders, setOrders] = useState([]);

    // ✅ SOLO suscripción simple (SIN sonido)
    useEffect(() => {
        const unsubscribe = subscribeToOrders(setOrders);
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (order, newStatus) => {
        await updateOrderStatus(order.id, newStatus, order.total);
    };

    const archivarPedidos = async () => {
        const confirmar = window.confirm(
            "¿Archivar todos los pedidos entregados?\n\nNo se borrarán, solo dejarán de mostrarse."
        );
        if (!confirmar) return;
        await archivarPedidosEntregados();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'preparando': return 'bg-blue-100 text-blue-800';
            case 'listo': return 'bg-green-100 text-green-800';
            case 'entregado': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pendiente': return <Clock className="h-4 w-4" />;
            case 'preparando': return <ChefHat className="h-4 w-4" />;
            case 'listo': return <CheckCircle className="h-4 w-4" />;
            case 'entregado': return <Truck className="h-4 w-4" />;
            default: return null;
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Pedidos</h2>

            <button
                onClick={archivarPedidos}
                className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
                Archivar pedidos entregados
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders
                    .filter(order => order.archivado !== true)
                    .map(order => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow-sm p-6 border"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-sm text-gray-500">
                                        Mesa {order.mesa}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {order.status === 'entregado'
                                            ? `Entregado: ${formatDateTime(order.entregadoEn)}`
                                            : `Pedido: ${formatDateTime(order.createdAt)}`
                                        }
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}
                                >
                                    {getStatusIcon(order.status)}
                                    {order.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}

                                <div className="border-t pt-2 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {order.status === 'pendiente' && (
                                    <button
                                        onClick={() => handleStatusChange(order, 'preparando')}
                                        className="col-span-2 bg-blue-600 text-white py-2 rounded"
                                    >
                                        Empezar Preparación
                                    </button>
                                )}

                                {order.status === 'preparando' && (
                                    <button
                                        onClick={() => handleStatusChange(order, 'listo')}
                                        className="col-span-2 bg-green-600 text-white py-2 rounded"
                                    >
                                        Marcar Listo
                                    </button>
                                )}

                                {order.status === 'listo' && (
                                    <button
                                        onClick={() => handleStatusChange(order, 'entregado')}
                                        className="col-span-2 bg-gray-600 text-white py-2 rounded"
                                    >
                                        Marcar Entregado
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
}









