import React, { useMemo, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getWheelConfig, getWheelGLBUrl, wheelPositions } from '../config/wheelConfigs'

// Procedural wheel fallback - used when GLB not available
function ProceduralWheel({ color, specs = {}, position = [0, 0, 0], rotation = [0, 0, Math.PI / 2] }) {
  const wheelColor = useMemo(() => new THREE.Color(color || '#1a1a1a'), [color])
  const diameter = specs.diameter ? specs.diameter * 0.0254 : 0.35 // Convert inches to meters, default 14"
  const width = specs.width ? specs.width * 0.0254 : 0.25

  return (
    <group position={position} rotation={rotation}>
      {/* Tire */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[diameter, diameter, width, 32]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[diameter * 0.6, diameter * 0.6, width + 0.01, specs.spokes || 5]} />
        <meshStandardMaterial
          color={wheelColor}
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Center cap */}
      <mesh position={[0, width / 2 + 0.01, 0]}>
        <cylinderGeometry args={[diameter * 0.15, diameter * 0.15, 0.02, 16]} />
        <meshStandardMaterial color={wheelColor} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// GLB wheel model loader
function LoadedWheel({ glbUrl, color, scale = 1, position = [0, 0, 0], rotation = [0, 0, Math.PI / 2] }) {
  const gltf = useGLTF(glbUrl)

  const scene = useMemo(() => {
    if (!gltf?.scene) return null

    const clonedScene = gltf.scene.clone()

    // Apply color customization to rim materials
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        const name = child.name.toLowerCase()

        // Identify rim (not tire) and apply color
        const isRim = name.includes('rim') ||
                      name.includes('spoke') ||
                      name.includes('wheel') && !name.includes('tire')

        if (isRim && color) {
          child.material.color = new THREE.Color(color)
          child.material.metalness = 0.85
          child.material.roughness = 0.15
        }

        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return clonedScene
  }, [gltf, color])

  if (!scene) return null

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  )
}

// Error boundary for wheel loading
class WheelErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('Wheel model failed to load, using fallback:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Single wheel component that tries GLB first, falls back to procedural
function Wheel({ productId, color, position, rotation, specs }) {
  const config = getWheelConfig(productId)
  const glbUrl = getWheelGLBUrl(productId)

  // Use config color if no color provided
  const wheelColor = color || config?.fallbackColor || '#1a1a1a'
  const wheelSpecs = specs || config?.specs || {}

  const fallback = (
    <ProceduralWheel
      color={wheelColor}
      specs={wheelSpecs}
      position={position}
      rotation={rotation}
    />
  )

  // If no GLB available, use procedural
  if (!glbUrl) {
    return fallback
  }

  return (
    <WheelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <LoadedWheel
          glbUrl={glbUrl}
          color={wheelColor}
          scale={config?.scale || 1}
          position={position}
          rotation={rotation}
        />
      </Suspense>
    </WheelErrorBoundary>
  )
}

// Complete wheel set (all 4 wheels)
export function WheelSet({ productId, color, vehicleType = 'default' }) {
  const positions = wheelPositions

  return (
    <group>
      <Wheel
        productId={productId}
        color={color}
        position={positions.frontLeft.position}
        rotation={positions.frontLeft.rotation}
      />
      <Wheel
        productId={productId}
        color={color}
        position={positions.frontRight.position}
        rotation={positions.frontRight.rotation}
      />
      <Wheel
        productId={productId}
        color={color}
        position={positions.rearLeft.position}
        rotation={positions.rearLeft.rotation}
      />
      <Wheel
        productId={productId}
        color={color}
        position={positions.rearRight.position}
        rotation={positions.rearRight.rotation}
      />
    </group>
  )
}

export default Wheel
