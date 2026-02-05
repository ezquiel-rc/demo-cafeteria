import React, { useEffect, useState } from 'react';
import { getAppConfig, openCaja, closeCaja } from '../firebase/appConfig';
import { subscribeToOrders } from '../firebase/pedidos';
import { guardarCierreCaja } from '../firebase/historialCaja';

export default function PanelCaja() {
    const [config, setConfig] = useState(null);
    const [totalDia, setTotalDia] = useState(0);
    const [cantidadPedidos, setCantidadPedidos] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAppConfig().then(setConfig);
    }, []);

    useEffect(() => {
        if (!config?.cajaAbierta || !config?.cajaAbiertaEn) return;

        const unsub = subscribeToOrders((orders) => {
            const pedidosDelDia = orders.filter(o =>
                o.status === 'entregado' &&
                o.entregadoEn &&
                o.entregadoEn.toDate() >= config.cajaAbiertaEn.toDate()
            );

            const total = pedidosDelDia.reduce((acc, o) => acc + o.total, 0);
            setTotalDia(total);
            setCantidadPedidos(pedidosDelDia.length);
        });

        return () => unsub();
    }, [config]);

    const handleOpenCaja = async () => {
        await openCaja();
        setConfig(await getAppConfig());
    };

    const confirmarCierreCaja = async () => {
        if (!config?.cajaAbiertaEn) return;

        try {
            setLoading(true);

            await guardarCierreCaja({
                apertura: config.cajaAbiertaEn,
                cierre: new Date(),
                total: totalDia,
                cantidadPedidos
            });

            await closeCaja();

            setTotalDia(0);
            setCantidadPedidos(0);
            setConfig(await getAppConfig());
            setShowModal(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Caja</h2>

            <div className="bg-white rounded-xl shadow-sm p-6 border max-w-xl">
                <p>
                    Estado:{' '}
                    <strong className={config?.cajaAbierta ? 'text-green-600' : 'text-red-600'}>
                        {config?.cajaAbierta ? 'Abierta' : 'Cerrada'}
                    </strong>
                </p>

                {config?.cajaAbierta ? (
                    <>
                        <p className="mt-4">Pedidos: <strong>{cantidadPedidos}</strong></p>
                        <p className="mt-2 text-lg">Total: <strong>${totalDia}</strong></p>

                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Cerrar caja
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleOpenCaja}
                        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Abrir caja
                    </button>
                )}
            </div>

            {/* 🧾 MODAL CERRAR CAJA */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 text-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold mb-4">Cerrar caja</h3>

                        <div className="space-y-2 text-sm text-gray-300">
                            <p>Pedidos del día: <strong>{cantidadPedidos}</strong></p>
                            <p>Total a cerrar: <strong>${totalDia}</strong></p>
                        </div>

                        <p className="mt-4 text-sm text-gray-400">
                            Esta acción cerrará la caja y guardará el resumen del día.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={confirmarCierreCaja}
                                disabled={loading}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 font-semibold"
                            >
                                {loading ? 'Cerrando...' : 'Confirmar cierre'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}







