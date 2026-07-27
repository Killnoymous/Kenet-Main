import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Scroll progress helper
const getScroll = () => {
  if (typeof window === 'undefined') return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
};

// --- Particle Field Component ---
function ParticleField({ count = 5000 }) {
  const ref = useRef();
  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.pow(Math.random(), 0.55) * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);
      sd[i] = Math.random();
    }
    return [pos, sd];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uSize: { value: 26.0 },
    uColorA: { value: new THREE.Color('#ff8b4a') },
    uColorB: { value: new THREE.Color('#7ab7ff') },
    uScroll: { value: 0 }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = getScroll();
    uniforms.uMouse.value.lerp(new THREE.Vector3(state.mouse.x * 6, state.mouse.y * 3, 0), 0.05);
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03 + uniforms.uScroll.value * 2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.06;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          count={seeds.length}
          array={seeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime; uniform vec3 uMouse; uniform float uSize; uniform float uScroll;
          attribute float aSeed;
          varying float vSeed; varying float vDist;
          void main() {
            vSeed = aSeed;
            vec3 p = position;
            float t = uTime * (0.25 + aSeed * 0.6);
            p.x += sin(t + aSeed * 6.28) * 0.4;
            p.y += cos(t * 1.2 + aSeed * 6.28) * 0.4;
            p.z += sin(t * 0.8 + aSeed * 6.28) * 0.4;
            p += vec3(0.0, -uScroll * 8.0, 0.0);
            vec3 toMouse = uMouse - p;
            float d = length(toMouse);
            float force = smoothstep(6.0, 0.0, d) * 0.9;
            p += normalize(toMouse) * force;
            vDist = d;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * (1.0 / -mv.z) * (0.6 + aSeed * 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA; uniform vec3 uColorB;
          varying float vSeed; varying float vDist;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float a = smoothstep(0.5, 0.0, length(uv));
            vec3 c = mix(uColorB, uColorA, smoothstep(6.0, 0.0, vDist) * 0.9 + vSeed * 0.2);
            gl_FragColor = vec4(c, a * (0.32 + vSeed * 0.6));
          }
        `}
      />
    </points>
  );
}

// --- Simplex Noise Sculpture Component ---
function DistortSculpture({ position = [0, 0, 0], scale = 1, color = '#ff8b4a', speed = 0.4, wireframe = false }) {
  const ref = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: speed },
    uColor: { value: new THREE.Color(color) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 }
  }), [color, speed]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = getScroll();
    uniforms.uMouse.value.set(state.mouse.x, state.mouse.y);
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15 + getScroll() * 3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.4 + getScroll() * 1.5;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 48]} />
      <shaderMaterial
        wireframe={wireframe}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime; uniform float uSpeed; uniform vec2 uMouse; uniform float uScroll;
          varying vec3 vNormal; varying vec3 vPos;
          vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
          vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
          vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
          float snoise(vec3 v){
            const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
            vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
            vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g;
            vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
            vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
            i=mod289(i);
            vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
            float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
            vec4 j=p-49.0*floor(p*ns.z*ns.z);
            vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
            vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy;
            vec4 h=1.0-abs(x)-abs(y);
            vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
            vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0;
            vec4 sh=-step(h,vec4(0.0));
            vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
            vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y);
            vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
            vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
            vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
            m=m*m;
            return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
          }
          void main() {
            vNormal = normal;
            float n = snoise(position * 1.4 + vec3(uTime * uSpeed));
            float m = snoise(position * 3.0 - vec3(uTime * uSpeed * 0.6));
            float boost = 1.0 + uScroll * 0.6;
            vec3 p = position + normal * ((n * 0.35 + m * 0.12) * boost + uMouse.x * 0.05 + uMouse.y * 0.05);
            vPos = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor; uniform float uTime;
          varying vec3 vNormal; varying vec3 vPos;
          void main() {
            vec3 light = normalize(vec3(0.6, 0.9, 0.4));
            float diff = max(dot(normalize(vNormal), light), 0.0);
            float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.5);
            vec3 base = mix(vec3(0.02,0.02,0.03), uColor, diff * 0.7 + rim * 0.9);
            base += uColor * rim * 0.6;
            base += 0.03 * sin(uTime + vPos.y * 4.0);
            gl_FragColor = vec4(base, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// --- Iridescent Torus Knot Component ---
function IridescentKnot({ y = -14 }) {
  const ref = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = getScroll();
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.25 + getScroll() * 4;
      ref.current.rotation.y = state.clock.elapsedTime * 0.35;
      ref.current.position.y = y + Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
    }
  });

  return (
    <mesh ref={ref} position={[0, y, -2]} scale={2.2}>
      <torusKnotGeometry args={[1, 0.32, 220, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal; varying vec3 vView;
          void main(){
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform float uTime; uniform float uScroll;
          varying vec3 vNormal; varying vec3 vView;
          vec3 iridescent(float t){
            vec3 a=vec3(0.5); vec3 b=vec3(0.5); vec3 c=vec3(1.0);
            vec3 d=vec3(0.10, 0.33, 0.67);
            return a + b*cos(6.28318*(c*t+d));
          }
          void main(){
            float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 1.4);
            float t = f + uTime * 0.05 + uScroll * 0.6;
            vec3 col = iridescent(t);
            col += 0.2 * pow(f, 3.0);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// --- Wireframe Scroll Rings Component ---
function ScrollRings({ y = -8 }) {
  const g = useRef();
  useFrame((state) => {
    if (!g.current) return;
    const s = getScroll();
    g.current.rotation.x = state.clock.elapsedTime * 0.1 + s * 6;
    g.current.rotation.y = state.clock.elapsedTime * 0.15;
    g.current.position.y = y;
  });

  const rings = [
    { r: 3.2, tube: 0.02, color: '#ff8b4a', rot: [0, 0, 0] },
    { r: 3.6, tube: 0.015, color: '#7ab7ff', rot: [Math.PI / 2.5, 0, 0] },
    { r: 4.0, tube: 0.012, color: '#ffffff', rot: [Math.PI / 4, Math.PI / 5, 0] },
    { r: 4.5, tube: 0.008, color: '#ff6a2b', rot: [0, Math.PI / 3, Math.PI / 4] }
  ];

  return (
    <group ref={g} position={[0, y, -3]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r.rot}>
          <torusGeometry args={[r.r, r.tube, 8, 220]} />
          <meshBasicMaterial color={r.color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// --- Floating Crystals Grid Component ---
function FloatingCrystals({ y = -22, count = 24 }) {
  const g = useRef();
  const items = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    p: [
      (Math.random() - 0.5) * 26,
      y + (Math.random() - 0.5) * 6,
      -3 - Math.random() * 6
    ],
    s: 0.15 + Math.random() * 0.35,
    seed: Math.random(),
    type: Math.floor(Math.random() * 3)
  })), [count, y]);

  useFrame((state) => {
    if (!g.current) return;
    g.current.children.forEach((c, idx) => {
      const s = items[idx].seed;
      c.rotation.x = state.clock.elapsedTime * (0.2 + s * 0.5);
      c.rotation.y = state.clock.elapsedTime * (0.15 + s * 0.4);
      c.position.y = items[idx].p[1] + Math.sin(state.clock.elapsedTime * (0.5 + s) + s * 6.28) * 0.4;
    });
  });

  return (
    <group ref={g}>
      {items.map((it, i) => (
        <mesh key={i} position={it.p} scale={it.s}>
          {it.type === 0 && <octahedronGeometry args={[1, 0]} />}
          {it.type === 1 && <tetrahedronGeometry args={[1, 0]} />}
          {it.type === 2 && <dodecahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial
            color={i % 2 ? '#ff8b4a' : '#7ab7ff'}
            metalness={0.8}
            roughness={0.15}
            emissive={i % 2 ? '#ff6a2b' : '#3a6cff'}
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

// --- Finale Sphere Component ---
function FinaleSphere({ y = -34 }) {
  const ref = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uColor: { value: new THREE.Color('#ff8b4a') }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = getScroll();
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.position.y = y;
    }
  });

  return (
    <mesh ref={ref} position={[0, y, -4]} scale={2.8}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime; uniform float uScroll;
          varying vec3 vN; varying vec3 vP;
          void main(){
            vN = normal;
            float t = uTime * 0.4;
            float a = sin(position.x * 4.0 + t) * 0.06;
            float b = cos(position.y * 5.0 - t) * 0.06;
            float c = sin(position.z * 6.0 + t) * 0.06;
            vec3 p = position + normal * (a + b + c) * (1.0 + uScroll * 1.2);
            vP = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor; uniform float uTime;
          varying vec3 vN; varying vec3 vP;
          void main(){
            float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0,0.0,1.0))), 2.0);
            vec3 c1 = uColor;
            vec3 c2 = vec3(0.48, 0.72, 1.0);
            vec3 col = mix(c2, c1, rim);
            col += rim * 0.7;
            col += 0.05 * sin(uTime + vP.y * 5.0);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// --- Mouse Light Component ---
function MouseLight() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const s = getScroll();
    const target = new THREE.Vector3(state.mouse.x * 6, state.mouse.y * 4 - s * 30, 3);
    ref.current.position.lerp(target, 0.08);
  });
  return <pointLight ref={ref} intensity={4.5} distance={22} color='#ff8b4a' />;
}

// --- Camera Rig Component ---
function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    const s = getScroll();
    const targetX = state.mouse.x * 0.9;
    const targetY = -state.mouse.y * 0.5 - s * 30;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    const z = 8 - Math.sin(s * Math.PI * 2) * 2.5;
    camera.position.z += (z - camera.position.z) * 0.05;
    target.set(0, -s * 30, 0);
    camera.lookAt(target);
  });
  return null;
}

// --- HeroScene Main Component ---
export default function HeroScene() {
  return (
    <div className="webgl-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8], fov: 55 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 30]} />
        <ambientLight intensity={0.18} />
        <MouseLight />
        <pointLight position={[-6, -4, -3]} color='#7ab7ff' intensity={2.2} distance={22} />
        <pointLight position={[8, 6, 4]} color='#ff8b4a' intensity={1.6} distance={22} />
        <Suspense fallback={null}>
          <ParticleField />
          <DistortSculpture position={[-2.4, 0.3, -0.4]} scale={1.4} color="#ff8b4a" speed={0.35} />
          <DistortSculpture position={[2.8, -0.4, -1]} scale={0.9} color="#7ab7ff" speed={0.55} />
          <DistortSculpture position={[0.5, 1.7, -2.5]} scale={0.55} color="#ffffff" speed={0.7} />
          <DistortSculpture position={[-3.4, -1.6, -2.8]} scale={0.5} color="#ff6a2b" speed={0.9} />
          <ScrollRings y={-8} />
          <DistortSculpture position={[-4.5, -8, -1]} scale={0.7} color="#7ab7ff" speed={0.5} wireframe />
          <DistortSculpture position={[4.5, -8.5, -1]} scale={0.6} color="#ff8b4a" speed={0.6} wireframe />
          <IridescentKnot y={-14} />
          <FloatingCrystals y={-22} count={30} />
          <FinaleSphere y={-32} />
        </Suspense>
        <CameraRig />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.05} luminanceThreshold={0.12} luminanceSmoothing={0.9} mipmapBlur radius={0.85} />
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={2.5} height={480} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0007, 0.0012]} />
          <Noise opacity={0.06} premultiply />
          <Vignette eskil={false} offset={0.22} darkness={0.92} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
