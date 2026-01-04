import React, { useEffect, useRef } from 'react';

interface Vector {
  x: number;
  y: number;
}

class Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxForce: number = 0.2;
  maxSpeed: number = 3;
  perceptionRadius: number = 50;

  constructor(x: number, y: number) {
    this.position = { x, y };
    const angle = Math.random() * Math.PI * 2;
    this.velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    this.acceleration = { x: 0, y: 0 };
  }

  edges(width: number, height: number) {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }

  applyForce(force: Vector) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  flock(boids: Boid[], mouse: Vector, isMouseDown: boolean) {
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    const separation = this.separation(boids);
    const mouseForce = this.seek(mouse, isMouseDown);

    alignment.x *= 1.0; alignment.y *= 1.0;
    cohesion.x *= 1.0; cohesion.y *= 1.0;
    separation.x *= 2.5; separation.y *= 2.5;
    
    // Mouse force weight can be adjusted
    mouseForce.x *= 2.0; mouseForce.y *= 2.0;

    this.applyForce(alignment);
    this.applyForce(cohesion);
    this.applyForce(separation);
    this.applyForce(mouseForce);
  }

  seek(target: Vector, attract: boolean): Vector {
    const desired = {
      x: target.x - this.position.x,
      y: target.y - this.position.y,
    };
    const distance = Math.sqrt(desired.x ** 2 + desired.y ** 2);
    
    // Repel radius (flee) vs Attract radius (seek)
    // Let's use 400 for both for now
    if (distance > 0 && distance < 400) {
      // If we want to repel (scare), we reverse the desired vector
      if (!attract) {
        desired.x *= -1;
        desired.y *= -1;
      }

      const speed = this.maxSpeed;
      desired.x = (desired.x / distance) * speed;
      desired.y = (desired.y / distance) * speed;

      const steer = {
        x: desired.x - this.velocity.x,
        y: desired.y - this.velocity.y,
      };
      
      const steerLen = Math.sqrt(steer.x ** 2 + steer.y ** 2);
      if (steerLen > this.maxForce) {
        steer.x = (steer.x / steerLen) * this.maxForce;
        steer.y = (steer.y / steerLen) * this.maxForce;
      }
      return steer;
    }
    return { x: 0, y: 0 };
  }

  align(boids: Boid[]): Vector {
    let steering = { x: 0, y: 0 };
    let total = 0;
    for (const other of boids) {
      const d = Math.sqrt(
        (this.position.x - other.position.x) ** 2 +
        (this.position.y - other.position.y) ** 2
      );
      if (other !== this && d < this.perceptionRadius) {
        steering.x += other.velocity.x;
        steering.y += other.velocity.y;
        total++;
      }
    }
    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      const mag = Math.sqrt(steering.x ** 2 + steering.y ** 2);
      if (mag > 0) {
        steering.x = (steering.x / mag) * this.maxSpeed;
        steering.y = (steering.y / mag) * this.maxSpeed;
      }
      steering.x -= this.velocity.x;
      steering.y -= this.velocity.y;
      const steerMag = Math.sqrt(steering.x ** 2 + steering.y ** 2);
      if (steerMag > this.maxForce) {
        steering.x = (steering.x / steerMag) * this.maxForce;
        steering.y = (steering.y / steerMag) * this.maxForce;
      }
    }
    return steering;
  }

  separation(boids: Boid[]): Vector {
    let steering = { x: 0, y: 0 };
    let total = 0;
    const separationDistance = 30;
    for (const other of boids) {
      const d = Math.sqrt(
        (this.position.x - other.position.x) ** 2 +
        (this.position.y - other.position.y) ** 2
      );
      if (other !== this && d < separationDistance) {
        const diff = {
          x: this.position.x - other.position.x,
          y: this.position.y - other.position.y,
        };
        diff.x /= d;
        diff.y /= d;
        steering.x += diff.x;
        steering.y += diff.y;
        total++;
      }
    }
    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      const mag = Math.sqrt(steering.x ** 2 + steering.y ** 2);
      if (mag > 0) {
        steering.x = (steering.x / mag) * this.maxSpeed;
        steering.y = (steering.y / mag) * this.maxSpeed;
      }
      steering.x -= this.velocity.x;
      steering.y -= this.velocity.y;
      const steerMag = Math.sqrt(steering.x ** 2 + steering.y ** 2);
      if (steerMag > this.maxForce) {
        steering.x = (steering.x / steerMag) * this.maxForce;
        steering.y = (steering.y / steerMag) * this.maxForce;
      }
    }
    return steering;
  }

  cohesion(boids: Boid[]): Vector {
    let steering = { x: 0, y: 0 };
    let total = 0;
    for (const other of boids) {
      const d = Math.sqrt(
        (this.position.x - other.position.x) ** 2 +
        (this.position.y - other.position.y) ** 2
      );
      if (other !== this && d < this.perceptionRadius) {
        steering.x += other.position.x;
        steering.y += other.position.y;
        total++;
      }
    }
    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      steering.x -= this.position.x;
      steering.y -= this.position.y;
      const mag = Math.sqrt(steering.x ** 2 + steering.y ** 2);
      if (mag > 0) {
        steering.x = (steering.x / mag) * this.maxSpeed;
        steering.y = (steering.y / mag) * this.maxSpeed;
      }
      steering.x -= this.velocity.x;
      steering.y -= this.velocity.y;
      const steerMag = Math.sqrt(steering.x ** 2 + steering.y ** 2);
      if (steerMag > this.maxForce) {
        steering.x = (steering.x / steerMag) * this.maxForce;
        steering.y = (steering.y / steerMag) * this.maxForce;
      }
    }
    return steering;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }

    this.acceleration = { x: 0, y: 0 };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const angle = Math.atan2(this.velocity.y, this.velocity.x);
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-4, 4);
    ctx.lineTo(-4, -4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fill();
    ctx.restore();
  }
}

const BoidsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boidsRef = useRef<Boid[]>([]);
  const mouseRef = useRef<Vector>({ x: -1000, y: -1000 });
  const mouseDownRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (boidsRef.current.length === 0) {
        for (let i = 0; i < 100; i++) {
          boidsRef.current.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      mouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    handleResize();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const boid of boidsRef.current) {
        boid.edges(canvas.width, canvas.height);
        boid.flock(boidsRef.current, mouseRef.current, mouseDownRef.current);
        boid.update();
        boid.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: '#ffffff',
      }}
    />
  );
};

export default BoidsBackground;