import { v4 as uuid } from "uuid";
import { javascriptGenerator } from "blockly/javascript";

export let ground = {
  init: function () {
    this.appendValueInput("LENGTH").setCheck("Number").appendField("Set ground to");
    this.appendValueInput("WIDTH").setCheck("Number").appendField("x");
    this.appendValueInput("TILESIZE").setCheck("Number").appendField("tile size");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("with material");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  transpile: function (block) {
    let width = javascriptGenerator.valueToCode(block, "WIDTH", javascriptGenerator.ORDER_NONE);
    let length = javascriptGenerator.valueToCode(block, "LENGTH", javascriptGenerator.ORDER_NONE);
    let tileSize = javascriptGenerator.valueToCode(block, "TILESIZE", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return `threeD.createGround({ id: "${uuid()}", type: "ground", width: ${width}, length:${length}, tileSize: ${tileSize}, material:${material} });`;
  },
};
