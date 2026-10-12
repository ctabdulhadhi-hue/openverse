"use client";

import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

import { InteractableTarget } from "@/game/interaction/InteractionTarget";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { airportStore } from "./aircraftStore";
import type { AircraftState } from "./airportTypes";

export interface AircraftModelProps {
  basePosition?: [number, number, number];
}

/**
 * Varanaya Island Hopper (VA-72 Regional Turboprop Airliner).
 * Original fictional regional passenger aircraft inspired by island hops (e.g. Dornier / ATR).
 *
 * Features:
 * - Coherent aerodynamic fuselage with high wings, twin turboprop engines, and T-tail
 * - Tricycle landing gear resting on Apron Stand 1
 * - Mobile passenger boarding stairs connected to port door
 * - Walkable interior cabin with aisle, passenger seats, overhead bins, and cockpit view
 * - Solid Rapier colliders for stairs and cabin interior (player cannot clip outside or fall through)
 * - State machine-aware boarding ([E] Board Aircraft / [E] Disembark Aircraft)
 */
export function AircraftModel({ basePosition = [140, 0.4, 52] }: AircraftModelProps) {
  const [aircraftState, setAircraftState] = useState<AircraftState>(() => airportStore.getState());
  const [isBoardingAllowed, setIsBoardingAllowed] = useState<boolean>(() =>
    airportStore.isBoardingAllowed(),
  );

  const groupRef = useRef<THREE.Group>(null);
  const leftPropRef = useRef<THREE.Group>(null);
  const rightPropRef = useRef<THREE.Group>(null);
  const beaconLightRef = useRef<THREE.Mesh>(null);

  // Scripted animation timeline tracker
  const animTimeRef = useRef(0);

  useEffect(() => {
    return airportStore.subscribe((t) => {
      setAircraftState(t.aircraftState);
      setIsBoardingAllowed(t.isBoardingAllowed);
    });
  }, []);

  // Boarding action: teleport player inside cabin aisle
  const handleBoard = () => {
    if (!airportStore.isBoardingAllowed()) return;
    if (typeof window !== "undefined") {
      const player = (
        window as unknown as {
          __OPENVERSE_PLAYER__?: {
            teleport: (x: number, y: number, z: number, yaw?: number) => void;
          };
        }
      ).__OPENVERSE_PLAYER__;
      if (player?.teleport) {
        // Teleport to interior cabin aisle entrance
        player.teleport(basePosition[0] - 2.5, basePosition[1] + 1.85, basePosition[2], 0);
      }
    }
  };

  // Disembark action: teleport player back down onto boarding stairs platform
  const handleDisembark = () => {
    if (typeof window !== "undefined") {
      const player = (
        window as unknown as {
          __OPENVERSE_PLAYER__?: {
            teleport: (x: number, y: number, z: number, yaw?: number) => void;
          };
        }
      ).__OPENVERSE_PLAYER__;
      if (player?.teleport) {
        // Teleport to top of mobile boarding stairs on apron
        player.teleport(basePosition[0] - 2.5, basePosition[1] + 1.6, basePosition[2] - 2.2, Math.PI);
      }
    }
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    animTimeRef.current += dt;

    // Propeller spinning animation based on state
    const isEnginesRunning =
      aircraftState === "PREPARING" ||
      aircraftState === "DEPARTING" ||
      aircraftState === "IN_FLIGHT" ||
      aircraftState === "ARRIVING";

    if (isEnginesRunning) {
      const propSpeed = aircraftState === "PREPARING" ? 25 : 55;
      if (leftPropRef.current) leftPropRef.current.rotation.x += dt * propSpeed;
      if (rightPropRef.current) rightPropRef.current.rotation.x += dt * propSpeed;
    }

    // Flashing anti-collision red beacon light
    if (beaconLightRef.current) {
      const flash = Math.sin(animTimeRef.current * 4) > 0.4 ? 1.8 : 0.2;
      (beaconLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash;
    }

    // Dynamic flight animation for non-parked states
    if (groupRef.current) {
      if (aircraftState === "PARKED" || aircraftState === "BOARDING") {
        groupRef.current.position.set(basePosition[0], basePosition[1], basePosition[2]);
        groupRef.current.rotation.set(0, 0, 0);
      } else if (aircraftState === "DEPARTING") {
        // Scripted takeoff rollout along runway
        const progress = Math.min(1, (animTimeRef.current % 15) / 15);
        if (progress < 0.3) {
          // Taxi forward to runway
          groupRef.current.position.set(
            basePosition[0],
            basePosition[1],
            basePosition[2] + progress * 40,
          );
          groupRef.current.rotation.set(0, 0, 0);
        } else if (progress < 0.7) {
          // Takeoff roll along runway heading East
          const rollX = basePosition[0] + (progress - 0.3) * 160;
          groupRef.current.position.set(rollX, basePosition[1], basePosition[2] + 16);
          groupRef.current.rotation.set(-0.15, -Math.PI / 2, 0);
        } else {
          // Airborne climb
          const climbX = basePosition[0] + 64 + (progress - 0.7) * 200;
          const climbY = basePosition[1] + (progress - 0.7) * 90;
          groupRef.current.position.set(climbX, climbY, basePosition[2] + 16);
          groupRef.current.rotation.set(-0.25, -Math.PI / 2, 0);
        }
      } else if (aircraftState === "IN_FLIGHT") {
        // High altitude holding / scenic circle over turquoise lagoon
        const theta = animTimeRef.current * 0.2;
        const orbitR = 140;
        const cx = basePosition[0] + Math.cos(theta) * orbitR;
        const cz = basePosition[2] + Math.sin(theta) * orbitR;
        groupRef.current.position.set(cx, 48, cz);
        groupRef.current.rotation.set(0.1, -theta + Math.PI / 2, 0.18);
      }
    }
  });

  return (
    <group ref={groupRef} position={basePosition} name="regional-airliner-va72">
      {/* ======================================================== */}
      {/* 1. EXTERIOR FUSELAGE & STREAMLINED NOSE                   */}
      {/* ======================================================== */}
      {/* Main Fuselage Body with Top Observation Vista Arc */}
      <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 15.0, 24, 1, false, Math.PI * 0.2, Math.PI * 1.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.15} side={2} />
      </mesh>
      {/* Tinted Panoramic Cabin Observation Skylight */}
      <mesh position={[0, 3.08, 0]}>
        <boxGeometry args={[12.2, 0.03, 1.05]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.7} transparent opacity={0.3} />
      </mesh>

      {/* Aerodynamic Nose Radome (Front of Fuselage, -X) */}
      <mesh position={[-7.5, 1.8, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[1.35, 3.2, 20]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Cockpit Windshield Visor (Black / Cyan Reflective Glass) */}
      <mesh position={[-6.2, 2.3, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[1.4, 0.7, 1.8]} />
        <meshStandardMaterial color="#0c4a6e" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Tapered Tail Cone (Aft Fuselage, +X) */}
      <mesh position={[7.5, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[1.35, 3.8, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Royal Azure Livery Cheatline along Fuselage */}
      <mesh position={[0, 1.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.36, 1.36, 14.5, 20, 1, true]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Golden Cheatline Stripe */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.365, 1.365, 14.5, 20, 1, true]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Exterior Cabin Windows (Port & Starboard) */}
      {[-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((wx, i) => (
        <group key={`win-${i}`}>
          {/* Port side window */}
          <mesh position={[wx, 2.0, -1.37]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.4, 0.45, 0.04]} />
            <meshStandardMaterial color="#0369a1" roughness={0.15} metalness={0.8} />
          </mesh>
          {/* Starboard side window */}
          <mesh position={[wx, 2.0, 1.37]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.4, 0.45, 0.04]} />
            <meshStandardMaterial color="#0369a1" roughness={0.15} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Passenger Door Cutout (Port Side at X = -3.5) */}
      <mesh position={[-3.5, 1.7, -1.38]} castShadow>
        <boxGeometry args={[0.9, 1.6, 0.06]} />
        <meshStandardMaterial color={isBoardingAllowed ? "#1e293b" : "#f8fafc"} roughness={0.5} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. HIGH WINGS, ENGINE NACELLES & TURBOPROP PROPELLERS     */}
      {/* ======================================================== */}
      {/* Center Wing Center-Section (Above Cabin) */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <boxGeometry args={[2.8, 0.35, 18.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Wingtip Aerodynamic Blended Winglets */}
      <mesh position={[0, 3.6, -9.0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[1.8, 1.0, 0.1]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.6, 9.0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[1.8, 1.0, 0.1]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>

      {/* Left Turboprop Engine Nacelle (Port Wing, Z = -3.8) */}
      <group position={[-0.8, 2.7, -3.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 3.6, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Spinner Cone */}
        <mesh position={[-1.9, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <coneGeometry args={[0.42, 0.8, 14]} />
          <meshStandardMaterial color="#1c1917" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* 4-Blade Propeller Assembly */}
        <group ref={leftPropRef} position={[-1.85, 0, 0]}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, pi) => (
            <mesh key={`lprop-${pi}`} rotation={[ang, 0, 0]}>
              <boxGeometry args={[0.04, 1.6, 0.15]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right Turboprop Engine Nacelle (Starboard Wing, Z = 3.8) */}
      <group position={[-0.8, 2.7, 3.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 3.6, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[-1.9, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <coneGeometry args={[0.42, 0.8, 14]} />
          <meshStandardMaterial color="#1c1917" roughness={0.6} metalness={0.3} />
        </mesh>
        <group ref={rightPropRef} position={[-1.85, 0, 0]}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, pi) => (
            <mesh key={`rprop-${pi}`} rotation={[ang, 0, 0]}>
              <boxGeometry args={[0.04, 1.6, 0.15]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. T-TAIL EMPENNAGE & NAVIGATION BEACON                   */}
      {/* ======================================================== */}
      {/* Vertical Tail Fin */}
      <mesh position={[7.8, 3.8, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[2.2, 3.4, 0.28]} />
        <meshStandardMaterial color="#ea580c" roughness={0.35} />
      </mesh>
      {/* Horizontal Stabilizer (Top of T-Tail) */}
      <mesh position={[8.4, 5.2, 0]} castShadow>
        <boxGeometry args={[1.8, 0.2, 6.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Flashing Anti-Collision Red Beacon Light (Crown of Tail) */}
      <mesh ref={beaconLightRef} position={[8.4, 5.4, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.5} />
      </mesh>

      {/* ======================================================== */}
      {/* 4. TRICYCLE LANDING GEAR ON APRON                        */}
      {/* ======================================================== */}
      {/* Nose Gear Strut & Dual Wheels (Front, X = -6.2) */}
      <group position={[-6.2, 0, 0]}>
        <mesh position={[0, 0.5, 0]} material={SHARED_MATERIALS.pierWood}>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 8]} />
        </mesh>
        {/* Left & Right Nose Wheels */}
        <mesh position={[0, 0.22, -0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 12]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.22, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 12]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
      </group>

      {/* Main Landing Gear Bogies (Under wings, X = 0.5, Z = +/- 2.4) */}
      {[-2.4, 2.4].map((gz) => (
        <group key={`mgear-${gz}`} position={[0.5, 0, gz]}>
          <mesh position={[0, 0.55, 0]} material={SHARED_MATERIALS.pierWood}>
            <cylinderGeometry args={[0.09, 0.09, 1.1, 8]} />
          </mesh>
          <mesh position={[0, 0.3, -0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 14]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.3, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 14]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 5. PASSENGER BOARDING STAIRS (Connected to Port Door)     */}
      {/* ======================================================== */}
      {/* Mobile Stairs Rig on Apron with Walkable Solid Collider */}
      <group position={[-3.5, 0, -2.2]} name="mobile-boarding-stairs">
        {/* Stairs Rig Solid Body Collider */}
        <RigidBody type="fixed" colliders={false} position={[0, 0.7, 0]}>
          <CuboidCollider args={[0.8, 0.7, 0.8]} />
          {/* Wheelbase Chassis */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.curbConcrete}>
            <boxGeometry args={[1.5, 0.35, 1.5]} />
          </mesh>
        </RigidBody>

        {/* Stepped Riser Structure leading to Doorway */}
        {[0, 1, 2, 3].map((step) => (
          <group key={`stair-${step}`} position={[0, 0.25 + step * 0.32, -0.6 + step * 0.35]}>
            <mesh castShadow receiveShadow material={SHARED_MATERIALS.curbConcrete}>
              <boxGeometry args={[1.2, 0.15, 0.4]} />
            </mesh>
            {/* Safety Yellow Edge Stripe */}
            <mesh position={[0, 0.08, -0.18]}>
              <boxGeometry args={[1.2, 0.02, 0.04]} />
              <meshStandardMaterial color="#facc15" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Top Boarding Landing Platform at Aircraft Doorway */}
        <RigidBody type="fixed" colliders={false} position={[0, 1.45, 0.75]}>
          <CuboidCollider args={[0.7, 0.1, 0.45]} />
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.curbConcrete}>
            <boxGeometry args={[1.4, 0.2, 0.9]} />
          </mesh>
        </RigidBody>

        {/* Handrail Balustrades */}
        <mesh position={[-0.65, 1.2, 0]} material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[0.06, 1.2, 1.6]} />
        </mesh>
        <mesh position={[0.65, 1.2, 0]} material={SHARED_MATERIALS.pierWood}>
          <boxGeometry args={[0.06, 1.2, 1.6]} />
        </mesh>

        {/* Boarding Door Interaction Prompt Target */}
        <InteractableTarget
          id="aircraft-boarding-door"
          name="Varanaya Island Hopper Boarding Door"
          type="OPEN"
          promptLabel={
            isBoardingAllowed
              ? "[E] BOARD AIRCRAFT"
              : `[LOCKED] BOARDING CLOSED (${aircraftState})`
          }
          position={[0, 1.8, 0.8]}
          range={3.2}
          priority={15}
          chunkKey="1,0"
          action={handleBoard}
        >
          {/* Visual Boarding Entry Glow Ring */}
          <mesh position={[0, 1.8, 0.8]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.35, 0.45, 16]} />
            <meshStandardMaterial
              color={isBoardingAllowed ? "#38bdf8" : "#94a3b8"}
              emissive={isBoardingAllowed ? "#0284c7" : "#475569"}
              emissiveIntensity={isBoardingAllowed ? 1.4 : 0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </InteractableTarget>
      </group>

      {/* ======================================================== */}
      {/* 6. WALKABLE PASSENGER CABIN INTERIOR                      */}
      {/* ======================================================== */}
      {/* 
        The interior cabin is located directly inside the fuselage cylinder.
        Floor level: Y = 0.95. Ceiling: Y = 2.65.
        Rapier colliders prevent falling through or escaping through walls.
      */}
      <group position={[0, 0, 0]} name="aircraft-interior-cabin">
        {/* Interior Cabin Solid RigidBody Colliders */}
        <RigidBody type="fixed" colliders={false}>
          {/* Cabin Walkable Floor */}
          <CuboidCollider args={[6.5, 0.1, 1.1]} position={[0, 0.85, 0]} />
          {/* Port Wall Barrier */}
          <CuboidCollider args={[6.5, 1.2, 0.1]} position={[0, 1.8, -1.25]} />
          {/* Starboard Wall Barrier */}
          <CuboidCollider args={[6.5, 1.2, 0.1]} position={[0, 1.8, 1.25]} />
          {/* Front Cockpit Bulkhead */}
          <CuboidCollider args={[0.1, 1.2, 1.1]} position={[-6.2, 1.8, 0]} />
          {/* Aft Galley Bulkhead */}
          <CuboidCollider args={[0.1, 1.2, 1.1]} position={[6.2, 1.8, 0]} />
        </RigidBody>

        {/* Carpeted Central Aisle Floor Mesh */}
        <mesh position={[0, 0.96, 0]} receiveShadow>
          <boxGeometry args={[12.2, 0.04, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        {/* Under-Seat Floor Matting */}
        <mesh position={[0, 0.95, -0.8]} receiveShadow>
          <boxGeometry args={[12.2, 0.03, 0.75]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.95, 0.8]} receiveShadow>
          <boxGeometry args={[12.2, 0.03, 0.75]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Overhead Cabin Soft Lighting Strips */}
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[12.0, 0.05, 0.35]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fef08a"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>

        {/* Overhead Luggage Stowage Bins along Both Sides */}
        <mesh position={[0, 2.45, -0.85]} castShadow>
          <boxGeometry args={[11.8, 0.4, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.45, 0.85]} castShadow>
          <boxGeometry args={[11.8, 0.4, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>

        {/* 6 Rows of Passenger Seats (Navy Fabric with Grey Headrests) */}
        {[-4.5, -2.8, -1.1, 0.6, 2.3, 4.0].map((rowX, ri) => (
          <group key={`seatrow-${ri}`}>
            {/* Port Side Seat Pair */}
            <group position={[rowX, 1.0, -0.78]}>
              <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[0.55, 0.5, 0.55]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
              </mesh>
              {/* Seat Backrest */}
              <mesh position={[0.22, 0.72, 0]} rotation={[0, 0, -0.1]} castShadow>
                <boxGeometry args={[0.1, 0.65, 0.52]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
              </mesh>
              {/* White Headrest Cover */}
              <mesh position={[0.23, 0.95, 0]}>
                <boxGeometry args={[0.08, 0.2, 0.4]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
            </group>

            {/* Starboard Side Seat Pair */}
            <group position={[rowX, 1.0, 0.78]}>
              <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[0.55, 0.5, 0.55]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
              </mesh>
              <mesh position={[0.22, 0.72, 0]} rotation={[0, 0, -0.1]} castShadow>
                <boxGeometry args={[0.1, 0.65, 0.52]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
              </mesh>
              <mesh position={[0.23, 0.95, 0]}>
                <boxGeometry args={[0.08, 0.2, 0.4]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
            </group>
          </group>
        ))}

        {/* Cockpit Forward Bulkhead & Viewing Window */}
        <group position={[-5.8, 1.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 1.8, 2.4]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Cockpit Door Window Reveal */}
          <mesh position={[0.08, 0.3, 0]}>
            <boxGeometry args={[0.02, 0.6, 0.4]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Glowing Avionics Screens inside Cockpit visible through glass */}
          <mesh position={[-0.8, 0.1, -0.3]}>
            <boxGeometry args={[0.05, 0.25, 0.35]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[-0.8, 0.1, 0.3]}>
            <boxGeometry args={[0.05, 0.25, 0.35]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* Interior Cabin Exit Doorway & Disembark Prompt Target */}
        <group position={[-3.5, 1.8, -1.0]}>
          {/* Glowing Green EXIT Sign above doorway */}
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[0.45, 0.18, 0.05]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#16a34a"
              emissiveIntensity={1.6}
              roughness={0.3}
            />
          </mesh>

          {/* Disembark Aircraft Interaction Trigger */}
          <InteractableTarget
            id="aircraft-cabin-exit"
            name="Aircraft Cabin Exit"
            type="OPEN"
            promptLabel="[E] DISEMBARK AIRCRAFT"
            position={[0, 0, 0]}
            range={2.4}
            priority={15}
            chunkKey="1,0"
            action={handleDisembark}
          >
            <mesh position={[0, 0, 0]}>
              <ringGeometry args={[0.25, 0.35, 16]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#16a34a"
                emissiveIntensity={1.2}
                transparent
                opacity={0.85}
              />
            </mesh>
          </InteractableTarget>
        </group>
      </group>
    </group>
  );
}
