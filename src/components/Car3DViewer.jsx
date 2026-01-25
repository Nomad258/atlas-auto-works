
import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, useGLTF, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { getCarModelPath } from '../utils/carModelMapping'
import { useTranslation } from '../i18n/useTranslation'

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

// Car model loader - attempts to load actual car GLB files
function LoadedCarModel({ modelPath, color, wheelColor }) {
  // useGLTF suspends while loading and throws on error (caught by ErrorBoundary)
  const gltf = useGLTF(modelPath)

  // If model loaded successfully, render it
  if (gltf && gltf.scene) {
    const scene = gltf.scene.clone()

    // Apply color to car body materials
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone material to avoid affecting other instances
        child.material = child.material.clone()

        // Smart material detection
        const name = child.name.toLowerCase()
        const isBody =
          name.includes('body') ||
          name.includes('paint') ||
          name.includes('shell') ||
          (child.material.name && child.material.name.toLowerCase().includes('paint'))

        const isWindow = name.includes('glass') || name.includes('window') || child.material.transparent
        const isWheel = name.includes('wheel') || name.includes('rim') || name.includes('tire')

        if (isBody && !isWindow && !isWheel) {
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
      }
    })

    return (
      <primitive
        object={scene}
        scale={1.6}
        position={[0, -0.65, 0]}
        rotation={[0, Math.PI / 5, 0]}
      />
    )
  }

  return null
}

// Procedural car model - fallback
function ProceduralCarModel({ color, wheelColor, bodyStyle = 'Coupe' }) {
  const groupRef = useRef()
  const bodyColor = useMemo(() => new THREE.Color(color), [color])
  const wheelColorObj = useMemo(() => new THREE.Color(wheelColor || '#1a1a1a'), [wheelColor])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation handled by Float component, but we can add subtle idle movement here if needed
    }
  })

  // Dimensions
  const length = 4.2
  const width = 1.8
  const height = 1.2

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Car body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height * 0.6, width]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.7}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Cabin/roof */}
      <mesh position={[-0.2, height * 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[length * 0.5, height * 0.5, width * 0.85]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.9}
          roughness={0.0}
        />
      </mesh>

      {/* Wheels */}
      <Wheel position={[length * 0.35, 0, width * 0.5]} color={wheelColorObj} />
      <Wheel position={[length * 0.35, 0, -width * 0.5]} color={wheelColorObj} />
      <Wheel position={[-length * 0.35, 0, width * 0.5]} color={wheelColorObj} />
      <Wheel position={[-length * 0.35, 0, -width * 0.5]} color={wheelColorObj} />
    </group>
  )
}

function Wheel({ position, color }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Car({ vehicle, color, wheelColor }) {
  const modelPath = vehicle ? getCarModelPath(vehicle) : null

  if (!vehicle) {
    return <ProceduralCarModel color={color} wheelColor={wheelColor} />
  }

  if (modelPath) {
    return (
      <GLBErrorBoundary
        Fallback={ProceduralCarModel}
        color={color}
        wheelColor={wheelColor}
      >
        <Suspense fallback={<ProceduralCarModel color={color} wheelColor={wheelColor} />}>
          <LoadedCarModel
            modelPath={modelPath}
            color={color}
            wheelColor={wheelColor}
          />
        </Suspense>
      </GLBErrorBoundary>
    )
  }

  return <ProceduralCarModel color={color} wheelColor={wheelColor} bodyStyle={vehicle.bodyStyle} />
}

// Dynamic Lighting Component
function DynamicLighting({ timeOfDay, season }) {
  const lightingPresets = {
    dawn: {
      ambient: { intensity: 0.3, color: '#8B7BC1' },
      key: { intensity: 1.2, color: '#FFB347', position: [15, 10, 15] },
      fill: { intensity: 0.4, color: '#6B8EE3', position: [-10, 5, -10] },
      rim: { intensity: 1.5, color: '#FF6B9D', position: [-5, 5, 5] }
    },
    day: {
      ambient: { intensity: 0.5, color: '#ffffff' },
      key: { intensity: 2, color: '#FFF8E7', position: [10, 15, 10] },
      fill: { intensity: 1, color: '#87CEEB', position: [-10, 5, -10] },
      rim: { intensity: 3, color: '#ffffff', position: [-5, 5, 5] }
    },
    sunset: {
      ambient: { intensity: 0.4, color: '#FF7F50' },
      key: { intensity: 1.5, color: '#FF4500', position: [12, 8, 12] },
      fill: { intensity: 0.6, color: '#FF69B4', position: [-10, 5, -10] },
      rim: { intensity: 2, color: '#FF8C00', position: [-5, 5, 5] }
    },
    night: {
      ambient: { intensity: 0.2, color: '#4B0082' },
      key: { intensity: 0.8, color: '#B0C4DE', position: [5, 20, 5] },
      fill: { intensity: 0.3, color: '#483D8B', position: [-10, 5, -10] },
      rim: { intensity: 1, color: '#87CEEB', position: [-5, 5, 5] }
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

export default function Car3DViewer() {
  const { vehicle, color, wheelColor, selectedLocation, selectedSeason, timeOfDay } = useStore()

  return (
    <div className="w-full h-full bg-atlas-black">
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
              color={color || '#5a0f1d'} // Default burgundy
              wheelColor={wheelColor || '#1a1a1a'}
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
