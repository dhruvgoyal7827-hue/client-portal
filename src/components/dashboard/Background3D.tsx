import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const COUNT = 1800;
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  const { viewport } = useThree();

  const { positions, basePositions } = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return { positions: arr, basePositions: arr.slice() };
  }, []);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 6), 3));
    return g;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * viewport.width;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * viewport.height;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [viewport]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const bx = basePositions[ix];
      const by = basePositions[ix + 1];
      const bz = basePositions[ix + 2];
      // gentle drift
      let x = bx + Math.sin(t * 0.2 + i * 0.01) * 0.15;
      let y = by + Math.cos(t * 0.18 + i * 0.013) * 0.15;
      const z = bz;
      // soft mouse repel
      const dx = x - mouse.current.x;
      const dy = y - mouse.current.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 2) {
        const f = (2 - d2) * 0.18;
        x += (dx / Math.sqrt(d2 + 0.001)) * f;
        y += (dy / Math.sqrt(d2 + 0.001)) * f;
      }
      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }
    pos.needsUpdate = true;

    // connection lines (sparse, sampled)
    const linePos = lineGeo.attributes.position.array as Float32Array;
    let li = 0;
    const MAX_LINES = COUNT;
    for (let i = 0; i < COUNT && li < MAX_LINES; i += 2) {
      const j = (i + 7) % COUNT;
      const ax = arr[i * 3], ay = arr[i * 3 + 1], az = arr[i * 3 + 2];
      const bxp = arr[j * 3], byp = arr[j * 3 + 1], bzp = arr[j * 3 + 2];
      const ddx = ax - bxp, ddy = ay - byp;
      if (ddx * ddx + ddy * ddy < 0.6) {
        linePos[li * 6] = ax; linePos[li * 6 + 1] = ay; linePos[li * 6 + 2] = az;
        linePos[li * 6 + 3] = bxp; linePos[li * 6 + 4] = byp; linePos[li * 6 + 5] = bzp;
        li++;
      }
    }
    // zero out unused
    for (let k = li * 6; k < linePos.length; k++) linePos[k] = 0;
    lineGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color="#a78bfa" transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

function Orbs() {
  const left = useRef<THREE.Mesh>(null!);
  const right = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (left.current) {
      left.current.position.x = -6 + Math.sin(t * 0.15) * 1.2;
      left.current.position.y = Math.cos(t * 0.18) * 1.5;
    }
    if (right.current) {
      right.current.position.x = 6 + Math.cos(t * 0.13) * 1.2;
      right.current.position.y = Math.sin(t * 0.2) * 1.5;
    }
  });
  return (
    <>
      <mesh ref={left} position={[-6, 0, -3]}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.35} />
      </mesh>
      <mesh ref={right} position={[6, 0, -3]}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#3b5bdb" transparent opacity={0.35} />
      </mesh>
    </>
  );
}

export function Background3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.18 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 70 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Orbs />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}