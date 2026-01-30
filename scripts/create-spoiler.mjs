import { writeFileSync } from 'fs'

// Create a simple GT wing spoiler mesh
// Wing dimensions: ~1.2m wide, 0.3m deep, 0.15m tall

const positions = new Float32Array([
  // Main wing top face
  -0.6, 0.1, -0.15,   0.6, 0.1, -0.15,   0.6, 0.1, 0.15,   -0.6, 0.1, 0.15,
  // Main wing bottom face
  -0.6, 0.0, -0.15,   0.6, 0.0, -0.15,   0.6, 0.0, 0.15,   -0.6, 0.0, 0.15,
  // Front face
  -0.6, 0.0, 0.15,   0.6, 0.0, 0.15,   0.6, 0.1, 0.15,   -0.6, 0.1, 0.15,
  // Back face
  -0.6, 0.0, -0.15,   0.6, 0.0, -0.15,   0.6, 0.1, -0.15,   -0.6, 0.1, -0.15,
  // Left side
  -0.6, 0.0, -0.15,   -0.6, 0.0, 0.15,   -0.6, 0.1, 0.15,   -0.6, 0.1, -0.15,
  // Right side
  0.6, 0.0, -0.15,   0.6, 0.0, 0.15,   0.6, 0.1, 0.15,   0.6, 0.1, -0.15,
])

const normals = new Float32Array([
  // Top face - pointing up
  0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
  // Bottom face - pointing down
  0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
  // Front face - pointing forward
  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
  // Back face - pointing backward
  0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
  // Left side - pointing left
  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  // Right side - pointing right
  1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
])

const indices = new Uint16Array([
  // Top face
  0, 1, 2,  0, 2, 3,
  // Bottom face
  4, 6, 5,  4, 7, 6,
  // Front face
  8, 9, 10,  8, 10, 11,
  // Back face
  12, 14, 13,  12, 15, 14,
  // Left side
  16, 17, 18,  16, 18, 19,
  // Right side
  20, 22, 21,  20, 23, 22,
])

// Create buffers
const posBuffer = Buffer.from(positions.buffer)
const normBuffer = Buffer.from(normals.buffer)
const idxBuffer = Buffer.from(indices.buffer)
const allBuffer = Buffer.concat([posBuffer, normBuffer, idxBuffer])
const base64Data = allBuffer.toString('base64')

const gltf = {
  asset: {
    version: "2.0",
    generator: "Atlas Auto Works"
  },
  scene: 0,
  scenes: [{ name: "Scene", nodes: [0] }],
  nodes: [{ name: "spoiler", mesh: 0 }],
  meshes: [{
    name: "GTWingSpoiler",
    primitives: [{
      attributes: { POSITION: 0, NORMAL: 1 },
      indices: 2,
      material: 0
    }]
  }],
  materials: [{
    name: "CarbonFiber",
    pbrMetallicRoughness: {
      baseColorFactor: [0.1, 0.1, 0.12, 1.0],
      metallicFactor: 0.85,
      roughnessFactor: 0.15
    },
    doubleSided: true
  }],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: 24,
      type: "VEC3",
      max: [0.6, 0.1, 0.15],
      min: [-0.6, 0.0, -0.15]
    },
    {
      bufferView: 1,
      componentType: 5126,
      count: 24,
      type: "VEC3"
    },
    {
      bufferView: 2,
      componentType: 5123,
      count: 36,
      type: "SCALAR"
    }
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: posBuffer.length },
    { buffer: 0, byteOffset: posBuffer.length, byteLength: normBuffer.length },
    { buffer: 0, byteOffset: posBuffer.length + normBuffer.length, byteLength: idxBuffer.length }
  ],
  buffers: [{
    uri: `data:application/octet-stream;base64,${base64Data}`,
    byteLength: allBuffer.length
  }]
}

// Write GLTF
writeFileSync('public/models/bodykits/gt_wing_spoiler.gltf', JSON.stringify(gltf, null, 2))
console.log('Created gt_wing_spoiler.gltf')
console.log(`Buffer size: ${allBuffer.length} bytes`)
console.log(`Positions: ${positions.length / 3} vertices`)
console.log(`Indices: ${indices.length / 3} triangles`)
