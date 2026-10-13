"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Atmospheric Cloud Layer for OPENVERSE.
 *
 * Provides:
 * 1. An undulating macro cloud deck (sea of clouds) situated at altitude y ≈ 118m - 138m.
 * 2. 3D billowing cumulus cloud clusters along the flight corridor.
 * 3. Soft sunlight scattering and sky horizon color blending.
 * 4. High-performance procedural implementation with zero external asset dependencies.
 */

const DECK_VERTEX_SHADER = `
  uniform float uTime;
  varying vec3 vWorldPos;
  varying float vHeight;

  // Simplex 2D noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float cloudFbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p *= 2.02;
    f += 0.2500 * snoise(p); p *= 2.03;
    f += 0.1250 * snoise(p); p *= 2.01;
    f += 0.0625 * snoise(p);
    return f;
  }

  void main() {
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    // Displace height for billowy, rolling cloud terrain
    float billow = cloudFbm(worldPos.xz * 0.0035 + vec2(uTime * 0.012, uTime * 0.006));
    worldPos.y += billow * 22.0;
    vHeight = billow;
    vWorldPos = worldPos;
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
  }
`;

const DECK_FRAGMENT_SHADER = `
  uniform vec3 uSunPosition;
  uniform vec3 uCameraPosition;
  varying vec3 vWorldPos;
  varying float vHeight;

  void main() {
    vec3 normal = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    if (!gl_FrontFacing) normal = -normal;

    vec3 sunDir = normalize(uSunPosition);
    float sunDot = clamp(dot(normal, sunDir), 0.0, 1.0);

    vec3 viewDir = normalize(uCameraPosition - vWorldPos);
    float rim = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.8);
    float forwardScatter = pow(max(0.0, dot(sunDir, -viewDir)), 2.0) * 0.35;

    // Palette: warm sunlight on ridges, soft sky-blue bounce in shadow
    vec3 sunlitColor = vec3(1.0, 0.98, 0.93);
    vec3 shadowColor = vec3(0.70, 0.83, 0.96);
    vec3 rimGlow     = vec3(1.0, 0.92, 0.78);

    vec3 color = mix(shadowColor, sunlitColor, sunDot * 0.75 + 0.25);
    color += rimGlow * (rim * 0.35 + forwardScatter);

    // Horizon distance fog fade
    float dist = length(vWorldPos - uCameraPosition);
    float fogFactor = clamp((dist - 250.0) / 1050.0, 0.0, 1.0);
    vec3 horizonFog = vec3(0.73, 0.87, 0.98);
    color = mix(color, horizonFog, fogFactor);

    // Full opacity on cloud body
    float alpha = smoothstep(-0.8, -0.1, vHeight);
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.96));
  }
`;

const MIST_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MIST_FRAGMENT_SHADER = `
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    // Soft radial vignette
    float d = length(vUv - vec2(0.5));
    float alpha = smoothstep(0.75, 0.1, d) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function AtmosphericCloudLayer() {
  const { camera } = useThree();
  const deckShaderRef = useRef<THREE.ShaderMaterial>(null);
  const mistShaderRef = useRef<THREE.ShaderMaterial>(null);
  const mistMeshRef = useRef<THREE.Mesh>(null);

  // Reusable vectors
  const camPosRef = useRef(new THREE.Vector3());

  // Uniform instances
  const deckUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunPosition: { value: new THREE.Vector3(65, 75, 48) },
      uCameraPosition: { value: new THREE.Vector3() },
    }),
    [],
  );

  const mistUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color("#e8f4fc") },
    }),
    [],
  );

  // Procedural 3D Cumulus Cloud Clusters along the flight path
  const cumulusClouds = useMemo(() => {
    // Strategic positions along descent trajectory (positioned below y = 135m)
    const clusterCenters: [number, number, number][] = [
      [-70, 132, 135],
      [-55, 126, 110],
      [-42, 120, 85],
      [-32, 114, 62],
      [-22, 108, 42],
      [-62, 118, 98],
      [-46, 124, 120],
      [-15, 106, 35],
      [-95, 122, 125],
      [18, 115, 70],
      [-12, 112, 80],
      [-75, 126, 110],
    ];

    const spheres: { pos: [number, number, number]; scale: [number, number, number] }[] = [];

    clusterCenters.forEach(([cx, cy, cz]) => {
      // 4-6 overlapping sub-spheres per cluster to form irregular cumulus puffs
      const count = 5;
      for (let i = 0; i < count; i++) {
        const ox = (Math.sin(i * 1.7 + cx) - 0.5) * 22;
        const oy = (Math.cos(i * 2.3 + cy) - 0.5) * 10;
        const oz = (Math.sin(i * 3.1 + cz) - 0.5) * 22;
        const r = 14 + (Math.sin(i * 4.5) + 1) * 7;
        spheres.push({
          pos: [cx + ox, cy + oy, cz + oz],
          scale: [r, r * 0.75, r * 1.1],
        });
      }
    });

    return spheres;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (deckShaderRef.current) {
      if (deckShaderRef.current.uniforms.uTime) {
        deckShaderRef.current.uniforms.uTime.value = elapsed;
      }
      if (deckShaderRef.current.uniforms.uCameraPosition) {
        deckShaderRef.current.uniforms.uCameraPosition.value.copy(camera.position);
      }
    }

    camPosRef.current.copy(camera.position);
    const camY = camPosRef.current.y;

    // Calculate In-Cloud Immersion: Peak mist between y = 115m and y = 145m
    let immersion = 0;
    if (camY >= 82 && camY <= 165) {
      if (camY > 125) {
        // 165 -> 125: gradual build up of mist
        immersion = (165 - camY) / 40;
      } else {
        // 125 -> 82: rapid breakthrough out of cloud bottom
        immersion = (camY - 82) / 43;
      }
    }
    immersion = Math.max(0, Math.min(1, immersion)) * 0.72;
    if (mistShaderRef.current?.uniforms.uOpacity) {
      mistShaderRef.current.uniforms.uOpacity.value = immersion;
    }

    // Position mist billboard just in front of camera
    if (mistMeshRef.current) {
      mistMeshRef.current.position.copy(camera.position);
      mistMeshRef.current.quaternion.copy(camera.quaternion);
      mistMeshRef.current.translateZ(-0.4);
    }
  });

  return (
    <group data-testid="atmospheric-cloud-layer">
      {/* 1. Macro Undulating Cloud Sea Deck at y = 122m */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 122, 0]}>
        <planeGeometry args={[2200, 2200, 96, 96]} />
        <shaderMaterial
          ref={deckShaderRef}
          uniforms={deckUniforms}
          vertexShader={DECK_VERTEX_SHADER}
          fragmentShader={DECK_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. 3D Cumulus Cloud Formations along Flight Descent Corridor */}
      <group>
        {cumulusClouds.map((puff, idx) => (
          <mesh key={idx} position={puff.pos} scale={puff.scale}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial
              color="#fcf8f2"
              roughness={0.98}
              metalness={0.0}
              transparent
              opacity={0.88}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 3. In-Cloud Camera Mist Billboard for Dive-Through Immersion */}
      <mesh ref={mistMeshRef}>
        <planeGeometry args={[2.5, 2.0]} />
        <shaderMaterial
          ref={mistShaderRef}
          uniforms={mistUniforms}
          vertexShader={MIST_VERTEX_SHADER}
          fragmentShader={MIST_FRAGMENT_SHADER}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
