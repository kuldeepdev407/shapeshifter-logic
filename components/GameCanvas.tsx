import React, { useRef, useEffect, useState } from 'react';
import { LevelData, ShapeType, GameState, Particle } from '../types';
import { GRAVITY, FRICTION, MOVE_SPEED, MAX_SPEED, JUMP_FORCE, SHAPE_STATS } from '../constants';
import { audioService } from '../services/audioService';

interface GameCanvasProps {
  level: LevelData;
  gameState: GameState;
  onDie: () => void;
  onWin: () => void;
  onShapeChange: (s: ShapeType) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ level, gameState, onDie, onWin, onShapeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State Refs (to avoid re-renders during loop)
  const playerRef = useRef({
    x: level.spawn.x,
    y: level.spawn.y,
    vx: 0,
    vy: 0,
    w: 40,
    h: 40,
    shape: ShapeType.SQUARE,
    grounded: false
  });

  const keysRef = useRef<Set<string>>(new Set());
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const frameCountRef = useRef(0);

  // Initialize player on level change
  useEffect(() => {
    playerRef.current = {
      x: level.spawn.x,
      y: level.spawn.y,
      vx: 0,
      vy: 0,
      w: SHAPE_STATS[ShapeType.SQUARE].width,
      h: SHAPE_STATS[ShapeType.SQUARE].height,
      shape: ShapeType.SQUARE,
      grounded: false
    };
    particlesRef.current = [];
    onShapeChange(ShapeType.SQUARE);
  }, [level, onShapeChange]);

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Helper: Create particles
  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color,
        size: Math.random() * 4 + 2
      });
    }
  };

  // Helper: Collision Logic (AABB)
  const checkCollision = (rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.y + rect1.h > rect2.y
    );
  };

  // Main Loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gameState !== GameState.PLAYING) {
        // Just draw one frame static if not playing
        if (gameState === GameState.MENU) {
             ctx.fillStyle = '#0f172a';
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             return;
        }
    }

    const player = playerRef.current;
    const stats = SHAPE_STATS[player.shape];

    // --- PHYSICS ---
    if (gameState === GameState.PLAYING) {
      // Horizontal Movement
      if (keysRef.current.has('ArrowLeft') || keysRef.current.has('KeyA')) {
        player.vx -= MOVE_SPEED * stats.speedMod;
      }
      if (keysRef.current.has('ArrowRight') || keysRef.current.has('KeyD')) {
        player.vx += MOVE_SPEED * stats.speedMod;
      }

      // Friction
      player.vx *= FRICTION;
      
      // Max Speed Cap
      const currentMaxSpeed = MAX_SPEED * stats.speedMod;
      if (Math.abs(player.vx) > currentMaxSpeed) {
        player.vx = player.vx > 0 ? currentMaxSpeed : -currentMaxSpeed;
      }

      // Gravity
      player.vy += GRAVITY;

      // Jump
      if ((keysRef.current.has('ArrowUp') || keysRef.current.has('Space') || keysRef.current.has('KeyW')) && player.grounded) {
        player.vy = JUMP_FORCE * stats.jumpMod;
        player.grounded = false;
        audioService.playJump();
        createParticles(player.x + player.w / 2, player.y + player.h, '#fff', 5);
      }

      // Apply Horizontal Velocity
      player.x += player.vx;

      // Horizontal Collisions
      // Screen Bounds
      if (player.x < 0) { player.x = 0; player.vx = 0; }
      if (player.x + player.w > canvas.width) { player.x = canvas.width - player.w; player.vx = 0; }

      // Platform Collisions (X)
      for (const plat of level.platforms) {
        if (plat.type === 'solid' && checkCollision(player, plat)) {
           // Resolve X overlap
           const dx1 = (plat.x + plat.w) - player.x; // Player is to left of platform right side
           const dx2 = plat.x - (player.x + player.w); // Player is to right of platform left side
           
           // Determine smallest push
           if (Math.abs(dx1) < Math.abs(dx2)) {
             player.x = plat.x + plat.w;
           } else {
             player.x = plat.x - player.w;
           }
           player.vx = 0;
        }
      }

      // Apply Vertical Velocity
      player.y += player.vy;
      player.grounded = false;

      // Vertical Collisions
      for (const plat of level.platforms) {
         if (checkCollision(player, plat)) {
           if (plat.type === 'hazard') {
             createParticles(player.x + player.w/2, player.y + player.h/2, '#ff0000', 30);
             onDie();
             return; // Stop frame
           }

           if (plat.type === 'solid') {
             // If falling down
             if (player.vy > 0 && player.y + player.h - player.vy <= plat.y) {
               player.y = plat.y - player.h;
               player.vy = 0;
               player.grounded = true;
             } 
             // If jumping up
             else if (player.vy < 0 && player.y - player.vy >= plat.y + plat.h) {
               player.y = plat.y + plat.h;
               player.vy = 0;
             }
           }
         }
      }

      // Void Death
      if (player.y > canvas.height) {
        onDie();
        return;
      }

      // Morph Zones Interaction
      for (const zone of level.morphZones) {
        if (checkCollision(player, zone)) {
          if (player.shape !== zone.shape) {
            createParticles(player.x + player.w / 2, player.y + player.h / 2, SHAPE_STATS[zone.shape].color, 20);
            player.shape = zone.shape;
            
            // Adjust dimensions but try to keep centered/bottom aligned
            const oldH = player.h;
            player.w = SHAPE_STATS[zone.shape].width;
            player.h = SHAPE_STATS[zone.shape].height;
            player.y += (oldH - player.h); // Align bottom
            
            audioService.playMorph();
            onShapeChange(zone.shape);
          }
        }
      }

      // Win Condition
      if (checkCollision(player, level.endGate)) {
        if (player.shape === level.requiredEndShape) {
          createParticles(player.x + player.w/2, player.y + player.h/2, '#ffffff', 50);
          onWin();
          return;
        }
      }
    }

    // --- RENDER ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '20px "Space Mono"';
    level.texts.forEach(text => {
      ctx.fillText(text.content, text.x, text.y);
    });

    // Draw Platforms
    level.platforms.forEach(plat => {
      if (plat.type === 'solid') {
        ctx.fillStyle = '#64748b'; // slate-500
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        // Highlight top edge
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(plat.x, plat.y, plat.w, 4);
      } else if (plat.type === 'hazard') {
        ctx.fillStyle = '#ef4444';
        // Draw spikes
        const spikeWidth = 10;
        const spikeCount = plat.w / spikeWidth;
        ctx.beginPath();
        for(let i=0; i<spikeCount; i++) {
           ctx.moveTo(plat.x + i*spikeWidth, plat.y + plat.h);
           ctx.lineTo(plat.x + i*spikeWidth + spikeWidth/2, plat.y);
           ctx.lineTo(plat.x + (i+1)*spikeWidth, plat.y + plat.h);
        }
        ctx.fill();
      }
    });

    // Draw Morph Zones
    level.morphZones.forEach(zone => {
      ctx.save();
      ctx.strokeStyle = SHAPE_STATS[zone.shape].color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      // Pulse effect
      const pulse = Math.sin(frameCountRef.current * 0.1) * 2;
      ctx.strokeRect(zone.x - pulse, zone.y - pulse, zone.w + pulse*2, zone.h + pulse*2);
      
      // Draw Icon inside
      ctx.fillStyle = SHAPE_STATS[zone.shape].color;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(zone.x + 10, zone.y + 10, zone.w - 20, zone.h - 20);
      ctx.restore();
    });

    // Draw End Gate
    ctx.save();
    const gateColor = SHAPE_STATS[level.requiredEndShape].color;
    ctx.strokeStyle = gateColor;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = gateColor;
    ctx.strokeRect(level.endGate.x, level.endGate.y, level.endGate.w, level.endGate.h);
    
    // Gate Interior (Hollow unless correct shape)
    if (player.shape === level.requiredEndShape) {
       ctx.fillStyle = gateColor;
       ctx.globalAlpha = 0.2;
       ctx.fillRect(level.endGate.x, level.endGate.y, level.endGate.w, level.endGate.h);
    }
    
    // Gate Label
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;
    ctx.font = '12px "Space Mono"';
    ctx.fillText("EXIT", level.endGate.x + 15, level.endGate.y - 10);
    ctx.restore();

    // Draw Player
    ctx.save();
    ctx.fillStyle = SHAPE_STATS[player.shape].color;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    
    if (player.shape === ShapeType.CIRCLE) {
      ctx.beginPath();
      ctx.arc(player.x + player.w/2, player.y + player.h/2, player.w/2, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.shape === ShapeType.TRIANGLE) {
      ctx.beginPath();
      ctx.moveTo(player.x + player.w/2, player.y);
      ctx.lineTo(player.x + player.w, player.y + player.h);
      ctx.lineTo(player.x, player.y + player.h);
      ctx.closePath();
      ctx.fill();
    } else {
      // Square or Rectangle
      ctx.fillRect(player.x, player.y, player.w, player.h);
    }
    // Eyes (Cute factor)
    ctx.fillStyle = '#000';
    if (player.vx > 0) {
        ctx.fillRect(player.x + player.w - 15, player.y + 10, 5, 5); // Looking Right
    } else if (player.vx < 0) {
        ctx.fillRect(player.x + 10, player.y + 10, 5, 5); // Looking Left
    } else {
        ctx.fillRect(player.x + player.w/2 - 5, player.y + 10, 4, 4); // Looking Center
        ctx.fillRect(player.x + player.w/2 + 5, player.y + 10, 4, 4);
    }
    ctx.restore();

    // Draw Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      if (p.life <= 0) particlesRef.current.splice(i, 1);
    }
    ctx.globalAlpha = 1;

    frameCountRef.current++;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  });

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-slate-900 rounded-lg shadow-2xl border-4 border-slate-700 w-full max-w-4xl"
    />
  );
};

export default GameCanvas;