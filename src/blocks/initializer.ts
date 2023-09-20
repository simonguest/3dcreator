import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

import * as shapes from "./shapes";
import * as world from "./world";
import * as materials from "./materials";
import * as animation from "./animation";
import * as events from "./events";
import * as math from "./math";
import * as physics from "./physics";
import * as lighting from "./lighting";
import * as camera from "./camera";

import { toolbox } from "./toolbox";

Blockly.Theme.defineTheme("theme", {
  base: Blockly.Themes.Zelos,
  name: "theme",
  componentStyles: {
    workspaceBackgroundColour: "#ccc",
    toolboxBackgroundColour: "#5d5d73",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#3d3d53",
    flyoutForegroundColour: "#ddd",
    flyoutOpacity: 0.8,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: "#d0d0d0",
  },
  fontStyle: { family: "Roboto Mono", size: 10 },
});

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
  theme: "theme",
  zoom: { controls: true, wheel: false, startScale: 0.9, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: false },
  trashcan: false,
});

const createCustomBlock = (name, blockType) => {
  Blockly.Blocks[name] = blockType;
  javascriptGenerator[name] = blockType["transpile"];
};

const createCustomBlocks = () => {
  createCustomBlock("skybox", world.skybox);
  createCustomBlock("setSkyColor", world.setSkyColor);
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
  createCustomBlock("createShapeAndAddTo", world.createShapeAndAddTo);
  createCustomBlock("moveShape", world.moveShape);
  createCustomBlock("moveShapeAlong", world.moveShapeAlong);
  createCustomBlock("rotate", world.rotate);
  createCustomBlock("clone", world.clone);
  createCustomBlock("remove", world.remove);
  createCustomBlock("addTo", world.addTo);
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
  createCustomBlock("codeorg", materials.codeorg);
  createCustomBlock("fabric", materials.fabric);
  createCustomBlock("grass", materials.grass);
  createCustomBlock("gravel", materials.gravel);
  createCustomBlock("marble", materials.marble);
  createCustomBlock("planets", materials.planets);
  createCustomBlock("road", materials.road);
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

  createCustomBlock("setGravity", physics.setGravity);
  createCustomBlock("applyForce", physics.applyForce);
  createCustomBlock("setMass", physics.setMass);

  createCustomBlock("createLightAs", lighting.createLightAs);
  createCustomBlock("lightBulb", lighting.lightBulb);
  createCustomBlock("spotlight", lighting.spotlight);
  createCustomBlock("showLight", lighting.showLight);
  createCustomBlock("moveLight", lighting.moveLight);
  createCustomBlock("moveLightAlong", lighting.moveLightAlong);
  createCustomBlock("setLightColor", lighting.setLightColor);
  createCustomBlock("setLightIntensity", lighting.setLightIntensity);
  createCustomBlock("setAmbientLightIntensity", lighting.setAmbientLightIntensity);

  createCustomBlock("moveCamera", camera.moveCamera);
  createCustomBlock("moveCameraAlong", camera.moveCameraAlong);
  createCustomBlock("setCameraType", camera.setCameraType);
  createCustomBlock("pointCameraTowards", camera.pointCameraTowards);
  createCustomBlock("keepDistanceOf", camera.keepDistanceOf);

  createCustomBlock("debug", math.debug);
};

const handleBlocklyResize = () => {
  let blocklyArea = document.getElementById("blocklyArea");
  let blocklyDiv = document.getElementById("blocklyDiv");

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
};

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

const eventInitializer = (runCallback) => {
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
      runCallback();
    }
  });
}

const blocklyInit = (runCallback) => {
  createCustomBlocks();
  handleBlocklyResize();
  eventInitializer(runCallback);
}

export { blocklyInit, workspace };
