import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

import * as shapes from "./blocks/shapes";
import * as world from "./blocks/world";
import * as materials from "./blocks/materials";
import * as animation from "./blocks/animation";
import * as events from "./blocks/events";
import * as math from "./blocks/math";
import * as physics from "./blocks/physics";

import { toolbox } from "./blocks/toolbox";

import { ThreeD } from "./3d";
import { _BabylonLoaderRegistered } from "babylonjs";
import { create } from "domain";

const createCustomBlock = (name, blockType) => {
  Blockly.Blocks[name] = blockType;
  javascriptGenerator[name] = blockType["transpile"];
};

createCustomBlock("skybox", world.skybox);
createCustomBlock("ground", world.ground);

createCustomBlock("sphere", shapes.sphere);
createCustomBlock("box", shapes.box);
createCustomBlock("wall", shapes.wall);
createCustomBlock("cylinder", shapes.cylinder);
createCustomBlock("cone", shapes.cone);
createCustomBlock("torus", shapes.torus);
createCustomBlock("capsule", shapes.capsule);
createCustomBlock("ramp", shapes.ramp);

createCustomBlock("createShape", world.createShape);
createCustomBlock("createShapeAs", world.createShapeAs);
createCustomBlock("move", world.move);
createCustomBlock("moveAlong", world.moveAlong);
createCustomBlock("rotate", world.rotate);
createCustomBlock("clone", world.clone);
createCustomBlock("remove", world.remove);
createCustomBlock("merge", world.merge);
createCustomBlock("coordinates", world.coordinates);
createCustomBlock("getPosition", world.getPosition);

createCustomBlock("none", materials.none);
createCustomBlock("matte", materials.matte);
createCustomBlock("glass", materials.glass);
createCustomBlock("gloss", materials.gloss);
createCustomBlock("metal", materials.metal);
createCustomBlock("bricks", materials.bricks);
createCustomBlock("carpet", materials.carpet);
createCustomBlock("chip", materials.chip);
createCustomBlock("fabric", materials.fabric);
createCustomBlock("grass", materials.grass);
createCustomBlock("marble", materials.marble);
createCustomBlock("planets", materials.planets);
createCustomBlock("roofingtiles", materials.roofingtiles);
createCustomBlock("snow", materials.snow);
createCustomBlock("sports", materials.sports);
createCustomBlock("tiles", materials.tiles);
createCustomBlock("wood", materials.wood);
createCustomBlock("woodfloor", materials.woodfloor);

createCustomBlock("animationLoop", animation.loop);
createCustomBlock("animationStart", animation.start);
createCustomBlock("animationStop", animation.stop);

createCustomBlock("onClick", events.onClick);
createCustomBlock("onKeyPress", events.onKeyPress);

createCustomBlock("applyForce", physics.applyForce);

createCustomBlock("debug", math.debug);

