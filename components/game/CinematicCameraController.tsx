"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { introStore } from "@/game/cinematic/introStore";
import type { IntroPhase } from "@/game/cinematic/introTypes";
import {
  CINEMATIC_WAYPOINTS,
  CLOUD_REVEAL_T,
  FLYOVER_DURATION_SECONDS,
  HANDOFF_DURATION_SECONDS,
} from "@/game/cinematic/introWaypoints";

export function CinematicCameraController() {
  const { camera } = useThree();
  const [phase, setPhase] = useState<IntroPhase>(() => introStore.getPhase());

  const elapsedFlyoverRef = useRef(0);
  const elapsedHandoffRef = useRef(0);

  // Reusable vectors to avoid allocations in animation loop
  const currentPosRef = useRef(new THREE.Vector3());
  const currentLookAtRef = useRef(new THREE.Vector3());
  const handoffStartPosRef = useRef(new THREE.Vector3());
  const handoffStartLookAtRef = useRef(new THREE.Vector3());

  // Player default third-person camera target at spawn [0, 1.2, 8]
  const playerFocusPos = useMemo(() => new THREE.Vector3(0, 2.0, 8), []);
  const playerCameraPos = useMemo(() => new THREE.Vector3(0, 3.2, 14.5), []);

  // Pre-calculate smooth Catmull-Rom spline curves through canonical waypoints
  const { posCurve, lookAtCurve } = useMemo(() => {
    const posPoints = CINEMATIC_WAYPOINTS.map(
      (wp) => new THREE.Vector3(wp.position[0], wp.position[1], wp.position[2]),
    );
    const lookPoints = CINEMATIC_WAYPOINTS.map(
      (wp) => new THREE.Vector3(wp.lookAt[0], wp.lookAt[1], wp.lookAt[2]),
    );

    const posSpline = new THREE.CatmullRomCurve3(posPoints, false, "catmullrom", 0.5);
    const lookSpline = new THREE.CatmullRomCurve3(lookPoints, false, "catmullrom", 0.5);

    return { posCurve: posSpline, lookAtCurve: lookSpline };
  }, []);

  // Subscribe to introStore phase changes
  useEffect(() => {
    return introStore.subscribe((t) => {
      setPhase(t.phase);
      if (t.phase === "LOADING") {
        elapsedFlyoverRef.current = 0;
        elapsedHandoffRef.current = 0;
        posCurve.getPoint(0, currentPosRef.current);
        lookAtCurve.getPoint(0, currentLookAtRef.current);
        camera.position.copy(currentPosRef.current);
        camera.lookAt(currentLookAtRef.current);
      } else if (t.phase === "FLYOVER" && elapsedFlyoverRef.current === 0) {
        // Prepare initial camera position at Waypoint 0
        posCurve.getPoint(0, currentPosRef.current);
        lookAtCurve.getPoint(0, currentLookAtRef.current);
        camera.position.copy(currentPosRef.current);
        camera.lookAt(currentLookAtRef.current);
      }
    });
  }, [camera, lookAtCurve, posCurve]);

  useFrame((_, delta) => {
    // 1. Loading phase: camera is docked at Waypoint 0 waiting for takeoff
    if (phase === "LOADING") {
      posCurve.getPoint(0, currentPosRef.current);
      lookAtCurve.getPoint(0, currentLookAtRef.current);
      camera.position.copy(currentPosRef.current);
      camera.lookAt(currentLookAtRef.current);
      return;
    }

    // Legacy Title phase timer progression
    if (phase === "TITLE") {
      introStore.updateTitleTimer(delta);
      return;
    }

    // 2. Drone Flyover flight animation
    if (phase === "FLYOVER") {
      elapsedFlyoverRef.current += delta;
      const t = Math.min(1.0, elapsedFlyoverRef.current / FLYOVER_DURATION_SECONDS);

      // Sample smooth Catmull-Rom spline coordinates
      posCurve.getPoint(t, currentPosRef.current);
      lookAtCurve.getPoint(t, currentLookAtRef.current);

      camera.position.copy(currentPosRef.current);
      camera.lookAt(currentLookAtRef.current);

      // Find active landmark title from waypoints
      let activeWp = CINEMATIC_WAYPOINTS[0]!;
      for (let i = 0; i < CINEMATIC_WAYPOINTS.length; i++) {
        if (t >= CINEMATIC_WAYPOINTS[i]!.t) {
          activeWp = CINEMATIC_WAYPOINTS[i]!;
        }
      }

      introStore.updateFlyover(t, activeWp.locationTitle, activeWp.subtitle);

      // Detect cloud-emergence and trigger soundtrack
      if (t >= CLOUD_REVEAL_T) {
        introStore.onCloudReveal();
      }

      // Trigger audio fade-out and handoff as camera reaches final descent
      if (t >= 0.92) {
        introStore.startHandoff();
      }

      if (t >= 1.0) {
        handoffStartPosRef.current.copy(camera.position);
        handoffStartLookAtRef.current.copy(currentLookAtRef.current);
        elapsedHandoffRef.current = 0;
      }
      return;
    }

    // 3. Smooth blend into player camera at spawn point
    if (phase === "HANDOFF") {
      elapsedHandoffRef.current += delta;
      const handoffT = Math.min(1.0, elapsedHandoffRef.current / HANDOFF_DURATION_SECONDS);
      // Smooth ease-out curve
      const easeT = 1 - Math.pow(1 - handoffT, 3);

      camera.position.lerpVectors(handoffStartPosRef.current, playerCameraPos, easeT);
      const blendedLookAt = new THREE.Vector3().lerpVectors(
        handoffStartLookAtRef.current,
        playerFocusPos,
        easeT,
      );
      camera.lookAt(blendedLookAt);

      if (handoffT >= 1.0) {
        introStore.complete();
      }
    }
  });

  return null;
}
