
import React, { useRef, useMemo, Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, useGLTF, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { getCarModelPath } from '../utils/carModelMapping'
import { useTranslation } from '../i18n/useTranslation'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { wheelConfigs, tireConfigs, wheelPositions } from '../config/wheelConfigs'
import { bodykitConfigs, accessoryConfigs } from '../config/partConfigs'

// Error boundary for GLB loading failures
class GLBErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    console.error('❌ GLB Loading Error caught by boundary:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error loading model:', error.message)
  }

  render() {
    if (this.state.hasError) {
      const { Fallback, color, wheelColor } = this.props
      return <Fallback color={color} wheelColor={wheelColor} />
    }

    return this.props.children
  }
}

// Loading indicator - spinning wireframe box while model loads
function LoadingCarPlaceholder() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[3, 1, 1.5]} />
      <meshBasicMaterial color="#C4A661" wireframe />
    </mesh>
  )
}

// Car model loader - attempts to load actual car GLB files
function LoadedCarModel({ modelPath, color, wheelColor, hideWheels }) {
  console.log('🚗 Loading car model from:', modelPath)

  // useGLTF suspends while loading and throws on error (caught by ErrorBoundary)
  const gltf = useGLTF(modelPath)

  // If model loaded successfully, render it
  if (gltf && gltf.scene) {
    // Calculate bounding box to auto-scale and position
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Auto-scale to fit nicely (target ~4 units length)
    const maxDim = Math.max(size.x, size.y, size.z)
    const autoScale = maxDim > 0 ? 4 / maxDim : 1

    const scene = gltf.scene.clone()

    // Apply color to car body materials
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone material to avoid affecting other instances
        child.material = child.material.clone()

        // Smart material detection - be more aggressive about finding body panels
        const name = child.name.toLowerCase()
        const matName = child.material.name ? child.material.name.toLowerCase() : ''

        const isBody =
          name.includes('body') ||
          name.includes('paint') ||
          name.includes('shell') ||
          name.includes('exterior') ||
          name.includes('hood') ||
          name.includes('door') ||
          name.includes('fender') ||
          name.includes('bumper') ||
          name.includes('trunk') ||
          name.includes('roof') ||
          matName.includes('paint') ||
          matName.includes('car') ||
          matName.includes('body')

        const isWindow = name.includes('glass') || name.includes('window') || child.material.transparent
        const isWheel = name.includes('wheel') || name.includes('rim') || name.includes('tire')
        const isLight = name.includes('light') || name.includes('lamp') || name.includes('headlight')
        const isChrome = name.includes('chrome') || name.includes('metal') || name.includes('grill')

        if (isBody && !isWindow && !isWheel && !isLight && !isChrome) {
          child.material.color = new THREE.Color(color)
          child.material.metalness = 0.6
          child.material.roughness = 0.2
          child.material.clearcoat = 1.0
          child.material.clearcoatRoughness = 0.1
        }

        // Simple wheel coloring if we can identify rims
        if (name.includes('rim') && wheelColor) {
          child.material.color = new THREE.Color(wheelColor)
        }

        // Hide original wheels if custom wheels are active
        if (hideWheels && isWheel) {
          child.visible = false
        }
      }
    })

    return (
      <primitive
        object={scene}
        scale={autoScale}
        position={[0, -center.y * autoScale, 0]}
        rotation={[0, Math.PI / 5, 0]}
      />
    )
  }

  return null
}

// Wheel model loader - loads individual wheel GLB models
function LoadedWheel({ glbPath, position, rotation, color, scale = 1.0 }) {
  const gltf = useGLTF(glbPath)

  const clonedScene = useMemo(() => {
    if (!gltf?.scene) return null
    const scene = gltf.scene.clone()

    // Apply wheel color to materials
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()

        const name = child.name.toLowerCase()
        // If it's a rim part, color it
        if ((name.includes('rim') || name.includes('spoke') || name.includes('wheel'))) {
          if (color) {
            child.material.color = new THREE.Color(color)
            child.material.metalness = 0.85
            child.material.roughness = 0.15
          }
        }
      }
    })

    return scene
  }, [gltf, color])

  if (!clonedScene) return null

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

