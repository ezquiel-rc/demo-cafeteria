import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer } from 'lucide-react';

export default function PanelQR() {
    const [tableCount, setTableCount] = useState(10);
    const [tables, setTables] = useState(
        Array.from({ length: 10 }, (_, i) => i + 1)
    );

    const handleCountChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setTableCount(count);
        setTables(Array.from({ length: count }, (_, i) => i + 1));
    };

    const handlePrint = () => {
        window.print();
    };

    // ✅ BASE URL + HASH (OBLIGATORIO para GitHub Pages)
    const baseUrl = window.location.origin + '/demo-cafeteria/#';

    return (
        <>
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-2xl font-bold">Códigos QR para Mesas</h2>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Cantidad de Mesas:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={tableCount}
                            onChange={handleCountChange}
                            className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>

                    <button
                        onClick={handlePrint}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        <Printer className="h-5 w-5" />
                        Imprimir
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-3 print:gap-8">
                {tables.map(num => (
                    <div
                        key={num}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center print:border-2 print:border-gray-900 print:shadow-none"
                    >
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                            Mesa {num}
                        </h3>

                        <div className="bg-white p-2 rounded-lg">
                            <QRCodeCanvas
                                value={`${baseUrl}/?mesa=${num}`}
                                size={150}
                                level="H"
                            />
                        </div>

                        <p className="mt-4 text-sm text-gray-500 font-medium">
                            Escanea para pedir
                        </p>
                    </div>
                ))}
            </div>

            <style>{`
                @media print {
                    aside, header, footer { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; overflow: visible !important; }
                    body { background: white !important; }
                }
            `}</style>
        </>
    );
}

