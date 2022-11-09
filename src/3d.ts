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

    setMaterial = (obj, material) => {
        if (material === null) return;

        let loadedMaterial = new BABYLON.StandardMaterial("Material", this.scene);
        loadedMaterial.diffuseTexture = new BABYLON.Texture(`./assets/materials/${material}`);
        obj.material = loadedMaterial;

    }

    createBox = (obj) => {
        let box = BABYLON.MeshBuilder.CreateBox(obj.id, {
            height: obj.size.y,
            width: obj.size.x,
            depth: obj.size.z
        });
        box.position.x = obj.coords.x;
        box.position.y = obj.coords.y;
        box.position.z = obj.coords.z;
        this.setMaterial(box, obj.material);
    }

    createSphere = (obj) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere(obj.id, {
            segments: 16,
            diameterX: obj.size.x,
            diameterY: obj.size.y,
            diameterZ: obj.size.z
        });
        sphere.position.x = obj.coords.x;
        sphere.position.y = obj.coords.y;
        sphere.position.z = obj.coords.z;
        this.setMaterial(sphere, obj.material);
    }

    createGround = (obj) => {
        if (this.ground) this.ground.dispose();
        this.ground = BABYLON.MeshBuilder.CreateGround(obj.id, {width: obj.width, height: obj.length}, this.scene);
        this.setMaterial(this.ground, obj.material);
    }

    createSkybox = (obj) => {
        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(`./assets/skyboxes/${obj.asset}/${obj.asset}`, this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    create = (obj) => {
        if (obj.constructor === Array) {
            obj.forEach(o => this.create(o));
        }

        switch (obj.type) {
            case "sphere":
                this.createSphere(obj);
                break;
            case "box":
                this.createBox(obj);
                break;
            case "ground":
                this.createGround(obj);
                break;
            case "merged":
                let meshes = [];
                obj.objs.forEach(childObj => {
                    //TODO: Check if the object has already been created
                    this.create(childObj);
                    meshes.push(this.scene.getMeshById(childObj.id));
                });
                let mergedMesh = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
                mergedMesh.id = obj.id;
                break;
        }
    }

    move = (obj, coords) => {
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            mesh.position.x = coords.x;
            mesh.position.y = coords.y;
            mesh.position.z = coords.z;
        }
    }

    private convertToRadians = (degrees) => {
        return degrees * (Math.PI / 180);
    }

    rotate = (obj, axis, degrees) =>{
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            mesh.rotation[axis] = this.convertToRadians(degrees);
        }
    }
}