// Wheel Assembly - renders 4 wheels with selected rim model
function WheelAssembly({ wheelProductId, wheelColor, selectedWheel }) {
  // Use selectedWheel object first (from Turso), fallback to hardcoded config
  const glbPath = selectedWheel?.glb_path || selectedWheel?.glbPath || (wheelProductId && wheelConfigs[wheelProductId]?.glbPath)

  if (!glbPath) return null

  const positions = wheelPositions

  return (
    <group>
      {Object.entries(positions).map(([key, pos]) => (
        <Suspense key={key} fallback={null}>
          <LoadedWheel
            glbPath={glbPath}
            position={pos.position}
            rotation={pos.rotation}
            color={wheelColor}
            scale={selectedWheel?.scale_factor || 1.0}
          />
        </Suspense>
      ))}
    </group>
  )
}

// ... existing PartModel ...

function Car({ vehicle, color, wheelColor, wheelProductId, selectedWheel, bodykitProductId, accessoryProductIds, caliperColor }) {
  const modelPath = vehicle ? getCarModelPath(vehicle) : null

  // Debug log
  useEffect(() => {
    if (vehicle) {
      console.log('🚙 Vehicle selected:', vehicle.make, vehicle.model)
      console.log('🔗 Model path:', modelPath)
    }
  }, [vehicle, modelPath])

  // Car body
  const carBody = useMemo(() => {
    if (!vehicle) {
      console.log('📦 No vehicle - showing procedural model')
      return <ProceduralCarModel color={color} wheelColor={wheelColor} />
    }

    if (modelPath) {
      console.log('📦 Loading GLB model:', modelPath)
      return (
        <GLBErrorBoundary
          Fallback={ProceduralCarModel}
          color={color}
          wheelColor={wheelColor}
        >
          <Suspense fallback={<LoadingCarPlaceholder />}>
            <LoadedCarModel
              modelPath={modelPath}
              color={color}
              wheelColor={wheelColor}
              hideWheels={!!selectedWheel || !!wheelProductId}
            />
          </Suspense>
        </GLBErrorBoundary>
      )
    }

    console.log('⚠️ No model path found - showing procedural model')
    return <ProceduralCarModel color={color} wheelColor={wheelColor} bodyStyle={vehicle.bodyStyle} />
  }, [vehicle, modelPath, color, wheelColor, selectedWheel, wheelProductId])

  return (
    <group>
      {/* Main car body */}
      {carBody}

      {/* Wheel Assembly - custom wheels */}
      {(selectedWheel || wheelProductId) && (
        <WheelAssembly
          wheelProductId={wheelProductId}
          wheelColor={wheelColor}
          selectedWheel={selectedWheel}
        />
      )}

      {/* Bodykit Assembly - bumpers, spoilers, etc */}
      {bodykitProductId && (
        <BodykitAssembly bodykitProductId={bodykitProductId} />
      )}

      {/* Accessories Assembly - exhaust, brakes, lights */}
      {accessoryProductIds && accessoryProductIds.length > 0 && (
        <AccessoriesAssembly
          accessoryProductIds={accessoryProductIds}
          caliperColor={caliperColor}
        />
      )}
    </group>
  )
}

