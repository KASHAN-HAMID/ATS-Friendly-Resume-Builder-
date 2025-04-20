
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { ResumeData } from '../types/resume';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
  });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Lightning bolt class
    class LightningBolt {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      segments: number;
      width: number;
      color: string;
      lifespan: number;
      maxLifespan: number;
      branches: LightningBolt[];
      
      constructor(startX: number, startY: number, endX: number, endY: number, color: string, width: number, lifespan: number, isBranch = false) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.segments = Math.floor(Math.random() * 5) + 3;
        this.width = width || Math.random() * 2 + 1;
        this.color = color || "#8B5CF6";
        this.lifespan = lifespan || 15;
        this.maxLifespan = this.lifespan;
        this.branches = [];
        
        // Create branches if this is not already a branch
        if (!isBranch && Math.random() < 0.3) {
          const branchCount = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < branchCount; i++) {
            this.createBranch();
          }
        }
      }
      
      createBranch() {
        const branchStartPoint = Math.random() * 0.6 + 0.2; // 20-80% along the main bolt
        const mainX = this.startX + (this.endX - this.startX) * branchStartPoint;
        const mainY = this.startY + (this.endY - this.startY) * branchStartPoint;
        
        // Branch in a random direction, but generally upward and outward
        const angle = (Math.random() * Math.PI) - Math.PI/2;
        const length = Math.random() * 100 + 50;
        const branchEndX = mainX + Math.cos(angle) * length;
        const branchEndY = mainY + Math.sin(angle) * length;
        
        const branchColor = this.color === "#8B5CF6" ? "#D946EF" : "#8B5CF6";
        const branch = new LightningBolt(
          mainX, 
          mainY, 
          branchEndX, 
          branchEndY, 
          branchColor, 
          this.width * 0.6, 
          this.lifespan * 0.7, 
          true
        );
        
        this.branches.push(branch);
      }
      
      update() {
        this.lifespan--;
        
        // Update branches
        for (let i = 0; i < this.branches.length; i++) {
          this.branches[i].update();
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        if (this.lifespan <= 0) return;
        
        const alpha = (this.lifespan / this.maxLifespan) * 0.8 + 0.2;
        const points = this.getZigZagPoints();
        
        // Draw glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineWidth = this.width + 4;
        
        // Draw the main path with a glow
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        // Draw the core of the lightning
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#FFFFFF';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = this.width;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        // Draw branches
        for (let i = 0; i < this.branches.length; i++) {
          if (this.branches[i].lifespan > 0) {
            this.branches[i].draw(ctx);
          }
        }
        
        // Reset alpha
        ctx.globalAlpha = 1;
      }
      
      getZigZagPoints() {
        const points = [];
        points.push({ x: this.startX, y: this.startY });
        
        // Create a zigzag path for the lightning
        for (let i = 1; i < this.segments; i++) {
          const ratio = i / this.segments;
          const x = this.startX + (this.endX - this.startX) * ratio;
          const y = this.startY + (this.endY - this.startY) * ratio;
          
          // Add randomness to the bolt
          const offset = Math.random() * 30 - 15;
          const perpX = -(this.endY - this.startY);
          const perpY = (this.endX - this.startX);
          
          const length = Math.sqrt(perpX * perpX + perpY * perpY);
          const normalizedPerpX = perpX / length;
          const normalizedPerpY = perpY / length;
          
          points.push({
            x: x + normalizedPerpX * offset,
            y: y + normalizedPerpY * offset
          });
        }
        
        points.push({ x: this.endX, y: this.endY });
        return points;
      }
    }
    
    // Energy Field class (for the small particles)
    class EnergyParticle {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        
        // Create electric colors
        const colors = ["#8B5CF6", "#D946EF", "#0EA5E9", "#F97316"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.speed = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.6 + 0.2;
      }
      
      update() {
        // Move in a slightly random direction
        this.angle += (Math.random() - 0.5) * 0.1;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Wrap around screen edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Randomly change alpha for flickering effect
        this.alpha = Math.max(0.1, Math.min(0.8, this.alpha + (Math.random() - 0.5) * 0.1));
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
      }
    }
    
    // Create background gradient
    function drawBackground(ctx: CanvasRenderingContext2D) {
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width
      );
      
      gradient.addColorStop(0, 'rgba(10, 10, 35, 1)'); // Center color (deep blue)
      gradient.addColorStop(1, 'rgba(5, 5, 15, 1)'); // Edge color (nearly black)
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Lightning and particles
    const lightningBolts: LightningBolt[] = [];
    const particles: EnergyParticle[] = [];
    
    // Generate particles
    for (let i = 0; i < 150; i++) {
      particles.push(new EnergyParticle());
    }
    
    // Generate new lightning bolts periodically
    function createLightning() {
      // Start from random positions on top or sides
      const startSide = Math.floor(Math.random() * 3);
      let startX, startY, endX, endY;
      
      if (startSide === 0) { // Top
        startX = Math.random() * canvas.width;
        startY = 0;
      } else if (startSide === 1) { // Left
        startX = 0;
        startY = Math.random() * canvas.height * 0.5;
      } else { // Right
        startX = canvas.width;
        startY = Math.random() * canvas.height * 0.5;
      }
      
      // End at a random position on the canvas, generally downward
      endX = Math.random() * canvas.width;
      endY = Math.random() * (canvas.height * 0.7) + canvas.height * 0.3;
      
      // Create a bolt with random properties
      const colors = ["#8B5CF6", "#D946EF", "#0EA5E9", "#F97316"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const width = Math.random() * 2 + 1;
      const lifespan = Math.floor(Math.random() * 10) + 10;
      
      lightningBolts.push(new LightningBolt(startX, startY, endX, endY, color, width, lifespan));
      
      // Schedule next lightning creation
      const nextTime = Math.random() * 2000 + 1000; // Between 1-3 seconds
      setTimeout(createLightning, nextTime);
    }
    
    // Start creating lightning
    setTimeout(createLightning, 1000);
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground(ctx);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      // Update and draw lightning bolts
      for (let i = lightningBolts.length - 1; i >= 0; i--) {
        lightningBolts[i].update();
        lightningBolts[i].draw(ctx);
        
        // Remove dead bolts
        if (lightningBolts[i].lifespan <= 0) {
          lightningBolts.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  const handleUpdateResumeData = (newData: Partial<ResumeData>) => {
    setResumeData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      <div className="relative z-10 py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            ATS-Friendly Resume Builder
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Create professional, single-page resumes that pass through ATS systems
          </p>
        </div>

        <div className="max-w-7xl mx-auto bg-black/30 backdrop-blur-md rounded-lg p-6 shadow-xl">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="edit">Edit Resume</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-2">
              <ResumeForm data={resumeData} onUpdate={handleUpdateResumeData} />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-2">
              <ResumePreview data={resumeData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
