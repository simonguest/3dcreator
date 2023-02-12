import * as BABYLON from "babylonjs";

import { convertShapeBlockToMesh } from "../world";

// Sets overall gravity for the scene
const setGravity = (units: number, scene: BABYLON.Scene) => {
  if (scene.isPhysicsEnabled()) {
    scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(0, 0 - units, 0));
  }
};

// Apply a force to a shape
const applyForce = (shapeBlock: ShapeBlock, axis: string, units: number, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh && scene.isPhysicsEnabled() === true) {
    let vector = { x: 0, y: 0, z: 0 };
    vector[axis] = units;
    let direction = new BABYLON.Vector3(vector.x, vector.y, vector.z);
    if (mesh.physicsImpostor) {
      mesh.physicsImpostor.applyForce(direction.scale(50), mesh.getAbsolutePosition());
    }
  }
};

// Set the mass of a shape
const setMass = (shapeBlock: ShapeBlock, mass: number, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh && scene.isPhysicsEnabled() === true) {
    mesh.physicsImpostor.mass = mass;
  }
};

export { setGravity, applyForce, setMass };