// Dynamic Lighting Component
function DynamicLighting({ timeOfDay, season }) {
  const lightingPresets = {
    dawn: {
      ambient: { intensity: 0.3, color: '#4d4d6e' },
      key: { intensity: 1.5, color: '#f7d3a1', position: [15, 10, 15] },
      fill: { intensity: 0.4, color: '#6B8EE3', position: [-10, 5, -10] },
      rim: { intensity: 2.0, color: '#ffb3c6', position: [-5, 5, 5] }
    },
    day: {
      ambient: { intensity: 0.4, color: '#ffffff' },
      key: { intensity: 1.8, color: '#fffdf5', position: [10, 15, 10] },
      fill: { intensity: 0.8, color: '#dbeafe', position: [-10, 5, -10] },
      rim: { intensity: 2.0, color: '#ffffff', position: [-5, 5, 5] }
    },
    sunset: {
      ambient: { intensity: 0.4, color: '#6e3b3b' },
      key: { intensity: 1.5, color: '#ff7e47', position: [12, 8, 12] },
      fill: { intensity: 0.5, color: '#aa4d69', position: [-10, 5, -10] },
      rim: { intensity: 2.5, color: '#ffa64d', position: [-5, 5, 5] }
    },
    night: {
      ambient: { intensity: 0.1, color: '#1a1a2e' },
      key: { intensity: 0.0, color: '#000000', position: [0, 0, 0] }, // No direct sun
      fill: { intensity: 0.3, color: '#2d2d4d', position: [-10, 5, -10] },
      rim: { intensity: 0.5, color: '#4a5a7a', position: [-5, 5, 5] }
    },
    // Adding a specific 'studio' preset which might be mapped from 'day' or 'night' if needed, 
    // but for now optimizing the existing keys.
    // Let's make "day" feel more like a controlled studio environment since that's the default.
    studio: {
      ambient: { intensity: 0.4, color: '#ffffff' },
      key: { intensity: 2.5, color: '#ffffff', position: [8, 12, 8] },
      fill: { intensity: 1.0, color: '#d0d0d0', position: [-8, 6, -8] },
      rim: { intensity: 3.5, color: '#ffffff', position: [-2, 8, 5] }
    }
  }

  const seasonModifiers = {
    spring: { multiplier: 1.1 },
    summer: { multiplier: 1.2 },
    autumn: { multiplier: 0.9 },
    winter: { multiplier: 0.8 }
  }

  const lighting = lightingPresets[timeOfDay] || lightingPresets.day
  const modifier = seasonModifiers[season] || seasonModifiers.summer

  return (
    <>
      <ambientLight
        intensity={lighting.ambient.intensity * modifier.multiplier}
        color={lighting.ambient.color}
      />

      <spotLight
        position={lighting.key.position}
        angle={0.2}
        penumbra={1}
        intensity={lighting.key.intensity * modifier.multiplier}
        color={lighting.key.color}
        castShadow
        shadow-bias={-0.0001}
      />

      <pointLight
        position={lighting.fill.position}
        intensity={lighting.fill.intensity * modifier.multiplier}
        color={lighting.fill.color}
      />

      <spotLight
        position={lighting.rim.position}
        intensity={lighting.rim.intensity * modifier.multiplier}
        color={lighting.rim.color}
        angle={0.5}
        penumbra={1}
      />
    </>
  )
}

// Dynamic Environment Component
function DynamicEnvironment({ location, timeOfDay }) {
  const environmentPresets = {
    casablanca: { preset: 'city', background: '#1a3a52' },
    marrakech: { preset: 'sunset', background: '#8B4513' },
    atlas: { preset: 'dawn', background: '#4682B4' },
    sahara: { preset: 'sunset', background: '#F4A460' },
    tangier: { preset: 'city', background: '#2F4F4F' },
    chefchaouen: { preset: 'dawn', background: '#4169E1' }
  }

  const env = environmentPresets[location] || environmentPresets.casablanca
  const preset = timeOfDay === 'night' ? 'night' : env.preset

  return (
    <>
      <Environment preset={preset} />
      <color attach="background" args={[env.background]} />
    </>
  )
}

// Camera controller component to handle zoom
function CameraController({ controlsRef, zoomLevel }) {
  const { camera } = useThree()

  useFrame(() => {
    if (controlsRef.current && zoomLevel !== null) {
      // Smooth zoom animation
      const targetDistance = zoomLevel
      const currentDistance = camera.position.length()
      const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.1)
      camera.position.normalize().multiplyScalar(newDistance)
      controlsRef.current.update()
    }
  })

  return null
}

