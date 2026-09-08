import { useEffect, useRef, useState } from 'react';

export function CyberHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle system (Cyan vs Crimson)
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      team: 'blue' | 'red';
      size: number;
      baseSpeed: number;

      constructor(x: number, y: number, team: 'blue' | 'red') {
        this.x = x;
        this.y = y;
        // Move towards center generally
        const angle = Math.atan2(height/2 - y, width/2 - x) + (Math.random() - 0.5);
        this.baseSpeed = Math.random() * 2 + 0.5;
        this.vx = Math.cos(angle) * this.baseSpeed;
        this.vy = Math.sin(angle) * this.baseSpeed;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
        this.team = team;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            // Repel from mouse
            const force = (150 - dist) / 150;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.5;
            this.vy -= Math.sin(angle) * force * 0.5;
            
            // Speed limit
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > 5) {
              this.vx = (this.vx / currentSpeed) * 5;
              this.vy = (this.vy / currentSpeed) * 5;
            }
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        // Add some jitter
        this.vx += (Math.random() - 0.5) * 0.2;
        this.vy += (Math.random() - 0.5) * 0.2;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = 1 - (this.life / this.maxLife);
        ctx.globalAlpha = alpha;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        if (this.team === 'blue') {
          ctx.fillStyle = '#00FFFF'; // Cyan
          ctx.shadowColor = '#00FFFF';
        } else {
          ctx.fillStyle = '#DC143C'; // Crimson
          ctx.shadowColor = '#DC143C';
        }
        
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
    }

    const particles: Particle[] = [];
    
    // Grid animation setup
    let offset = 0;

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      // Perspective grid
      ctx.beginPath();
      for (let i = -width; i < width * 2; i += 50) {
        ctx.moveTo(i, height);
        ctx.lineTo(width / 2, height / 2 - 100);
      }
      ctx.stroke();

      // Horizontal moving lines
      ctx.beginPath();
      for (let i = 0; i < height / 2 + 100; i += 20) {
        const y = height - Math.pow(i / 10, 2) + offset;
        if (y < height && y > height / 2 - 100) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
      }
      ctx.stroke();
    };

    const drawHUD = () => {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Reticle
      const cx = width / 2;
      const cy = height / 2 - 50;
      
      ctx.beginPath();
      ctx.arc(cx, cy, 150, 0, Math.PI * 2);
      ctx.stroke();
      
      // Tick marks on reticle
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 140, cy + Math.sin(angle) * 140);
        ctx.lineTo(cx + Math.cos(angle) * 160, cy + Math.sin(angle) * 160);
        ctx.stroke();
      }

      // UI Frame elements
      ctx.strokeStyle = 'rgba(220, 20, 60, 0.4)';
      ctx.beginPath();
      ctx.moveTo(30, 30);
      ctx.lineTo(80, 30);
      ctx.moveTo(30, 30);
      ctx.lineTo(30, 80);
      
      ctx.moveTo(width - 30, 30);
      ctx.lineTo(width - 80, 30);
      ctx.moveTo(width - 30, 30);
      ctx.lineTo(width - 30, 80);
      
      ctx.moveTo(30, height - 30);
      ctx.lineTo(80, height - 30);
      ctx.moveTo(30, height - 30);
      ctx.lineTo(30, height - 80);
      
      ctx.moveTo(width - 30, height - 30);
      ctx.lineTo(width - 80, height - 30);
      ctx.moveTo(width - 30, height - 30);
      ctx.lineTo(width - 30, height - 80);
      ctx.stroke();
      
      // Data readouts
      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`SYS.T: ${Date.now() % 100000}`, 40, 50);
      ctx.fillText(`OP.SEC: ACTIVE`, 40, 65);
      
      ctx.fillStyle = 'rgba(220, 20, 60, 0.5)';
      ctx.textAlign = 'right';
      ctx.fillText(`THREAT.LVL: HIGH`, width - 40, 50);
      ctx.fillText(`ENC.KEY: ROLL`, width - 40, 65);
      ctx.textAlign = 'left';

      // Mouse Interaction Reticle
      if (mouseRef.current.active) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
        ctx.setLineDash([5, 15]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.font = '10px "JetBrains Mono", monospace';
        
        const apts = ['APT28', 'APT29', 'Sandworm', 'Lazarus Group', 'Equation Group', 'Volt Typhoon'];
        const cves = ['CVE-2010-2568', 'CVE-2017-0144', 'CVE-2021-44228', 'CVE-2019-0708', 'CVE-2023-34362'];
        const aptIndex = Math.floor(Date.now() / 2000) % apts.length;
        const cveIndex = Math.floor(Date.now() / 3000) % cves.length;
        
        ctx.fillText(`TGT: ${apts[aptIndex]}`, mouseRef.current.x + 40, mouseRef.current.y - 5);
        ctx.fillText(`SIG: ${cves[cveIndex]}`, mouseRef.current.x + 40, mouseRef.current.y + 10);
      }
    };

    const render = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      drawGrid();
      
      // Spawn particles
      let spawnRate = 0.3;
      if (mouseRef.current.active) {
        spawnRate = 0.6; // Increased spawn rate on hover
      }

      if (Math.random() < spawnRate) {
        particles.push(new Particle(Math.random() * width/3, Math.random() * height, 'blue'));
      }
      if (Math.random() < spawnRate) {
        particles.push(new Particle(width - (Math.random() * width/3), Math.random() * height, 'red'));
      }
      
      // Spawn extra particles near mouse
      if (mouseRef.current.active && Math.random() < 0.2) {
         const team = Math.random() > 0.5 ? 'blue' : 'red';
         particles.push(new Particle(mouseRef.current.x + (Math.random() - 0.5) * 50, mouseRef.current.y + (Math.random() - 0.5) * 50, team));
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Draw Tactical Units (Soldiers/Equipment representations)
      const drawUnit = (x: number, y: number, angle: number, team: 'blue'|'red') => {
        ctx.save();
        ctx.translate(x, y);
        
        // Mouse interaction for units (they face the mouse)
        let finalAngle = angle;
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 300) {
             finalAngle = Math.atan2(dy, dx);
          }
        }
        
        ctx.rotate(finalAngle);
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-4, 4);
        ctx.lineTo(4, 4);
        ctx.closePath();
        if (team === 'blue') {
          ctx.strokeStyle = '#00FFFF';
          ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        } else {
          ctx.strokeStyle = '#DC143C';
          ctx.fillStyle = 'rgba(220, 20, 60, 0.3)';
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // Draw tiny text label for unit
        ctx.font = '6px "JetBrains Mono", monospace';
        ctx.fillStyle = team === 'blue' ? 'rgba(0, 255, 255, 0.6)' : 'rgba(220, 20, 60, 0.6)';
        ctx.fillText(team === 'blue' ? 'BLU-SQD' : 'RED-OP', x + 6, y + 4);
      };
      
      // Animate some units moving
      const unitTime = Date.now() / 2000;
      drawUnit(width/3 + Math.sin(unitTime)*20, height/2 + Math.cos(unitTime)*10, Math.sin(unitTime), 'blue');
      drawUnit(width/3 - 40 + Math.cos(unitTime*0.8)*15, height/2 + 20 + Math.sin(unitTime*0.8)*15, Math.cos(unitTime), 'blue');
      
      drawUnit(width*0.6 + Math.cos(unitTime*1.2)*20, height/2 - 20 + Math.sin(unitTime*1.2)*20, Math.cos(unitTime*1.2) + Math.PI, 'red');
      drawUnit(width*0.6 + 50 + Math.sin(unitTime*0.9)*15, height/2 + 10 + Math.cos(unitTime*0.9)*15, Math.sin(unitTime*0.9) + Math.PI, 'red');

      drawHUD();

      offset = (offset + 0.5) % 20;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
      
      {/* Vignette overlay to blend with the rest of the site */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/60 to-[#050505] pointer-events-none"></div>
    </div>
  );
}
