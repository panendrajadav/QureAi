"use client"

import { useEffect, useRef } from "react"

export default function MedicineInteractionVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create SVG-based 3D-like visualization
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "100%")
    svg.setAttribute("viewBox", "0 0 600 400")
    svg.setAttribute("class", "w-full h-full")

    // Define gradient and filters
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
    style.textContent = `
      .med-node { cursor: pointer; transition: all 0.3s ease; }
      .med-node:hover circle { filter: drop-shadow(0 0 8px currentColor); }
      .med-label { font-size: 12px; font-weight: 500; text-anchor: middle; }
      .med-line { stroke-width: 2; opacity: 0.6; }
      .med-line.positive { stroke: #10b981; }
      .med-line.warning { stroke: #f59e0b; }
      .med-line.critical { stroke: #ef4444; }
    `
    defs.appendChild(style)

    // Medicines data
    const medicines = [
      { id: 1, name: "Metformin", x: 150, y: 200, color: "#06b6d4", interactions: [2, 3] },
      { id: 2, name: "Aspirin", x: 300, y: 100, color: "#8b5cf6", interactions: [1, 3] },
      { id: 3, name: "Lisinopril", x: 450, y: 200, color: "#ec4899", interactions: [1, 2] },
    ]

    // Draw connection lines
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")

    medicines.forEach((med) => {
      med.interactions.forEach((interactionId) => {
        const other = medicines.find((m) => m.id === interactionId)
        if (other && med.id < interactionId) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
          line.setAttribute("x1", med.x.toString())
          line.setAttribute("y1", med.y.toString())
          line.setAttribute("x2", other.x.toString())
          line.setAttribute("y2", other.y.toString())
          line.setAttribute("class", "med-line warning")
          g.appendChild(line)
        }
      })
    })

    // Draw medicine nodes
    medicines.forEach((med) => {
      const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
      nodeGroup.setAttribute("class", "med-node")

      // Circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", med.x.toString())
      circle.setAttribute("cy", med.y.toString())
      circle.setAttribute("r", "40")
      circle.setAttribute("fill", med.color)
      circle.setAttribute("opacity", "0.8")

      // Label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", med.x.toString())
      text.setAttribute("y", (med.y + 5).toString())
      text.setAttribute("class", "med-label")
      text.setAttribute("fill", "#ffffff")
      text.setAttribute("font-size", "13")
      text.setAttribute("font-weight", "600")
      text.textContent = med.name

      nodeGroup.appendChild(circle)
      nodeGroup.appendChild(text)
      g.appendChild(nodeGroup)
    })

    // Add legend
    const legend = document.createElementNS("http://www.w3.org/2000/svg", "g")
    legend.setAttribute("transform", "translate(20, 350)")

    const legendText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    legendText.setAttribute("class", "med-label")
    legendText.setAttribute("x", "0")
    legendText.setAttribute("y", "0")
    legendText.setAttribute("font-size", "12")
    legendText.setAttribute("fill", "currentColor")
    legendText.textContent = "Lines show potential interactions between medicines"

    legend.appendChild(legendText)
    g.appendChild(legend)

    svg.appendChild(defs)
    svg.appendChild(g)

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(svg)
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-64 md:h-96 bg-gradient-to-b from-muted to-muted/50 rounded-lg flex items-center justify-center"
    >
      <p className="text-muted-foreground text-sm">Loading visualization...</p>
    </div>
  )
}
