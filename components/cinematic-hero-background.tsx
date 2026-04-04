"use client"

import { useEffect, useRef } from "react"

export function CinematicHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle system for atmospheric effect
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.3 - 0.2
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.7 ? "#D4A574" : "#8B2B3E"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.y < -10) {
          this.y = canvas.height + 10
          this.x = Math.random() * canvas.width
        }
        if (this.x < -10) this.x = canvas.width + 10
        if (this.x > canvas.width + 10) this.x = -10
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle =
          this.color === "#D4A574"
            ? `rgba(212, 165, 116, ${this.opacity})`
            : `rgba(139, 43, 62, ${this.opacity})`
        ctx.fill()
      }
    }

    // Light beam class
    class LightBeam {
      x: number
      width: number
      speed: number
      opacity: number
      angle: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.width = Math.random() * 200 + 100
        this.speed = Math.random() * 0.3 + 0.1
        this.opacity = Math.random() * 0.08 + 0.02
        this.angle = (Math.random() * 30 - 15) * (Math.PI / 180)
      }

      update() {
        this.x += this.speed
        if (this.x > canvas.width + this.width) {
          this.x = -this.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, 0)
        ctx.rotate(this.angle)

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.5)
        gradient.addColorStop(0, `rgba(212, 165, 116, 0)`)
        gradient.addColorStop(0.3, `rgba(212, 165, 116, ${this.opacity})`)
        gradient.addColorStop(0.7, `rgba(139, 43, 62, ${this.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(139, 43, 62, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(-this.width / 2, -100, this.width, canvas.height * 1.5)
        ctx.restore()
      }
    }

    // Create particles and light beams
    const particles: Particle[] = []
    const lightBeams: LightBeam[] = []

    for (let i = 0; i < 80; i++) {
      particles.push(new Particle())
    }

    for (let i = 0; i < 4; i++) {
      lightBeams.push(new LightBeam())
    }

    let animationId: number

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      )
      bgGradient.addColorStop(0, "rgba(139, 43, 62, 0.03)")
      bgGradient.addColorStop(0.5, "rgba(212, 165, 116, 0.02)")
      bgGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw light beams
      lightBeams.forEach((beam) => {
        beam.update()
        beam.draw()
      })

      // Draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#8B2B3E]/5 rounded-full blur-[100px] animate-orb-float-1" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D4A574]/8 rounded-full blur-[80px] animate-orb-float-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#8B2B3E]/3 to-transparent rounded-full animate-pulse-slow" />
      
      {/* Canvas for particle effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />
      
      {/* Light rays overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#D4A574]/10 to-transparent rotate-[15deg] animate-ray-1" />
        <div className="absolute -top-[20%] left-[30%] w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#8B2B3E]/8 to-transparent rotate-[10deg] animate-ray-2" />
        <div className="absolute -top-[20%] right-[25%] w-[1px] h-[150%] bg-gradient-to-b from-transparent via-[#D4A574]/12 to-transparent rotate-[-12deg] animate-ray-3" />
        <div className="absolute -top-[20%] right-[10%] w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#8B2B3E]/6 to-transparent rotate-[-8deg] animate-ray-4" />
      </div>
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
      }} />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.03)_100%)]" />
    </div>
  )
}
