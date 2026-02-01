import React from 'react';
import { ShoppingCart, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Header({ toggleCart }) {
    const { cart } = useCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-amber-600 p-2 rounded-lg">
                        <Coffee className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Café QR</span>
                </Link>

                <button
                    onClick={toggleCart}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
}
