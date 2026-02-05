import { serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import Categorias from '../components/Categorias';

import { getMenu } from '../firebase/menu';
import { useCart } from '../context/CartContext';
import { createOrder } from '../firebase/pedidos';

export default function ClienteMenu() {
    const [products, setProducts] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get('mesa');
    const { cart, total, clearCart } = useCart();

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        const menu = await getMenu();
        setProducts(menu);
    };

    const handleCheckout = async () => {
        if (!tableNumber) {
            setShowErrorModal(true);
            return;
        }

        const order = {
            mesa: tableNumber,
            items: cart,
            total: total,
            status: 'pendiente',
            createdAt: serverTimestamp(),
        };

        try {
            await createOrder(order);
            clearCart();
            setIsCartOpen(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error al enviar pedido:", error);
            setShowErrorModal(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header toggleCart={() => setIsCartOpen(true)} />

            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">

                {!tableNumber && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <p className="text-sm text-yellow-700">
                            No se detectó número de mesa. Por favor, escaneá el QR de tu mesa.
                        </p>
                    </div>
                )}

                {!categoriaActiva && (
                    <Categorias onSelectCategoria={setCategoriaActiva} />
                )}

                {categoriaActiva && (
                    <button
                        onClick={() => setCategoriaActiva(null)}
                        className="mb-6 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                        ← Volver a categorías
                    </button>
                )}

                {categoriaActiva && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products
                            .filter(p => p.activo === true)
                            .filter(p => p.categoria === categoriaActiva)
                            .map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                    </div>
                )}
            </main>

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckout}
            />

            <Footer />

            {/* ✅ MODAL ÉXITO */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            ¡Pedido enviado! ☕
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Tu pedido fue enviado correctamente.
                            <br />
                            En breve lo estarán preparando.
                        </p>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="px-6 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                        >
                            Perfecto
                        </button>
                    </div>
                </div>
            )}

            {/* ❌ MODAL ERROR */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
                        <h3 className="text-2xl font-bold text-red-600 mb-3">
                            Error 😕
                        </h3>

                        <p className="text-gray-600 mb-6">
                            No se pudo enviar el pedido.
                            <br />
                            Intentá nuevamente o escaneá el QR.
                        </p>

                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}



