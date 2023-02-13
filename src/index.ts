import Ammo from "../lib/ammo.js";

import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { ThreeD } from "./3d";

let physicsEnabled = false;
let inspectorEnabled = false;
let ammo = null;
let activeCamera = "ArcRotate";

// Initialize Blockly and the workspace
import { blocklyInit, workspace } from "./blocks/initializer";
blocklyInit(async () => {
  await run(false, physicsEnabled);
});

// Initialize BabylonJS
let threeD = new ThreeD(document.getElementById("runAreaCanvas"));
threeD.runRenderLoop();
window.addEventListener("resize", function () {
  threeD.engine.resize();
});

// Grab any URL parameters
const sample = new URLSearchParams(window.location.search).get("sample");
const phys = new URLSearchParams(window.location.search).get("phys");

// Setup UI
let resetButton = document.getElementById("reset");
let physicsButton = document.getElementById("physics");
let fullscreenButton = document.getElementById("fullscreen");
let debugButton = document.getElementById("debug");
let examplesButton = document.getElementById("examples");
let examplesDropDown = document.getElementById("examples-dropdown");
let vrButton = document.getElementById("vr");
let vrDropDown = document.getElementById("vr-dropdown");
let oculusQuestButton = document.getElementById("oculusQuestButton");
let googleCardboardButton = document.getElementById("googleCardboardButton");
let exitVRButton = document.getElementById("exitVRButton");

// Code execution
async function run(reset?: boolean, physics?: boolean) {
  console.log("Loading ammo physics lib");
  ammo = await Ammo.bind(window)();
  threeD.ammo = ammo;

  // Execute the required code
  let code = javascriptGenerator.workspaceToCode(workspace);
  console.log(`CODE: ${code}`);
  try {
    eval(
      `const run = async () => { threeD.setCameraType("${activeCamera}"); await threeD.createScene(${reset}, ${physics}); ${code} threeD.createCamera();}; run();`
    );
  } catch (err) {
    console.error(err);
  }
}

// Setup the UI
async function init() {
  console.log("Loading workspace from session storage");
  let jsonStr = sessionStorage.getItem("workspace");
  if (jsonStr) Blockly.serialization.workspaces.load(JSON.parse(jsonStr), workspace);

  resetButton.onmouseup = async (e) => {
    e.preventDefault();
    console.log("reset button pressed");
    await run(true, physicsEnabled);
  };

  const setPhysicsButton = () => {
    if (physicsEnabled) {
      physicsButton.classList.remove("physics-off");
      physicsButton.classList.add("physics-on");
    } else {
      physicsButton.classList.remove("physics-on");
      physicsButton.classList.add("physics-off");
    }
  };

  physicsButton.onmouseup = async (e) => {
    e.preventDefault();
    console.log("physics button pressed");
    physicsEnabled = !physicsEnabled;
    setPhysicsButton();
    await run(false, physicsEnabled);
  };

  fullscreenButton.onmouseup = async (e) => {
    e.preventDefault();
    console.log("full screen button pressed");
    threeD.engine.enterFullscreen(false);
    await run(false, physicsEnabled);
  };

  debugButton.onmouseup = async (e) => {
    e.preventDefault();
    console.log("debug button pressed");
    inspectorEnabled = !inspectorEnabled;
    if (inspectorEnabled) {
      threeD.enableInspector();
    } else {
      threeD.disableInspector();
    }
  };

  document.getElementById("clear").onclick = () => {
    console.log("clear session button pressed");
    if (confirm("Clearing the workspace will lose all unsaved work. Continue?")) {
      sessionStorage.removeItem("workspace");
      location.reload();
    }
  };

  vrButton.onmouseup = async (e) => {
    e.preventDefault();
    examplesDropDown.style.display = "none";
    if (getComputedStyle(vrDropDown).display === "none") {
      vrDropDown.style.display = "flex";
    } else {
      vrDropDown.style.display = "none";
    }
  };

  oculusQuestButton.onmouseup = async (e) => {
    e.preventDefault();
    vrDropDown.style.display = "none";
    console.log("oculus quest button pressed");
    await threeD.enableXR();
  };

  googleCardboardButton.onmouseup = async (e) => {
    e.preventDefault();
    vrDropDown.style.display = "none";
    console.log("google cardboard button pressed");
    activeCamera = "VRDeviceOrientationFreeCamera";
    await run(false, physicsEnabled);
  };

  exitVRButton.onmouseup = async (e) => {
    e.preventDefault();
    vrDropDown.style.display = "none";
    console.log("exit vr button pressed");
    activeCamera = "ArcRotate";
    await run(false, physicsEnabled);
  };

  examplesButton.onmouseup = async (e) => {
    e.preventDefault();
    vrDropDown.style.display = "none";
    if (getComputedStyle(examplesDropDown).display === "none") {
      examplesDropDown.style.display = "flex";
    } else {
      examplesDropDown.style.display = "none";
    }
  };

  let projects = document.getElementsByClassName("examples-dropdown-item");
  Array.from(projects).forEach((element) => {
    element.addEventListener("click", async (e) => {
      e.preventDefault();
      let filename = (e.target as Element).getAttribute("data-file");
      let physics = (e.target as Element).getAttribute("data-physics");
      if (confirm("Loading this example workspace will lose all unsaved work. Continue?")) {
        const response = await fetch(`./examples/${filename}`);
        const json = await response.json();
        Blockly.serialization.workspaces.load(json, workspace);
        examplesDropDown.style.display = "none";
        physicsEnabled = physics === "on" ? true : false;
        setPhysicsButton();
      } else {
        examplesDropDown.style.display = "none";
      }
      // reset the scene to get default camera angle
      await run(true, physicsEnabled);
    });
  });

  // see whether should load sample from url params
  if (sample && phys) {
    const response = await fetch(`./examples/${sample}`);
    const json = await response.json();
    Blockly.serialization.workspaces.load(json, workspace);
    physicsEnabled = phys === "1" ? true : false;
    setPhysicsButton();
    // reset the scene to get default camera angle
    await run(true, physicsEnabled);
  }

  document.getElementById("export").onclick = () => {
    console.log("export workspace button pressed");
    let file = new Blob([sessionStorage.getItem("workspace")], {
      type: "text/json",
    });
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "3d-workspace.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  document.getElementById("import").onchange = async (e) => {
    console.log("importing workspace from file");
    let file = e.target["files"][0];
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
    runArea.style.width = `${(e.clientX / windowWidth) * 100}%`;

    let blocklyArea = document.getElementById("blocklyArea");
    blocklyArea.style.width = `${((window.innerWidth - e.clientX) / windowWidth) * 100}%`;

    let columnResizedEvent = new Event("resize");
    window.dispatchEvent(columnResizedEvent);
  };

  // Column resizer control using pointer events to support mouse and touch
  document.getElementById("columnResizer").onpointerdown = () => {
    document.addEventListener("pointermove", broadcastColumnResize);
    document.onpointerup = () => {
      console.log("resize complete");
      document.removeEventListener("pointermove", broadcastColumnResize);
    };
  };

  // Initial scene creation
  await run(true, physicsEnabled);
}

init().then();
