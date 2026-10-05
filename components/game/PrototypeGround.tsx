"use client";

export interface PrototypeGroundProps {
  showDebugMonoliths?: boolean;
}

/**
 * Natural terrain ground and optional development scale references.
 * In normal gameplay, provides a clean, expansive open-world ground plane.
 * In debug mode, displays architectural scale monoliths and spawn pad.
 */
export function PrototypeGround({ showDebugMonoliths = false }: PrototypeGroundProps) {
  return (
    <group name="ground-environment">
      {/* Primary continuous terrain plane (320m x 320m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[320, 320, 64, 64]} />
        <meshStandardMaterial color="#1b2a22" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Subtle natural landscape features (boulders & distant rock silhouettes) */}
      <group name="natural-landscape-rocks">
        <mesh position={[28, 1.2, -35]} castShadow receiveShadow>
          <dodecahedronGeometry args={[2.8, 1]} />
          <meshStandardMaterial color="#2d3732" roughness={0.9} />
        </mesh>
        <mesh position={[-32, 1.8, -42]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.6, 1]} />
          <meshStandardMaterial color="#28322d" roughness={0.92} />
        </mesh>
        <mesh position={[-45, 2.2, 25]} castShadow receiveShadow>
          <dodecahedronGeometry args={[4.2, 1]} />
          <meshStandardMaterial color="#2b3530" roughness={0.88} />
        </mesh>
        <mesh position={[40, 1.6, 30]} castShadow receiveShadow>
          <dodecahedronGeometry args={[3.2, 1]} />
          <meshStandardMaterial color="#2e3833" roughness={0.9} />
        </mesh>
        <mesh position={[12, 0.6, -18]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial color="#35403a" roughness={0.85} />
        </mesh>
        <mesh position={[-14, 0.8, 15]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial color="#323d37" roughness={0.85} />
        </mesh>
      </group>

      {/* Developer-Only Scale Reference Monoliths (Hidden during normal gameplay) */}
      {showDebugMonoliths && (
        <group name="debug-scale-monoliths">
          {/* Central spawn plaza pad */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <cylinderGeometry args={[10, 10.5, 0.1, 48]} />
            <meshStandardMaterial color="#2a3c36" roughness={0.7} metalness={0.15} />
          </mesh>

          {/* North monolith */}
          <mesh position={[0, 4, -20]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 8, 2.5]} />
            <meshStandardMaterial color="#2d3f44" roughness={0.6} metalness={0.2} />
          </mesh>

          {/* East monolith */}
          <mesh position={[24, 5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 10, 3]} />
            <meshStandardMaterial color="#33474d" roughness={0.6} metalness={0.2} />
          </mesh>

          {/* South monolith */}
          <mesh position={[0, 3, 22]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 6, 2.5]} />
            <meshStandardMaterial color="#28393e" roughness={0.6} metalness={0.2} />
          </mesh>

          {/* West monolith */}
          <mesh position={[-22, 6, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 12, 3]} />
            <meshStandardMaterial color="#364b52" roughness={0.6} metalness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}
