import React, { useEffect, useRef, useState, useCallback } from ‘react’;
import * as THREE from ‘three’;
import { Settings, X, Play, Pause, RotateCcw } from ‘lucide-react’;

const QuantumLightMatrix = () => {
const mountRef = useRef(null);
const sceneRef = useRef(null);
const rendererRef = useRef(null);
const animationRef = useRef(null);

const phi = (1 + Math.sqrt(5)) / 2;

// State management
const [currentSolid, setCurrentSolid] = useState(‘icosahedron’);
const [currentNodeSolid, setCurrentNodeSolid] = useState(‘dodecahedron’);
const [showControls, setShowControls] = useState(false);
const [isPlaying, setIsPlaying] = useState(true);
const [performance, setPerformance] = useState(‘auto’);
const [sphericalHarmonics, setSphericalHarmonics] = useState(true);

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Performance settings based on device
const getPerformanceSettings = useCallback(() => {
const settings = {
nodeCount: isMobile ? 50 : 100,
subdivisions: isMobile ? 2 : 5,
shaderComplexity: isMobile ? ‘low’ : ‘high’,
antialiasing: !isMobile
};

```
if (performance === 'low') {
  settings.nodeCount = 25;
  settings.subdivisions = 1;
  settings.shaderComplexity = 'low';
} else if (performance === 'high') {
  settings.nodeCount = 150;
  settings.subdivisions = 6;
  settings.shaderComplexity = 'high';
}

return settings;
```

}, [performance, isMobile]);

useEffect(() => {
if (!mountRef.current) return;

```
const perfSettings = getPerformanceSettings();

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  antialias: perfSettings.antialiasing,
  powerPreference: isMobile ? "low-power" : "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
mountRef.current.appendChild(renderer.domElement);

camera.position.z = 5;

sceneRef.current = scene;
rendererRef.current = renderer;

// Enhanced Quantum Matrix Field Shader with Spherical Harmonics
const quantumFieldShader = {
  uniforms: {
    time: { value: 0 },
    phi: { value: phi },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    harmonicsEnabled: { value: sphericalHarmonics },
    complexity: { value: perfSettings.shaderComplexity === 'high' ? 1.0 : 0.5 }
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vPosition = position;
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float phi;
    uniform vec2 resolution;
    uniform bool harmonicsEnabled;
    uniform float complexity;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    // Spherical Harmonics Functions
    float Y_0_0() { return 0.282095; }
    float Y_1_m1(vec3 p) { return 0.488603 * p.y; }
    float Y_1_0(vec3 p) { return 0.488603 * p.z; }
    float Y_1_1(vec3 p) { return 0.488603 * p.x; }
    float Y_2_m2(vec3 p) { return 1.092548 * p.x * p.y; }
    float Y_2_m1(vec3 p) { return 1.092548 * p.y * p.z; }
    float Y_2_0(vec3 p) { return 0.315392 * (3.0 * p.z * p.z - 1.0); }
    float Y_2_1(vec3 p) { return 1.092548 * p.x * p.z; }
    float Y_2_2(vec3 p) { return 0.546274 * (p.x * p.x - p.y * p.y); }
    
    // Crystal Light Lattice Formation with Spherical Harmonics
    float crystalSeed(vec3 p) {
      float seed = 1.0;
      vec3 pn = normalize(p);
      
      if (harmonicsEnabled) {
        // Spherical harmonic modulation
        float harm = Y_0_0() + 
                    Y_1_m1(pn) * sin(time * 0.5) +
                    Y_1_0(pn) * cos(time * 0.7) +
                    Y_1_1(pn) * sin(time * 0.9) +
                    Y_2_0(pn) * cos(time * 0.3) +
                    Y_2_2(pn) * sin(time * 0.4);
        seed *= (1.0 + 0.3 * harm);
      }
      
      int iterations = int(4.0 + complexity * 4.0);
      for(int i = 0; i < 8; i++) {
        if (i >= iterations) break;
        float phase = pow(phi, float(-i));
        seed *= 1.0 + phase * cos(2.0 * 3.14159 * dot(p, p) * phase + time);
      }
      
      return seed;
    }
    
    // Quantum Wave Pattern with Harmonic Resonance
    vec3 quantumWave(vec3 p, float t) {
      vec3 wave = vec3(0.0);
      float amplitude = 1.0;
      vec3 pn = normalize(p);
      
      int iterations = int(3.0 + complexity * 2.0);
      for(int i = 0; i < 5; i++) {
        if (i >= iterations) break;
        float phase = pow(phi, float(i));
        
        vec3 dir = normalize(vec3(
          sin(t * 0.5 + phase),
          cos(t * 0.7 + phase),
          sin(t * 0.9 + phase)
        ));
        
        if (harmonicsEnabled) {
          // Modulate with spherical harmonics
          float harmonic = Y_2_m1(pn) * sin(t * phase) + Y_2_1(pn) * cos(t * phase);
          dir *= (1.0 + 0.2 * harmonic);
        }
        
        wave += amplitude * dir * sin(dot(p, dir) * phase + t);
        amplitude *= 0.618; // Golden ratio decay
      }
      
      return wave;
    }
    
    // Matrix Light Flow with Harmonic Interference
    vec3 lightFlow(vec3 p, float t) {
      vec3 flow = vec3(0.0);
      float sigma = 2.0;
      vec3 pn = normalize(p);
      
      int iterations = int(4.0 + complexity * 2.0);
      for(int i = 0; i < 6; i++) {
        if (i >= iterations) break;
        float phase = pow(phi, float(i));
        vec3 pos = p + quantumWave(p, t * phase);
        float intensity = exp(-dot(pos, pos) / (sigma * phase));
        
        vec3 harmFlow = vec3(
          sin(phase * t + p.x),
          cos(phase * t + p.y),
          sin(phase * t + p.z)
        );
        
        if (harmonicsEnabled) {
          // Add spherical harmonic complexity
          float Y2 = Y_2_m2(pn) * cos(t * phase) + Y_2_2(pn) * sin(t * phase);
          harmFlow *= (1.0 + 0.3 * Y2);
        }
        
        flow += harmFlow * intensity;
      }
      
      return flow;
    }
    
    // Light Consciousness Matrix
    vec4 consciousLight(vec3 p, float t) {
      vec3 light = lightFlow(p, t);
      float seed = crystalSeed(p + light * 0.2);
      vec3 pn = normalize(p);
      
      // Color harmonics
      vec3 color = vec3(
        0.5 + 0.5 * sin(seed * 5.0 + t),
        0.5 + 0.5 * cos(seed * 7.0 + t * 1.1),
        0.5 + 0.5 * sin(seed * 11.0 + t * 1.3)
      );
      
      if (harmonicsEnabled) {
        // Spherical harmonic color modulation
        float harmColor = Y_1_m1(pn) * sin(t) + Y_1_1(pn) * cos(t * 1.2);
        color += 0.2 * vec3(harmColor, harmColor * 0.8, harmColor * 0.6);
      }
      
      float alpha = 0.7 * (1.0 + sin(seed * 13.0 + t)) * 
                   exp(-dot(vPosition, vPosition) * 0.1);
      
      return vec4(color, alpha);
    }
    
    void main() {
      vec3 pos = vPosition * 2.0;
      float t = time * 0.5;
      
      vec4 quantumMatrix = consciousLight(pos, t);
      
      // Enhanced brilliance with harmonic resonance
      float brilliance = 0.8 + 0.2 * sin(t * 3.0);
      if (harmonicsEnabled) {
        vec3 pn = normalize(vPosition);
        brilliance += 0.1 * Y_2_0(pn) * cos(t * 2.0);
      }
      
      vec3 finalColor = quantumMatrix.rgb * brilliance;
      
      gl_FragColor = vec4(finalColor, quantumMatrix.a);
    }
  `
};

// Geometry creation functions
const createGeometry = (solidType) => {
  const subdivisions = perfSettings.subdivisions;
  switch(solidType) {
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(2, Math.max(0, subdivisions - 1));
    case 'cube':
      return new THREE.BoxGeometry(2.3, 2.3, 2.3, 2, 2, 2);
    case 'octahedron':
      return new THREE.OctahedronGeometry(2, Math.max(1, subdivisions - 1));
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(2, Math.max(0, subdivisions - 3));
    case 'icosahedron':
    default:
      return new THREE.IcosahedronGeometry(2, subdivisions);
  }
};

const createNodeGeometry = (solidType) => {
  switch(solidType) {
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(0.1, 0);
    case 'cube':
      return new THREE.BoxGeometry(0.15, 0.15, 0.15);
    case 'octahedron':
      return new THREE.OctahedronGeometry(0.12, 0);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(0.1, 1);
    case 'dodecahedron':
    default:
      return new THREE.DodecahedronGeometry(0.1, 1);
  }
};

// Create quantum matrix field
const fieldGeometry = createGeometry(currentSolid);
const fieldMaterial = new THREE.ShaderMaterial({
  ...quantumFieldShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide
});

const quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
scene.add(quantumField);

// Create light nodes with golden ratio spiral
const lightNodeGeometry = createNodeGeometry(currentNodeSolid);
const lightNodes = new THREE.InstancedMesh(
  lightNodeGeometry,
  new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.6 
  }),
  perfSettings.nodeCount
);

