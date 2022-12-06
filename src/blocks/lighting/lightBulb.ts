import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

export let lightBulb = {
  init: function () {
    this.appendDummyInput()
      .appendField("Light Bulb of color ")
      .appendField(new Blockly.FieldColour("#ffffff", null), "COLOR");
    this.appendValueInput("B").setCheck("Number").appendField("brightness");
    this.setInputsInline(false);
    this.setOutput(true, "OBJECT");
    this.setColour(60);
    this.setTooltip("A light bulb with brightness and color");
  },

  transpile: function (block) {
    let b = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_NONE);
    let color = block.getFieldValue("COLOR");

    return [
      `[{ id: "${block.id}", type: "lightbulb", props: { b: ${b}, c: "${color}" }}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};