let blocklyArea = document.getElementById("blocklyArea");
let blocklyDiv = document.getElementById("blocklyDiv");
let workspace = Blockly.inject("blocklyDiv", {
  toolbox: toolbox,
  horizontalLayout: false,
  toolboxPosition: "start",
  move: {
    scrollbars: {
      horizontal: false,
      vertical: true,
    },
    drag: true,
    wheel: true,
  },
  trashcan: false,
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
  blocklyDiv.style.left = x + "px";
  blocklyDiv.style.top = y + "px";
  blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
  blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
  Blockly.svgResize(workspace);
};
window.addEventListener("resize", onresize, false);
onresize();
Blockly.svgResize(workspace);

const getUniqueNameForField = (prefix, block) => {
  let counter = 1;
  let existingNames = [];

  var blocks = block.workspace.getBlocksByType(block.type);

  for (var i = 0; i < blocks.length; i++) {
    var name = blocks[i].getFieldValue("NAME");
    existingNames.push(name);
  }

  while (true) {
    var newName = prefix + "_" + counter;
    //@ts-ignore
    if (!existingNames.includes(newName)) {
      return newName;
    }
    counter++;
  }
};

let physicsEnabled = false;

workspace.addChangeListener(async (ev) => {
  if (
    ev.type === Blockly.Events.BLOCK_MOVE ||
    ev.type === Blockly.Events.BLOCK_CHANGE ||
    ev.type === Blockly.Events.BLOCK_DELETE ||
    ev.type === Blockly.Events.BLOCK_CREATE
  ) {
    //Check to see if need to adjust any of the animation blocks
    let eventBlockIds = ev.ids;
    if (!eventBlockIds) {
      eventBlockIds = [ev.blockId];
    }
    var allBlocks = workspace.getAllBlocks(true);
    eventBlockIds.forEach((eventBlockId) => {
      switch (ev.type) {
        case Blockly.Events.BLOCK_CREATE:
          let newBlock = workspace.getBlockById(eventBlockId);
          if (newBlock.type === "animationLoop") {
            // Set the name of new animationLoop to animation_x to be unique
            if (newBlock.getFieldValue("NAME") === "animation") {
              let newUniqueName = getUniqueNameForField("animation", newBlock);
              newBlock.setFieldValue(newUniqueName, "NAME");
            }
            // Iterate through all of the start animation blocks to add to drop down
            allBlocks.forEach((block) => {
              if (block.type === "animationStart" || block.type === "animationStop") {
                block["dropdownOptions"][newBlock.id] = newBlock.getFieldValue("NAME");
              }
            });
          }

          if (newBlock.type === "animationStart" || newBlock.type === "animationStop") {
            let loops = [];
            // Add the animation loops to the dropdown
            allBlocks.forEach(function (block) {
              if (block.type === "animationLoop") {
                var name = block.getField("NAME").getValue();
                newBlock["dropdownOptions"][block.id] = name;
                loops.push(block.id);
              }
            });
          }
          break;
        case Blockly.Events.BLOCK_CHANGE:
          let changedBlock = workspace.getBlockById(eventBlockId);
          if (changedBlock.type === "animationLoop") {
            // Iterate through all of the start animation blocks to update the drop downs
            allBlocks.forEach((block) => {
              // Update the dropdown list
              if (block.type === "animationStart" || block.type === "animationStop") {
                block["dropdownOptions"][changedBlock.id] = changedBlock.getFieldValue("NAME");
                // Quickly switch dropdown selection to force refresh of selected text
                let currentValue = block.getField("ANIMATIONS").getValue();
                //@ts-ignore
                block.getField("ANIMATIONS").getOptions(false);
                block.getField("ANIMATIONS").setValue("none");
                block.getField("ANIMATIONS").setValue(currentValue);
              }
            });
          }
          break;
        case Blockly.Events.BLOCK_DELETE:
          // Iterate through all of the start animation blocks to update the drop downs
          allBlocks.forEach((block) => {
            // Update the dropdown list
            if (block.type === "animationStart" || block.type === "animationStop") {
              delete block["dropdownOptions"][eventBlockId];
              let currentValue = block.getField("ANIMATIONS").getValue();
              if (currentValue === eventBlockId) {
                block.getField("ANIMATIONS").setValue("none");
              }
            }
          });
          break;
      }
    });

    // Write to session storage
    console.log("Writing workspace to session storage");
    let json = Blockly.serialization.workspaces.save(workspace);
    sessionStorage.setItem("workspace", JSON.stringify(json));

    // Refresh the scene
    await run(false, physicsEnabled);
  }
});

/* Babylon init */
let threeD = new ThreeD(document.getElementById("runAreaCanvas"));
threeD.runRenderLoop();

// the canvas/window resize event handler
window.addEventListener("resize", function () {
  threeD.engine.resize();
});

let resetButton = document.getElementById("reset");
let physicsButton = document.getElementById("physics");

async function run(reset?: boolean, physics?: boolean) {
  console.log("Running");

  // Generate the required code
  let code = javascriptGenerator.workspaceToCode(workspace);
  console.log(`CODE: ${code}`);
  eval(`threeD.createScene(${reset}, ${physics}); ${code} stop();`);
}

async function init() {
  console.log("Loading workspace from session storage");
  let jsonStr = sessionStorage.getItem("workspace");
  if (jsonStr) Blockly.serialization.workspaces.load(JSON.parse(jsonStr), workspace);

  resetButton.onmouseup = async (e) => {
    e.preventDefault();
    console.log("reset button pressed");
    await run(true, physicsEnabled);
  };

  physicsButton.onmouseup = async (e) => {
    e.preventDefault();
    console.log("physics button pressed");
    if (physicsButton.getAttribute("data-enabled") === "false") {
      console.log("Physics engine enabled");
      physicsButton.setAttribute("data-enabled", "true");
      physicsButton.innerText = "Disable Physics";
      physicsEnabled = true;
      await run(false, true);
    } else {
      console.log("Physics engine disabled");
      physicsButton.setAttribute("data-enabled", "false");
      physicsButton.innerText = "Enable Physics";
      physicsEnabled = false;
      await run(false, false);
    }
  };

  document.getElementById("clear").onclick = () => {
    console.log("clear session button pressed");
    if (confirm("Clearing the workspace will lose all unsaved work. Continue?")) {
      sessionStorage.removeItem("workspace");
      location.reload();
    }
  };
  document.getElementById("examples")["value"] = "";
  document.getElementById("examples").onchange = async (e) => {
    console.log("example workspace changed");
    if (e.target["value"]) {
      if (confirm("Loading this example workspace will lose all unsaved work. Continue?")) {
        const response = await fetch(`./examples/${e.target["value"]}`);
        const json = await response.json();
        Blockly.serialization.workspaces.load(json, workspace);
      }
    }
  };

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

  document.getElementById("import").onchange = (e) => {
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

  document.getElementById("columnResizer").onmousedown = () => {
    document.addEventListener("mousemove", broadcastColumnResize);
    document.onmouseup = () => {
      console.log("done now");
      document.removeEventListener("mousemove", broadcastColumnResize);
    };
  };
}

init().then();
