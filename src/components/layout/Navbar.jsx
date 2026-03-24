import React from 'react';
import { useConafData } from '../../context/DataContext';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { rows } = useConafData();
  const totalEmployees = new Intl.NumberFormat('es-CL').format(new Set(rows.map(r => r.rut)).size);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', badge: totalEmployees },
    { id: 'contracts', label: 'Gestión de Contratos' },
  ];

  return (
    <nav style={{
      height: '56px',
      backgroundColor: '#1B5E20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '24px',
      paddingRight: '24px',
      position: 'relative',
      zIndex: 50,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#A5D6A7',
          fontSize: '14px',
        }}>🌲</div>
        <div>
          <div style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px', letterSpacing: '0.05em', lineHeight: 1 }}>
            CONAF
          </div>
          <div style={{ color: '#A5D6A7', fontWeight: '500', fontSize: '8px', letterSpacing: '0.15em', marginTop: '2px' }}>
            INSTITUCIONAL
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '20px',
                paddingRight: '20px',
                height: '100%',
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                border: 'none',
                borderBottom: isActive ? '3px solid #A5D6A7' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              {tab.label}
              {tab.badge && (
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '500',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: '500', lineHeight: 1 }}>Admin Usuario</div>
          <div style={{ color: 'rgba(165, 214, 167, 0.8)', fontSize: '8px', fontWeight: '500', letterSpacing: '0.1em', marginTop: '3px' }}>RR.HH. Central</div>
        </div>
        <div style={{
          width: '32px', height: '32px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1.5px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff',
          fontWeight: '500',
          fontSize: '10px',
        }}>AD</div>
      </div>
    </nav>
  );
};

export default Navbar;
