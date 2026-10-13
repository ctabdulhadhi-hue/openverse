"use client";

import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";

import { InteractableTarget } from "@/game/interaction/InteractionTarget";

import { SHARED_MATERIALS } from "../WorldMaterials";
import { airportStore } from "./aircraftStore";
import type { FlightScheduleItem } from "./airportTypes";

export interface IslandTerminalProps {
  position?: [number, number, number];
}

/**
 * Agatti-inspired Regional Island Passenger Terminal.
 *
 * Features:
 * - Single-story tropical pavilion architecture with overhanging teal metal roof
 * - Open breezeway passenger lounge with panoramic airside apron windows
 * - Check-in desks with scales and monitors
 * - Electronic Flight Information Display System (FIDS) / Departure Board
 * - Security stanchions & Gate 1 boarding portal
 * - Luggage reclaim counter with baggage
 * - Airport Staff NPC (Agent Kabir) and Passenger (Amina)
 * - Complete solid Rapier floor and wall colliders
 */
export function IslandTerminal({ position = [140, 0, 36] }: IslandTerminalProps) {
  const [schedule, setSchedule] = useState<FlightScheduleItem[]>(() => airportStore.getSchedule());
  const [selectedFlightInfo, setSelectedFlightInfo] = useState<string | null>(null);

  useEffect(() => {
    return airportStore.subscribe(() => {
      setSchedule(airportStore.getSchedule());
    });
  }, []);

  const handleInspectFlightBoard = () => {
    const active = schedule[0];
    if (active) {
      setSelectedFlightInfo(
        `${active.airline} ${active.flightNumber} to ${active.destination} · Status: ${active.status} (${active.remarks})`,
      );
    }
  };

  return (
    <group position={position} name="island-passenger-terminal">
      {/* ======================================================== */}
      {/* 1. SOLID TERMINAL FOUNDATION FLOOR & ROOF COLLIDERS      */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.2, 0]}>
        <CuboidCollider args={[14.0, 0.2, 8.0]} />
        {/* Polished Terminal Terrazzo Floor */}
        <mesh receiveShadow material={SHARED_MATERIALS.curbConcrete}>
          <boxGeometry args={[28.0, 0.4, 16.0]} />
        </mesh>
      </RigidBody>

      {/* Terminal Sloped Tropical Metal Roof */}
      <mesh position={[0, 5.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[30.0, 0.5, 18.0]} />
        <meshStandardMaterial color="#0d9488" roughness={0.4} metalness={0.25} />
      </mesh>
      {/* Roof Fascia Trim */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[30.4, 0.25, 18.4]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Terminal Structural Columns */}
      {[-13.0, -6.5, 0, 6.5, 13.0].map((cx, ci) => (
        <group key={`col-${ci}`}>
          {/* North Column */}
          <mesh position={[cx, 2.7, -7.5]} castShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[0.6, 5.0, 0.6]} />
          </mesh>
          {/* South Column (Airside) */}
          <mesh position={[cx, 2.7, 7.5]} castShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[0.6, 5.0, 0.6]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. EXTERIOR WALLS & AIRSIDE PANORAMIC GLASS              */}
      {/* ======================================================== */}
      <RigidBody type="fixed" colliders={false}>
        {/* West Side Wall */}
        <CuboidCollider args={[0.3, 2.5, 8.0]} position={[-13.8, 2.7, 0]} />
        <mesh position={[-13.8, 2.7, 0]} castShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[0.6, 5.0, 16.0]} />
        </mesh>

        {/* East Side Wall */}
        <CuboidCollider args={[0.3, 2.5, 8.0]} position={[13.8, 2.7, 0]} />
        <mesh position={[13.8, 2.7, 0]} castShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[0.6, 5.0, 16.0]} />
        </mesh>

        {/* North Wall (Landside Entrance with double doorway opening) */}
        <CuboidCollider args={[5.5, 2.5, 0.3]} position={[-8.0, 2.7, -7.8]} />
        <mesh position={[-8.0, 2.7, -7.8]} castShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[11.0, 5.0, 0.6]} />
        </mesh>
        <CuboidCollider args={[5.5, 2.5, 0.3]} position={[8.0, 2.7, -7.8]} />
        <mesh position={[8.0, 2.7, -7.8]} castShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[11.0, 5.0, 0.6]} />
        </mesh>

        {/* South Wall (Airside with Gate 1 Exit Opening) */}
        <CuboidCollider args={[5.0, 2.5, 0.3]} position={[-8.5, 2.7, 7.8]} />
        <mesh position={[-8.5, 2.7, 7.8]} castShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[10.0, 5.0, 0.6]} />
        </mesh>
        <CuboidCollider args={[5.0, 2.5, 0.3]} position={[8.5, 2.7, 7.8]} />
        <mesh position={[8.5, 2.7, 7.8]} castShadow material={SHARED_MATERIALS.buildingWhite}>
          <boxGeometry args={[10.0, 5.0, 0.6]} />
        </mesh>
      </RigidBody>

      {/* Airside Large Glass Viewing Windows overlooking Apron & Runway */}
      {[-4.0, 4.0].map((gx, gi) => (
        <mesh key={`glass-${gi}`} position={[gx, 2.7, 7.8]}>
          <boxGeometry args={[4.5, 3.8, 0.08]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.45}
          />
        </mesh>
      ))}

      {/* Terminal Entrance Sign (North Façade) */}
      <mesh position={[0, 4.8, -8.1]}>
        <boxGeometry args={[8.5, 0.9, 0.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.8, -8.18]}>
        <boxGeometry args={[7.8, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* ======================================================== */}
      {/* 3. CHECK-IN DESKS & BAGGAGE SCALES (West Side)           */}
      {/* ======================================================== */}
      <group position={[-9.5, 0.4, -3.5]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0.6, 0]}>
          <CuboidCollider args={[2.8, 0.6, 0.8]} />
          {/* Main Counter Desk */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.warmSandstone}>
            <boxGeometry args={[5.6, 1.2, 1.6]} />
          </mesh>
        </RigidBody>
        {/* Computer Monitors */}
        {[-1.6, 0, 1.6].map((mx, mi) => (
          <group key={`mon-${mi}`} position={[mx, 1.45, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.45, 0.06]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, -0.04]}>
              <boxGeometry args={[0.54, 0.38, 0.02]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
        {/* Luggage Scales Platform */}
        <mesh position={[0, 0.1, -1.2]} receiveShadow material={SHARED_MATERIALS.metalTrim}>
          <boxGeometry args={[5.0, 0.1, 0.8]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. FLIGHT INFORMATION DISPLAY (FIDS) / DEPARTURE BOARD   */}
      {/* ======================================================== */}
      <group position={[0, 2.8, -4.5]}>
        {/* Display Board Frame */}
        <mesh castShadow>
          <boxGeometry args={[5.2, 2.6, 0.3]} />
          <meshStandardMaterial color="#020617" roughness={0.4} />
        </mesh>

        {/* High-Contrast Electronic Screen Background */}
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[4.9, 2.3, 0.04]} />
          <meshStandardMaterial
            color="#090d16"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            roughness={0.2}
          />
        </mesh>

        {/* Top Header Bar "AGATTI ISLAND AERODROME · DEPARTURES" */}
        <mesh position={[0, 0.85, 0.19]}>
          <boxGeometry args={[4.6, 0.35, 0.02]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1.4} />
        </mesh>

        {/* Flight Rows (Simulated LED rows) */}
        {schedule.slice(0, 3).map((flight, fi) => (
          <group key={flight.flightNumber} position={[0, 0.4 - fi * 0.5, 0.19]}>
            {/* Flight Code & Destination pill */}
            <mesh position={[-1.2, 0, 0]}>
              <boxGeometry args={[1.8, 0.28, 0.02]} />
              <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
            </mesh>
            {/* Status indicator pill */}
            <mesh position={[1.4, 0, 0]}>
              <boxGeometry args={[1.4, 0.28, 0.02]} />
              <meshStandardMaterial
                color={flight.status === "BOARDING" ? "#22c55e" : "#f59e0b"}
                emissive={flight.status === "BOARDING" ? "#16a34a" : "#b45309"}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        ))}

        {/* Interactive Flight Board Target */}
        <InteractableTarget
          id="airport-fids-board"
          name="Electronic Flight Information Board"
          type="READ"
          promptLabel="[E] INSPECT FLIGHT DEPARTURES"
          position={[0, 1.2, 0.6]}
          range={3.8}
          priority={10}
          chunkKey="1,0"
          action={handleInspectFlightBoard}
        >
          <mesh position={[0, 0, 0.25]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>
        </InteractableTarget>
      </group>

      {/* Floating Tooltip Banner when Flight Board is Inspected */}
      {selectedFlightInfo && (
        <group position={[0, 4.4, -4.0]}>
          <mesh>
            <boxGeometry args={[8.0, 0.65, 0.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* ======================================================== */}
      {/* 5. PASSENGER WAITING LOUNGE SEATING (East Side)          */}
      {/* ======================================================== */}
      {[-2.0, 0.8, 3.6].map((sz, si) => (
        <group key={`lounge-${si}`} position={[8.5, 0.4, sz]}>
          {/* Bench Row */}
          <mesh castShadow receiveShadow material={SHARED_MATERIALS.buildingBlue}>
            <boxGeometry args={[4.8, 0.45, 0.8]} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.55, -0.32]} castShadow material={SHARED_MATERIALS.buildingBlue}>
            <boxGeometry args={[4.8, 0.65, 0.12]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 6. GATE 1 BOARDING PORTAL & STANCHIONS (South Exit)      */}
      {/* ======================================================== */}
      <group position={[0, 0.4, 7.2]}>
        {/* Gate Portal Arch */}
        <mesh position={[0, 2.2, 0]} material={SHARED_MATERIALS.warmSandstone}>
          <boxGeometry args={[4.2, 0.4, 0.6]} />
        </mesh>
        {/* Gate 1 Sign */}
        <mesh position={[0, 2.65, 0]}>
          <boxGeometry args={[2.2, 0.55, 0.15]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={1.4} />
        </mesh>
        {/* Security Stanchions with Ribbon */}
        {[-1.6, 1.6].map((sx, si) => (
          <mesh
            key={`stanchion-${si}`}
            position={[sx, 0.5, 0]}
            material={SHARED_MATERIALS.metalTrim}
          >
            <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 7. BAGGAGE RECLAIM CAROUSEL & SUITCASES                  */}
      {/* ======================================================== */}
      <group position={[-9.5, 0.4, 4.0]}>
        {/* Oval Carousel Conveyor */}
        <mesh receiveShadow material={SHARED_MATERIALS.metalTrim}>
          <boxGeometry args={[4.5, 0.35, 2.5]} />
        </mesh>
        {/* Luggage Bags on Carousel */}
        {[
          { pos: [-1.2, 0.3, 0.4] as const, col: "#ea580c" },
          { pos: [0.2, 0.3, -0.5] as const, col: "#1e3a8a" },
          { pos: [1.4, 0.3, 0.2] as const, col: "#059669" },
        ].map((lug, li) => (
          <mesh key={`lug-${li}`} position={[lug.pos[0], lug.pos[1], lug.pos[2]]} castShadow>
            <boxGeometry args={[0.65, 0.28, 0.45]} />
            <meshStandardMaterial color={lug.col} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 8. AIRPORT STAFF & TRAVELER NPCS                         */}
      {/* ======================================================== */}
      {/* Gate Agent Kabir stationed at Gate 1 */}
      <group position={[-1.2, 0.4, 6.8]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.6, 10]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#d4a373" roughness={0.65} />
        </mesh>
        {/* Cap with gold badge */}
        <mesh position={[0, 1.85, 0.04]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <InteractableTarget
          id="npc-airport-agent-kabir"
          name="Gate Agent Kabir"
          type="TALK"
          promptLabel="[E] SPEAK WITH GATE AGENT"
          position={[0, 1.0, 0]}
          range={3.0}
          priority={12}
          chunkKey="1,0"
          action={() => {
            handleInspectFlightBoard();
          }}
        />
      </group>

      {/* Passenger Amina sitting in the waiting lounge */}
      <group position={[8.5, 0.9, 0.8]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.9, 10]} />
          <meshStandardMaterial color="#ea580c" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#e0ac69" roughness={0.65} />
        </mesh>
      </group>
    </group>
  );
}
