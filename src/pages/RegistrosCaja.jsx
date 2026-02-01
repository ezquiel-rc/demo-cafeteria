import React, { useEffect, useState } from 'react';
import { subscribeToHistorialCaja } from '../firebase/historialCaja';
import { getPedidosPorPeriodo } from '../firebase/pedidos';

const RegistrosCaja = () => {
    const [registros, setRegistros] = useState([]);
    const [registroAbierto, setRegistroAbierto] = useState(null);
    const [pedidosDetalle, setPedidosDetalle] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToHistorialCaja(setRegistros);
        return () => unsubscribe();
    }, []);

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Registros de Caja</h2>

            {registros.length === 0 ? (
                <p className="text-gray-500">No hay registros todavía</p>
            ) : (
                <div className="space-y-4">
                    {registros.map((r) => (
                        <div key={r.id} className="bg-white rounded-xl shadow p-4 border">
                            <p className="font-semibold">
                                📅 {r.cierre?.toDate().toLocaleDateString()}
                            </p>

                            <p>🕒 Apertura: {r.apertura?.toDate().toLocaleTimeString()}</p>
                            <p>🕒 Cierre: {r.cierre?.toDate().toLocaleTimeString()}</p>
                            <p>🧾 Pedidos: {r.cantidadPedidos}</p>
                            <p className="font-bold text-green-600">💰 Total: ${r.total}</p>

                            <button
                                className="mt-3 text-sm text-blue-600 hover:underline"
                                onClick={async () => {
                                    if (registroAbierto === r.id) {
                                        setRegistroAbierto(null);
                                        setPedidosDetalle([]);
                                    } else {
                                        setRegistroAbierto(r.id);
                                        setPedidosDetalle(
                                            await getPedidosPorPeriodo(r.apertura, r.cierre)
                                        );
                                    }
                                }}
                            >
                                {registroAbierto === r.id ? 'Ocultar detalle' : 'Ver detalle'}
                            </button>

                            {registroAbierto === r.id && (
                                <div className="mt-4 space-y-3">
                                    {pedidosDetalle.map((pedido) => (
                                        <div key={pedido.id} className="border p-3 rounded bg-gray-50">
                                            <h4 className="font-semibold">
                                                🪑 Mesa {pedido.mesa}
                                            </h4>

                                            {pedido.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm ml-3">
                                                    <span>{item.quantity} × {item.name}</span>
                                                    <span>${item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default RegistrosCaja;





