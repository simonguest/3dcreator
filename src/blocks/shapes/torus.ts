import { javascriptGenerator } from "blockly/javascript";

export let torus = {
  init: function () {
    this.appendDummyInput().appendField("torus");
    this.appendValueInput("D").setCheck("Number").appendField("diameter");
    this.appendValueInput("T").setCheck("Number").appendField("thickness");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "SHAPE");
    this.setColour(200);
    this.setTooltip("A torus with diameter and thickness");
  },

  transpile: function (block) {
    let d = javascriptGenerator.valueToCode(block, "D", javascriptGenerator.ORDER_NONE);
    let t = javascriptGenerator.valueToCode(block, "T", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "torus", size: { d: ${d}, t: ${t}, s: 16}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
