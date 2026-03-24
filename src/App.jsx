import React, { useState } from 'react';
import { DataProvider, useConafData } from './context/DataContext';
import Navbar from './components/layout/Navbar';
import DashboardPage from './components/dashboard/DashboardPage';
import ContractsPage from './components/contracts/ContractsPage';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorScreen from './components/common/ErrorScreen';

const AppContent = () => {
  const { loading, error } = useConafData();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'contracts'

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'dashboard' ? <DashboardPage /> : <ContractsPage />}
      </main>
      
      <footer className="py-4 px-6 bg-white border-t border-gray-200 text-center text-xs text-text-light">
        © {new Date().getFullYear()} Corporación Nacional Forestal — CONAF Chile. Sistema de Gestión Interna.
      </footer>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
