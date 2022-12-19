import { javascriptGenerator } from "blockly/javascript";

export let wall = {
  init: function () {
    this.appendDummyInput().appendField("wall");
    this.appendValueInput("W").setCheck("Number").appendField("width");
    this.appendValueInput("H").setCheck("Number").appendField("height");
    this.appendValueInput("S").setCheck("Number").appendField("tile size");
    this.appendValueInput("R").setCheck("Number").appendField("rotation");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "SHAPE");
    this.setColour(200);
    this.setTooltip("A wall with width, height, tile size, and rotation on y axis");
  },

  transpile: function (block) {
    let w = javascriptGenerator.valueToCode(block, "W", javascriptGenerator.ORDER_NONE);
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let s = javascriptGenerator.valueToCode(block, "S", javascriptGenerator.ORDER_NONE);
    let r = javascriptGenerator.valueToCode(block, "R", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "wall", size: { w: ${w}, h: ${h}, s:${s}, r:${r} }, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
