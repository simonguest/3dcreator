import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

export let spotlight = {
  init: function () {
    this.appendDummyInput()
      .appendField("spotlight of color ")
      .appendField(new Blockly.FieldColour("#ffffff", null), "COLOR");
    this.appendValueInput("B").setCheck("Number").appendField("brightness");
    this.appendValueInput("X").setCheck("Number").appendField("angle (x)");
    this.appendValueInput("Y").setCheck("Number").appendField("angle (y)");
    this.appendValueInput("Z").setCheck("Number").appendField("angle (z)");
    this.appendValueInput("S").setCheck("Number").appendField("beam size");
    this.appendValueInput("R").setCheck("Number").appendField("range");
    this.setInputsInline(false);
    this.setOutput(true, "LIGHT");
    this.setColour(60);
    this.setTooltip("A spotlight with brightness and color");
  },

  transpile: function (block) {
    let b = javascriptGenerator.valueToCode(block, "B", javascriptGenerator.ORDER_NONE);
    let x = javascriptGenerator.valueToCode(block, "X", javascriptGenerator.ORDER_NONE);
    let y = javascriptGenerator.valueToCode(block, "Y", javascriptGenerator.ORDER_NONE);
    let z = javascriptGenerator.valueToCode(block, "Z", javascriptGenerator.ORDER_NONE);
    let s = javascriptGenerator.valueToCode(block, "S", javascriptGenerator.ORDER_NONE);
    let r = javascriptGenerator.valueToCode(block, "R", javascriptGenerator.ORDER_NONE);
    let color = block.getFieldValue("COLOR");

    return [
      `[{ id: "${block.id}", type: "spotlight", props: { b: ${b}, x: ${x}, y:${y}, z:${z}, s:${s}, r:${r}, c: "${color}" }}]`,
      javascriptGenerator.ORDER_NONE,
    ];
  },
};