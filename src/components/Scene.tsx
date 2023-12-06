import { Suspense } from 'react'
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
// import { PointerLockControls } from '@react-three/drei';
import CarLoader from './loaders/CarLoader';
import Loader from './loaders/Loader';
import { Model } from './loaders/James';

const car1 = new URL("../../public/assets/aventador/scene.gltf",import.meta.url);
const car2 = new URL("../../public/assets/aventador2/scene.gltf",import.meta.url);
const car3 = new URL("../../public/assets/urus/scene.gltf",import.meta.url);
const car4 = new URL("../../public/assets/vision/scene.gltf",import.meta.url);
const carSound1 = new URL('../../public/assets/sound/aventador_sound.mp3',import.meta.url);
const carSound2 = new URL('../../public/assets/sound/urus_sound.mp3',import.meta.url);

const Plane = () => {
  return (
    <mesh receiveShadow={true} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={0xd6d6d6} side={THREE.DoubleSide} />
    </mesh>
  );
};

interface SpotLightProps {
  x:number,
  y:number,
  z:number,
  angleProp:boolean,
}
const SpotLight = ({x,y,z,angleProp}:SpotLightProps) => (
    <spotLight
        color={0xffffff}
        intensity={100}
        position={[x,y,z]}
        castShadow={true}
        shadow-mapSize = {[2048,2048]}
        distance={6}
        angle ={angleProp ? Math.PI / 2 : undefined }
        penumbra={0.1}
        decay={1}
    />
)

const Scene = () => {

  return (
    <Canvas
        onCreated={({gl})=>{
            // Renderer
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        camera={{
          fov: 90, near: 0.1, far: 100, position: [0,2,7]
        }}
        shadows
    >
        {/* Scene */}
        <scene background={new THREE.Color(0xffffff)}>

            {/* Textures */}
            {/* <primitive object={new THREE.TextureLoader().load('../../public/assets/logo.png')} /> */}

            {/* Camera */}
            {/* <perspectiveCamera 
                fov={80}
                aspect={window.innerWidth / window.innerHeight}
                near={0.1} // default
                far={100}
                position={[0,2,5]}
            /> */}

            {/* Lights */}
            {/* <ambientLight color={0xffffff} intensity={0.5} /> */}
            <directionalLight
                color={0xffffff}
                intensity={3}
                position={[0,10,20]}
                // castShadow={true}
                // shadow-mapSize = {[1024,1024]}
                // scale={[3,3,3]}
            />
            <SpotLight x={-2} y={5} z={2} angleProp={false} />
            <SpotLight x={2} y={5} z={2} angleProp={false} />
            <SpotLight x={-2} y={5} z={-4} angleProp={true} />
            <SpotLight x={2} y={5} z={-4} angleProp={true} />

            <Suspense fallback={<Loader/>}>
                {/* Orbit Controls used in james Component. */}
                {/* <OrbitControls
                    // Dont set this, camera does not follow the character, gets stuck.
                    enableDamping
                    minDistance={4}
                    maxDistance={6}
                    enablePan={false}
                    maxPolarAngle={1.4}
                /> */}
                
                    {/* Plane */}
                    <Plane/>

                    {/* for first person */}
                    {/* <PointerLockControls/>  */}

                    {/* Load Character */}
                    <Model />

                    {/* Load Cars */}
                    <group>
                        <CarLoader modelPath={car1.href} x={2} y={0} z={2} url={carSound1.href} />
                        <CarLoader modelPath={car2.href} x={-2} y={0} z={2} url={carSound1.href} />
                        <CarLoader modelPath={car3.href} x={2} y={0.8} z={-4} url={carSound2.href} />
                        <CarLoader modelPath={car4.href} x={-2} y={0} z={-2} url={carSound1.href} />
                    </group>
            </Suspense>
        </scene>
    </Canvas>
  )
}

export default Scene