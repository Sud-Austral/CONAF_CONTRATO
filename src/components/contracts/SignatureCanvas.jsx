import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Eraser, CheckCircle2 } from 'lucide-react';

const SignatureCanvas = forwardRef(({ onDraw }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useImperativeHandle(ref, () => ({
    clear: handleClear,
    toDataURL: () => canvasRef.current.toDataURL(),
    isEmpty: isEmpty
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configuración inicial del trazo
    ctx.strokeStyle = '#1e3a1e'; // Verde muy oscuro
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Soporte para mouse y touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    if (isEmpty) {
      setIsEmpty(false);
      onDraw(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onDraw(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative group/canvas">
        <canvas 
          ref={canvasRef}
          width={480}
          height={180}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`
            w-full h-[180px] bg-white border-2 rounded-2xl cursor-crosshair shadow-inner transition-all
            ${isEmpty ? 'border-gray-200' : 'border-conaf-500 shadow-emerald-50'}
            group-hover/canvas:border-conaf-300
          `}
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEmpty && (
            <div className="px-3 py-1 bg-conaf-300/80 backdrop-blur-sm rounded-full text-conaf-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm animate-in zoom-in duration-300">
              <CheckCircle2 size={12} strokeWidth={3} />
              Firma Detectada
            </div>
          )}
          <button 
            type="button"
            onClick={handleClear}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-500 shadow-md hover:bg-red-50 border border-gray-100 transition-all active:scale-90"
            title="Limpiar firma"
          >
            <Eraser size={18} />
          </button>
        </div>

        {isEmpty && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40 select-none">
            <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Escriba su firma aquí</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default SignatureCanvas;
