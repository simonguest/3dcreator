import { javascriptGenerator } from "blockly/javascript";

export let wall = {
  init: function () {
    this.appendDummyInput().appendField("Wall ");
    this.appendValueInput("W").setCheck("Number").appendField("width");
    this.appendValueInput("H").setCheck("Number").appendField("height");
    this.appendValueInput("S").setCheck("Number").appendField("tile size");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "OBJECT");
    this.setColour(200);
    this.setTooltip("A wall with width, height, and tile size");
  },

  transpile: function (block) {
    let w = javascriptGenerator.valueToCode(block, "W", javascriptGenerator.ORDER_NONE);
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let s = javascriptGenerator.valueToCode(block, "S", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "wall", size: { w: ${w}, h: ${h}, s:${s} }, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
