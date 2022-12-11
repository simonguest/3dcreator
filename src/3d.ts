import * as BABYLON from "babylonjs";
import {
  ActionManager,
  LensFlareSystemSceneComponent,
  PBRMaterialDefines,
  VRDeviceOrientationFreeCamera,
} from "babylonjs";
import { load } from "blockly/core/serialization/workspaces";
import * as CANNON from "cannon";
window.CANNON = CANNON;
import { v4 as uuid } from "uuid";
import { runInThisContext } from "vm";

const BRIGHTNESS_MULTIPLIER = 50;
const BRIGHTNESS_MAX = 1000;

export class ThreeD {
  private readonly canvas: any;
  public readonly engine: BABYLON.Engine;
  private cameraState: any;
  private camera: BABYLON.Camera;
  private cameraType: string;
  private scene: BABYLON.Scene;
  private ambientLight: BABYLON.HemisphericLight;
  private material: BABYLON.StandardMaterial;
  private ground: BABYLON.Mesh;
  private hdrSkyboxTexture: BABYLON.CubeTexture;

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
          100,
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
    }
    this.camera.attachControl(this.canvas, true);
    this.restoreCameraState();
  };

  public createScene = (reset?: boolean, physics?: boolean) => {
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
    // Now, create a new scene
    this.scene = new BABYLON.Scene(this.engine);
    this.cameraType = "ArcRotate";
    if (reset === true) {
      delete this.camera;
      this.clearCameraState();
    }

    this.ambientLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    this.ambientLight.intensity = 2.0;
    this.material = null;
    this.runningAnimations = {};

    // Unregister actions from each mesh
    this.actionManagers.forEach((actionManager) => {
      let actionsToUnregister = actionManager.actions.map((a) => a);
      actionsToUnregister.forEach((a) => {
        actionManager.unregisterAction(a);
      });
    });
    this.actionManagers = [];
    this.scene.actionManager = new ActionManager();
    if (physics === true) {
      console.log("Enabling physics");
      let gravityVector = new BABYLON.Vector3(0, -90.81, 0);
      let physicsPlugin = new BABYLON.CannonJSPlugin();
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
        if (this.scene) {
          this.scene.render();
          document.getElementById("fpsCounter").innerHTML = this.engine.getFps().toFixed() + " fps";
        }
      }.bind(this)
    );
  };

  private setMaterial = (obj, materialArray) => {
    let material = { texture: "matte", color: "#cccccc", pbr: false, image: false, metallic: 0, roughness: 0 };

    if (materialArray !== null) {
      material = materialArray[0];
    }
    if (material.texture === "matte") {
      var matte = new BABYLON.PBRMetallicRoughnessMaterial("metal", this.scene);
      matte.baseColor = BABYLON.Color3.FromHexString(material.color);
      matte.roughness = 1.0;
      obj.material = matte;
      return;
    }

    if (material.texture === "metal") {
      var metal = new BABYLON.PBRMaterial("metal", this.scene);
      metal.albedoColor = BABYLON.Color3.FromHexString(material.color);
      metal.metallic = 1.0;
      metal.roughness = 0;
      metal.usePhysicalLightFalloff = false;
      obj.material = metal;
      return;
    }

    if (material.texture === "gloss") {
      var gloss = new BABYLON.PBRMetallicRoughnessMaterial("metal", this.scene);
      gloss.baseColor = BABYLON.Color3.FromHexString(material.color);
      gloss.metallic = 1.0;
      gloss.roughness = 1.0;
      gloss.clearCoat.isEnabled = true;
      obj.material = gloss;
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
      obj.material = glass;
      return;
    }

    if (material.image) {
      let loadedMaterial = new BABYLON.StandardMaterial("Material", this.scene);
      loadedMaterial.diffuseTexture = new BABYLON.Texture(`./assets/materials/${material.image}`);
      obj.material = loadedMaterial;
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
      pbrMaterial.roughness = material.roughness || 0;
      pbrMaterial.metallic = material.metallic || 0;
      obj.material = pbrMaterial;
      return;
    }
  };

  private createTorus = (obj, coords) => {
    let torus = BABYLON.MeshBuilder.CreateTorus(obj.id, {
      diameter: obj.size.d,
      thickness: obj.size.t,
      tessellation: obj.size.s,
    });
    torus.position.x = coords.x;
    torus.position.y = coords.y;
    torus.position.z = coords.z;
    this.setMaterial(torus, obj.material);
    torus.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(torus.actionManager);
    if (this.physicsEnabled === true) {
      torus.physicsImpostor = new BABYLON.PhysicsImpostor(
        torus,
        BABYLON.PhysicsImpostor.SphereImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  private createRamp = (obj, coords) => {
    // Halve the w, h, and l to position the triangle in the middle prior to extrusion
    let width = obj.size.w / 2;
    let height = obj.size.h / 2;
    let length = obj.size.l / 2;
    var triangle = [
      new BABYLON.Vector3(0 - width, 0 - height, 0),
      new BABYLON.Vector3(width, 0 - height, 0),
      new BABYLON.Vector3(width, height, 0),
    ];
    triangle.push(triangle[0]);
    let extrudePath = [new BABYLON.Vector3(0, 0, 0 - length), new BABYLON.Vector3(0, 0, length)];
    let ramp = BABYLON.MeshBuilder.ExtrudeShape(
      obj.id,
      { shape: triangle, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL },
      this.scene
    );
    ramp.position.x = coords.x;
    ramp.position.y = coords.y;
    ramp.position.z = coords.z;
    this.setMaterial(ramp, obj.material);
    ramp.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(ramp.actionManager);
    if (this.physicsEnabled === true) {
      ramp.physicsImpostor = new BABYLON.PhysicsImpostor(ramp, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 1,
        restitution: 0.7,
        friction: 1.0,
      });
    }
  };

  private createCapsule = (obj, coords) => {
    let capsule = BABYLON.MeshBuilder.CreateCapsule(obj.id, {
      height: obj.size.h,
      radius: obj.size.d / 2,
    });
    capsule.position.x = coords.x;
    capsule.position.y = coords.y;
    capsule.position.z = coords.z;
    this.setMaterial(capsule, obj.material);
    capsule.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(capsule.actionManager);
    if (this.physicsEnabled === true) {
      capsule.physicsImpostor = new BABYLON.PhysicsImpostor(
        capsule,
        BABYLON.PhysicsImpostor.CylinderImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  private createCone = (obj, coords) => {
    let cone = BABYLON.MeshBuilder.CreateCylinder(obj.id, {
      height: obj.size.h,
      diameterTop: obj.size.t,
      diameterBottom: obj.size.b,
    });
    cone.position.x = coords.x;
    cone.position.y = coords.y;
    cone.position.z = coords.z;
    this.setMaterial(cone, obj.material);
    cone.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(cone.actionManager);
    if (this.physicsEnabled === true) {
      cone.physicsImpostor = new BABYLON.PhysicsImpostor(
        cone,
        BABYLON.PhysicsImpostor.CylinderImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  private createCylinder = (obj, coords) => {
    let cylinder = BABYLON.MeshBuilder.CreateCylinder(obj.id, {
      height: obj.size.h,
      diameter: obj.size.d,
    });
    cylinder.position.x = coords.x;
    cylinder.position.y = coords.y;
    cylinder.position.z = coords.z;
    this.setMaterial(cylinder, obj.material);
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

  private createBox = (obj, coords) => {
    let box = BABYLON.MeshBuilder.CreateBox(obj.id, {
      height: obj.size.h,
      width: obj.size.w,
      depth: obj.size.l,
    });
    box.position.x = coords.x;
    box.position.y = coords.y;
    box.position.z = coords.z;
    this.setMaterial(box, obj.material);
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

  private createWall = (obj, coords) => {
    let wall = BABYLON.MeshBuilder.CreateTiledPlane(obj.id, {
      height: obj.size.h,
      width: obj.size.w,
      tileSize: obj.size.s,
    });
    wall.position.x = coords.x;
    wall.position.y = coords.y;
    wall.position.z = coords.z;
    if (obj.size.r < 0) obj.size.r = 0;
    if (obj.size.r > 360) obj.size.r = 360;
    wall.rotation.y = this.convertToRadians(obj.size.r);
    this.setMaterial(wall, obj.material);
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

  private createSphere = (obj, coords) => {
    let sphere = BABYLON.MeshBuilder.CreateSphere(obj.id, {
      segments: 32,
      diameterX: obj.size.w,
      diameterY: obj.size.h,
      diameterZ: obj.size.l,
    });
    sphere.position.x = coords.x;
    sphere.position.y = coords.y;
    sphere.position.z = coords.z;
    this.setMaterial(sphere, obj.material);
    sphere.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(sphere.actionManager);
    if (this.physicsEnabled === true) {
      sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere,
        BABYLON.PhysicsImpostor.SphereImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  public createGround = (obj) => {
    if (this.ground) this.ground.dispose();
    if (obj.tileSize < 0) obj.tileSize = 1;
    let width = obj.width;
    let length = obj.length;
    let tileSize = obj.tileSize;

    let grid = {
      h: length / tileSize,
      w: width / tileSize,
    };

    this.ground = BABYLON.MeshBuilder.CreateTiledGround(obj.id, {
      xmin: 0 - width / 2,
      zmin: 0 - length / 2,
      xmax: width / 2,
      zmax: length / 2,
      subdivisions: grid,
    });

    this.setMaterial(this.ground, obj.material);
    if (this.physicsEnabled === true) {
      this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        this.ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.7, friction: 1.0 },
        this.scene
      );
    }
  };

  public createSkybox = (obj) => {
    this.scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      `./assets/env/${obj.asset}.env`,
      this.scene
    );
    this.scene.createDefaultSkybox(this.scene.environmentTexture);
  };

  public createShape = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];

    switch (obj.type) {
      case "sphere":
        this.createSphere(obj, coords);
        break;
      case "box":
        this.createBox(obj, coords);
        break;
      case "wall":
        this.createWall(obj, coords);
        break;
      case "cylinder":
        this.createCylinder(obj, coords);
        break;
      case "cone":
        this.createCone(obj, coords);
        break;
      case "torus":
        this.createTorus(obj, coords);
        break;
      case "capsule":
        this.createCapsule(obj, coords);
        break;
      case "ramp":
        this.createRamp(obj, coords);
        break;
    }
  };

  public createLightBulb = (obj, coords) => {
    let lightBulb = new BABYLON.PointLight(obj.id, new BABYLON.Vector3(0, 0, 0), this.scene);
    lightBulb.position.x = coords.x;
    lightBulb.position.y = coords.y;
    lightBulb.position.z = coords.z;
    if (obj.props.b < 0) obj.props.b = 0;
    if (obj.props.b > BRIGHTNESS_MAX) obj.props.b = BRIGHTNESS_MAX;
    lightBulb.intensity = obj.props.b * BRIGHTNESS_MULTIPLIER;
    lightBulb.diffuse = BABYLON.Color3.FromHexString(obj.props.c);
  };

  public createSpotlight = (obj, coords) => {
    let spotlight = new BABYLON.SpotLight(
      obj.id,
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(obj.props.x, obj.props.y, obj.props.z), // direction
      obj.props.s, // beam size
      obj.props.r, // range
      this.scene
    );
    spotlight.position.x = coords.x;
    spotlight.position.y = coords.y;
    spotlight.position.z = coords.z;
    if (obj.props.b < 0) obj.props.b = 0;
    if (obj.props.b > 100) obj.props.b = 100;
    spotlight.intensity = obj.props.b / 50;
    spotlight.diffuse = BABYLON.Color3.FromHexString(obj.props.c);
  };

  public createLight = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];

    switch (obj.type) {
      case "lightbulb":
        this.createLightBulb(obj, coords);
        break;
      case "spotlight":
        this.createSpotlight(obj, coords);
        break;
    }
  };

  public clone = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      let clonedMesh = mesh.clone(`${uuid()}`, null, null);
      this.moveShape([clonedMesh], coordsArray);
    }
  };

  public remove = (objArray) => {
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      this.scene.removeMesh(mesh);
    }
  };

  public moveShape = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      mesh.position.x = coords.x;
      mesh.position.y = coords.y;
      mesh.position.z = coords.z;
    }
  };

  public moveShapeAlong = (objArray, axis, steps) => {
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      mesh.position[axis] += steps;
    }
  };

  public merge = (objArray, objectsToMerge) => {
    let obj = objArray[0];
    let meshes = [];
    if (objectsToMerge.length === 0) return;
    objectsToMerge.forEach((childObj) => {
      //TODO: Check if the object has already been created
      //this.createShape(childObj);
      meshes.push(this.scene.getMeshById(childObj[0].id));
    });
    let mergedMesh = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
    mergedMesh.id = obj.id;
    mergedMesh.actionManager = new BABYLON.ActionManager(this.scene);
    this.actionManagers.push(mergedMesh.actionManager);
  };

  private convertToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  public rotate = (objArray, axis, degrees) => {
    if (objArray === undefined) return;
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      mesh.rotate(BABYLON.Axis[axis], this.convertToRadians(degrees));
    }
  };

  public createAnimationLoop = (name: string, statements) => {
    {
      this.scene.onBeforeRenderObservable.add(() => {
        if (this.runningAnimations[name] === true) statements();
      });
    }
  };

  public startAnimation = (name: string) => {
    this.runningAnimations[name] = true;
  };

  public stopAnimation = (name: string) => {
    delete this.runningAnimations[name];
  };

  public onClick = (objArray, statements) => {
    if (objArray === undefined) return;
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
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

  public onKeyPress = (key: string, statements) => {
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

  public getPosition = (objArray, axis) => {
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      return mesh.position[axis];
    }
  };

  public applyForce = (objArray, axis, units) => {
    if (objArray === undefined) return;
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh && this.physicsEnabled === true) {
      let vector = { x: 0, y: 0, z: 0 };
      vector[axis] = units;
      let direction = new BABYLON.Vector3(vector.x, vector.y, vector.z);
      mesh.physicsImpostor.applyForce(direction.scale(50), mesh.getAbsolutePosition());
    }
  };

  public ambientOn = (color: string) => {
    this.ambientLight.diffuse = BABYLON.Color3.FromHexString(color);
    this.ambientLight.setEnabled(true);
  };

  public ambientOff = () => {
    this.ambientLight.setEnabled(false);
  };

  public showLight = (objArray) => {
    if (objArray === undefined) return;
    let obj = objArray[0];
    let light = this.scene.getLightById(obj.id);
    if (light) {
      let lightSphere = BABYLON.CreateSphere("ls", { diameter: 5 });
      let material = new BABYLON.StandardMaterial("lsm", this.scene);
      material.emissiveColor = new BABYLON.Color3(1, 1, 0);
      lightSphere.material = material;
      lightSphere.position = light.getAbsolutePosition();
    }
  };

  public moveLight = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];
    let light = this.scene.getLightById(obj.id);
    if (light) {
      //@ts-ignore (N/A as we don't allow use to create ambient light types)
      light.position.x = coords.x;
      //@ts-ignore
      light.position.y = coords.y;
      //@ts-ignore
      light.position.z = coords.z;
    }
  };

  public moveLightAlong = (objArray, axis, steps) => {
    let obj = objArray[0];
    if (!obj) return;
    let light = this.scene.getLightById(obj.id);
    if (light) {
      //@ts-ignore
      light.position[axis] += steps;
    }
  };

  public setLightColor = (objArray, color: string) => {
    let obj = objArray[0];
    if (!obj) return;
    let light = this.scene.getLightById(obj.id);
    if (light) {
      light.diffuse = BABYLON.Color3.FromHexString(color);
    }
  };

  public setLightIntensity = (objArray, intensity: number) => {
    let obj = objArray[0];
    if (!obj) return;
    let light = this.scene.getLightById(obj.id);
    if (light) {
      if (intensity < 0) intensity = 0;
      if (intensity > BRIGHTNESS_MAX) intensity = BRIGHTNESS_MAX;
      light.intensity = intensity * BRIGHTNESS_MULTIPLIER;
    }
  };

  public setAmbientLightIntensity = (intensity: number) => {
    if (this.ambientLight) {
      if (intensity < 0) intensity = 0;
      if (intensity > BRIGHTNESS_MAX) intensity = BRIGHTNESS_MAX;
      this.ambientLight.intensity = intensity * BRIGHTNESS_MULTIPLIER / 1000;
    }
  };

  public moveCamera = (coordsArray) => {
    let coords = coordsArray[0];
    if (this.camera instanceof BABYLON.ArcRotateCamera) {
      this.camera.setPosition(new BABYLON.Vector3(coords.x, coords.y, coords.z));
    }
    if (this.camera instanceof BABYLON.UniversalCamera) {
      this.camera.position = new BABYLON.Vector3(coords.x, coords.y, coords.z);
    }
  };

  public moveCameraAlong = (axis, units) => {
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
    if (this.camera instanceof VRDeviceOrientationFreeCamera) {
      this.camera.position[axis] = this.camera.position[axis] += units;
    }
  };

  public setCameraType = (cameraType: string) => {
    this.cameraType = cameraType;
  };

  public pointCameraTowards = (objArray) => {
    let obj = objArray[0];
    if (!obj) return;

    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      if (this.camera instanceof BABYLON.FollowCamera) {
        this.camera.lockedTarget = mesh;
      }
      if (this.camera instanceof BABYLON.UniversalCamera) {
        this.camera.target = mesh.position;
      }
      if (this.camera instanceof BABYLON.ArcRotateCamera) {
        this.camera.target = mesh.position;
      }
    }
  };

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
}
