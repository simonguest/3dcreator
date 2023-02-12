import * as BABYLON from "babylonjs";

import { setMaterial } from "../materials";
import { convertToRadians } from "../utils";

const convertCoordsBlockToCoords = (coordsBlock: CoordsBlock) => {
  if (!coordsBlock) return null;
  if (!coordsBlock[0]) return null;
  let coords = coordsBlock[0];
  if (coords === null) return null;
  return coords;
};

const convertShapeBlockToShape = (shapeBlock: ShapeBlock) => {
  if (!shapeBlock) return null;
  if (!shapeBlock[0]) return null;
  let shape = shapeBlock[0];
  if (shape === null) return null;
  return shape;
};

const convertShapeBlockToMesh = (shapeBlock: ShapeBlock, scene: BABYLON.Scene) => {
  if (!shapeBlock) return null;
  if (!shapeBlock[0]) return null;
  let shape = shapeBlock[0];
  if (shape === null) return null;
  let mesh = scene.getMeshById(shape.id);
  return mesh;
};

// Creates a torus
const createTorus = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let torus = BABYLON.MeshBuilder.CreateTorus(shape.id, {
    diameter: shape.size.d,
    thickness: shape.size.t,
    tessellation: shape.size.s,
  });
  torus.position.x = coords.x;
  torus.position.y = coords.y;
  torus.position.z = coords.z;
  setMaterial(torus, shape.material, scene);
  torus.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(torus.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    torus.physicsImpostor = new BABYLON.PhysicsImpostor(
      torus,
      BABYLON.PhysicsImpostor.ConvexHullImpostor,
      { mass: 1, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates a ramp from a triangle shape
const createRamp = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  // Halve the w, h, and l to position the triangle in the middle prior to extrusion
  let width = shape.size.w / 2;
  let height = shape.size.h / 2;
  let length = shape.size.l / 2;
  var triangle = [
    new BABYLON.Vector3(0 - width, 0 - height, 0),
    new BABYLON.Vector3(width, 0 - height, 0),
    new BABYLON.Vector3(width, height, 0),
  ];
  triangle.push(triangle[0]);
  let extrudePath = [new BABYLON.Vector3(0, 0, 0 - length), new BABYLON.Vector3(0, 0, length)];
  let ramp = BABYLON.MeshBuilder.ExtrudeShape(
    shape.id,
    { shape: triangle, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL },
    scene
  );
  ramp.position.x = coords.x;
  ramp.position.y = coords.y;
  ramp.position.z = coords.z;
  setMaterial(ramp, shape.material, scene);
  ramp.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(ramp.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    ramp.physicsImpostor = new BABYLON.PhysicsImpostor(ramp, BABYLON.PhysicsImpostor.ConvexHullImpostor, {
      mass: 1,
      restitution: 0.7,
      friction: 1.0,
    });
  }
};

// Creates a capsule shape
const createCapsule = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let capsule = BABYLON.MeshBuilder.CreateCapsule(shape.id, {
    height: shape.size.h,
    radius: shape.size.d / 2,
  });
  capsule.position.x = coords.x;
  capsule.position.y = coords.y;
  capsule.position.z = coords.z;
  setMaterial(capsule, shape.material, scene);
  capsule.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(capsule.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    capsule.physicsImpostor = new BABYLON.PhysicsImpostor(
      capsule,
      BABYLON.PhysicsImpostor.CapsuleImpostor,
      { mass: 1, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates a cone with a base and a top
const createCone = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let cone = BABYLON.MeshBuilder.CreateCylinder(shape.id, {
    height: shape.size.h,
    diameterTop: shape.size.t,
    diameterBottom: shape.size.b,
  });
  cone.position.x = coords.x;
  cone.position.y = coords.y;
  cone.position.z = coords.z;
  setMaterial(cone, shape.material, scene);
  cone.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(cone.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    cone.physicsImpostor = new BABYLON.PhysicsImpostor(
      cone,
      BABYLON.PhysicsImpostor.ConvexHullImpostor,
      { mass: 1, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates a cylinder
const createCylinder = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let cylinder = BABYLON.MeshBuilder.CreateCylinder(shape.id, {
    height: shape.size.h,
    diameter: shape.size.d,
  });
  cylinder.position.x = coords.x;
  cylinder.position.y = coords.y;
  cylinder.position.z = coords.z;
  setMaterial(cylinder, shape.material, scene);
  cylinder.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(cylinder.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(
      cylinder,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      { mass: 1, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates a box
const createBox = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let box = BABYLON.MeshBuilder.CreateBox(shape.id, {
    height: shape.size.h,
    width: shape.size.w,
    depth: shape.size.l,
  });
  box.position.x = coords.x;
  box.position.y = coords.y;
  box.position.z = coords.z;
  setMaterial(box, shape.material, scene);
  box.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(box.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates a wall
const createWall = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let wall = BABYLON.MeshBuilder.CreateTiledPlane(shape.id, {
    height: shape.size.h,
    width: shape.size.w,
    tileSize: shape.size.s,
  });
  wall.position.x = coords.x;
  wall.position.y = coords.y;
  wall.position.z = coords.z;
  if (shape.size.r < 0) shape.size.r = 0;
  if (shape.size.r > 360) shape.size.r = 360;
  wall.rotation.y = convertToRadians(shape.size.r);
  setMaterial(wall, shape.material, scene);
  wall.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(wall.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    wall.physicsImpostor = new BABYLON.PhysicsImpostor(
      wall,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates a sphere
const createSphere = (
  shape: Shape,
  coords: Coords,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let sphere = BABYLON.MeshBuilder.CreateSphere(shape.id, {
    segments: 16,
    diameterX: shape.size.w,
    diameterY: shape.size.h,
    diameterZ: shape.size.l,
  });
  sphere.position.x = coords.x;
  sphere.position.y = coords.y;
  sphere.position.z = coords.z;
  setMaterial(sphere, shape.material, scene);
  sphere.actionManager = new BABYLON.ActionManager(scene);
  actionManagers.push(sphere.actionManager);
  if (scene.isPhysicsEnabled() === true) {
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.7, friction: 3 },
      scene
    );
    sphere.physicsImpostor.physicsBody.angularDamping = 0.4;
    sphere.physicsImpostor.physicsBody.linearDamping = 0.4;
  }
};

// Creates a shape
const createShape = (
  shapeBlock: ShapeBlock,
  coordsBlock: CoordsBlock,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let shape = convertShapeBlockToShape(shapeBlock);
  let coords = convertCoordsBlockToCoords(coordsBlock);

  if (shape && coords) {
    switch (shape.type) {
      case "sphere":
        createSphere(shape, coords, scene, actionManagers);
        break;
      case "box":
        createBox(shape, coords, scene, actionManagers);
        break;
      case "wall":
        createWall(shape, coords, scene, actionManagers);
        break;
      case "cylinder":
        createCylinder(shape, coords, scene, actionManagers);
        break;
      case "cone":
        createCone(shape, coords, scene, actionManagers);
        break;
      case "torus":
        createTorus(shape, coords, scene, actionManagers);
        break;
      case "capsule":
        createCapsule(shape, coords, scene, actionManagers);
        break;
      case "ramp":
        createRamp(shape, coords, scene, actionManagers);
        break;
    }
  }
};

// Returns the bounding box of a complex mesh
const getAxisAlignedBoundingInfo = (mesh: BABYLON.AbstractMesh, scene: BABYLON.Scene) => {
  let clone = mesh.clone("mesh", null);
  let vertices = clone.getVerticesData("position");
  let min = new BABYLON.Vector3(1e10, 1e10, 1e10),
    max = new BABYLON.Vector3(-1e10, -1e10, -1e10),
    m = clone.getWorldMatrix();

  let v = new BABYLON.Vector3();
  for (let i = 0; i < vertices.length / 3; ++i) {
    v.copyFromFloats(vertices[i * 3 + 0], vertices[i * 3 + 1], vertices[i * 3 + 2]);
    BABYLON.Vector3.TransformCoordinatesToRef(v, m, v);
    min.minimizeInPlace(v);
    max.maximizeInPlace(v);
  }
  let parent = new BABYLON.Mesh("parent", scene);
  parent.setBoundingInfo(new BABYLON.BoundingInfo(min, max));
  // DEBUG parent.showBoundingBox = true;
  clone.dispose();

  return new BABYLON.BoundingInfo(min, max);
};

// Adds a shape to a parent
const addTo = (
  childBlock: ShapeBlock,
  parentBlock: ShapeBlock,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  let child = convertShapeBlockToMesh(childBlock, scene);
  let parent = convertShapeBlockToMesh(parentBlock, scene);
  if (child && parent) {
    let parentAABB = getAxisAlignedBoundingInfo(parent, scene);
    let childAABB = getAxisAlignedBoundingInfo(child, scene);

    let aggMaxX = Math.max(parentAABB.maximum.x, childAABB.maximum.x);
    let aggMaxY = Math.max(parentAABB.maximum.y, childAABB.maximum.y);
    let aggMaxZ = Math.max(parentAABB.maximum.z, childAABB.maximum.z);
    let aggMinX = Math.min(parentAABB.minimum.x, childAABB.minimum.x);
    let aggMinY = Math.min(parentAABB.minimum.y, childAABB.minimum.y);
    let aggMinZ = Math.min(parentAABB.minimum.z, childAABB.minimum.z);
    let deltaX = (aggMinX + aggMaxX) / 2;
    let deltaY = (aggMinY + aggMaxY) / 2;
    let deltaZ = (aggMinZ + aggMaxZ) / 2;
    let deltaPosition = new BABYLON.Vector3(deltaX, deltaY, deltaZ);

    let newParentPosition = parent.position.subtract(deltaPosition);
    let newChildPosition = child.position.subtract(deltaPosition);

    parent.position = newParentPosition;
    child.position = newChildPosition;
    let mergedMesh = BABYLON.Mesh.MergeMeshes(
      [parent as BABYLON.Mesh, child as BABYLON.Mesh],
      true,
      true,
      undefined,
      false,
      true
    );
    mergedMesh.id = parent.id;
    mergedMesh.position = mergedMesh.position.add(deltaPosition);

    mergedMesh.actionManager = new BABYLON.ActionManager(scene);
    actionManagers.push(mergedMesh.actionManager);

    if (scene.isPhysicsEnabled() === true) {
      mergedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        mergedMesh,
        BABYLON.PhysicsImpostor.ConvexHullImpostor,
        { mass: 1, restitution: 0.1, friction: 1.0 },
        scene
      );
    }
  }
};

// Creates a shape and adds it to a parent
const createShapeAndAddTo = (
  shapeBlock: ShapeBlock,
  parent: ShapeBlock,
  coordsBlock: CoordsBlock,
  scene: BABYLON.Scene,
  actionManagers: BABYLON.AbstractActionManager[]
) => {
  createShape(shapeBlock, coordsBlock, scene, actionManagers);
  addTo(shapeBlock, parent, scene, actionManagers);
};

// Clone a shape into a new mesh and set the position
const clone = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  let coords = convertCoordsBlockToCoords(coordsBlock);
  if (mesh && coords) {
    let clonedMesh = mesh.clone(`${mesh.id}-clone`, null, null);
    clonedMesh.position.x = coords.x;
    clonedMesh.position.y = coords.y;
    clonedMesh.position.z = coords.z;
  }
};

// Remove a shape from the scene
const remove = (shapeBlock: ShapeBlock, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh) {
    // remove any physics imposters first
    if (mesh.physicsImpostor) {
      mesh.physicsImpostor.dispose();
    }
    scene.removeMesh(mesh);
  }
};

// Move a shape to a new position
const moveShape = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  let coords = convertCoordsBlockToCoords(coordsBlock);
  if (mesh && coords) {
    mesh.position.x = coords.x;
    mesh.position.y = coords.y;
    mesh.position.z = coords.z;
  }
};

// Move a shape along an axis
const moveShapeAlong = (shapeBlock: ShapeBlock, axis: string, steps: number, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh) {
    mesh.position[axis] += steps;
  }
};

// Rotate a shape
const rotate = (shapeBlock: ShapeBlock, axis: string, degrees: number, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh) {
    mesh.rotate(BABYLON.Axis[axis], convertToRadians(degrees));
  }
};

// Get the position of a shape
const getPosition = (shapeBlock: ShapeBlock, axis: string, scene: BABYLON.Scene) => {
  let mesh = convertShapeBlockToMesh(shapeBlock, scene);
  if (mesh) {
    return mesh.position[axis];
  }
};

// Creates the ground
const createGround = (shape: Shape, scene: BABYLON.Scene) => {
  // if (this.ground) this.ground.dispose();
  if (shape.tileSize <= 0) shape.tileSize = 1;
  let width = shape.size.w;
  let length = shape.size.l;
  let tileSize = shape.tileSize;

  let grid = {
    h: length / tileSize,
    w: width / tileSize,
  };

  let ground = BABYLON.MeshBuilder.CreateTiledGround(shape.id, {
    xmin: 0 - width / 2,
    zmin: 0 - length / 2,
    xmax: width / 2,
    zmax: length / 2,
    subdivisions: grid,
  });

  setMaterial(ground, shape.material, scene);
  if (scene.isPhysicsEnabled() === true) {
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.7, friction: 1.0 },
      scene
    );
  }
};

// Creates the skybox
const createSkybox = (skybox: Skybox, scene: BABYLON.Scene) => {
  scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(`./assets/env/${skybox.asset}.env`, scene);
  scene.createDefaultSkybox(scene.environmentTexture);
};

// Set the sky/background color
const setSkyColor = (color: string, scene: BABYLON.Scene) => {
  scene.clearColor = BABYLON.Color4.FromHexString(color);
};

export {
  createShape,
  createShapeAndAddTo,
  clone,
  remove,
  moveShape,
  moveShapeAlong,
  rotate,
  getPosition,
  createGround,
  createSkybox,
  setSkyColor,
  convertCoordsBlockToCoords,
  convertShapeBlockToMesh,
};