const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();

// Golden spiral distribution with spherical harmonics
for(let i = 0; i < perfSettings.nodeCount; i++) {
  const t = i / perfSettings.nodeCount;
  const angle = i * phi * 2 * Math.PI;
  const radius = 1.5 * Math.sqrt(t);
  
  position.set(
    Math.cos(angle) * radius * (1 + 0.2 * Math.sin(i * 0.1)),
    Math.sin(angle) * radius * (1 + 0.2 * Math.cos(i * 0.1)),
    Math.cos(i * phi) * Math.sin(i * phi) * 0.5
  );
  
  matrix.makeTranslation(position.x, position.y, position.z);
  lightNodes.setMatrixAt(i, matrix);
}

scene.add(lightNodes);

// Animation loop
let time = 0;
const animate = () => {
  if (!isPlaying) return;
  
  animationRef.current = requestAnimationFrame(animate);
  time += 0.01;

  // Update uniforms
  quantumField.material.uniforms.time.value = time;
  quantumField.material.uniforms.harmonicsEnabled.value = sphericalHarmonics;
  
  // Golden ratio rotation
  quantumField.rotation.x = Math.sin(time * 0.2) * 0.3;
  quantumField.rotation.y = Math.cos(time * 0.3) * 0.3;
  quantumField.rotation.z = Math.sin(time * 0.1) * 0.1;
  
  lightNodes.rotation.x = Math.sin(time * 0.1) * 0.2;
  lightNodes.rotation.y = Math.cos(time * 0.15) * 0.2;
  lightNodes.rotation.z = Math.sin(time * 0.05) * 0.1;

  renderer.render(scene, camera);
};

