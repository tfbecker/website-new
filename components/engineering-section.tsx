"use client"

import { useState } from "react"

interface Project {
  id: string
  category: "HARDWARE" | "SOFTWARE"
  title: string
  year: string
  description?: string
  image?: string
  status?: "active" | "completed"
}

const projects: Project[] = [
  {
    id: "grumobile",
    category: "HARDWARE",
    title: "GruMobile",
    year: "2023",
    description: "An electric GruMobile from the movie Despicable Me",
  },
  {
    id: "solar-a-frame",
    category: "HARDWARE",
    title: "Solar A-Frame",
    year: "2023",
    description: "A modular, solar panel based, off-grid A-frame structure",
  },
  {
    id: "ultrasound",
    category: "HARDWARE",
    title: "Ultrasound Attentuation Experiment",
    year: "2024",
  },
  {
    id: "safety-sensor",
    category: "HARDWARE",
    title: "Safety Sensor System",
    year: "2022",
    description: "A system of BLE radars for traffic safety, decreased cost of storage by 15x. Used C++ and Docker",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-20%20at%2017.30.23-jmcCQLUw3xB9YCGK9laSOyL0aRbSb9.png",
  },
  {
    id: "pcb",
    category: "HARDWARE",
    title: "Analog to Frequency PCB",
    year: "2023",
  },
  {
    id: "solar-panel",
    category: "HARDWARE",
    title: "Sun Tracking Solar Panel",
    year: "2023",
  },
  {
    id: "levers",
    category: "SOFTWARE",
    title: "Levers for Progress",
    year: "2024",
  },
  {
    id: "resonant-love",
    category: "SOFTWARE",
    title: "Resonant Love",
    year: "2024",
  },
  {
    id: "pricing",
    category: "SOFTWARE",
    title: "Pricing Algorithm",
    year: "2020",
  },
  {
    id: "portal",
    category: "SOFTWARE",
    title: "Application Portal",
    year: "2021",
  },
  {
    id: "map-editor",
    category: "SOFTWARE",
    title: "Map Editor Prototype",
    year: "2021",
  },
  {
    id: "matchmaking",
    category: "SOFTWARE",
    title: "Matchmaking Scheme",
    year: "2023",
  },
  {
    id: "gesture",
    category: "SOFTWARE",
    title: "Gesture Prototype",
    year: "2022",
  },
  {
    id: "threejs",
    category: "SOFTWARE",
    title: "Three.js Workshop",
    year: "2021",
  },
  {
    id: "sites",
    category: "SOFTWARE",
    title: "Sites++",
    year: "2020-",
  },
]

export function EngineeringSection() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-8 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">00</h2>
        <p className="text-xl md:text-2xl font-serif">Tinkering</p>
      </div>

      <div className="px-6 md:px-16">
        <div className="mb-12 rounded-lg bg-gray-100 p-6 max-w-md">
          <p className="text-sm">
            I particularly enjoy prototyping strange ideas quickly!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/4">
            <div className="space-y-12">
              {["HARDWARE", "SOFTWARE"].map((category) => (
                <div key={category}>
                  <h3 className="mb-4 text-xs font-medium text-gray-500">{category}</h3>
                  <ul className="space-y-2">
                    {projects
                      .filter((project) => project.category === category)
                      .map((project) => (
                        <li key={project.id}>
                          <button
                            className="group flex w-full items-center justify-between py-1 text-left hover:text-blue-600"
                            onMouseEnter={() => setActiveProject(project)}
                            onMouseLeave={() => setActiveProject(null)}
                          >
                            <span>{project.title}</span>
                            <span className="text-gray-400 group-hover:text-blue-600">{project.year}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="space-y-4">
                  <h3 className="text-2xl font-serif">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

