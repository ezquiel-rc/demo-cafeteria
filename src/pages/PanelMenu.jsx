
import { getCategorias } from '../firebase/categorias';

import React, { useState, useEffect } from 'react'
import { getMenu, addProduct, updateProduct, deleteProduct } from '../firebase/menu';
import { formatPrice } from '../utils/formatPrice';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function PanelMenu() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: '',
        categoria: 'Comidas',
        activo: true
    });
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        loadMenu();
        loadCategorias();
    }, []);


    const loadMenu = async () => {
        const menu = await getMenu();
        setProducts(menu);
    };

    const loadCategorias = async () => {
        const data = await getCategorias();
        setCategorias(data.filter(cat => cat.activo));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            precio: Number(formData.precio)
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', image: '', category: 'Café' });
            loadMenu();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre,
            precio: product.precio,
            descripcion: product.descripcion,
            imagen: product.imagen || '',
            categoria: product.categoria || 'Bebidas calientes',
            activo: product.activo ?? true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            await deleteProduct(id);
            loadMenu();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestión del Menú</h2>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', price: '', description: '', image: '', category: 'Café' });
                        setIsModalOpen(true);
                    }}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Producto</th>
                            <th className="p-4 font-semibold text-gray-600">Precio</th>
                            <th className="p-4 font-semibold text-gray-600">Categoría</th>
                            <th className="p-4 font-semibold text-gray-600">Descripción</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                            {product.imagen && (
                                                <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className="font-medium">{product.nombre}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-amber-600">{formatPrice(product.precio)}</td>
                                <td className="p-4 text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded-md text-sm">{product.categoria || 'Café'}</span></td>
                                <td className="p-4 text-gray-500 max-w-xs truncate">{product.descripcion}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.precio}
                                    onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select
                                    value={formData.categoria}
                                    onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                                >
                                    <option value="">Seleccionar categoría</option>

                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.nombre}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
                                <input
                                    type="url"
                                    value={formData.imagen}
                                    onChange={e => setFormData({ ...formData, imagen: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                            >
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
