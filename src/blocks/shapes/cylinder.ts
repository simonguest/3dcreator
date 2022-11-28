import { javascriptGenerator } from "blockly/javascript";

export let cylinder = {
  init: function () {
    this.appendDummyInput().appendField("Cylinder ");
    this.appendValueInput("H").setCheck("Number").appendField("h:");
    this.appendValueInput("D").setCheck("Number").appendField("d:");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("with material");
    this.setInputsInline(true);
    this.setOutput(true, "OBJECT");
    this.setColour(200);
  },

  transpile: function (block) {
    let d = javascriptGenerator.valueToCode(block, "D", javascriptGenerator.ORDER_NONE);
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "cylinder", size: { d: ${d}, h: ${h}}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
