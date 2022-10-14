import Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';


import * as objects from "./blocks/objects";
import * as world from "./blocks/world";
import * as coords from "./blocks/coords";
import * as materials from "./blocks/materials";

import {toolbox} from "./blocks/toolbox";

import {ThreeD} from "./3d";

const createCustomBlock = (name, blockType) => {
    Blockly.Blocks[name] = blockType;
    javascriptGenerator[name] = blockType["transpile"];
}

createCustomBlock("coordinates", coords.coordinates);
createCustomBlock("createGround", world.createGround);
createCustomBlock("createObject", world.createObject);
createCustomBlock("setPosition", world.setPosition);

createCustomBlock("sphere", objects.sphere);
createCustomBlock("box", objects.box);

createCustomBlock("setMaterial", materials.setMaterial);
createCustomBlock("none", materials.none);
createCustomBlock("earth", materials.earth);
createCustomBlock("building", materials.building);

let blocklyArea = document.getElementById('blocklyArea');
let blocklyDiv = document.getElementById('blocklyDiv');
let workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    horizontalLayout: false,
    toolboxPosition: "start",
    move: {
        scrollbars: {
            horizontal: false,
            vertical: true
        },
        drag: true,
        wheel: true
    },
    trashcan: false
});
let onresize = function () {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element: HTMLElement = blocklyArea;
    let x = 0;
    let y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent as HTMLElement;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

workspace.addChangeListener((ev) => {
    if ((ev.type === Blockly.Events.BLOCK_MOVE) || (ev.type === Blockly.Events.BLOCK_CHANGE) || (ev.type === Blockly.Events.BLOCK_DELETE) || (ev.type === Blockly.Events.BLOCK_CREATE)) {
        console.log("Writing workspace to session storage");
        let json = Blockly.serialization.workspaces.save(workspace);
        sessionStorage.setItem("workspace", JSON.stringify(json));
    }
});

/* Babylon init */
let threeD = new ThreeD(document.getElementById('runAreaCanvas'));
threeD.runRenderLoop();

// the canvas/window resize event handler
window.addEventListener('resize', function () {
    threeD.engine.resize();
});

let runButton = document.getElementById("run");
let stopButton = document.getElementById("stop");
let pauseButton = document.getElementById("pause");
let resumeButton = document.getElementById("resume");

async function run() {
    console.log("Running");
    runButton.setAttribute("disabled", "true");
    stopButton.removeAttribute("disabled");
    pauseButton.removeAttribute("disabled");

    // Generate the required code
    let code = javascriptGenerator.workspaceToCode(workspace);
    console.log(code);
    eval("threeD.createScene(); " + code + " stop(); ");
}

function stop() {
    console.log("Stopping...");
    stopButton.setAttribute("disabled", "true");
    runButton.removeAttribute("disabled");
    pauseButton.setAttribute("disabled", "true");
    resumeButton.setAttribute("disabled", "true");
}

function pause() {
    pauseButton.setAttribute("disabled", "true");
    resumeButton.removeAttribute("disabled");
}

function resume() {
    resumeButton.setAttribute("disabled", "true");
    pauseButton.removeAttribute("disabled");
}

async function init() {
    console.log("Loading workspace from session storage");
    let jsonStr = sessionStorage.getItem("workspace");
    if (jsonStr) Blockly.serialization.workspaces.load(JSON.parse(jsonStr), workspace);

    runButton.onmousedown = async (e) => {
        e.preventDefault();
        console.log("run button pressed");
        await run();
    }

    pauseButton.onmousedown = (e) => {
        e.preventDefault();
        console.log("pause button pressed");
        pause();
    }

    resumeButton.onmousedown = (e) => {
        e.preventDefault();
        console.log("resume button pressed");
        resume();
    }

    stopButton.onclick = (e) => {
        e.preventDefault();
        console.log("stop button pressed");
        stop();
    }

    document.getElementById("debug").onclick = () => {
        console.log("debug button pressed");
    }

    document.getElementById("clear").onclick = () => {
        console.log("clear session button pressed");
        if (confirm("Clearing the workspace will lose all unsaved work. Continue?")) {
            sessionStorage.removeItem("workspace");
            location.reload();
        }
    }
    document.getElementById("examples")['value'] = "";
    document.getElementById("examples").onchange = async (e) => {
        console.log("example workspace changed");
        if (e.target['value']) {
            if (confirm("Loading this example workspace will lose all unsaved work. Continue?")) {
                const response = await fetch(`./examples/${e.target['value']}`);
                const json = await response.json();
                Blockly.serialization.workspaces.load(json, workspace);
            }
        }
    }

    document.getElementById("export").onclick = () => {
        console.log("export workspace button pressed");
        let file = new Blob([sessionStorage.getItem("workspace")], {type: "text/json"});
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = "3d-artist-workspace.json";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    document.getElementById("import").onchange = (e) => {
        console.log("importing workspace from file");
        let file = e.target['files'][0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function (e) {
            let json = e.target.result;
            Blockly.serialization.workspaces.load(JSON.parse(json.toString()), workspace);
            sessionStorage.setItem("workspace", json.toString());
        };
        reader.readAsText(file);
    };

    const broadcastColumnResize = (e) => {
        let windowWidth = window.innerWidth;
        let runArea = document.getElementById("runArea");
        runArea.style.width = `${e.clientX / windowWidth * 100}%`;

        let blocklyArea = document.getElementById("blocklyArea");
        blocklyArea.style.width = `${(window.innerWidth - e.clientX) / windowWidth * 100}%`;

        let columnResizedEvent = new Event('resize');
        window.dispatchEvent(columnResizedEvent);
    }

    document.getElementById("columnResizer").onmousedown = () => {
        document.addEventListener("mousemove", broadcastColumnResize);
        document.onmouseup = () => {
            console.log("done now");
            document.removeEventListener("mousemove", broadcastColumnResize);
        }
    }
}

init().then();