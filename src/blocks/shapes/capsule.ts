import { javascriptGenerator } from "blockly/javascript";

export let capsule = {
  init: function () {
    this.appendDummyInput().appendField("capsule");
    this.appendValueInput("H").setCheck("Number").appendField("height");
    this.appendValueInput("D").setCheck("Number").appendField("diameter");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "SHAPE");
    this.setColour(200);
    this.setTooltip("A capsule with height and diameter");
  },

  transpile: function (block) {
    let d = javascriptGenerator.valueToCode(block, "D", javascriptGenerator.ORDER_NONE);
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "capsule", size: { d: ${d}, h: ${h}}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
