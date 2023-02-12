import * as BABYLON from "babylonjs";

import { convertCoordsBlockToCoords } from "../world";

const BRIGHTNESS_MULTIPLIER = 1;
const BRIGHTNESS_MAX = 10000;

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

// Creates a light bulb, light comes from all directions
const createLightBulb = (light: Light, coords: Coords, scene: BABYLON.Scene) => {
  let lightBulb = new BABYLON.PointLight(light.id, new BABYLON.Vector3(0, 0, 0), scene);
  lightBulb.position.x = coords.x;
  lightBulb.position.y = coords.y;
  lightBulb.position.z = coords.z;
  if (light.props.b < 0) light.props.b = 0;
  if (light.props.b > BRIGHTNESS_MAX) light.props.b = BRIGHTNESS_MAX;
  lightBulb.intensity = light.props.b * BRIGHTNESS_MULTIPLIER;
  lightBulb.diffuse = BABYLON.Color3.FromHexString(light.props.c);
};

// Creates a spotlight, light comes from a specific direction
const createSpotlight = (light: Light, coords: Coords, scene: BABYLON.Scene) => {
  let spotlight = new BABYLON.SpotLight(
    light.id,
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(light.props.x, light.props.y, light.props.z), // direction
    light.props.s, // beam size
    light.props.r, // range
    scene
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
const createLight = (lightBlock: LightBlock, coordsBlock: CoordsBlock, scene: BABYLON.Scene) => {
  let light = convertLightBlockToLight(lightBlock);
  let coords = convertCoordsBlockToCoords(coordsBlock);

  if (light && coords) {
    switch (light.type) {
      case "lightbulb":
        createLightBulb(light, coords, scene);
        break;
      case "spotlight":
        createSpotlight(light, coords, scene);
        break;
    }
  }
};

 // Show a light on the scene to help with debugging
 const showLight = (lightBlock: LightBlock, scene: BABYLON.Scene) => {
  let light = convertLightBlockToLightInScene(lightBlock, scene);
  if (light) {
    let lightSphere = BABYLON.CreateSphere("ls", { diameter: 1 });
    let material = new BABYLON.StandardMaterial("lsm", scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 0);
    lightSphere.material = material;
    lightSphere.position = light.getAbsolutePosition();
  }
};

// Move a light to a new position
const moveLight = (lightBlock: LightBlock, coordsBlock: CoordsBlock, scene: BABYLON.Scene) => {
  let light = convertLightBlockToLightInScene(lightBlock, scene);
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
const moveLightAlong = (lightBlock: LightBlock, axis: string, steps: number, scene: BABYLON.Scene) => {
  let light = convertLightBlockToLightInScene(lightBlock, scene);
  if (light) {
    //@ts-ignore
    light.position[axis] += steps;
  }
};

// Sets the color of a light
const setLightColor = (lightBlock: LightBlock, color: string, scene: BABYLON.Scene) => {
  let light = convertLightBlockToLightInScene(lightBlock, scene);
  if (light) {
    light.diffuse = BABYLON.Color3.FromHexString(color);
  }
};

// Sets the intensity of a light
const setLightIntensity = (lightBlock: LightBlock, intensity: number, scene: BABYLON.Scene) => {
  let light = convertLightBlockToLightInScene(lightBlock, scene);
  if (light) {
    if (intensity < 0) intensity = 0;
    if (intensity > BRIGHTNESS_MAX) intensity = BRIGHTNESS_MAX;
    light.intensity = intensity * BRIGHTNESS_MULTIPLIER;
  }
};

export { BRIGHTNESS_MAX, BRIGHTNESS_MULTIPLIER, createLight, showLight, moveLight, moveLightAlong, setLightColor, setLightIntensity };
