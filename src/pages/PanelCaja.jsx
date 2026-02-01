import React, { useEffect, useState } from 'react';
import { getAppConfig, openCaja, closeCaja } from '../firebase/appConfig';
import { subscribeToOrders } from '../firebase/pedidos';
import { guardarCierreCaja } from '../firebase/historialCaja';

export default function PanelCaja() {
    const [config, setConfig] = useState(null);
    const [totalDia, setTotalDia] = useState(0);
    const [cantidadPedidos, setCantidadPedidos] = useState(0);

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

    const handleCloseCaja = async () => {
        if (!config?.cajaAbiertaEn) return;

        const confirmar = window.confirm(
            `¿Cerrar caja?\n\nPedidos: ${cantidadPedidos}\nTotal: $${totalDia}`
        );
        if (!confirmar) return;

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
                            onClick={handleCloseCaja}
                            className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Cerrar caja
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleOpenCaja}
                        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Abrir caja
                    </button>
                )}
            </div>
        </>
    );
}






