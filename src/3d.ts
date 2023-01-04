import * as BABYLON from "babylonjs";
import { BabylonFileLoaderConfiguration } from "babylonjs";

const BRIGHTNESS_MULTIPLIER = 1;
const BRIGHTNESS_MAX = 10000;

type Material = {
  texture: string;
  color: string;
  pbr?: string;
  image?: string;
  metallic?: number;
  roughness?: number;
};

type MaterialBlock = [material: Material];

type Shape = {
  id: string;
  type: string;
  size: {
    w?: number; // width
    h?: number; // height
    l?: number; // length
    r?: number; // radius
    d?: number; // diameter
    t?: number; // diameter of top
    b?: number; // diameter of bottom
    s?: number; // tile size
  };
  tileSize?: number; // tile size for walls and ground
  material: MaterialBlock;
};

type ShapeBlock = [shape: Shape];

type Coords = {
  x: number;
  y: number;
  z: number;
};

type CoordsBlock = [coords: Coords];

type Light = {
  id: string;
  type: string;
  props: {
    b?: number; // brightness
    c?: string; // color
    s?: number; // beam size
    r?: number; // range
    x?: number; // x position of directionality
    y?: number; // y position of directionality
    z?: number; // z position of directionality
  };
};

type LightBlock = [light: Light];

const convertLightBlockToLight = (lightBlock: LightBlock) => {
  if (!lightBlock) return null;
  if (!lightBlock[0]) return null;
  let light = lightBlock[0];
  if (light === null) return null;
  return light;
};

const convertLightBlockToLightInScene = (lightBlock: LightBlock, scene: BABYLON.Scene) => {
  if (!lightBlock) return null;
  if (!lightBlock[0]) return null;
  let light = lightBlock[0];
  if (light === null) return null;
  let lightInScene = scene.getLightById(light.id);
  return lightInScene;
};

type Skybox = {
  asset: string;
};

const convertShapeBlockToMesh = (shapeBlock: ShapeBlock, scene: BABYLON.Scene) => {
  if (!shapeBlock) return null;
  if (!shapeBlock[0]) return null;
  let shape = shapeBlock[0];
  if (shape === null) return null;
  let mesh = scene.getMeshById(shape.id);
  return mesh;
};

const convertShapeBlockToShape = (shapeBlock: ShapeBlock) => {
  if (!shapeBlock) return null;
  if (!shapeBlock[0]) return null;
  let shape = shapeBlock[0];
  if (shape === null) return null;
  return shape;
};

const convertCoordsBlockToCoords = (coordsBlock: CoordsBlock) => {
  if (!coordsBlock) return null;
  if (!coordsBlock[0]) return null;
  let coords = coordsBlock[0];
  if (coords === null) return null;
  return coords;
};

const convertMaterialBlockToMaterial = (materialBlock: MaterialBlock) => {
  if (!materialBlock) return null;
  if (!materialBlock[0]) return null;
  let material = materialBlock[0];
  if (material === null) return null;
  return material;
};

export class ThreeD {
  private readonly canvas: any;
  public readonly engine: BABYLON.Engine;
  public ammo: any;
  private cameraState: any;
  private camera: BABYLON.Camera;
  private cameraType: string;
  private scene: BABYLON.Scene;
  private skybox: BABYLON.Mesh;
  private ambientLight: BABYLON.HemisphericLight;
  private ground: BABYLON.Mesh;
  private defaultXRExperience: BABYLON.WebXRDefaultExperience;

