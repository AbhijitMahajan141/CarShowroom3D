import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useBox } from '@react-three/cannon'
import useInput from '../controls/useInput'
import { useThree } from '@react-three/fiber'
import { characterMovement } from '../controls/CharacterControls'

const james = new URL("../../james.glb",import.meta.url);

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

  const {forward,back,left,right,shift} = useInput(); // character movement

  const group = useRef<THREE.Group>(new THREE.Group)
  const { nodes, materials, animations } = useGLTF(james.href) as GLTFResult
  
  // const { actions } = useAnimations<GLTFAction>(animations, group)
  const { actions }: { actions: Record<ActionName, THREE.AnimationAction | null> } = useAnimations<GLTFAction>(animations, group)

  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 0, 0], // Adjust the position as needed
    args: [1, 1, 1], // Adjust the size of the box
    type:"Kinematic"
  }));

  // Character Movement Code
  const currentAction = useRef<ActionName>("idle");
  const controlsRef = useRef<typeof OrbitControls>();
  const {camera} = useThree();// Returns the camera of the scene
  

  useEffect(()=>{
    actions.idle?.play()
    let action: ActionName;
    if(forward || back || left || right){
      action = "walk";
      if(shift){
        action = "run";
      }
    }else{
      action = 'idle'
    }

    if(currentAction.current != action){
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current]
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
  },
  [forward,back,left,right,shift]
  )

  // useFrame((_,delta)=>{
    characterMovement({currentAction,controlsRef,camera,group})
  // })

  return (
    // <>
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" ref={ref as any}>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <OrbitControls 
            ref={controlsRef as any}  
            enableDamping
            minDistance={4}
            maxDistance={6}
            enablePan={false}
            maxPolarAngle={1.4}
          />
          <primitive object={nodes.mixamorig9Hips} />
          <group name="Ch06">
            <skinnedMesh name="Mesh001" geometry={nodes.Mesh001.geometry} material={materials['Ch06_body.001']} skeleton={nodes.Mesh001.skeleton} castShadow={true} receiveShadow />
            <skinnedMesh name="Mesh001_1" geometry={nodes.Mesh001_1.geometry} material={materials['Ch06_eyelashes.001']} skeleton={nodes.Mesh001_1.skeleton} castShadow={true} receiveShadow />
            <skinnedMesh name="Mesh001_2" geometry={nodes.Mesh001_2.geometry} material={materials['Ch06_body1.001']} skeleton={nodes.Mesh001_2.skeleton} castShadow={true} receiveShadow />
          </group>
        </group>
      </group>
    </group>
    // </>
  )
}

useGLTF.preload(james.href)
