let engine = null;
let scene = null;

export const init = (canvas) => {
    engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape.
    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
    ground.material = groundMaterial;
}

export const getScene = () => {
    return scene;
}

export const runRenderLoop = () => {
    engine.runRenderLoop(function () {
        scene.render();
    });
}

export const getEngine = () => {
    return engine;
}


// export const createEngine = (canvas) => {
//     return new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
// }

// export const createDefaultScene = (canvas, engine) => {
//     let scene = new BABYLON.Scene(engine);
//     let camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(65), 10, BABYLON.Vector3.Zero(), scene);
//
//     // This attaches the camera to the canvas
//     camera.attachControl(canvas, true);
//
//     // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//     let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
//
//     // Default intensity is 1. Let's dim the light a small amount
//     light.intensity = 0.7;
//
//     // Our built-in 'ground' shape.
//     let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
//     let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
//     ground.material = groundMaterial;
//
//     return scene;
// }

export const createSphere = (diameter, x, y) => {
    let sphere = BABYLON.MeshBuilder.CreateSphere(`sphere-${diameter}-${x}-${y}`, {
        segments: 16,
        diameter: diameter,
        sideOrientation: BABYLON.Mesh.FRONTSIDE
    }, scene);
    sphere.position.y = x;
    sphere.position.x = y;
}