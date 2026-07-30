import React, { useRef, useEffect } from 'react';

export function TextParticleAnimation({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, vx: number, vy: number, size: number, color: string, baseAlpha: number, phase: number}[] = [];
    const colors = ['#00ff9d', '#00e38b', '#ffffff', '#007143'];

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          baseAlpha: Math.random() * 0.5 + 0.1,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;
    
    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        const alpha = p.baseAlpha + Math.sin(time + p.phase) * 0.1;
        
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen" 
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
