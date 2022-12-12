import { javascriptGenerator } from "blockly/javascript";

export let sphere = {
  init: function () {
    this.appendDummyInput().appendField("Sphere ");
    this.appendValueInput("W").setCheck("Number").appendField("width");
    this.appendValueInput("L").setCheck("Number").appendField("length");
    this.appendValueInput("H").setCheck("Number").appendField("height");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "SHAPE");
    this.setColour(200);
    this.setTooltip("A sphere with width, height, and length");
  },

  transpile: function (block) {
    let l = javascriptGenerator.valueToCode(block, "L", javascriptGenerator.ORDER_NONE);
    let w = javascriptGenerator.valueToCode(block, "W", javascriptGenerator.ORDER_NONE);
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "sphere", size: { l: ${l}, w: ${w}, h: ${h}}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
