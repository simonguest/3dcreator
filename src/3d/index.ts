import * as BABYLON from "babylonjs";

import * as lighting from "./lighting";
import * as world from "./world";
import * as physics from "./physics";
import * as camera from "./camera";

export class ThreeD {
  private readonly canvas: any;
  public readonly engine: BABYLON.Engine;
  public ammo: any;
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

  // Camera functions
  public setCameraType = (cameraType: string) => {
    this.cameraType = cameraType;
  };
  
  public createCamera = (scene: BABYLON.Scene) => {
    this.camera = camera.createCamera(this.cameraType, this.camera, scene, this.canvas);
  };

  public moveCamera = (coordsBlock: CoordsBlock) => {
    camera.moveCamera(coordsBlock, this.camera);
  };

  public moveCameraAlong = (axis: string, units: number) => {
    camera.moveCameraAlong(axis, units, this.camera);
  };

  public pointCameraTowards = (shapeBlock: ShapeBlock, scene: BABYLON.Scene) => {
    camera.pointCameraTowards(shapeBlock, this.camera, scene);
  };

  public keepDistanceOf = (units: number) => {
    camera.keepDistanceOf(units, this.camera);
  };

  // Scene functions
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
