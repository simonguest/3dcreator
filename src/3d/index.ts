import * as BABYLON from "babylonjs";

import * as lighting from "./lighting";
import * as world from "./world";
import * as physics from "./physics";
import * as camera from "./camera";
import * as events from "./events";

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
  private runningAnimations = {};
  private actionManagers: BABYLON.AbstractActionManager[] = [];

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
  }

  // Camera functions
  public setCameraType = (cameraType: string) => {
    this.cameraType = cameraType;
  };

  public createCamera = () => {
    this.camera = camera.createCamera(this.cameraType, this.camera, this.scene, this.canvas);
    if (this.camera instanceof BABYLON.ArcRotateCamera) {
      // Remove the ability to pinch and zoom on trackpads, but keep scroll wheel zoom
      this.camera.pinchToPanMaxDistance = 0;
      this.camera.inputs.removeByType("ArcRotateCameraMultiTouchInput");

      // Set radius limits for the camera
      this.camera.lowerRadiusLimit = 2;
      this.camera.upperRadiusLimit = 50;
    }
  };

  public moveCamera = (coordsBlock: CoordsBlock) => {
    camera.moveCamera(coordsBlock, this.camera);
  };

  public moveCameraAlong = (axis: string, units: number) => {
    camera.moveCameraAlong(axis, units, this.camera);
  };

  public pointCameraTowards = (shapeBlock: ShapeBlock) => {
    camera.pointCameraTowards(shapeBlock, this.camera, this.scene);
  };

  public keepDistanceOf = (units: number) => {
    camera.keepDistanceOf(units, this.camera);
  };

  // Event functions
  public onClick = (shapeBlock: ShapeBlock, statements: any) => {
    events.onClick(shapeBlock, statements, this.scene);
  };

  public onKeyPress = (key: string, statements: any) => {
    events.onKeyPress(key, statements, this.scene);
  };

  // Lighting functions
  public createLight = (lightBlock: LightBlock, coordsBlock: CoordsBlock) => {
    lighting.createLight(lightBlock, coordsBlock, this.scene);
  };

  public showLight = (lightBlock: LightBlock) => {
    lighting.showLight(lightBlock, this.scene);
  };

  public moveLight = (lightBlock: LightBlock, coordsBlock: CoordsBlock) => {
    lighting.moveLight(lightBlock, coordsBlock, this.scene);
  };

  public moveLightAlong = (lightBlock: LightBlock, axis: string, steps: number) => {
    lighting.moveLightAlong(lightBlock, axis, steps, this.scene);
  };

  public setLightColor = (lightBlock: LightBlock, color: string) => {
    lighting.setLightColor(lightBlock, color, this.scene);
  };

  public setLightIntensity = (lightBlock: LightBlock, intensity: number) => {
    lighting.setLightIntensity(lightBlock, intensity, this.scene);
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

  // World functions
  public createShape = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    world.createShape(shapeBlock, coordsBlock, this.scene, this.actionManagers);
  };

  public createShapeAndAddTo = (shapeBlock: ShapeBlock, parentBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    world.createShapeAndAddTo(shapeBlock, parentBlock, coordsBlock, this.scene, this.actionManagers);
  };

  public clone = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    world.clone(shapeBlock, coordsBlock, this.scene);
  };

  public remove = (shapeBlock: ShapeBlock) => {
    world.remove(shapeBlock, this.scene);
  };

  public moveShape = (shapeBlock: ShapeBlock, coordsBlock: CoordsBlock) => {
    world.moveShape(shapeBlock, coordsBlock, this.scene);
  };

  public moveShapeAlong = (shapeBlock: ShapeBlock, axis: string, steps: number) => {
    world.moveShapeAlong(shapeBlock, axis, steps, this.scene);
  };

  public rotate = (shapeBlock: ShapeBlock, axis: string, degrees: number) => {
    world.rotate(shapeBlock, axis, degrees, this.scene);
  };

  public getPosition = (shapeBlock: ShapeBlock, axis: string) => {
    return world.getPosition(shapeBlock, axis, this.scene);
  };

  public createGround = (shape: Shape) => {
    world.createGround(shape, this.scene);
  };

  public createSkybox = (skybox: Skybox) => {
    world.createSkybox(skybox, this.scene);
  };

  public setSkyColor = (color: string) => {
    world.setSkyColor(color, this.scene);
  };

  // Physics functions
  public setGravity = (units: number) => {
    physics.setGravity(units, this.scene);
  };

  public applyForce = (shapeBlock: ShapeBlock, axis: string, units: number) => {
    physics.applyForce(shapeBlock, axis, units, this.scene);
  };

  public setMass = (shapeBlock: ShapeBlock, mass: number) => {
    physics.setMass(shapeBlock, mass, this.scene);
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
