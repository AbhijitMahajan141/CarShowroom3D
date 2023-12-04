// import React from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
  useBox,
} from '@react-three/cannon'

interface CarLoaderProps  {
    modelPath:string,
    x:number,
    y:number,
    z:number
}
const CarLoader = ({modelPath,x,y,z}:CarLoaderProps) => {

    const [ref] = useBox(()=>({
        mass:150,
        position:[x,y,z],
        args:[1,1,1],
        type:'Static'
    }))

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

    return <primitive object={result.scene} ref={ref} position={[x,y,z]} scale={[1,1,1]} />
}

export default CarLoader