  constructor(canvas) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
  }

  private runningAnimations = {};
  private actionManagers = [];
  private physicsEnabled: boolean = false;

  private saveCameraState = () => {
    this.cameraState = this.camera.serialize();
  };

  private clearCameraState = () => {
    delete this.cameraState;
  };

  private restoreCameraState = () => {
    if (this.cameraState) {
      if (this.camera instanceof BABYLON.ArcRotateCamera) {
        this.camera.alpha = this.cameraState.alpha;
        this.camera.beta = this.cameraState.beta;
        this.camera.radius = this.cameraState.radius;
      }
      if (this.camera instanceof BABYLON.UniversalCamera) {
        this.camera.position = new BABYLON.Vector3(
          this.cameraState.position[0],
          this.cameraState.position[1],
          this.cameraState.position[2]
        );
        this.camera.rotation = new BABYLON.Vector3(
          this.cameraState.rotation[0],
          this.cameraState.rotation[1],
          this.cameraState.rotation[2]
        );
      }
      if (this.camera instanceof BABYLON.FollowCamera) {
        this.camera.position = new BABYLON.Vector3(
          this.cameraState.position[0],
          this.cameraState.position[1],
          this.cameraState.position[2]
        );
      }
      if (this.camera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
        this.camera.position = new BABYLON.Vector3(
          this.cameraState.position[0],
          this.cameraState.position[1],
          this.cameraState.position[2]
        );
      }
    }
  };

  public createCamera = () => {
    switch (this.cameraType) {
      case "ArcRotate":
        if (this.camera instanceof BABYLON.ArcRotateCamera) {
          this.saveCameraState();
        } else {
          this.clearCameraState();
        }
        this.scene.removeCamera(this.scene.getCameraById("camera"));
        this.camera = new BABYLON.ArcRotateCamera(
          "camera",
          BABYLON.Tools.ToRadians(-90),
          BABYLON.Tools.ToRadians(65),
          5,
          BABYLON.Vector3.Zero(),
          this.scene
        );
        break;
      case "UniversalCamera":
        if (this.camera instanceof BABYLON.UniversalCamera) {
          this.saveCameraState();
        } else {
          this.clearCameraState();
        }
        this.scene.removeCamera(this.scene.getCameraById("camera"));
        this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 10, -100), this.scene);
        break;
      case "FollowCamera":
        if (this.camera instanceof BABYLON.FollowCamera) {
          this.saveCameraState();
        } else {
          this.clearCameraState();
        }
        this.scene.removeCamera(this.scene.getCameraById("camera"));
        this.camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 10, -100), this.scene);
        break;
      case "VRDeviceOrientationFreeCamera":
        if (this.camera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
          this.saveCameraState();
        } else {
          this.clearCameraState();
        }
        this.scene.removeCamera(this.scene.getCameraById("camera"));
        this.camera = new BABYLON.VRDeviceOrientationFreeCamera("camera", new BABYLON.Vector3(0, 10, -100), this.scene);
        break;
    }
    this.camera.attachControl(this.canvas, true);
    this.restoreCameraState();
  };

  public createScene = async (reset?: boolean, physics?: boolean) => {
    console.log("Creating scene");
    // Unregister actions from previous scene
    if (this.scene) {
      if (this.scene.actionManager) {
        let actionsToUnregister = this.scene.actionManager.actions.map((a) => a);
        actionsToUnregister.forEach((a) => {
          this.scene.actionManager.unregisterAction(a);
        });
      }
    }

    if (this.defaultXRExperience) {
      if (this.defaultXRExperience.baseExperience.state === BABYLON.WebXRState.IN_XR) {
        // We're in XR mode, so we'll need to disable it before constructing a new scene
        console.log("disabling XR mode");
        await this.defaultXRExperience.baseExperience.exitXRAsync();
        this.defaultXRExperience = null;
      }
    }

    // Now, create a new scene
    this.scene = new BABYLON.Scene(this.engine);
    this.cameraType = "ArcRotate";
    if (reset === true) {
      delete this.camera;
      this.clearCameraState();
    }

    // Create default env for metal and glass shapes
    this.scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      `./assets/env/puresky.env`,
      this.scene
    );
    this.skybox = null;
    this.scene.clearColor = BABYLON.Color4.FromHexString("#000000");

    this.ambientLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    this.ambientLight.intensity = 1.0;
    this.runningAnimations = {};

    // Unregister actions from each mesh
    this.actionManagers.forEach((actionManager) => {
      let actionsToUnregister = actionManager.actions.map((a) => a);
      actionsToUnregister.forEach((a) => {
        actionManager.unregisterAction(a);
      });
    });
    this.actionManagers = [];
    this.scene.actionManager = new BABYLON.ActionManager();
    if (physics === true) {
      console.log("Enabling physics");
      let gravityVector = new BABYLON.Vector3(0, -9.81, 0);
      let physicsPlugin = new BABYLON.AmmoJSPlugin(true, this.ammo);
      this.scene.enablePhysics(gravityVector, physicsPlugin);
      this.physicsEnabled = true;
    } else {
      this.physicsEnabled = false;
      this.scene.disablePhysicsEngine();
    }

  };

  public runRenderLoop = () => {
    this.engine.runRenderLoop(
      function () {
        if (this.scene && this.scene.cameras.length > 0) {
          this.scene.render();
          document.getElementById("fpsCounter").innerHTML = this.engine.getFps().toFixed() + " fps";
        }
      }.bind(this)
    );
  };

  // Sets the material of a mesh based on the material block
  private setMaterial = (mesh: BABYLON.Mesh, materialBlock: MaterialBlock) => {
    let material = convertMaterialBlockToMaterial(materialBlock);
    if (material === null) material = { texture: "matte", color: "#cccccc" }; // default material for "none"

    if (material.texture === "matte") {
      var matte = new BABYLON.PBRMetallicRoughnessMaterial("metal", this.scene);
      matte.baseColor = BABYLON.Color3.FromHexString(material.color);
      matte.roughness = 1.0;
      matte.maxSimultaneousLights = 8;
      mesh.material = matte;
      return;
    }

    if (material.texture === "metal") {
      var metal = new BABYLON.PBRMaterial("metal", this.scene);
      metal.albedoColor = BABYLON.Color3.FromHexString(material.color);
      metal.metallic = 1.0;
      metal.roughness = 0;
      metal.usePhysicalLightFalloff = false;
      metal.maxSimultaneousLights = 8;
      mesh.material = metal;
      return;
    }

    if (material.texture === "gloss") {
      var gloss = new BABYLON.PBRMetallicRoughnessMaterial("metal", this.scene);
      gloss.baseColor = BABYLON.Color3.FromHexString(material.color);
      gloss.metallic = 1.0;
      gloss.roughness = 1.0;
      gloss.clearCoat.isEnabled = true;
      gloss.maxSimultaneousLights = 8;
      mesh.material = gloss;
      return;
    }

    if (material.texture === "glass") {
      var glass = new BABYLON.PBRMaterial("glass", this.scene);
      glass.alpha = 0.9;
      glass.subSurface.tintColor = BABYLON.Color3.FromHexString(material.color);
      glass.metallic = 0.0;
      glass.roughness = 0;
      glass.subSurface.isRefractionEnabled = true;
      glass.subSurface.indexOfRefraction = 1.4;
      glass.usePhysicalLightFalloff = false;
      glass.maxSimultaneousLights = 8;
      mesh.material = glass;
      return;
    }

    if (material.image) {
      let imageMaterial = new BABYLON.PBRMetallicRoughnessMaterial("Material", this.scene);
      imageMaterial.baseTexture = new BABYLON.Texture(`./assets/materials/${material.image}`);
      imageMaterial.roughness = material.roughness || 1;
      imageMaterial.metallic = material.metallic || 0;
      imageMaterial.maxSimultaneousLights = 8;
      mesh.material = imageMaterial;
      return;
    }

    if (material.pbr) {
      const PBR_RESOLUTION = "1K";
      let pbrMaterial = new BABYLON.PBRMetallicRoughnessMaterial("PBRMaterial", this.scene);
      pbrMaterial.baseTexture = new BABYLON.Texture(`./assets/materials/${material.pbr}_${PBR_RESOLUTION}_Color.jpg`);
      pbrMaterial.metallicRoughnessTexture = new BABYLON.Texture(
        `./assets/materials/${material.pbr}_${PBR_RESOLUTION}_Roughness.jpg`
      );
      pbrMaterial.normalTexture = new BABYLON.Texture(
        `./assets/materials/${material.pbr}_${PBR_RESOLUTION}_NormalDX.jpg`
      );
      pbrMaterial.roughness = material.roughness || 1;
      pbrMaterial.metallic = material.metallic || 0;
      pbrMaterial.maxSimultaneousLights = 8;
      mesh.material = pbrMaterial;
      return;
    }
  };

  // Creates a torus
  private createTorus = (shape: Shape, coords: Coords) => {
    let torus = BABYLON.MeshBuilder.CreateTorus(shape.id, {
      diameter: shape.size.d,
      thickness: shape.size.t,
      tessellation: shape.size.s,
    });
    torus.position.x = coords.x;
    torus.position.y = coords.y;
    torus.position.z = coords.z;
    this.setMaterial(torus, shape.material);
    torus.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(torus.actionManager);
    if (this.physicsEnabled === true) {
      torus.physicsImpostor = new BABYLON.PhysicsImpostor(
        torus,
        BABYLON.PhysicsImpostor.ConvexHullImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates a ramp from a triangle shape
  private createRamp = (shape: Shape, coords: Coords) => {
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
      this.scene
    );
    ramp.position.x = coords.x;
    ramp.position.y = coords.y;
    ramp.position.z = coords.z;
    this.setMaterial(ramp, shape.material);
    ramp.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(ramp.actionManager);
    if (this.physicsEnabled === true) {
      ramp.physicsImpostor = new BABYLON.PhysicsImpostor(ramp, BABYLON.PhysicsImpostor.ConvexHullImpostor, {
        mass: 1,
        restitution: 0.7,
        friction: 1.0,
      });
    }
  };

  // Creates a capsule shape
  private createCapsule = (shape: Shape, coords: Coords) => {
    let capsule = BABYLON.MeshBuilder.CreateCapsule(shape.id, {
      height: shape.size.h,
      radius: shape.size.d / 2,
    });
    capsule.position.x = coords.x;
    capsule.position.y = coords.y;
    capsule.position.z = coords.z;
    this.setMaterial(capsule, shape.material);
    capsule.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(capsule.actionManager);
    if (this.physicsEnabled === true) {
      capsule.physicsImpostor = new BABYLON.PhysicsImpostor(
        capsule,
        BABYLON.PhysicsImpostor.CapsuleImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates a cone with a base and a top
  private createCone = (shape: Shape, coords: Coords) => {
    let cone = BABYLON.MeshBuilder.CreateCylinder(shape.id, {
      height: shape.size.h,
      diameterTop: shape.size.t,
      diameterBottom: shape.size.b,
    });
    cone.position.x = coords.x;
    cone.position.y = coords.y;
    cone.position.z = coords.z;
    this.setMaterial(cone, shape.material);
    cone.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(cone.actionManager);
    if (this.physicsEnabled === true) {
      cone.physicsImpostor = new BABYLON.PhysicsImpostor(
        cone,
        BABYLON.PhysicsImpostor.ConvexHullImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates a cylinder
  private createCylinder = (shape: Shape, coords: Coords) => {
    let cylinder = BABYLON.MeshBuilder.CreateCylinder(shape.id, {
      height: shape.size.h,
      diameter: shape.size.d,
    });
    cylinder.position.x = coords.x;
    cylinder.position.y = coords.y;
    cylinder.position.z = coords.z;
    this.setMaterial(cylinder, shape.material);
    cylinder.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(cylinder.actionManager);
    if (this.physicsEnabled === true) {
      cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(
        cylinder,
        BABYLON.PhysicsImpostor.CylinderImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates a box
  private createBox = (shape: Shape, coords: Coords) => {
    let box = BABYLON.MeshBuilder.CreateBox(shape.id, {
      height: shape.size.h,
      width: shape.size.w,
      depth: shape.size.l,
    });
    box.position.x = coords.x;
    box.position.y = coords.y;
    box.position.z = coords.z;
    this.setMaterial(box, shape.material);
    box.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(box.actionManager);
    if (this.physicsEnabled === true) {
      box.physicsImpostor = new BABYLON.PhysicsImpostor(
        box,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates a wall
  private createWall = (shape: Shape, coords: Coords) => {
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
    wall.rotation.y = this.convertToRadians(shape.size.r);
    this.setMaterial(wall, shape.material);
    wall.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(wall.actionManager);
    if (this.physicsEnabled === true) {
      wall.physicsImpostor = new BABYLON.PhysicsImpostor(
        wall,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates a sphere
  private createSphere = (shape: Shape, coords: Coords) => {
    let sphere = BABYLON.MeshBuilder.CreateSphere(shape.id, {
      segments: 16,
      diameterX: shape.size.w,
      diameterY: shape.size.h,
      diameterZ: shape.size.l,
    });
    sphere.position.x = coords.x;
    sphere.position.y = coords.y;
    sphere.position.z = coords.z;
    this.setMaterial(sphere, shape.material);
    sphere.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(sphere.actionManager);
    if (this.physicsEnabled === true) {
      sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere,
        BABYLON.PhysicsImpostor.SphereImpostor,
        { mass: 1, restitution: 0.7, friction: 3 },
        this.scene
      );
      sphere.physicsImpostor.physicsBody.angularDamping = 0.4;
      sphere.physicsImpostor.physicsBody.linearDamping = 0.4;
    }
  };

  // Creates the ground
  public createGround = (shape: Shape) => {
    if (this.ground) this.ground.dispose();
    if (shape.tileSize <= 0) shape.tileSize = 1;
    let width = shape.size.w;
    let length = shape.size.l;
    let tileSize = shape.tileSize;

    let grid = {
      h: length / tileSize,
      w: width / tileSize,
    };

    this.ground = BABYLON.MeshBuilder.CreateTiledGround(shape.id, {
      xmin: 0 - width / 2,
      zmin: 0 - length / 2,
      xmax: width / 2,
      zmax: length / 2,
      subdivisions: grid,
    });

    this.setMaterial(this.ground, shape.material);
    if (this.physicsEnabled === true) {
      this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        this.ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  // Creates the skybox
  public createSkybox = (skybox: Skybox) => {
    this.scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      `./assets/env/${skybox.asset}.env`,
      this.scene
    );
    this.skybox = this.scene.createDefaultSkybox(this.scene.environmentTexture);
  };

  // Set the sky/background color
  public setSkyColor = (color: string) => {
    this.scene.clearColor = BABYLON.Color4.FromHexString(color);
  };

  // Creates a shape
  public createShape = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    let shape = convertShapeBlockToShape(shapeBlock);
    let coords = convertCoordsBlockToCoords(coordsBlock);

    if (shape && coords) {
      switch (shape.type) {
        case "sphere":
          this.createSphere(shape, coords);
          break;
        case "box":
          this.createBox(shape, coords);
          break;
        case "wall":
          this.createWall(shape, coords);
          break;
        case "cylinder":
          this.createCylinder(shape, coords);
          break;
        case "cone":
          this.createCone(shape, coords);
          break;
        case "torus":
          this.createTorus(shape, coords);
          break;
        case "capsule":
          this.createCapsule(shape, coords);
          break;
        case "ramp":
          this.createRamp(shape, coords);
          break;
      }
    }
  };

  // Creates a shape and adds it to a parent
  public createShapeAndAddTo = (shapeBlock: ShapeBlock, parent: ShapeBlock, coordsBlock: CoordsBlock) => {
    this.createShape(shapeBlock, coordsBlock);
    this.addTo(shapeBlock, parent);
  };

  private getAxisAlignedBoundingInfo = (mesh: BABYLON.AbstractMesh) => {
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
    let parent = new BABYLON.Mesh("parent", this.scene);
    parent.setBoundingInfo(new BABYLON.BoundingInfo(min, max));
    // DEBUG parent.showBoundingBox = true;
    clone.dispose();

    return new BABYLON.BoundingInfo(min, max);
  };

  // Adds a shape to a parent
  public addTo = (childBlock: ShapeBlock, parentBlock: ShapeBlock) => {
    let child = convertShapeBlockToMesh(childBlock, this.scene);
    let parent = convertShapeBlockToMesh(parentBlock, this.scene);
    if (child && parent) {
      let parentAABB = this.getAxisAlignedBoundingInfo(parent);
      let childAABB = this.getAxisAlignedBoundingInfo(child);

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

      mergedMesh.actionManager = new BABYLON.ActionManager(this.scene);
      this.actionManagers.push(mergedMesh.actionManager);

      if (this.physicsEnabled === true) {
        mergedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
          mergedMesh,
          BABYLON.PhysicsImpostor.ConvexHullImpostor,
          { mass: 1, restitution: 0.1, friction: 1.0 },
          this.scene
        );
      }
    }
  };

  // Creates a light bulb, light comes from all directions
  public createLightBulb = (light: Light, coords: Coords) => {
    let lightBulb = new BABYLON.PointLight(light.id, new BABYLON.Vector3(0, 0, 0), this.scene);
    lightBulb.position.x = coords.x;
    lightBulb.position.y = coords.y;
    lightBulb.position.z = coords.z;
    if (light.props.b < 0) light.props.b = 0;
    if (light.props.b > BRIGHTNESS_MAX) light.props.b = BRIGHTNESS_MAX;
    lightBulb.intensity = light.props.b * BRIGHTNESS_MULTIPLIER;
    lightBulb.diffuse = BABYLON.Color3.FromHexString(light.props.c);
  };

  // Creates a spotlight, light comes from a specific direction
  public createSpotlight = (light: Light, coords: Coords) => {
    let spotlight = new BABYLON.SpotLight(
      light.id,
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(light.props.x, light.props.y, light.props.z), // direction
      light.props.s, // beam size
      light.props.r, // range
      this.scene
    );
    spotlight.position.x = coords.x;
    spotlight.position.y = coords.y;
    spotlight.position.z = coords.z;
    if (light.props.b < 0) light.props.b = 0;
    if (light.props.b > 100) light.props.b = 100;
    spotlight.intensity = light.props.b / 50;
    spotlight.diffuse = BABYLON.Color3.FromHexString(light.props.c);
  };

  // Creates a light
  public createLight = (lightBlock: LightBlock, coordsBlock: CoordsBlock) => {
    let light = convertLightBlockToLight(lightBlock);
    let coords = convertCoordsBlockToCoords(coordsBlock);

    if (light && coords) {
      switch (light.type) {
        case "lightbulb":
          this.createLightBulb(light, coords);
          break;
        case "spotlight":
          this.createSpotlight(light, coords);
          break;
      }
    }
  };

  // Clone a shape into a new mesh and set the position
  public clone = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    let coords = convertCoordsBlockToCoords(coordsBlock);
    if (mesh && coords) {
      let clonedMesh = mesh.clone(`${mesh.id}-clone`, null, null);
      clonedMesh.position.x = coords.x;
      clonedMesh.position.y = coords.y;
      clonedMesh.position.z = coords.z;
    }
  };

  // Remove a shape from the scene
  public remove = (shapeBlock: ShapeBlock) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      // remove any physics imposters first
      if (mesh.physicsImpostor) {
        mesh.physicsImpostor.dispose();
      }
      this.scene.removeMesh(mesh);
    }
  };

  // Move a shape to a new position
  public moveShape = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    let coords = convertCoordsBlockToCoords(coordsBlock);
    if (mesh && coords) {
      mesh.position.x = coords.x;
      mesh.position.y = coords.y;
      mesh.position.z = coords.z;
    }
  };

  // Move a shape along an axis
  public moveShapeAlong = (shapeBlock: ShapeBlock, axis: string, steps: number) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      mesh.position[axis] += steps;
    }
  };

  // Convert degrees to radians
  private convertToRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  // Rotate a shape
  public rotate = (shapeBlock: ShapeBlock, axis: string, degrees: number) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      mesh.rotate(BABYLON.Axis[axis], this.convertToRadians(degrees));
    }
  };

  // Create an animation loop
  public createAnimationLoop = (name: string, statements) => {
    {
      this.scene.onBeforeRenderObservable.add(() => {
        if (this.runningAnimations[name] === true) statements();
      });
    }
  };

  // Start an animation loop
  public startAnimation = (name: string) => {
    this.runningAnimations[name] = true;
  };

  // Stop an animation loop
  public stopAnimation = (name: string) => {
    delete this.runningAnimations[name];
  };

  // On click event handler
  public onClick = (shapeBlock: ShapeBlock, statements: any) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnPickTrigger,
          },
          statements
        )
      );
    }
  };

  // On key press event handler
  public onKeyPress = (key: string, statements: any) => {
    this.scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnKeyDownTrigger,
          parameter: key,
        },
        statements
      )
    );
  };

  // Get the position of a shape
  public getPosition = (shapeBlock: ShapeBlock, axis: string) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      return mesh.position[axis];
    }
  };

  // Sets overall gravity for the scene
  public setGravity = (units: number) => {
    if (this.physicsEnabled) {
      this.scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(0, 0 - units, 0));
    }
  };

  // Apply a force to a shape
  public applyForce = (shapeBlock: ShapeBlock, axis: string, units: number) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh && this.physicsEnabled === true) {
      let vector = { x: 0, y: 0, z: 0 };
      vector[axis] = units;
      let direction = new BABYLON.Vector3(vector.x, vector.y, vector.z);
      if (mesh.physicsImpostor) {
        mesh.physicsImpostor.applyForce(direction.scale(50), mesh.getAbsolutePosition());
      }
    }
  };

  // Set the mass of a shape
  public setMass = (shapeBlock: ShapeBlock, mass: number) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh && this.physicsEnabled === true) {
      mesh.physicsImpostor.mass = mass;
    }
  };

  // Show a light on the scene to help with debugging
  public showLight = (lightBlock: LightBlock) => {
    let light = convertLightBlockToLightInScene(lightBlock, this.scene);
    if (light) {
      let lightSphere = BABYLON.CreateSphere("ls", { diameter: 5 });
      let material = new BABYLON.StandardMaterial("lsm", this.scene);
      material.emissiveColor = new BABYLON.Color3(1, 1, 0);
      lightSphere.material = material;
      lightSphere.position = light.getAbsolutePosition();
    }
  };

  // Move a light to a new position
  public moveLight = (lightBlock: LightBlock, coordsBlock: CoordsBlock) => {
    let light = convertLightBlockToLightInScene(lightBlock, this.scene);
    let coords = convertCoordsBlockToCoords(coordsBlock);
    if (light && coords) {
      //@ts-ignore (N/A as we don't allow use to create ambient light types)
      light.position.x = coords.x;
      //@ts-ignore
      light.position.y = coords.y;
      //@ts-ignore
      light.position.z = coords.z;
    }
  };

  // Move a light along an axis
  public moveLightAlong = (lightBlock: LightBlock, axis: string, steps: number) => {
    let light = convertLightBlockToLightInScene(lightBlock, this.scene);
    if (light) {
      //@ts-ignore
      light.position[axis] += steps;
    }
  };

  // Sets the color of a light
  public setLightColor = (lightBlock: LightBlock, color: string) => {
    let light = convertLightBlockToLightInScene(lightBlock, this.scene);
    if (light) {
      light.diffuse = BABYLON.Color3.FromHexString(color);
    }
  };

  // Sets the intensity of a light
  public setLightIntensity = (lightBlock: LightBlock, intensity: number) => {
    let light = convertLightBlockToLightInScene(lightBlock, this.scene);
    if (light) {
      if (intensity < 0) intensity = 0;
      if (intensity > BRIGHTNESS_MAX) intensity = BRIGHTNESS_MAX;
      light.intensity = intensity * BRIGHTNESS_MULTIPLIER;
    }
  };

  // Sets the ambient light intensity
  public setAmbientLightIntensity = (intensity: number) => {
    if (this.ambientLight) {
      if (intensity < 0) intensity = 0;
      if (intensity > BRIGHTNESS_MAX) intensity = BRIGHTNESS_MAX;
      this.ambientLight.intensity = (intensity * BRIGHTNESS_MULTIPLIER) / 1000;
    }
    this.scene.environmentIntensity = intensity / 100;
    this.scene.environmentTexture.level = intensity / 100;
    if (this.skybox) {
      this.scene.createDefaultSkybox(this.scene.environmentTexture);
      this.ambientLight.intensity = 0;
    }
  };

  // Move the camera to a new position
  public moveCamera = (coordsBlock: CoordsBlock) => {
    let coords = convertCoordsBlockToCoords(coordsBlock);
    if (coords) {
      if (this.camera instanceof BABYLON.ArcRotateCamera) {
        this.camera.setPosition(new BABYLON.Vector3(coords.x, coords.y, coords.z));
      }
      if (this.camera instanceof BABYLON.UniversalCamera) {
        this.camera.position = new BABYLON.Vector3(coords.x, coords.y, coords.z);
      }
    }
  };

  // Move the camera along an axis
  public moveCameraAlong = (axis: string, units: number) => {
    if (this.camera instanceof BABYLON.ArcRotateCamera) {
      switch (axis) {
        case "x":
          this.camera.alpha += this.convertToRadians(units);
          break;
        case "y":
          this.camera.beta += this.convertToRadians(units);
          break;
        case "z":
          this.camera.radius += this.convertToRadians(units);
          break;
      }
    }
    if (this.camera instanceof BABYLON.UniversalCamera) {
      this.camera.position[axis] = this.camera.position[axis] += units;
    }
    if (this.camera instanceof BABYLON.VRDeviceOrientationFreeCamera) {
      this.camera.position[axis] = this.camera.position[axis] += units;
    }
  };

  // Set the camera to a new type
  public setCameraType = (cameraType: string) => {
    this.cameraType = cameraType;
  };

  // Point the camera towards a shape
  public pointCameraTowards = (shapeBlock: ShapeBlock) => {
    let mesh = convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      if (this.camera instanceof BABYLON.FollowCamera) {
        this.camera.lockedTarget = mesh;
      }
      if (this.camera instanceof BABYLON.UniversalCamera) {
        this.camera.target = mesh.position;
      }
      if (this.camera instanceof BABYLON.ArcRotateCamera) {
        this.camera.focusOn([mesh], true);
      }
    }
  };

  // Set the camera distance for follow cameras
  public keepDistanceOf = (units: number) => {
    if (this.camera instanceof BABYLON.FollowCamera) {
      this.camera.radius = units;
    }
    if (this.camera instanceof BABYLON.ArcRotateCamera) {
      this.camera.radius = units;
    }
  };

  public enableInspector = () => {
    this.scene.debugLayer.show({ embedMode: false });
  };

  public disableInspector = () => {
    this.scene.debugLayer.hide();
  };

  public disableXR = async  () => {
    if (this.defaultXRExperience) {
      await this.defaultXRExperience.baseExperience.exitXRAsync();
      delete this.defaultXRExperience;
    }
  };

  public enableXR = async () => {
    this.defaultXRExperience = await this.scene.createDefaultXRExperienceAsync({
      floorMeshes: [this.ground],
      disableDefaultUI: true,
    });
    if (!this.defaultXRExperience.baseExperience) {
      console.error("XR not supported on this device");
    } else {
      console.log("Entering XR immersive mode");
      this.defaultXRExperience.baseExperience.enterXRAsync("immersive-vr", "local-floor");
    }
  };
}
