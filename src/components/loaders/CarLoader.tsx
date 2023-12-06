import { useRef} from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
  useBox,
} from '@react-three/cannon'
import { PositionalAudio } from '@react-three/drei';

interface CarLoaderProps  {
    modelPath:string,
    x:number,
    y:number,
    z:number,
    url:string
}
const CarLoader = ({modelPath,x,y,z,url}:CarLoaderProps) => {

    const [ref] = useBox(()=>({
        mass:150,
        position:[x,y,z],
        args:[2,2.3,5],
        type:'Static'
    }))

    const audioRef = useRef();

    const handleCarClick = () => {
    if (audioRef.current && (audioRef.current as any).isPlaying === false) {
        (audioRef.current as any).play();
    }else{
        (audioRef.current as any).stop();
    }
  };

    const result = useLoader(
        GLTFLoader,
        modelPath,
        (loader)=>{
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco-gltf/');
        loader.setDRACOLoader(dracoLoader); 
    })

    result.scene.traverse((child)=>{
        child.castShadow = true;
        child.receiveShadow = true;
    })
    
    return (
    <group  onClick={handleCarClick}>
      <primitive position={[x, y, z]} object={result.scene} ref={ref} />
      {/* Add a PositionalAudio component */}
      <PositionalAudio
        url={url}
        distance={10}
        loop={false}
        ref={(ref) => (audioRef.current = ref as any)}
      />
    </group>
        // <primitive onClick={handleCarClick} object={result.scene} ref={ref} position={[x,y,z]} scale={[1,1,1]} />
    )
}

export default CarLoader