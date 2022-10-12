import {setMaterial} from "./blocks/materials";

export class ThreeD {

    constructor(canvas) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
        this.createScene()
    }

    createScene = () => {
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.7;
        this.material = null;
    }

    runRenderLoop = () => {
        this.engine.runRenderLoop((function () {
            this.scene.render();
        }).bind(this));
    }

    createGround = (width, height) => {
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width: width, height: height}, this.scene);
        if (this.material) {
            let material = new BABYLON.StandardMaterial("Material", this.scene);
            material.diffuseTexture = new BABYLON.Texture(`./assets/materials/${this.material}`);
            this.ground.material = material;
        }
    }

    createSphere = (diameter, coords) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere(`sphere-${diameter}-${coords.x}-${coords.y}-${coords.z}`, {
            segments: 16,
            diameter: diameter,
            sideOrientation: BABYLON.Mesh.FRONTSIDE
        }, this.scene);
        sphere.position.x = coords.x;
        sphere.position.y = coords.y;
        sphere.position.z = coords.z;
        if (this.material) {
            let material = new BABYLON.StandardMaterial("Material", this.scene);
            material.diffuseTexture = new BABYLON.Texture(`./assets/materials/${this.material}`);
            sphere.material = material;
        }
    }
}