export default function Car3DViewer() {
  const {
    vehicle,
    carColor,
    wheelColor,
    selectedLocation,
    selectedSeason,
    timeOfDay,
    previewMode,
    configuration, // Get full configuration
    wheelProductId,
    bodykitProductId,
    accessoryProductIds,
    caliperColor
  } = useStore()
  const controlsRef = useRef()
  const [zoomLevel, setZoomLevel] = useState(null)

  // Use preview color if in preview mode, otherwise use selected color
  const displayColor = useMemo(() => {
    if (previewMode.active && previewMode.type === 'paint') {
      return previewMode.value
    }
    if (previewMode.active && previewMode.type === 'wrap') {
      return previewMode.value
    }
    return carColor || '#5a0f1d'
  }, [previewMode, carColor])

  const displayWheelColor = useMemo(() => {
    if (previewMode.active && previewMode.type === 'wheels') {
      return previewMode.value
    }
    return wheelColor || '#1a1a1a'
  }, [previewMode, wheelColor])

  // Get selected wheel product (either from config or preview)
  const selectedWheel = useMemo(() => {
    if (previewMode.active && previewMode.type === 'wheel_product') {
      return previewMode.value
    }
    return configuration?.wheels
  }, [previewMode, configuration])

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const currentDistance = controlsRef.current.object.position.length()
      const newDistance = Math.max(currentDistance * 0.75, 3) // Min distance 3
      setZoomLevel(newDistance)
      setTimeout(() => setZoomLevel(null), 500) // Clear after animation
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const currentDistance = controlsRef.current.object.position.length()
      const newDistance = Math.min(currentDistance * 1.35, 18) // Max distance 18
      setZoomLevel(newDistance)
      setTimeout(() => setZoomLevel(null), 500)
    }
  }, [])

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [])

  return (
    <div className="w-full h-full bg-atlas-black relative">
      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-atlas-charcoal/80 hover:bg-atlas-burgundy/80 rounded-lg flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-atlas-gold/50"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-atlas-charcoal/80 hover:bg-atlas-burgundy/80 rounded-lg flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-atlas-gold/50"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-atlas-charcoal/80 hover:bg-atlas-burgundy/80 rounded-lg flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-atlas-gold/50"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Zoom Hint */}
      <div className="absolute bottom-4 right-4 z-10 text-xs text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
        Scroll to zoom • Drag to rotate
      </div>

      <Canvas
        shadows
        dpr={[1, 2]} // Quality scaling
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <PerspectiveCamera makeDefault position={[6, 2, 6]} fov={45} />

        <CameraController controlsRef={controlsRef} zoomLevel={zoomLevel} />

        {/* Dynamic Lighting based on time of day and season */}
        <DynamicLighting timeOfDay={timeOfDay} season={selectedSeason} />

        <Suspense fallback={null}>
          <Float
            speed={2}
            rotationIntensity={0.1}
            floatIntensity={0.2}
            floatingRange={[-0.05, 0.05]}
          >
            <Car
              vehicle={vehicle}
              color={displayColor}
              wheelColor={displayWheelColor}
              wheelProductId={wheelProductId}
              selectedWheel={selectedWheel}
              bodykitProductId={bodykitProductId}
              accessoryProductIds={accessoryProductIds}
              caliperColor={caliperColor}
            />
          </Float>

          {/* Dynamic Environment based on location and time */}
          <DynamicEnvironment location={selectedLocation} timeOfDay={timeOfDay} />

          {/* Background Stars for subtle depth if dark */}
          {timeOfDay === 'night' && (
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          )}

          <ContactShadows
            resolution={1024}
            scale={50}
            blur={2}
            opacity={0.6}
            far={10}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          panSpeed={0.8}
          enableZoom={true}
          minDistance={2}
          maxDistance={20}
          minPolarAngle={0} // Allow view from directly above
          maxPolarAngle={Math.PI} // Allow view from all angles including underneath
          autoRotate={!vehicle} // Iterate if no vehicle loaded
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />

        <fog attach="fog" args={['#0a0a0a', 10, 50]} />
      </Canvas>
    </div>
  )
}

// Preload common models
const SUPABASE_URL = 'https://xoyyudojecpytvyisjqv.supabase.co'
const preloadModels = [
  '2021_bmw_m4_competition.glb',
  '2016_ferrari_488_gtb.glb',
  '2019_lamborghini_huracan_gt_lbsilhouette.glb'
]

preloadModels.forEach(filename => {
  const url = `${SUPABASE_URL}/storage/v1/object/public/cars/${filename}`
  useGLTF.preload(url)
})
