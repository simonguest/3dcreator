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

    setPosition = (obj, coords) => {
        obj.position.x = coords.x;
        obj.position.y = coords.y;
        obj.position.z = coords.z;
    }

    setMaterial = (obj) => {
        if (this.material) {
            let material = new BABYLON.StandardMaterial("Material", this.scene);
            material.diffuseTexture = new BABYLON.Texture(`./assets/materials/${this.material}`);
            obj.material = material;
        }
    }


    createBox = (width, height, depth, coords) => {
        let box = BABYLON.MeshBuilder.CreateBox(`box-${coords.x}-${coords.y}-${coords.z}`, {
            height: height,
            width: width,
            depth: depth
        });
        this.setPosition(box, coords);
        this.setMaterial(box);
    }

    createSphere = (diameter, coords) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere(`sphere-${diameter}-${coords.x}-${coords.y}-${coords.z}`, {
            segments: 16,
            diameter: diameter
        });
        this.setPosition(sphere, coords);
        this.setMaterial(sphere);
    }

    createObject = (obj, coords) => {
        switch (obj.type) {
            case "sphere":
                this.createSphere(obj.diameter, coords);
                break;
            case "box":
                this.createBox(obj.width, obj.height, obj.depth, coords);
                break;
        }

    }
}
