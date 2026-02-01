import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import ClienteMenu from './pages/ClienteMenu';

import AdminLayout from './components/AdminLayout';
import PanelPedidos from './pages/PanelPedidos';
import PanelMenu from './pages/PanelMenu';
import PanelQR from './pages/PanelQR';
import PanelCaja from './pages/PanelCaja';
import RegistrosCaja from './pages/RegistrosCaja';
import ProductosVendidos from './pages/ProductosVendidos';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* ☕ CLIENTE */}
          <Route path="/" element={<ClienteMenu />} />

          {/* 🔐 ADMIN con layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<PanelPedidos />} />
            <Route path="menu" element={<PanelMenu />} />
            <Route path="qr" element={<PanelQR />} />
            <Route path="caja" element={<PanelCaja />} />
            <Route path="registros" element={<RegistrosCaja />} />
            <Route path="productos-vendidos" element={<ProductosVendidos />} />
          </Route>

          {/* ❌ 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;