if (isPlaying) {
  animate();
}

// Handle resize
const handleResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  
  if (quantumField.material.uniforms) {
    quantumField.material.uniforms.resolution.value.set(width, height);
  }
};

window.addEventListener('resize', handleResize);

return () => {
  window.removeEventListener('resize', handleResize);
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }
  if (mountRef.current && renderer.domElement) {
    mountRef.current.removeChild(renderer.domElement);
  }
  renderer.dispose();
};
```

}, [currentSolid, currentNodeSolid, isPlaying, performance, sphericalHarmonics, getPerformanceSettings]);

const platonicSolids = [
{ value: ‘tetrahedron’, name: ‘Tetrahedron’, faces: 4 },
{ value: ‘cube’, name: ‘Cube’, faces: 6 },
{ value: ‘octahedron’, name: ‘Octahedron’, faces: 8 },
{ value: ‘dodecahedron’, name: ‘Dodecahedron’, faces: 12 },
{ value: ‘icosahedron’, name: ‘Icosahedron’, faces: 20 }
];

const togglePlayPause = () => {
setIsPlaying(!isPlaying);
};

const resetAnimation = () => {
if (sceneRef.current && rendererRef.current) {
// Reset time uniform
const quantumField = sceneRef.current.children.find(child => child.material?.uniforms?.time);
if (quantumField) {
quantumField.material.uniforms.time.value = 0;
}
}
};

return (
<div className="w-full h-screen relative bg-black overflow-hidden">
<div ref={mountRef} className="w-full h-full" />

```
  {/* Mobile-optimized toggle button */}
  <button
    onClick={() => setShowControls(!showControls)}
    className="absolute top-4 right-4 z-20 bg-black bg-opacity-70 text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200"
    aria-label="Toggle controls"
  >
    {showControls ? <X size={24} /> : <Settings size={24} />}
  </button>

  {/* Status indicator */}
  <div className={`absolute top-4 left-4 text-white bg-black bg-opacity-70 p-3 rounded-lg transition-all duration-300 ${isMobile ? 'text-sm' : ''}`}>
    <h2 className={`font-bold mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}>Quantum Light Matrix</h2>
    <div className="text-xs opacity-80">
      <div>Crystal Lattice: Active</div>
      <div>Spherical Harmonics: {sphericalHarmonics ? 'On' : 'Off'}</div>
      <div>Matrix Flow: {isPlaying ? 'Running' : 'Paused'}</div>
    </div>
  </div>

  {/* Playback controls */}
  <div className="absolute bottom-4 left-4 flex gap-2">
    <button
      onClick={togglePlayPause}
      className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
    </button>
    <button
      onClick={resetAnimation}
      className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200"
      aria-label="Reset"
    >
      <RotateCcw size={20} />
    </button>
  </div>

  {/* Collapsible controls panel */}
  <div className={`absolute top-16 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg transition-all duration-300 ${showControls ? 'opacity-100 visible' : 'opacity-0 invisible'} ${isMobile ? 'w-64 max-w-[calc(100vw-2rem)]' : 'w-72'}`}>
    <h3 className="text-lg font-bold mb-3">Quantum Controls</h3>
    
    {/* Performance Settings */}
    <div className="mb-4">
      <label className="block text-sm mb-1 font-medium">Performance:</label>
      <select 
        value={performance} 
        onChange={(e) => setPerformance(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded text-sm w-full border border-gray-600 focus:border-blue-400 outline-none"
      >
        <option value="low">Low (25 nodes)</option>
        <option value="auto">Auto ({isMobile ? '50' : '100'} nodes)</option>
        <option value="high">High (150 nodes)</option>
      </select>
    </div>

    {/* Spherical Harmonics Toggle */}
    <div className="mb-4">
      <label className="flex items-center text-sm">
        <input
          type="checkbox"
          checked={sphericalHarmonics}
          onChange={(e) => setSphericalHarmonics(e.target.checked)}
          className="mr-2"
        />
        <span className="font-medium">Spherical Harmonics</span>
      </label>
      <p className="text-xs opacity-70 mt-1">Enhanced mathematical beauty</p>
    </div>
    
    {/* Matrix Field Geometry */}
    <div className="mb-4">
      <label className="block text-sm mb-1 font-medium">Matrix Field:</label>
      <select 
        value={currentSolid} 
        onChange={(e) => setCurrentSolid(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded text-sm w-full border border-gray-600 focus:border-blue-400 outline-none"
      >
        {platonicSolids.map(solid => (
          <option key={solid.value} value={solid.value}>
            {solid.name} ({solid.faces} faces)
          </option>
        ))}
      </select>
    </div>
    
    {/* Light Node Geometry */}
    <div className="mb-4">
      <label className="block text-sm mb-1 font-medium">Light Nodes:</label>
      <select 
        value={currentNodeSolid} 
        onChange={(e) => setCurrentNodeSolid(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded text-sm w-full border border-gray-600 focus:border-blue-400 outline-none"
      >
        {platonicSolids.map(solid => (
          <option key={solid.value} value={solid.value}>
            {solid.name}
          </option>
        ))}
      </select>
    </div>

    {/* Current Configuration */}
    <div className="text-xs opacity-70 border-t border-gray-600 pt-2">
      <div>Device: {isMobile ? 'Mobile' : 'Desktop'}</div>
      <div>Current Config: {platonicSolids.find(s => s.value === currentSolid)?.name}</div>
      <div>Nodes: {platonicSolids.find(s => s.value === currentNodeSolid)?.name}</div>
    </div>
  </div>

  {/* Help text for mobile */}
  {isMobile && !showControls && (
    <div className="absolute bottom-4 right-4 text-white text-xs opacity-60 text-right">
      <div>Tap ⚙️ for controls</div>
    </div>
  )}
</div>
```

);
};

export default QuantumLightMatrix;
