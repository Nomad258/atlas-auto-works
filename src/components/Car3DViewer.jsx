import React, { useRef, useMemo, Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, useGLTF, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { getCarModelPath } from '../utils/carModelMapping'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { wheelConfigs, wheelPositions } from '../config/wheelConfigs'
import { bodykitConfigs, accessoryConfigs } from '../config/partConfigs'

// Error boundary for GLB loading failures
class GLBErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    console.error('GLB Loading Error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading model:', error.message)
  }

  render() {
    if (this.state.hasError) {
      const { Fallback, color, wheelColor } = this.props
      return <Fallback color={color} wheelColor={wheelColor} />
    }
    return this.props.children
  }
}

// Procedural car model fallback - shown when GLB fails to load or no vehicle selected
function ProceduralCarModel({ color = '#C4A661', wheelColor = '#1a1a1a' }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* Car Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[4, 0.8, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Cabin/Roof */}
      <mesh position={[0.2, 0.9, 0]} castShadow>
        <boxGeometry args={[2, 0.6, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Windshield */}
      <mesh position={[-0.7, 0.75, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.5, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rear Window */}
      <mesh position={[1.1, 0.75, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 0.4, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[
        [-1.3, 0, 0.9],
        [-1.3, 0, -0.9],
        [1.3, 0, 0.9],
        [1.3, 0, -0.9]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.32, 16]} />
            <meshStandardMaterial color={wheelColor} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[-2, 0.35, 0.6]}>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2, 0.35, -0.6]}>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[2, 0.35, 0.6]}>
        <boxGeometry args={[0.1, 0.15, 0.25]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[2, 0.35, -0.6]}>
        <boxGeometry args={[0.1, 0.15, 0.25]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// Loading indicator
function LoadingCarPlaceholder() {
  const meshRef = useRef()

  useFrame(() => {
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

// Bodykit effect definitions - visual modifications applied to car materials
const BODYKIT_EFFECTS = {
  'b001': { // GT Wing Spoiler
    name: 'GT Wing Spoiler',
    effects: {
      rearMetalness: 0.95,
      rearRoughness: 0.05,
      accentColor: '#1a1a1a',
      carbonAccent: true
    }
  },
  'b002': { // Sport Front Bumper
    name: 'Sport Front Bumper',
    effects: {
      frontMetalness: 0.7,
      frontRoughness: 0.15,
      aggressiveLook: true
    }
  },
  'b003': { // Wide Body Fenders
    name: 'Wide Body Fenders',
    effects: {
      bodyMetalness: 0.65,
      bodyRoughness: 0.18,
      wideBody: true
    }
  },
  'b004': { // Carbon Fiber Splitter
    name: 'Carbon Fiber Splitter',
    effects: {
      frontMetalness: 0.9,
      frontRoughness: 0.1,
      carbonAccent: true
    }
  },
  'b005': { // Body Shell
    name: 'BMW Body Shell',
    effects: {
      bodyMetalness: 0.7,
      bodyRoughness: 0.15,
      fullBodyKit: true
    }
  },
  'b006': { // Carbon Undertray
    name: 'Carbon Undertray',
    effects: {
      underMetalness: 1.0,
      underRoughness: 0.05,
      carbonAccent: true
    }
  }
}

// Car model loader with bodykit visual effects
function LoadedCarModel({ modelPath, color, wheelColor, hideWheels, bodykitId, windowTint, interiorColor }) {
  const gltf = useGLTF(modelPath)
  const bodykitEffect = bodykitId ? BODYKIT_EFFECTS[bodykitId] : null

  const scene = useMemo(() => {
    if (!gltf?.scene) return null

    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const autoScale = maxDim > 0 ? 4 / maxDim : 1

    const clonedScene = gltf.scene.clone()

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        const name = child.name.toLowerCase()
        const matName = child.material.name?.toLowerCase() || ''

        const isBody = name.includes('body') || name.includes('paint') || name.includes('shell') ||
          name.includes('hood') || name.includes('door') || name.includes('fender') ||
          name.includes('bumper') || name.includes('trunk') || name.includes('roof') ||
          matName.includes('paint') || matName.includes('car') || matName.includes('body')

        const isWindow = name.includes('glass') || name.includes('window') || child.material.transparent
        const isWheel = name.includes('wheel') || name.includes('rim') || name.includes('tire')
        const isLight = name.includes('light') || name.includes('lamp')
        const isChrome = name.includes('chrome') || name.includes('metal') || name.includes('grill')
        const isInterior = name.includes('interior') || name.includes('seat') || name.includes('dash') || name.includes('cabin')
        const isRear = name.includes('rear') || name.includes('trunk') || name.includes('spoiler') || name.includes('tail')
        const isFront = name.includes('front') || name.includes('hood') || name.includes('bumper_f') || name.includes('grille')

        // Apply base body color
        if (isBody && !isWindow && !isWheel && !isLight && !isChrome) {
          // CRITICAL: Remove base color texture so color applies correctly
          // Without this, color multiplies with dark texture = dark result
          if (child.material.map) {
            child.material.map = null
          }
          child.material.color = new THREE.Color(color)
          let metalness = 0.6
          let roughness = 0.2

          // Apply bodykit effects if selected
          if (bodykitEffect?.effects) {
            const fx = bodykitEffect.effects

            // Spoiler/rear effects
            if (isRear && fx.rearMetalness) {
              metalness = fx.rearMetalness
              roughness = fx.rearRoughness || 0.1
            }

            // Front bumper/splitter effects
            if (isFront && fx.frontMetalness) {
              metalness = fx.frontMetalness
              roughness = fx.frontRoughness || 0.15
            }

            // Full body effects
            if (fx.bodyMetalness) {
              metalness = fx.bodyMetalness
              roughness = fx.bodyRoughness || 0.15
            }

            // Carbon fiber accent - adds subtle dark tint to edges
            if (fx.carbonAccent) {
              child.material.envMapIntensity = 1.5
            }
          }

          child.material.metalness = metalness
          child.material.roughness = roughness
          child.material.needsUpdate = true
        }

        // Apply window tint if selected
        if (isWindow && windowTint) {
          child.material.color = new THREE.Color('#1a1a1a')
          child.material.opacity = windowTint // 0.5 = light, 0.2 = dark, 0.05 = limo
          child.material.transparent = true
        }

        // Apply interior color if selected
        if (isInterior && interiorColor) {
          child.material.color = new THREE.Color(interiorColor)
        }

        if (name.includes('rim') && wheelColor) {
          child.material.color = new THREE.Color(wheelColor)
        }

        if (hideWheels && isWheel) {
          child.visible = false
        }
      }
    })

    clonedScene.scale.setScalar(autoScale)
    clonedScene.position.set(0, -center.y * autoScale, 0)
    clonedScene.rotation.set(0, Math.PI / 5, 0)

    return clonedScene
  }, [gltf, color, wheelColor, hideWheels, bodykitEffect, windowTint, interiorColor])

  if (!scene) return null
  return <primitive object={scene} />
}

// Visual indicator for bodykit parts - 3D wireframe outline showing where parts go
function BodykitIndicator({ bodykitId, carBounds }) {
  const indicatorRef = useRef()
  const [pulse, setPulse] = useState(0)

  // Animate the indicator
  useFrame((state) => {
    if (indicatorRef.current) {
      setPulse(Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5)
      indicatorRef.current.material.opacity = 0.3 + pulse * 0.2
    }
  })

  if (!bodykitId) return null

  // Define indicator positions based on bodykit product IDs from database
  const indicators = {
    'b001': { // Atlas Aero Package - full body kit
      position: [0, 0.5, 0],
      size: [2.0, 0.7, 4.0],
      color: '#c4a661',
      label: 'Aero Package'
    },
    'b002': { // Sport Front Bumper
      position: [0, 0.3, 2.0],
      size: [1.8, 0.5, 0.4],
      color: '#c4a661',
      label: 'Front Bumper'
    },
    'b003': { // Wide Body Fenders - sides of car
      position: [0, 0.5, 0],
      size: [2.4, 0.5, 3.5],
      color: '#c4a661',
      label: 'Wide Body'
    },
    'b004': { // Carbon Fiber Splitter - front low
      position: [0, 0.1, 2.2],
      size: [1.6, 0.1, 0.3],
      color: '#c4a661',
      label: 'Splitter'
    },
    'b005': { // GT Wing Spoiler - rear top
      position: [0, 1.1, -1.6],
      size: [1.4, 0.2, 0.4],
      color: '#c4a661',
      label: 'Spoiler'
    },
    'b006': { // Side Skirt Extensions - along sides, low
      position: [0, 0.15, 0],
      size: [0.15, 0.2, 3.0],
      color: '#c4a661',
      label: 'Side Skirts',
      // Side skirts need two indicators (left and right)
      dual: true,
      leftPos: [-1.0, 0.15, 0],
      rightPos: [1.0, 0.15, 0]
    }
  }

  const indicator = indicators[bodykitId]
  if (!indicator) return null

  // Helper to render a single indicator box
  const IndicatorBox = ({ position, size }) => (
    <group position={position}>
      <mesh ref={indicatorRef}>
        <boxGeometry args={size} />
        <meshBasicMaterial
          color={indicator.color}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
      <mesh>
        <boxGeometry args={size.map(s => s * 0.98)} />
        <meshBasicMaterial
          color={indicator.color}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )

  // Handle dual indicators (like side skirts - left and right)
  if (indicator.dual) {
    return (
      <group>
        <IndicatorBox position={indicator.leftPos} size={indicator.size} />
        <IndicatorBox position={indicator.rightPos} size={indicator.size} />
      </group>
    )
  }

  return <IndicatorBox position={indicator.position} size={indicator.size} />
}

// Wheel model loader
function LoadedWheel({ glbPath, position, rotation, color, scale = 1.0 }) {
  const gltf = useGLTF(glbPath)

  const clonedScene = useMemo(() => {
    if (!gltf?.scene) return null
    const scene = gltf.scene.clone()

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        const name = child.name.toLowerCase()
        if (name.includes('rim') || name.includes('spoke') || name.includes('wheel')) {
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

// Wheel Assembly
function WheelAssembly({ wheelProductId, wheelColor, selectedWheel }) {
  const glbPath = selectedWheel?.glb_path || selectedWheel?.glbPath || (wheelProductId && wheelConfigs[wheelProductId]?.glbPath)

  if (!glbPath) return null

  return (
    <group>
      {Object.entries(wheelPositions).map(([key, pos]) => (
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

// Bodykit Assembly - Uses visual indicator only
// NOTE: Bodykit GLB files contain wrong models (full car shells instead of parts)
// Until proper individual part models are available, use wireframe indicator + material effects
function BodykitAssembly({ bodykitProductId }) {
  if (!bodykitProductId) return null

  // Use wireframe indicator + material effects (applied in LoadedCarModel)
  // This provides visual feedback without loading incorrect 3D models
  return <BodykitIndicator bodykitId={bodykitProductId} />
}

// Original BodykitAssembly with 3D loading - disabled until proper GLB files available
/*
function BodykitAssembly3D({ bodykitProductId }) {
  const [loadError, setLoadError] = useState(false)
  const [loadedParts, setLoadedParts] = useState([])

  useEffect(() => {
    setLoadError(false)
    setLoadedParts([])
  }, [bodykitProductId])

  if (!bodykitProductId) return null

  const config = bodykitConfigs[bodykitProductId]

  if (!config) {
    console.log('⚠️ No bodykit config found for:', bodykitProductId)
    return null
  }

  if (!config.parts) {
    console.log('⚠️ Bodykit config has no parts:', bodykitProductId)
    return null
  }

  if (loadError) {
    console.log('⚠️ Bodykit 3D loading failed, showing indicator for:', bodykitProductId)
    return <BodykitIndicator bodykitId={bodykitProductId} />
  }

  const getPartType = (key, config) => {
    if (config.type) {
      return config.type.toLowerCase()
    }
    if (key.includes('spoiler')) return 'spoiler'
    if (key.includes('splitter')) return 'splitter'
    if (key.includes('diffuser')) return 'diffuser'
    if (key.includes('skirt')) return 'sideskirt'
    if (key.includes('body')) return 'body'
    if (key.includes('undertray')) return 'undertray'
    if (key.includes('frame')) return 'frame'
    if (key.includes('window')) return 'window'
    return 'default'
  }

  return (
    <group>
      {Object.entries(config.parts).map(([key, part]) => {
        if (!part.glbPath) {
          console.log('⚠️ Bodykit part has no glbPath:', key)
          return null
        }
        if (!part.glbPath.endsWith('.glb') && !part.glbPath.endsWith('.gltf')) {
          console.log('⚠️ Invalid GLB path for bodykit part:', key, part.glbPath)
          return null
        }
        const partType = getPartType(key, config)
        console.log('🔧 Loading bodykit part:', key, 'from:', part.glbPath)
        return (
          <GLBErrorBoundary
            key={key}
            Fallback={() => null}
            onError={() => {
              console.error('⚠️ Error loading bodykit part:', key)
              setLoadError(true)
            }}
          >
            <Suspense fallback={null}>
              <SafeLoadedPart
                glbPath={part.glbPath}
                position={part.position}
                rotation={part.rotation}
                scale={part.scale}
                partType={partType}
                autoScale={true}
              />
            </Suspense>
          </GLBErrorBoundary>
        )
      })}
    </group>
  )
}
*/

// Accessories Assembly
function AccessoriesAssembly({ accessoryProductIds, caliperColor }) {
  if (!accessoryProductIds || accessoryProductIds.length === 0) return null

  return (
    <group>
      {accessoryProductIds.map((id) => {
        const config = accessoryConfigs[id]
        if (!config?.parts) return null

        return Object.entries(config.parts).map(([key, part]) => {
          if (!part.glbPath) return null
          return (
            <Suspense key={`${id}-${key}`} fallback={null}>
              <LoadedPart
                glbPath={part.glbPath}
                position={part.position}
                rotation={part.rotation}
                scale={part.scale}
                color={key.includes('caliper') ? caliperColor : null}
              />
            </Suspense>
          )
        })
      })}
    </group>
  )
}

// Safe Part Loader wrapper with error handling
function SafeLoadedPart(props) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    console.log('⚠️ SafeLoadedPart: Error loading part, hiding:', props.glbPath)
    return null
  }

  return (
    <GLBErrorBoundary
      Fallback={() => null}
      onError={() => setHasError(true)}
    >
      <LoadedPart {...props} />
    </GLBErrorBoundary>
  )
}

// Generic Part Loader with auto-scaling for bodykit parts
function LoadedPart({ glbPath, position, rotation, scale, color, partType, autoScale: shouldAutoScale = false }) {
  // Validate glbPath before attempting to load
  if (!glbPath || typeof glbPath !== 'string') {
    console.warn('⚠️ LoadedPart: Invalid glbPath:', glbPath)
    return null
  }

  const gltf = useGLTF(glbPath)

  const clonedScene = useMemo(() => {
    if (!gltf?.scene) return null

    try {
      const scene = gltf.scene.clone()

      // Auto-scale bodykit parts to match normalized car size (4 units)
      if (shouldAutoScale && partType) {
        const box = new THREE.Box3().setFromObject(scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        // Expected sizes relative to 4-unit normalized car
        const expectedSizes = {
          spoiler: 0.8,      // Rear spoiler - moderate size
          splitter: 1.0,     // Front splitter
          diffuser: 0.8,     // Rear diffuser
          sideskirt: 1.5,    // Side skirts - longer
          body: 3.5,         // Full body panels
          undertray: 2.5,    // Floor pan
          frame: 2.0,        // Structural frame
          window: 2.0,       // Window tint
          default: 0.5
        }

        const expected = expectedSizes[partType] || expectedSizes.default
        const partScale = maxDim > 0 ? expected / maxDim : 1

        scene.scale.setScalar(partScale)
        // Center the part at origin first
        scene.position.set(-center.x * partScale, -center.y * partScale, -center.z * partScale)
      }

      // Apply color if provided
      if (color) {
        scene.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material = child.material.clone()
            child.material.color = new THREE.Color(color)
          }
        })
      }

      return scene
    } catch (error) {
      console.error('⚠️ LoadedPart: Error processing scene:', error)
      return null
    }
  }, [gltf, color, partType, shouldAutoScale])

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

// Main Car component
function Car({ vehicle, color, wheelColor, wheelProductId, selectedWheel, bodykitProductId, accessoryProductIds, caliperColor, windowTint, interiorColor }) {
  const modelPath = vehicle ? getCarModelPath(vehicle) : null

  useEffect(() => {
    if (vehicle) {
      console.log('Vehicle:', vehicle.make, vehicle.model)
      console.log('Model path:', modelPath)
      if (bodykitProductId) {
        console.log('🔧 Bodykit selected:', bodykitProductId, BODYKIT_EFFECTS[bodykitProductId]?.name || 'Unknown')
      }
    }
  }, [vehicle, modelPath, bodykitProductId])

  const carBody = useMemo(() => {
    if (!vehicle) {
      return <ProceduralCarModel color={color} wheelColor={wheelColor} />
    }

    if (modelPath) {
      return (
        <GLBErrorBoundary Fallback={ProceduralCarModel} color={color} wheelColor={wheelColor}>
          <Suspense fallback={<LoadingCarPlaceholder />}>
            <LoadedCarModel
              modelPath={modelPath}
              color={color}
              wheelColor={wheelColor}
              hideWheels={!!selectedWheel || !!wheelProductId}
              bodykitId={bodykitProductId}
              windowTint={windowTint}
              interiorColor={interiorColor}
            />
          </Suspense>
        </GLBErrorBoundary>
      )
    }

    return <ProceduralCarModel color={color} wheelColor={wheelColor} />
  }, [vehicle, modelPath, color, wheelColor, selectedWheel, wheelProductId, bodykitProductId, windowTint, interiorColor])

  return (
    <group>
      {carBody}

      {(selectedWheel || wheelProductId) && (
        <WheelAssembly
          wheelProductId={wheelProductId}
          wheelColor={wheelColor}
          selectedWheel={selectedWheel}
        />
      )}

      {/* Bodykit 3D models with fallback to wireframe indicator */}
      {bodykitProductId && (
        <BodykitAssembly bodykitProductId={bodykitProductId} />
      )}

      {accessoryProductIds && accessoryProductIds.length > 0 && (
        <AccessoriesAssembly
          accessoryProductIds={accessoryProductIds}
          caliperColor={caliperColor}
        />
      )}
    </group>
  )
}

// Dynamic Lighting
function DynamicLighting({ timeOfDay, season }) {
  const presets = {
    dawn: { ambient: 0.3, key: 1.5, fill: 0.4, rim: 2.0, ambientColor: '#4d4d6e', keyColor: '#f7d3a1' },
    day: { ambient: 0.4, key: 1.8, fill: 0.8, rim: 2.0, ambientColor: '#ffffff', keyColor: '#fffdf5' },
    sunset: { ambient: 0.4, key: 1.5, fill: 0.5, rim: 2.5, ambientColor: '#6e3b3b', keyColor: '#ff7e47' },
    night: { ambient: 0.1, key: 0.0, fill: 0.3, rim: 0.5, ambientColor: '#1a1a2e', keyColor: '#000000' },
    studio: { ambient: 0.4, key: 2.5, fill: 1.0, rim: 3.5, ambientColor: '#ffffff', keyColor: '#ffffff' }
  }

  const seasonMod = { spring: 1.1, summer: 1.2, autumn: 0.9, winter: 0.8 }
  const p = presets[timeOfDay] || presets.day
  const mod = seasonMod[season] || 1.0

  return (
    <>
      <ambientLight intensity={p.ambient * mod} color={p.ambientColor} />
      <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={p.key * mod} color={p.keyColor} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={p.fill * mod} color="#dbeafe" />
      <spotLight position={[-5, 5, 5]} intensity={p.rim * mod} color="#ffffff" angle={0.5} penumbra={1} />
    </>
  )
}

// Dynamic Environment
function DynamicEnvironment({ location, timeOfDay }) {
  const envs = {
    casablanca: { preset: 'city', bg: '#1a3a52' },
    marrakech: { preset: 'sunset', bg: '#8B4513' },
    atlas: { preset: 'dawn', bg: '#4682B4' },
    sahara: { preset: 'sunset', bg: '#F4A460' },
    tangier: { preset: 'city', bg: '#2F4F4F' },
    chefchaouen: { preset: 'dawn', bg: '#4169E1' }
  }

  const env = envs[location] || envs.casablanca
  const preset = timeOfDay === 'night' ? 'night' : env.preset

  return (
    <>
      <Environment preset={preset} />
      <color attach="background" args={[env.bg]} />
    </>
  )
}

// Camera Controller
function CameraController({ controlsRef, zoomLevel }) {
  const { camera } = useThree()

  useFrame(() => {
    if (controlsRef.current && zoomLevel !== null) {
      const currentDist = camera.position.length()
      const newDist = THREE.MathUtils.lerp(currentDist, zoomLevel, 0.1)
      camera.position.normalize().multiplyScalar(newDist)
      controlsRef.current.update()
    }
  })

  return null
}

// Main export
export default function Car3DViewer() {
  const {
    vehicle, carColor, wheelColor, selectedLocation, selectedSeason, timeOfDay,
    previewMode, configuration, wheelProductId, bodykitProductId, accessoryProductIds, caliperColor,
    windowTintLevel, interiorColor
  } = useStore()

  const controlsRef = useRef()
  const [zoomLevel, setZoomLevel] = useState(null)

  const displayColor = useMemo(() => {
    if (previewMode.active && (previewMode.type === 'paint' || previewMode.type === 'wrap')) {
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

  const selectedWheel = useMemo(() => {
    if (previewMode.active && previewMode.type === 'wheel_product') {
      return previewMode.value
    }
    return configuration?.wheels
  }, [previewMode, configuration])

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const curr = controlsRef.current.object.position.length()
      setZoomLevel(Math.max(curr * 0.75, 3))
      setTimeout(() => setZoomLevel(null), 500)
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const curr = controlsRef.current.object.position.length()
      setZoomLevel(Math.min(curr * 1.35, 18))
      setTimeout(() => setZoomLevel(null), 500)
    }
  }, [])

  const handleReset = useCallback(() => {
    controlsRef.current?.reset()
  }, [])

  return (
    <div className="w-full h-full bg-atlas-black relative">
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-atlas-charcoal/80 hover:bg-atlas-burgundy/80 rounded-lg flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10" title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-atlas-charcoal/80 hover:bg-atlas-burgundy/80 rounded-lg flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10" title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="w-10 h-10 bg-atlas-charcoal/80 hover:bg-atlas-burgundy/80 rounded-lg flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10" title="Reset View">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-xs text-white/50 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
        Scroll to zoom • Drag to rotate
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <PerspectiveCamera makeDefault position={[6, 2, 6]} fov={45} />
        <CameraController controlsRef={controlsRef} zoomLevel={zoomLevel} />
        <DynamicLighting timeOfDay={timeOfDay} season={selectedSeason} />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
            <Car
              vehicle={vehicle}
              color={displayColor}
              wheelColor={displayWheelColor}
              wheelProductId={wheelProductId}
              selectedWheel={selectedWheel}
              bodykitProductId={bodykitProductId}
              accessoryProductIds={accessoryProductIds}
              caliperColor={caliperColor}
              windowTint={windowTintLevel}
              interiorColor={interiorColor}
            />
          </Float>

          <DynamicEnvironment location={selectedLocation} timeOfDay={timeOfDay} />

          {timeOfDay === 'night' && (
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          )}

          <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.6} far={10} color="#000000" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          panSpeed={0.8}
          enableZoom={true}
          minDistance={2}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          autoRotate={!vehicle}
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />

        <fog attach="fog" args={['#0a0a0a', 10, 50]} />
      </Canvas>
    </div>
  )
}

// Preload local models (small ones only)
const preloadModels = [
  '/models/2021_bmw_m4_competition.glb',
  '/models/audi_r8.glb',
  '/models/2014_porsche_cayman_s_981.glb'
]

preloadModels.forEach(url => {
  useGLTF.preload(url)
})
