import * as BABYLON from 'babylonjs';
window.CANNON = require('cannon');
import { v4 as uuid } from 'uuid';

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

    private runningAnimations = {};
    private actionManagers = [];
    private physicsEnabled: boolean = false;

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

    createScene = (reset?: boolean, physics?: boolean) => {
        console.log("Creating scene");
        if (this.camera) this.saveCameraState();
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        if (reset !== true) this.restoreCameraState();
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.7;
        this.material = null;
        this.runningAnimations = {};
        this.actionManagers.forEach((actionManager) => {
            actionManager.actions.forEach(action => {
                actionManager.unregisterAction(action);
            });
        });
        this.actionManagers = [];
        if (physics === true){
            console.log("Enabling physics");
            let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
            let physicsPlugin = new BABYLON.CannonJSPlugin();
            this.scene.enablePhysics(gravityVector, physicsPlugin);
            this.physicsEnabled = true;
        } else {
            this.physicsEnabled = false;
            this.scene.disablePhysicsEngine();
        }
    }

    runRenderLoop = () => {
        this.engine.runRenderLoop((function () {
            this.scene.render();
        }).bind(this));
    }

    setMaterial = (obj, materialArray) => {
        if (materialArray === null) return; // none selected
        let material = materialArray[0];

        if (material.texture === "matte"){
            let matte = new BABYLON.StandardMaterial("matte", this.scene);
            matte.diffuseColor = BABYLON.Color3.FromHexString(material.color);
            obj.material = matte;
            return;
        }

        if (material.texture === "glass"){
            let glass = new BABYLON.StandardMaterial("glass", this.scene);
            glass.diffuseColor = BABYLON.Color3.FromHexString(material.color);
            glass.alpha = 0.5;
            obj.material = glass;
            return;
        }

        if (material.image) {
            let loadedMaterial = new BABYLON.StandardMaterial("Material", this.scene);
            loadedMaterial.diffuseTexture = new BABYLON.Texture(`./assets/materials/${material.image}`);
            obj.material = loadedMaterial;
            return;
        }

    }

    createCylinder = (obj, coords) => {
        let cylinder = BABYLON.MeshBuilder.CreateCylinder(obj.id, {
            height: obj.size.y,
            diameter: obj.size.z
        });
        cylinder.position.x = coords.x;
        cylinder.position.y = coords.y;
        cylinder.position.z = coords.z;
        this.setMaterial(cylinder, obj.material)
        cylinder.actionManager = new BABYLON.ActionManager(this.scene);
        this.actionManagers.push(cylinder.actionManager);
        if (this.physicsEnabled === true) {
            cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(cylinder, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.7, friction: 1.0 }, this.scene);
        }
    }

    createBox = (obj, coords) => {
        let box = BABYLON.MeshBuilder.CreateBox(obj.id, {
            height: obj.size.y,
            width: obj.size.x,
            depth: obj.size.z
        });
        box.position.x = coords.x;
        box.position.y = coords.y;
        box.position.z = coords.z;
        this.setMaterial(box, obj.material)
        box.actionManager = new BABYLON.ActionManager(this.scene);
        this.actionManagers.push(box.actionManager);
        if (this.physicsEnabled === true) {
            box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.7, friction: 1.0 }, this.scene);
        }
    }

    createSphere = (obj, coords) => {
        let sphere = BABYLON.MeshBuilder.CreateSphere(obj.id, {
            segments: 16,
            diameterX: obj.size.x,
            diameterY: obj.size.y,
            diameterZ: obj.size.z
        });
        sphere.position.x = coords.x;
        sphere.position.y = coords.y;
        sphere.position.z = coords.z;
        this.setMaterial(sphere, obj.material);
        sphere.actionManager = new BABYLON.ActionManager(this.scene);
        this.actionManagers.push(sphere.actionManager);
        if (this.physicsEnabled === true) {
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.7, friction: 1.0 }, this.scene);
        }
    }

    createGround = (obj) => {
        if (this.ground) this.ground.dispose();
        this.ground = BABYLON.MeshBuilder.CreateGround(obj.id, {width: obj.width, height: obj.length}, this.scene);
        this.setMaterial(this.ground, obj.material);
        if (this.physicsEnabled === true) {
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.7, friction: 1.0 }, this.scene);
        }
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

    createShape = (objArray, coordsArray) => {
        let obj = objArray[0];
        let coords = coordsArray[0];

        switch (obj.type) {
            case "sphere":
                this.createSphere(obj, coords);
                break;
            case "box":
                this.createBox(obj, coords);
                break;
            case "cylinder":
                this.createCylinder(obj, coords);
                break;
        }
    }

    clone = (objArray, coordsArray) => {
        let obj = objArray[0];
        let coords = coordsArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            let clonedMesh = mesh.clone(`${uuid()}`, null, null);
            this.move([clonedMesh], coordsArray);
        }
    }

    remove = (objArray) => {
        let obj = objArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            this.scene.removeMesh(mesh);
        }
    }

    move = (objArray, coordsArray) => {
        let obj = objArray[0];
        let coords = coordsArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            mesh.position.x = coords.x;
            mesh.position.y = coords.y;
            mesh.position.z = coords.z;
        }
    }

    moveAlong = (objArray, axis, steps) => {
        let obj = objArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            mesh.position[axis] += steps;
        }
    }

    merge = (objArray, objectsToMerge) => {
        let obj = objArray[0];
        let meshes = [];
        if (objectsToMerge.length === 0) return;
        objectsToMerge.forEach(childObj => {
            //TODO: Check if the object has already been created
            //this.createShape(childObj);
            meshes.push(this.scene.getMeshById(childObj[0].id));
        });
        let mergedMesh = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, true);
        mergedMesh.id = obj.id;
    }

    private convertToRadians = (degrees) => {
        return degrees * (Math.PI / 180);
    }

    rotate = (objArray, axis, degrees) =>{
        let obj = objArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            //mesh.rotation[axis] += this.convertToRadians(degrees);
            mesh.rotate(BABYLON.Axis[axis], this.convertToRadians(degrees));
        }
    }

    createAnimationLoop = (name: string, statements) => {
        {
            this.scene.onBeforeRenderObservable.add(() => {
                if (this.runningAnimations[name] === true)
                    statements();
            });
        }
    }

    startAnimation = (name: string) => {
        this.runningAnimations[name] = true;
    }

    stopAnimation = (name: string) => {
        delete this.runningAnimations[name];
    }

    onClick = (objArray, statements) => {
        if (objArray === undefined) return;
        let obj = objArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnPickTrigger
                    },
                    statements
                )
            );
        }
    }

    getPosition = (objArray, axis) => {
        let obj = objArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh) {
            return mesh.position[axis];
        }
    }

    applyForce = (objArray, axis, units) => {
        let obj = objArray[0];
        let mesh = this.scene.getMeshById(obj.id);
        if (mesh && this.physicsEnabled === true) {
            let vector = { x: 0, y: 0, z: 0};
            vector[axis] = units;
            let direction = new BABYLON.Vector3(vector.x, vector.y, vector.z);
            mesh.physicsImpostor.applyForce(direction.scale(50), mesh.getAbsolutePosition());
        }
    }
}
