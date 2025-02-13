"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

interface Section {
  id: string
  title: string
  content: React.ReactNode
}

interface StickySectionsProps {
  sections: Section[]
}

export function StickySections({ sections }: StickySectionsProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="ml-64 relative">
      {sections.map((section) => (
        <Section
          key={section.id}
          {...section}
          isActive={activeSection === section.id}
          onInView={() => setActiveSection(section.id)}
        />
      ))}
    </div>
  )
}

function Section({ id, title, content, isActive, onInView }: Section & { isActive: boolean; onInView: () => void }) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) onInView()
    },
  })

  return (
    <section ref={ref} id={id} className="min-h-screen py-16">
      <div className={`sticky top-0 z-10 bg-white py-8 ${isActive ? "opacity-100" : "opacity-50"}`}>
        <h2 className="font-meursault text-7xl">{title}</h2>
      </div>
      <div className="mt-8">{content}</div>
    </section>
  )
}

