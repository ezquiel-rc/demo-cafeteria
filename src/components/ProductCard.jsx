import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        if (added) return;

        addToCart({
            id: product.id,
            name: product.nombre,
            price: Number(product.precio),
            image: product.imagen,
            quantity: 1,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="h-48 overflow-hidden bg-gray-100">
                {product.imagen ? (
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {product.nombre}
                    </h3>
                    <span className="font-bold text-amber-600">
                        {formatPrice(product.precio)}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.descripcion}
                </p>

                {/* BOTÓN NUEVO */}
                <button
                    onClick={handleAdd}
                    className={`add-btn ${added ? 'added' : ''}`}
                >
                    {added ? 'Agregado ✓' : 'Agregar'}
                </button>

            </div>
        </motion.div>
    );
}

