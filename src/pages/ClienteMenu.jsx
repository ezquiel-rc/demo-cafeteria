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
            alert("Por favor, escanea el código QR de tu mesa nuevamente.");
            return;
        }

        const order = {
            mesa: tableNumber,
            items: cart,
            total: total,
            status: 'pendiente',
            createdAt: serverTimestamp(), // ✅ FECHA Y HORA
        };


        try {
            await createOrder(order);
            alert("¡Pedido enviado con éxito!");
            clearCart();
            setIsCartOpen(false);
        } catch (error) {
            console.error("Error al enviar pedido:", error);
            alert("Hubo un error al enviar tu pedido. Intenta nuevamente.");
        }
    };

    // 🔥 Filtrado por categoría
    const productosFiltrados = categoriaActiva
        ? products.filter(
            p => p.categoria === categoriaActiva && p.activo === true
        )
        : products.filter(p => p.activo === true);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header toggleCart={() => setIsCartOpen(true)} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

                {/* ⚠️ Aviso mesa */}
                {!tableNumber && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <p className="text-sm text-yellow-700">
                            No se detectó número de mesa. Por favor, escanea el código QR.
                        </p>
                    </div>
                )}

                {/* 🧱 CATEGORÍAS (solo si NO hay una activa) */}
                {!categoriaActiva && (
                    <Categorias onSelectCategoria={setCategoriaActiva} />
                )}

                {/* 🔙 BOTÓN VOLVER */}
                {categoriaActiva && (
                    <button
                        onClick={() => setCategoriaActiva(null)}
                        className="mb-6 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    >
                        ← Volver a categorías
                    </button>
                )}

                {/* 🛒 PRODUCTOS (solo si hay categoría activa) */}
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
        </div>
    );
}

