import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

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
                        alt={product.name}
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
                    <h3 className="font-semibold text-lg text-gray-900">{product.nombre}</h3>
                    <span className="font-bold text-amber-600">
                        {formatPrice(product.precio)}
                    </span>


                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.descripcion}</p>

                <button
                    onClick={() =>
                        addToCart({
                            id: product.id,
                            name: product.nombre,              // 👈 CLAVE
                            price: Number(product.precio),     // 👈 CLAVE
                            image: product.imagen,             // 👈 CLAVE
                            quantity: 1,
                        })
                    }
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Agregar
                </button>



            </div>
        </motion.div>
    );
}
