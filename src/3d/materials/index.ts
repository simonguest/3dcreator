import * as BABYLON from "babylonjs";

const convertMaterialBlockToMaterial = (materialBlock: MaterialBlock) => {
  if (!materialBlock) return null;
  if (!materialBlock[0]) return null;
  let material = materialBlock[0];
  if (material === null) return null;
  return material;
};

// Sets the material of a mesh based on the material block
const setMaterial = (mesh: BABYLON.Mesh, materialBlock: MaterialBlock, scene: BABYLON.Scene) => {
  let material = convertMaterialBlockToMaterial(materialBlock);
  if (material === null) material = { texture: "matte", color: "#cccccc" }; // default material for "none"

  if (material.texture === "matte") {
    var matte = new BABYLON.PBRMetallicRoughnessMaterial("metal", scene);
    matte.baseColor = BABYLON.Color3.FromHexString(material.color);
    matte.roughness = 1.0;
    matte.maxSimultaneousLights = 8;
    mesh.material = matte;
    return;
  }

  if (material.texture === "metal") {
    var metal = new BABYLON.PBRMaterial("metal", scene);
    metal.albedoColor = BABYLON.Color3.FromHexString(material.color);
    metal.metallic = 1.0;
    metal.roughness = 0;
    metal.usePhysicalLightFalloff = false;
    metal.maxSimultaneousLights = 8;
    mesh.material = metal;
    return;
  }

  if (material.texture === "gloss") {
    var gloss = new BABYLON.PBRMetallicRoughnessMaterial("metal", scene);
    gloss.baseColor = BABYLON.Color3.FromHexString(material.color);
    gloss.metallic = 1.0;
    gloss.roughness = 1.0;
    gloss.clearCoat.isEnabled = true;
    gloss.maxSimultaneousLights = 8;
    mesh.material = gloss;
    return;
  }

  if (material.texture === "glass") {
    var glass = new BABYLON.PBRMaterial("glass", scene);
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
    let imageMaterial = new BABYLON.PBRMetallicRoughnessMaterial("Material", scene);
    imageMaterial.baseTexture = new BABYLON.Texture(`./assets/materials/${material.image}`);
    imageMaterial.roughness = material.roughness || 1;
    imageMaterial.metallic = material.metallic || 0;
    imageMaterial.maxSimultaneousLights = 8;
    mesh.material = imageMaterial;
    return;
  }

  if (material.pbr) {
    const PBR_RESOLUTION = "1K";
    let pbrMaterial = new BABYLON.PBRMetallicRoughnessMaterial("PBRMaterial", scene);
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

export { setMaterial };
