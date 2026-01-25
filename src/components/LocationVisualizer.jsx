
import React from 'react'
import { MapPin, Sun, Moon, Cloud, Snowflake, Leaf, Flower2, Clock } from 'lucide-react'
import useStore from '../store/useStore'
import { useTranslation } from '../i18n/useTranslation'

const LOCATIONS = [
  {
    id: 'casablanca',
    gradient: 'from-blue-900 via-blue-700 to-sky-500',
    image: '/locations/casablanca.jpg',
  },
  {
    id: 'marrakech',
    gradient: 'from-orange-900 via-red-700 to-amber-600',
    image: '/locations/marrakech.jpg',
  },
  {
    id: 'atlas',
    gradient: 'from-stone-800 via-slate-700 to-blue-500',
    image: '/locations/atlas.jpg',
  },
  {
    id: 'sahara',
    gradient: 'from-amber-900 via-orange-700 to-yellow-500',
    image: '/locations/sahara.jpg',
  },
  {
    id: 'tangier',
    gradient: 'from-teal-800 via-cyan-700 to-emerald-500',
    image: '/locations/tangier.jpg',
  },
  {
    id: 'chefchaouen',
    gradient: 'from-blue-800 via-indigo-700 to-blue-500',
    image: '/locations/chefchaouen.jpg',
  },
]

const SEASONS = [
  { id: 'spring', icon: Flower2, color: 'text-pink-400' },
  { id: 'summer', icon: Sun, color: 'text-amber-400' },
  { id: 'autumn', icon: Leaf, color: 'text-orange-400' },
  { id: 'winter', icon: Snowflake, color: 'text-cyan-300' },
]

const TIME_OPTIONS = [
  { id: 'dawn', icon: Sun, gradient: 'from-purple-600 to-orange-400' },
  { id: 'day', icon: Sun, gradient: 'from-sky-400 to-blue-200' },
  { id: 'sunset', icon: Cloud, gradient: 'from-orange-500 to-pink-600' },
  { id: 'night', icon: Moon, gradient: 'from-indigo-900 to-violet-800' },
]

function LocationCard({ location, isSelected, onSelect }) {
  const { t } = useTranslation()

  return (
    <div
      onClick={() => onSelect(location.id)}
      className={`
        relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group
        ${isSelected ? 'ring-2 ring-atlas-gold shadow-lg shadow-atlas-gold/20' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${location.gradient}`} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-3 h-3 text-atlas-gold" />
          <span className="text-atlas-gold text-xs font-medium uppercase tracking-wider">
            {t(`location.locations.${location.id}.name`)}
          </span>
        </div>
        <p className="text-gray-300 text-xs line-clamp-2">
          {t(`location.locations.${location.id}.description`)}
        </p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-atlas-gold rounded-full flex items-center justify-center z-20 shadow-md">
          <MapPin className="w-3 h-3 text-black" />
        </div>
      )}
    </div>
  )
}

function LocationVisualizer() {
  const {
    selectedLocation,
    setSelectedLocation,
    selectedSeason,
    setSelectedSeason,
    timeOfDay,
    setTimeOfDay,
    carColor,
  } = useStore()

  const { t } = useTranslation()

  const currentLocation = LOCATIONS.find(l => l.id === selectedLocation) || LOCATIONS[0]
  const currentTime = TIME_OPTIONS.find(t => t.id === timeOfDay) || TIME_OPTIONS[1]

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          {t('location.title')}
        </h3>
        <p className="text-gray-400">
          {t('location.subtitle')}
        </p>
      </div>

      {/* Main visualization */}
      <div className="relative rounded-2xl overflow-hidden aspect-video mb-8 shadow-2xl border border-white/10">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentLocation.gradient} transition-colors duration-700`}>
          {/* Time of day overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${currentTime.gradient} opacity-40 mix-blend-overlay transition-colors duration-700`} />
        </div>

        {/* Scene Element (Ground) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Car Silhouette Placeholder (Visual Feedback) */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-1/2 opacity-90">
          {/* This would ideally be a snapshot of the 3D car, but a stylized SVG works for now */}
          <div
            className="w-full h-32 bg-black/40 blur-xl absolute bottom-0 left-0 scale-y-50 rounded-[100%]"
          />
          <svg viewBox="0 0 200 60" className="w-full h-full drop-shadow-2xl">
            <path
              d="M10,50 L20,50 L40,30 L160,30 L180,50 L190,50"
              stroke={carColor}
              strokeWidth="2"
              fill="none"
              className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            />
          </svg>
          <p className="text-center text-white/50 text-xs mt-2 font-mono uppercase tracking-widest">
            {t('viewer3d.loading')}
          </p>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5">
            <MapPin className="w-3 h-3 text-atlas-gold" />
            <span className="text-white text-xs font-medium">
              {t(`location.locations.${currentLocation.id}.name`)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5">
            {React.createElement(SEASONS.find(s => s.id === selectedSeason)?.icon || Sun, {
              className: `w-3 h-3 ${SEASONS.find(s => s.id === selectedSeason)?.color}`
            })}
            <span className="text-white text-xs">
              {t(`location.seasons.${selectedSeason}`)} • {t(`location.times.${timeOfDay}`)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Season & Time Controls */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-atlas-gold" />
              {t('location.selectSeason')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {SEASONS.map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl transition-all border
                    ${selectedSeason === season.id
                      ? 'bg-white/10 border-atlas-gold text-white'
                      : 'bg-black/20 border-transparent text-gray-400 hover:bg-white/5'}
                  `}
                >
                  <season.icon className={`w-4 h-4 ${selectedSeason === season.id ? season.color : ''}`} />
                  <span className="text-sm">{t(`location.seasons.${season.id}`)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-atlas-gold" />
              {t('location.selectTime')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setTimeOfDay(time.id)}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl transition-all border
                    ${timeOfDay === time.id
                      ? 'bg-white/10 border-atlas-gold text-white'
                      : 'bg-black/20 border-transparent text-gray-400 hover:bg-white/5'}
                  `}
                >
                  <time.icon className={`w-4 h-4 ${timeOfDay === time.id ? 'text-orange-300' : ''}`} />
                  <span className="text-sm">{t(`location.times.${time.id}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location Grid */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-atlas-gold" />
            {t('location.selectLocation')}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation === location.id}
                onSelect={setSelectedLocation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationVisualizer
