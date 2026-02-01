import React, { useState } from 'react';
import { getPedidosPorPeriodo } from '../firebase/pedidos';
import { calcularRankingProductos } from '../firebase/pedidos';

const ProductosVendidos = () => {
    const [fecha, setFecha] = useState('');
    const [ranking, setRanking] = useState([]);

    const buscarRanking = async () => {
        if (!fecha) return;

        const inicio = new Date(fecha);
        inicio.setHours(0, 0, 0, 0);

        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);

        const pedidos = await getPedidosPorPeriodo(inicio, fin);
        const rankingCalculado = calcularRankingProductos(pedidos);

        setRanking(rankingCalculado);
    };

    return (
        <>
            <div className="max-w-xl space-y-4">
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    onClick={buscarRanking}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Ver ranking
                </button>

                {ranking.length > 0 && (
                    <div className="bg-white rounded-xl shadow p-4">
                        {ranking.map((p, i) => (
                            <p key={p.name} className="flex justify-between">
                                <span>
                                    {i === 0 && '🥇 '}
                                    {i === 1 && '🥈 '}
                                    {i === 2 && '🥉 '}
                                    {p.name}
                                </span>
                                <strong>{p.cantidad}</strong>
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductosVendidos;
