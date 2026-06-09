import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ─── 3D Logo Plane with glow + rotation ───

function LogoMesh({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/logo/Logfinalsabha.gif");

  // Smooth rotation based on scroll
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Gentle auto-rotation
    meshRef.current.rotation.y += delta * 0.3;
    // Tilt based on scroll — gives the flying-through-air feel
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      scrollProgress * 0.3 - 0.15,
      0.05,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      Math.sin(scrollProgress * Math.PI) * 0.15,
      0.05,
    );

    // Glow pulse
    if (glowRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Glow ring behind logo */}
        <mesh ref={glowRef} position={[0, 0, -0.05]}>
          <ringGeometry args={[1.1, 1.6, 64]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Main logo plane */}
        <mesh ref={meshRef}>
          <planeGeometry args={[2.2, 2.2]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.1}
            side={THREE.DoubleSide}
            emissive="#f59e0b"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Ambient particles around logo */}
        <Particles count={30} />
      </group>
    </Float>
  );
}

// ─── Floating particles ───

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.1;
    pointsRef.current.rotation.z += delta * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#f59e0b"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Main 3D Logo wrapper ───

export function Logo3D({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#f59e0b" />
        <pointLight position={[-3, -3, 3]} intensity={0.3} color="#fbbf24" />
        <LogoMesh scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
