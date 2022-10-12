import {createSphere} from "./blocks/objects";

export class TD {
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

        // Our built-in 'ground' shape.
        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 12, height: 12}, this.scene);
        let groundMaterial = new BABYLON.StandardMaterial("Ground Material", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture('../assets/textures/floor.png');
        ground.material = groundMaterial;
    }

    runRenderLoop = () => {
        this.engine.runRenderLoop((function () {
            this.scene.render();
        }).bind(this));
    }

    createSphere = (diameter, x, y, z) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere(`sphere-${diameter}-${x}-${y}`, {
            segments: 16,
            diameter: diameter,
            sideOrientation: BABYLON.Mesh.FRONTSIDE
        }, this.scene);
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
    }
}
