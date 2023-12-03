import { Suspense } from 'react'
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import CarLoader from './loaders/CarLoader';
import Loader from './loaders/Loader';
import { Model } from './loaders/James';
import {
  Physics,
  usePlane,
} from '@react-three/cannon'

const car1 = new URL("../../public/assets/aventador/scene.gltf",import.meta.url);
const car2 = new URL("../../public/assets/aventador2/scene.gltf",import.meta.url);
const car3 = new URL("../../public/assets/urus/scene.gltf",import.meta.url);
const car4 = new URL("../../public/assets/vision/scene.gltf",import.meta.url);

const Plane = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Ensure the plane is horizontal
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as any} receiveShadow={true}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={0xd6d6d6} side={THREE.DoubleSide} />
    </mesh>
  );
};

const Scene = () => {

  return (
    <Canvas
        onCreated={({gl})=>{
            // Renderer
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
    >
        {/* Scene */}
        <scene background={new THREE.Color(0xffffff)}>

            {/* Textures */}
            {/* <primitive object={new THREE.TextureLoader().load('./assets/img.png')} /> */}

            {/* Camera */}
            <perspectiveCamera 
                fov={80}
                aspect={window.innerWidth / window.innerHeight}
                near={0.1} // default
                far={100}
                position={[0,1,1]}
            />

            {/* Lights */}
            <ambientLight color={0xffffff} intensity={0.5} />
            <directionalLight
                color={0xffffff}
                intensity={20}
                position={[5,10,20]}
                castShadow={true}
                shadow-mapSize = {[1024,1024]}
                // scale={[3,3,3]}
            />
            {/* <primitive object={new THREE.CameraHelper(dirL)} /> */}

            <Suspense fallback={<Loader/>}>
                {/* Orbit Controls */}
                <OrbitControls
                    enableDamping
                    minDistance={4}
                    maxDistance={6}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2 - 0.5}
                />
                
                <Physics>

                    {/* Plane */}
                    <Plane/>

                    {/* Load Cars */}
                    <group>
                        <CarLoader modelPath={car1.href} x={2} y={0} z={0} />
                        <CarLoader modelPath={car2.href} x={-2} y={0} z={0} />
                        <CarLoader modelPath={car3.href} x={2} y={0.8} z={-6} />
                        <CarLoader modelPath={car4.href} x={-2} y={0} z={-4} />
                    </group>

                    {/* Load Character */}
                    <Model />

                </Physics>
            </Suspense>
        </scene>
    </Canvas>
  )
}

export default Scene