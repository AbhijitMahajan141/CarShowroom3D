import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useBox } from '@react-three/cannon'

type GLTFResult = GLTF & {
  nodes: {
    Mesh001: THREE.SkinnedMesh
    Mesh001_1: THREE.SkinnedMesh
    Mesh001_2: THREE.SkinnedMesh
    mixamorig9Hips: THREE.Bone
  }
  materials: {
    ['Ch06_body.001']: THREE.MeshStandardMaterial
    ['Ch06_eyelashes.001']: THREE.MeshStandardMaterial
    ['Ch06_body1.001']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[];
}

type ActionName = 'idle' | 'run' | 'walk'
interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

// type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['skinnedMesh'] | JSX.IntrinsicElements['bone']>>

export function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(new THREE.Group)
  const { nodes, materials, animations } = useGLTF('/james.glb') as GLTFResult
  const { actions } = useAnimations<GLTFAction>(animations, group)

  useEffect(()=>{
    actions.idle?.play()
  })

  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 0, 0], // Adjust the position as needed
    // args: [1, 1, 1], // Adjust the size of the box
    type:"Static"
  }));

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" ref={ref as any}>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorig9Hips} />
          <group name="Ch06">
            <skinnedMesh name="Mesh001" geometry={nodes.Mesh001.geometry} material={materials['Ch06_body.001']} skeleton={nodes.Mesh001.skeleton} castShadow={true} receiveShadow />
            <skinnedMesh name="Mesh001_1" geometry={nodes.Mesh001_1.geometry} material={materials['Ch06_eyelashes.001']} skeleton={nodes.Mesh001_1.skeleton} castShadow={true} receiveShadow />
            <skinnedMesh name="Mesh001_2" geometry={nodes.Mesh001_2.geometry} material={materials['Ch06_body1.001']} skeleton={nodes.Mesh001_2.skeleton} castShadow={true} receiveShadow />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/james.glb')
