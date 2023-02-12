import * as BABYLON from "babylonjs";
import { convertToRadians } from "../utils";
import { convertCoordsBlockToCoords, convertShapeBlockToMesh } from "../world";

const restoreCameraState = (camera: BABYLON.Camera, state: any) => {
  if (camera instanceof BABYLON.ArcRotateCamera) {
    camera.alpha = state.alpha;
    camera.beta = state.beta;
    camera.radius = state.radius;
  }
  if (camera instanceof BABYLON.UniversalCamera) {
    camera.position = new BABYLON.Vector3(state.position[0], state.position[1], state.position[2]);
    camera.rotation = new BABYLON.Vector3(state.rotation[0], state.rotation[1], state.rotation[2]);
  }
  if (camera instanceof BABYLON.FollowCamera) {
    camera.position = new BABYLON.Vector3(state.position[0], state.position[1], state.position[2]);
  }
  if (camera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
    camera.position = new BABYLON.Vector3(state.position[0], state.position[1], state.position[2]);
  }
};

const createCamera = (cameraType: string, camera: BABYLON.Camera, scene: BABYLON.Scene, canvas: HTMLElement) => {
  let cameraState: any;
  switch (cameraType) {
    case "ArcRotate":
      if (camera instanceof BABYLON.ArcRotateCamera) {
        cameraState = camera.serialize();
      } else {
        cameraState = null;
      }
      scene.removeCamera(scene.getCameraById("camera"));
      camera = new BABYLON.ArcRotateCamera(
        "camera",
        BABYLON.Tools.ToRadians(-90),
        BABYLON.Tools.ToRadians(65),
        5,
        BABYLON.Vector3.Zero(),
        scene
      );
      break;
    case "UniversalCamera":
      if (camera instanceof BABYLON.UniversalCamera) {
        cameraState = camera.serialize();
      } else {
        cameraState = null;
      }
      scene.removeCamera(scene.getCameraById("camera"));
      camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 10, -100), scene);
      break;
    case "FollowCamera":
      if (camera instanceof BABYLON.FollowCamera) {
        cameraState = camera.serialize();
      } else {
        cameraState = null;
      }
      scene.removeCamera(scene.getCameraById("camera"));
      camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 10, -100), scene);
      break;
    case "VRDeviceOrientationFreeCamera":
      if (camera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
        cameraState = camera.serialize();
      } else {
        cameraState = null;
      }
      scene.removeCamera(scene.getCameraById("camera"));
      camera = new BABYLON.VRDeviceOrientationFreeCamera("camera", new BABYLON.Vector3(0, 1, -3), scene);
      break;
  }
  camera.attachControl(canvas, true);
  if (cameraState) restoreCameraState(camera, cameraState);
  return camera;
};

// Move the camera to a new position
const moveCamera = (coordsBlock: CoordsBlock, camera: BABYLON.Camera) => {
  let coords = convertCoordsBlockToCoords(coordsBlock);
  if (coords) {
    if (camera instanceof BABYLON.ArcRotateCamera) {
      camera.setPosition(new BABYLON.Vector3(coords.x, coords.y, coords.z));
    }
    if (camera instanceof BABYLON.UniversalCamera) {
      camera.position = new BABYLON.Vector3(coords.x, coords.y, coords.z);
    }
  }
};

// Move the camera along an axis
const moveCameraAlong = (axis: string, units: number, camera: BABYLON.Camera) => {
  if (camera instanceof BABYLON.ArcRotateCamera) {
    switch (axis) {
      case "x":
        camera.alpha += convertToRadians(units);
        break;
      case "y":
        camera.beta += convertToRadians(units);
        break;
      case "z":
        camera.radius += convertToRadians(units);
        break;
    }
  }
  if (camera instanceof BABYLON.UniversalCamera) {
    camera.position[axis] = camera.position[axis] += units;
  }
  if (camera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
    camera.position[axis] = camera.position[axis] += units;
  }
};

// Point the camera towards a shape
const pointCameraTowards = (shapeBlock: ShapeBlock, camera: BABYLON.Camera, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh) {
    if (camera instanceof BABYLON.FollowCamera) {
      camera.lockedTarget = mesh;
    }
    if (camera instanceof BABYLON.UniversalCamera) {
      camera.target = mesh.position;
    }
    if (camera instanceof BABYLON.ArcRotateCamera) {
      camera.focusOn([mesh], true);
    }
  }
};

// Set the camera distance for follow cameras
const keepDistanceOf = (units: number, camera: BABYLON.Camera) => {
  if (camera instanceof BABYLON.FollowCamera) {
    camera.radius = units;
  }
  if (camera instanceof BABYLON.ArcRotateCamera) {
    camera.radius = units;
  }
};

export { createCamera, moveCamera, moveCameraAlong, pointCameraTowards, keepDistanceOf };
