import * as BABYLON from "babylonjs";

import * as lighting from "./lighting";
import * as world from "./world";
import * as physics from "./physics";
import * as utils from "./utils";

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
  public createGround = world.createGround;
  public createSkybox = world.createSkybox;
  public setSkyColor = world.setSkyColor;

  // Physics functions
  public setGravity = physics.setGravity;
  public applyForce = physics.applyForce;
  public setMass = physics.setMass;



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
    } else {
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

  // Create an animation loop
  public createAnimationLoop = (name: string, statements: any) => {
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

  // // Get the position of a shape
  public getPosition = (shapeBlock: ShapeBlock, axis: string) => {
    let mesh = world.convertShapeBlockToMesh(shapeBlock, this.scene);
    if (mesh) {
      return mesh.position[axis];
    }
  };


  // Move the camera to a new position
  public moveCamera = (coordsBlock: CoordsBlock) => {
    let coords = world.convertCoordsBlockToCoords(coordsBlock);
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
