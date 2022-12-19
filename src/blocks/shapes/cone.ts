import { javascriptGenerator } from "blockly/javascript";

export let cone = {
  init: function () {
    this.appendDummyInput().appendField("cone");
    this.appendValueInput("H").setCheck("Number").appendField("height");
    this.appendValueInput("T").setCheck("Number").appendField("top diameter");
    this.appendValueInput("B").setCheck("Number").appendField("bottom diameter");
    this.appendValueInput("MATERIAL").setCheck("MATERIAL").appendField("material");
    this.setInputsInline(false);
    this.setOutput(true, "SHAPE");
    this.setColour(200);
    this.setTooltip("A cone with height and top/bottom diameters");
  },

  transpile: function (block) {
    let h = javascriptGenerator.valueToCode(block, "H", javascriptGenerator.ORDER_NONE);
    let t = javascriptGenerator.valueToCode(block, "T", javascriptGenerator.ORDER_NONE);
    let b = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_NONE);
    let material = javascriptGenerator.valueToCode(block, "MATERIAL", javascriptGenerator.ORDER_NONE);

    return [
      `[{ id: "${block.id}", type: "cone", size: { h: ${h}, t: ${t}, b: ${b}}, material: ${material}}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
