import * as BABYLON from 'babylonjs';

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
        this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
        this.createScene()
    }

    saveCameraState = () => {
        this.cameraState = this.camera.serialize();
    }

    restoreCameraState = () => {
        if (this.cameraState) {
            this.camera.alpha = this.cameraState.alpha;
            this.camera.beta = this.cameraState.beta;
            this.camera.radius = this.cameraState.radius;
        }
    }

    createScene = () => {
        if (this.camera) this.saveCameraState();
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.restoreCameraState();
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

    setMaterial = (obj) => {
        if (this.material) {
            let material = new BABYLON.StandardMaterial("Material", this.scene);
            material.diffuseTexture = new BABYLON.Texture(`./assets/materials/${this.material}`);
            obj.material = material;
        }
    }

    createBox = (obj) => {
        let box = BABYLON.MeshBuilder.CreateBox(obj.id, {
            height: obj.height,
            width: obj.width,
            depth: obj.depth
        });
        box.position.x = obj.coords.x;
        box.position.y = obj.coords.y;
        box.position.z = obj.coords.z;
        this.setMaterial(box);
    }

    createSphere = (obj) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere(obj.id, {
            segments: 16,
            diameter: obj.diameter
        });
        sphere.position.x = obj.coords.x;
        sphere.position.y = obj.coords.y;
        sphere.position.z = obj.coords.z;
        this.setMaterial(sphere);
        console.log(sphere);
    }

    createObject = (obj) => {
        if (obj.length) {
            // Array of objects
            obj.forEach(o => this.createObject(o));
        }

        switch (obj.type) {
            case "sphere":
                this.createSphere(obj);
                break;
            case "box":
                this.createBox(obj);
                break;
            case "merged":
                let meshes = [];
                obj.objs.forEach(childObj => {
                    //TODO: Check if the object has already been created
                    this.createObject(childObj);
                    meshes.push(this.scene.getMeshById(childObj.id));
                });
                let mergedMesh = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
                mergedMesh.id = obj.id;
                break;
        }
    }

    setPosition = (obj, coords) => {
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh){
            mesh.position.x = coords.x;
            mesh.position.y = coords.y;
            mesh.position.z = coords.z;
        }
    }
}
