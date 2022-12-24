import { javascriptGenerator } from "blockly/javascript";

export let ground = {
  init: function () {
    this.appendDummyInput().appendField("set ground to");
    this.appendValueInput("LENGTH").setCheck("Number").appendField("length");
    this.appendValueInput("WIDTH").setCheck("Number").appendField("width");
    this.appendValueInput("TILESIZE").setCheck("Number").appendField("tile size");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
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

    return `threeD.createGround({ id: "${block.id}}", type: "ground", size: { w: ${width}, l:${length}}, tileSize: ${tileSize}, material:${material} });`;
  },
};
