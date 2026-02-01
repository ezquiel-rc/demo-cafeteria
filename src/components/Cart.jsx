import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Cart({ isOpen, onClose, onCheckout }) {
    const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckoutClick = () => {
        if (onCheckout) {
            onCheckout();
        } else {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
                    >
                        <div className="p-4 flex items-center justify-between border-b">
                            <h2 className="text-lg font-bold">Tu Pedido</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">
                                    <p>Tu carrito está vacío</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            {/* NOMBRE DEL PRODUCTO */}
                                            <h3 className="font-semibold text-gray-900">
                                                {item.name}
                                            </h3>

                                            {/* PRECIO UNITARIO */}
                                            <p className="text-amber-600 font-bold">
                                                {formatPrice(item.price)}
                                            </p>

                                            {/* CANTIDAD */}
                                            <div className="flex items-center gap-3 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>

                                                <span className="font-medium">{item.quantity}</span>

                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 self-start"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-2xl font-bold text-amber-600">{formatPrice(total)}</span>
                            </div>
                            <button
                                disabled={cart.length === 0}
                                onClick={handleCheckoutClick}
                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
