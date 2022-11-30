import * as BABYLON from "babylonjs";
import { ActionManager } from "babylonjs";
window.CANNON = require("cannon");
import { v4 as uuid } from "uuid";

export class ThreeD {
  private readonly canvas: any;
  public readonly engine: BABYLON.Engine;
  private cameraState: any;
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private light: BABYLON.HemisphericLight;
  private material: BABYLON.StandardMaterial;
  private ground: BABYLON.GroundMesh;

  constructor(canvas) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.createScene();
  }

  private runningAnimations = {};
  private actionManagers = [];
  private physicsEnabled: boolean = false;

  private saveCameraState = () => {
    this.cameraState = this.camera.serialize();
  };

  private restoreCameraState = () => {
    if (this.cameraState) {
      this.camera.alpha = this.cameraState.alpha;
      this.camera.beta = this.cameraState.beta;
      this.camera.radius = this.cameraState.radius;
    }
  };

  public createScene = (reset?: boolean, physics?: boolean) => {
    console.log("Creating scene");
    // If existing camera, save the state
    if (this.camera) this.saveCameraState();
    // If existing scene, unregister any event handlers
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
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Tools.ToRadians(65),
      10,
      BABYLON.Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);
    if (reset !== true) this.restoreCameraState();
    this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.7;
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
      let gravityVector = new BABYLON.Vector3(0, -9.81, 0);
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
        this.scene.render();
      }.bind(this)
    );
  };

  private setMaterial = (obj, materialArray) => {
    if (materialArray === null) return; // none selected
    let material = materialArray[0];

    if (material.texture === "matte") {
      let matte = new BABYLON.StandardMaterial("matte", this.scene);
      matte.diffuseColor = BABYLON.Color3.FromHexString(material.color);
      obj.material = matte;
      return;
    }

    if (material.texture === "glass") {
      let glass = new BABYLON.StandardMaterial("glass", this.scene);
      glass.diffuseColor = BABYLON.Color3.FromHexString(material.color);
      glass.alpha = 0.5;
      obj.material = glass;
      return;
    }

    if (material.image) {
      let loadedMaterial = new BABYLON.StandardMaterial("Material", this.scene);
      loadedMaterial.diffuseTexture = new BABYLON.Texture(`./assets/materials/${material.image}`);
      obj.material = loadedMaterial;
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
        BABYLON.PhysicsImpostor.BoxImpostor,
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
    var triangle = [new BABYLON.Vector3(0-width, 0-height, 0), new BABYLON.Vector3(width, 0-height, 0), new BABYLON.Vector3(width, height, 0)];
    triangle.push(triangle[0]);
    let extrudePath = [new BABYLON.Vector3(0, 0, 0-length), new BABYLON.Vector3(0, 0, length)];
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
      ramp.physicsImpostor = new BABYLON.PhysicsImpostor(
        ramp,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 1, restitution: 0.7, friction: 1.0 }
      );
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

  private createSphere = (obj, coords) => {
    let sphere = BABYLON.MeshBuilder.CreateSphere(obj.id, {
      segments: 16,
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
    this.ground = BABYLON.MeshBuilder.CreateGround(obj.id, { width: obj.width, height: obj.length }, this.scene);
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
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      `./assets/skyboxes/${obj.asset}/${obj.asset}`,
      this.scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
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

  public clone = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      let clonedMesh = mesh.clone(`${uuid()}`, null, null);
      this.move([clonedMesh], coordsArray);
    }
  };

  public remove = (objArray) => {
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      this.scene.removeMesh(mesh);
    }
  };

  public move = (objArray, coordsArray) => {
    let obj = objArray[0];
    let coords = coordsArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh) {
      mesh.position.x = coords.x;
      mesh.position.y = coords.y;
      mesh.position.z = coords.z;
    }
  };

  public moveAlong = (objArray, axis, steps) => {
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
  };

  private convertToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  public rotate = (objArray, axis, degrees) => {
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

  public onKeyPress = (key, statements) => {
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
    let obj = objArray[0];
    let mesh = this.scene.getMeshById(obj.id);
    if (mesh && this.physicsEnabled === true) {
      let vector = { x: 0, y: 0, z: 0 };
      vector[axis] = units;
      let direction = new BABYLON.Vector3(vector.x, vector.y, vector.z);
      mesh.physicsImpostor.applyForce(direction.scale(50), mesh.getAbsolutePosition());
    }
  };
}
