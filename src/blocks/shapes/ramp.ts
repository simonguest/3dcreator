import { javascriptGenerator } from "blockly/javascript";

export let ramp = {
  init: function () {
    this.appendDummyInput().appendField("ramp");
    this.appendValueInput("W").setCheck("Number").appendField("width");
    this.appendValueInput("H").setCheck("Number").appendField("height");
    this.appendValueInput("L").setCheck("Number").appendField("length");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "SHAPE");
    this.setColour(200);
    this.setTooltip("A ramp with height, width, and length");
  },

  transpile: function (block) {
    let w = javascriptGenerator.valueToCode(block, "W", javascriptGenerator.ORDER_NONE);
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let l = javascriptGenerator.valueToCode(block, "L", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "ramp", size: { w: ${w}, h: ${h}, l: ${l}}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
