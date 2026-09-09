import type { FlagCode } from '../data/flights'
import './CountryFlag.css'

interface CountryFlagProps {
  code: FlagCode
}

function CountryFlag({ code }: CountryFlagProps) {
  return (
    <span className="country-flag">
      <svg viewBox="0 0 20 14" width="100%" height="100%">
        {code === 'france' && (
          <>
            <rect width="20" height="14" fill="#fff" />
            <rect width="6.67" height="14" fill="#0055A4" />
            <rect x="13.33" width="6.67" height="14" fill="#EF4135" />
          </>
        )}
        {code === 'japan' && (
          <>
            <rect width="20" height="14" fill="#fff" />
            <circle cx="10" cy="7" r="4.2" fill="#BC002D" />
          </>
        )}
        {code === 'brazil' && (
          <>
            <rect width="20" height="14" fill="#009739" />
            <polygon points="10,2 18,7 10,12 2,7" fill="#FEDD00" />
            <circle cx="10" cy="7" r="3" fill="#012169" />
          </>
        )}
        {code === 'egypt' && (
          <>
            <rect width="20" height="14" fill="#fff" />
            <rect width="20" height="4.67" fill="#CE1126" />
            <rect y="9.33" width="20" height="4.67" fill="#000" />
            <circle cx="10" cy="7" r="1.3" fill="#C09A3E" />
          </>
        )}
        {code === 'usa' && (
          <>
            <rect width="20" height="14" fill="#fff" />
            <rect width="20" height="2" fill="#B22234" />
            <rect y="4" width="20" height="2" fill="#B22234" />
            <rect y="8" width="20" height="2" fill="#B22234" />
            <rect y="12" width="20" height="2" fill="#B22234" />
            <rect width="9" height="7.5" fill="#3C3B6E" />
          </>
        )}
        {code === 'australia' && (
          <>
            <rect width="20" height="14" fill="#00247D" />
            <rect x="1" y="1" width="7" height="4.5" fill="#fff" />
            <path d="M1 1 8 5.5M8 1 1 5.5" stroke="#CE1126" strokeWidth="0.6" />
            <circle cx="4.5" cy="10.5" r="1.4" fill="#fff" />
            <circle cx="13" cy="4" r="0.8" fill="#fff" />
            <circle cx="16" cy="7" r="0.8" fill="#fff" />
            <circle cx="14" cy="10" r="0.8" fill="#fff" />
          </>
        )}
        {code === 'sweden' && (
          <>
            <rect width="20" height="14" fill="#006AA7" />
            <rect x="6" width="3" height="14" fill="#FECC02" />
            <rect y="5.5" width="20" height="3" fill="#FECC02" />
          </>
        )}
      </svg>
    </span>
  )
}

export default CountryFlag
