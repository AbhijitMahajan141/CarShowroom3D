import * as THREE from 'three'
import useInput from './useInput';
import { useFrame } from '@react-three/fiber';

// Temp Data
let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuarternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

const directionOffset = ({forward,back,left,right}:any) => {
    var directionOffset = 0; // w

    if (forward) {
      if (left) {
        directionOffset = Math.PI / 4; // w+a
      } else if (right) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (back) {
      if (left) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (right) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (left) {
      directionOffset = Math.PI / 2; // a
    } else if (right) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  }

export const characterMovement = ({currentAction,controlsRef,camera,group}:any) => {
  
  const {forward,back,left,right} = useInput();

  const updateCameraTarget = (moveX: number, moveZ: number) => {
    // Move Camera
    camera.position.x += moveX;
    camera.position.z += moveZ;

    // Update Camera Target
    cameraTarget.x = group.current.position.x;
    cameraTarget.y = group.current.position.y;
    cameraTarget.z = group.current.position.z;
    controlsRef.current.target = cameraTarget;
    
  }
  
  useFrame((_,delta)=>{
    updateCameraTarget(0,0)
    if(currentAction.current == 'run' || currentAction.current == 'walk'){
      var angleYCameraDirection = Math.atan2(
        // Must declare in the below order or else character will not rotate properly
        group.current.position.x - camera.position.x,
        group.current.position.z - camera.position.z
      );

      let newDirectionalOffset = directionOffset({
        forward,back,left,right
      });

      // Rotating model towards direction step wise for smooth transition
      rotateQuarternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionalOffset
      );
      group.current.quaternion.rotateTowards(rotateQuarternion, 0.2);

      // Calculate direction
      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotateAngle, newDirectionalOffset);

      // Run/walk velocity
      const velocity = currentAction.current == 'run' ? 5: 1;

      // move model & camera
      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      group.current.position.x += moveX;
      group.current.position.z += moveZ;
      updateCameraTarget(moveX, moveZ);
    }
  
  })

}

