import * as BABYLON from "babylonjs";

import * as lighting from "./lighting";
import * as materials from "./materials";
import * as world from "./world";
import * as utils from "./utils";



const convertCoordsBlockToCoords = (coordsBlock: CoordsBlock) => {
  if (!coordsBlock) return null;
  if (!coordsBlock[0]) return null;
  let coords = coordsBlock[0];
  if (coords === null) return null;
  return coords;
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

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
  }

  private runningAnimations = {};
  private actionManagers: BABYLON.AbstractActionManager[] = [];
  private physicsEnabled: boolean = false;

  // Lighting functions
  public createLight = lighting.createLight;
  public showLight = lighting.showLight;
  public moveLight = lighting.moveLight;
  public moveLightAlong = lighting.moveLightAlong;
  public setLightColor = lighting.setLightColor;
  public setLightIntensity = lighting.setLightIntensity;

  // World functions
  public createShape = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock, scene: BABYLON.Scene) => {
    world.createShape(shapeBlock, coordsBlock, scene, this.actionManagers);
  };

  public createShapeAndAddTo = (shapeBlock: ShapeBlock, parentBlock: ShapeBlock, coordsBlock: CoordsBlock, scene: BABYLON.Scene) => {
    world.createShapeAndAddTo(shapeBlock, parentBlock, coordsBlock, scene, this.actionManagers);
  };

  public clone = world.clone;
  public remove = world.remove;
  public moveShape = world.moveShape;
  public moveShapeAlong = world.moveShapeAlong;
  public rotate = world.rotate;

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
        this.camera = new BABYLON.VRDeviceOrientationFreeCamera("camera", new BABYLON.Vector3(0, 1, -3), this.scene);
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
    return this.scene;
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

  // Sets the ambient light intensity
  public setAmbientLightIntensity = (intensity: number) => {
    if (this.ambientLight) {
      if (intensity < 0) intensity = 0;
      if (intensity > lighting.BRIGHTNESS_MAX) intensity = lighting.BRIGHTNESS_MAX;
      this.ambientLight.intensity = (intensity * lighting.BRIGHTNESS_MULTIPLIER) / 1000;
    }
    this.scene.environmentIntensity = intensity / 100;
    this.scene.environmentTexture.level = intensity / 100;
    if (this.skybox) {
      this.scene.createDefaultSkybox(this.scene.environmentTexture);
      this.ambientLight.intensity = 0;
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

    materials.setMaterial(this.ground, shape.material, this.scene);
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
    let mesh = world.convertShapeBlockToMesh(shapeBlock, this.scene);
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
    let mesh = world.convertShapeBlockToMesh(shapeBlock, this.scene);
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
    let mesh = world.convertShapeBlockToMesh(shapeBlock, this.scene);
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
    let mesh = world.convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh && this.physicsEnabled === true) {
      mesh.physicsImpostor.mass = mass;
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
          this.camera.alpha += utils.convertToRadians(units);
          break;
        case "y":
          this.camera.beta += utils.convertToRadians(units);
          break;
        case "z":
          this.camera.radius += utils.convertToRadians(units);
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
    let mesh = world.convertShapeBlockToMesh(shapeBlock, this.scene);
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

  public disableXR = async () => {
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
