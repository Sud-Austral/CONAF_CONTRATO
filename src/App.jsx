import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import DashboardPage from './components/dashboard/DashboardPage';
import ContractsPage from './components/contracts/ContractsPage';
import LoadPage from './components/system/LoadPage';
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/common/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mapeo simple de URL a ID de pestaña para el Navbar
  const getActiveTab = () => {
    const path = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
    // Si la ruta es solo el basename o vacío, es dashboard
    if (path === 'CONAF_CONTRATO' || path === '/') return 'dashboard';
    return path;
  };

  const handleTabChange = (id) => {
    if (id === 'dashboard') navigate('/');
    else navigate(`/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/10">
      <Navbar 
        activeTab={getActiveTab()} 
        setActiveTab={handleTabChange} 
        user={user} 
        onLogout={logout} 
      />
      <main className="flex-1 relative overflow-hidden">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="load" element={<LoadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="py-6 px-8 bg-white border-t border-neutral-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-extreme text-neutral-400">
          © {new Date().getFullYear()} Corporación Nacional Forestal — CONAF Chile. Sistema de Gestión Interna.
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter basename="/CONAF_CONTRATO">
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
