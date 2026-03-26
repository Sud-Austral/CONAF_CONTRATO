import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const lastEmail = localStorage.getItem('lastLoginEmail');
    if (lastEmail) setEmail(lastEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1611] flex items-center justify-center p-6 font-display overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-dark/20 rounded-full blur-[100px] animate-pulse transition-all duration-3000" />

      <div className="w-full max-w-md relative z-10 scale-in shadow-2xl">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 overflow-hidden relative group">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-40" />

          <header className="text-center mb-10">
            <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 border border-primary/20">
              <LogIn className="text-primary-light" size={28} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-3">CONAF Gestión</h1>
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Corporación Nacional Forestal</p>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-3 text-error animate-shake">
              <AlertCircle size={18} />
              <span className="text-[11px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group/input">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-extreme ml-1 transition-colors group-focus-within/input:text-primary-light">Email Institucional</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors group-focus-within/input:text-primary-light" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all placeholder:text-neutral-700"
                  placeholder="admin@conaf.cl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group/input">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-extreme ml-1 transition-colors group-focus-within/input:text-primary-light">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors group-focus-within/input:text-primary-light" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all placeholder:text-neutral-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-primary-dark hover:bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-extreme shadow-premium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Acceder al Sistema</span>
                </>
              )}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest leading-relaxed">
              Sistema de Acceso Restringido<br />
              Ley 19.628 de Protección de Datos Personales
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
