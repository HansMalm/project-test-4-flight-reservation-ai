import { useState } from 'react'
import type { ChangeEvent, PointerEvent } from 'react'
import './Sidebar.css'

const PRICE_MIN = 0
const PRICE_MAX = 10000
const PRICE_STEP = 100

interface SidebarProps {
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
}

function Sidebar({ priceRange, onPriceRangeChange }: SidebarProps) {
  const [min, max] = priceRange

  // The two range inputs overlap, so only the one on top can be grabbed. When
  // the handles sit close together this hides the lower one. Track the pointer
  // and raise whichever handle it's nearer to, so both stay reachable.
  const [minHandleOnTop, setMinHandleOnTop] = useState(false)

  function updateTopHandle(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerValue = ((event.clientX - rect.left) / rect.width) * PRICE_MAX
    const nearerToMin =
      Math.abs(pointerValue - min) <= Math.abs(pointerValue - max)
    setMinHandleOnTop((current) => (current === nearerToMin ? current : nearerToMin))
  }

  function handleMinChange(event: ChangeEvent<HTMLInputElement>) {
    const next = Math.min(Number(event.target.value), max - PRICE_STEP)
    onPriceRangeChange([next, max])
  }

  function handleMaxChange(event: ChangeEvent<HTMLInputElement>) {
    const next = Math.max(Number(event.target.value), min + PRICE_STEP)
    onPriceRangeChange([min, next])
  }

  const fillLeft = (min / PRICE_MAX) * 100
  const fillRight = 100 - (max / PRICE_MAX) * 100

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Filters</h2>

      <div className="filter-group">
        <h3>Price</h3>
        <div
          className="price-range"
          onPointerMove={updateTopHandle}
          onPointerDown={updateTopHandle}
        >
          <div className="price-range-track">
            <div
              className="price-range-fill"
              style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
            />
          </div>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={min}
            onChange={handleMinChange}
            aria-label="Minimum price"
            style={{ zIndex: minHandleOnTop ? 5 : undefined }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={max}
            onChange={handleMaxChange}
            aria-label="Maximum price"
          />
        </div>
        <div className="price-range-values">
          <span>{min.toLocaleString('sv-SE')} kr</span>
          <span>{max.toLocaleString('sv-SE')} kr</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
