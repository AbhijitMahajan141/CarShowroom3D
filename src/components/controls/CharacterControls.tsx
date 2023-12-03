import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { A, D, DIRECTIONS, S, W } from "../Utils.tsx";

export class characterControls {

    model: THREE.Group
    mixer: THREE.AnimationMixer
    animationsMap: Map<string, THREE.AnimationAction> = new Map() // Walk, Run, Idle
    orbitControl!: OrbitControls;
    camera: THREE.Camera

  toggleRun: boolean = false;
  currentAction: string;

  // Temp Data
  walkDirection = new THREE.Vector3();
  rotateAngle = new THREE.Vector3(0, 1, 0);
  rotateQuarternion = new THREE.Quaternion();
  cameraTarget = new THREE.Vector3();

  // constants
  fadeDuration: number = 0.2;
  runVelocity = 5;
  walkVelocity = 1;

  constructor(
    model: THREE.Group,
    mixer: THREE.AnimationMixer, 
    animationsMap: Map<string, THREE.AnimationAction>,
    orbitControl: OrbitControls, 
    camera: THREE.Camera,
    currentAction: string
  ) {
    this.model = model;
    this.mixer = mixer;
    this.animationsMap = animationsMap;
    this.currentAction = currentAction;
    this.animationsMap.forEach((value, key) => {
      if (key === currentAction) {
        value.play();
      }
    });

    this.orbitControl = orbitControl;
    this.camera = camera;

    this.updateCameraTarget(0, 0);
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }

  // The update function is called every frame in animation loop
  // to calculate next state, movement speed, directions and update animations with animation mixer
  public update(delta:number, keysPressed:any) {
    // Checks if any directional key is pressed w a s d
    const directionPressed = DIRECTIONS.some((key) => keysPressed[key] == true);

    // If any key is pressed we switch to walk or Idle
    var play = "";
    if (directionPressed && this.toggleRun) {
      play = "Run";
    } else if (directionPressed) {
      play = "Walk";
    } else {
      play = "Idle";
    }

    // Check if currentAction is not same as play (EG. Walk != Idle - true)
    // If this expression is true then we need to make a Animation transition
    if (this.currentAction !== play) {
      // Get the current and next animation action from animationsMap
      const toPlay = this.animationsMap.get(play);
      const current = this.animationsMap.get(this.currentAction);

      // Fadeout the current animation & Fadein next for smooth Transition
      current?.fadeOut(this.fadeDuration);
      toPlay?.reset().fadeIn(this.fadeDuration).play();

      // Storing the new State
      this.currentAction = play;
    }

    // We call the mixer's update method and pass delta time.
    // This allows the model to play the state else T pose is displayed.
    this.mixer.update(delta);

    // we need to turn character when in below states
    if (this.currentAction == "Run" || this.currentAction == "Walk") {
      // Calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        // Must declare in the below order or else character will not rotate properly
        this.model.position.x - this.camera.position.x,
        this.model.position.z - this.camera.position.z
      );

      // Diagonal movement angle offset
      var directionOffset = this.directionOffset(keysPressed);

      // Rotating model towards direction step wise for smooth transition
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

      // Calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // run/walk Velocity
      const velocity =
        this.currentAction == "Run" ? this.runVelocity : this.walkVelocity;

      // Move model and camera
      const moveX = this.walkDirection.x * velocity * delta;
      const moveZ = this.walkDirection.z * velocity * delta;
      this.model.position.x += moveX;
      this.model.position.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
    }
  }

  updateCameraTarget(moveX: number, moveZ: number) {
    // Move Camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    // Update Camera Target
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControl.target = this.cameraTarget;
  }

  // Method to calculate Offset for each key pressed and diagonals
  directionOffset(keysPressed: any) {
    var directionOffset = 0; // w

    if (keysPressed[W]) {
      if (keysPressed[A]) {
        directionOffset = Math.PI / 4; // w+a
      } else if (keysPressed[D]) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (keysPressed[S]) {
      if (keysPressed[A]) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (keysPressed[D]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (keysPressed[A]) {
      directionOffset = Math.PI / 2; // a
    } else if (keysPressed[D]) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  }
}
