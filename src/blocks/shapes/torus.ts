import { javascriptGenerator } from "blockly/javascript";

export let torus = {
  init: function () {
    this.appendDummyInput().appendField("Torus ");
    this.appendValueInput("D").setCheck("Number").appendField("d:");
    this.appendValueInput("T").setCheck("Number").appendField("t:");
    this.appendValueInput("S").setCheck("Number").appendField("s:");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("with material");
    this.setInputsInline(true);
    this.setOutput(true, "OBJECT");
    this.setColour(200);
    this.setTooltip("A torus with diameter, thickness, and sides");
  },

  transpile: function (block) {
    let d = javascriptGenerator.valueToCode(block, "D", javascriptGenerator.ORDER_NONE);
    let t = javascriptGenerator.valueToCode(block, "T", javascriptGenerator.ORDER_NONE);
    let s = javascriptGenerator.valueToCode(block, "S", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "torus", size: { d: ${d}, t: ${t}, s: ${s}}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
