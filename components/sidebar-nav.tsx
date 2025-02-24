"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Project {
  id: string
  title: string
  year: string
  preview: string
  description: string
}

interface SidebarNavProps {
  sections: {
    id: string
    title: string
    projects: Project[]
  }[]
}

export function SidebarNav({ sections }: SidebarNavProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white p-8">
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="mb-4 font-meursault text-2xl">{section.title}</h2>
            <ul className="space-y-2">
              {section.projects.map((project) => (
                <li key={project.id}>
                  <a
                    href={`#${project.id}`}
                    className="block py-1 text-sm text-gray-600 hover:text-black w-full"
                    onMouseEnter={() => setActiveProject(project)}
                    onMouseLeave={() => setActiveProject(null)}
                  >
                    <div className="flex items-baseline gap-2">
                      <span>{project.title}</span>
                      <div className="flex-grow border-b border-gray-400"></div>
                      <span className="text-gray-400">{project.year}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-64 top-0 h-screen w-96 border-r border-gray-200 bg-white p-8"
          >
            <h3 className="mb-4 font-meursault text-xl">{activeProject.title}</h3>
            <p className="text-sm text-gray-600">{activeProject.description}</p>
            {activeProject.preview && (
              <Image
                src={activeProject.preview || "/placeholder.svg"}
                alt={activeProject.title}
                className="mt-4 rounded-lg"
                width={384}
                height={216}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

