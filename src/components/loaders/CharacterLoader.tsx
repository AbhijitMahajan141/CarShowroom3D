// import React from 'react'
import { useFBX } from '@react-three/drei';
// import { useLoader } from '@react-three/fiber';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import { useEffect, useRef } from 'react';
// import { characterControls } from '../controls/CharacterControls';
// import THREE from 'three';

const jamesIdle = new URL(
  "../../assets/character/jamesIdleSkin.fbx",
  import.meta.url
);
// const jamesWalk = new URL(
//   "../../assets/character/jamesWalk.fbx",
//   import.meta.url
// );
// const jamesRun = new URL(
//   "../../assets/character/jamesRunSpot.fbx",
//   import.meta.url
// );

function CharacterLoader() {
  let james = useFBX(jamesIdle.href)
  james.traverse((c) => {
    c.castShadow = true;
    c.receiveShadow = true;
  })
  james.scale.setScalar(0.01);
  james.position.set(0,0,0);
  return <primitive object={james} />
}

export default CharacterLoader