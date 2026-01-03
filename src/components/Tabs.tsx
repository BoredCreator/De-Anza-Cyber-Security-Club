import { useState, useRef, useEffect } from 'react'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
    const activeButton = tabRefs.current[activeIndex]

    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      })
    }
  }, [activeTab, tabs])

  return (
    <div className={`relative flex gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800 ${className}`}>
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 bg-gray-800 rounded-md transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {/* Tab buttons */}
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={el => tabRefs.current[index] = el}
          onClick={() => onTabChange(tab.id)}
          className={`relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-matrix'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
