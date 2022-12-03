import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

export let gloss = {
  init: function () {
    let input = this.appendDummyInput()
      .appendField("Gloss color: ")
      .appendField(new Blockly.FieldColour("#ff4040", null), "MATERIAL");
    this.setOutput(true, "MATERIAL");
    this.setColour(100);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  transpile: function (block) {
    let material = block.getFieldValue("MATERIAL");

    return [`[ { texture: "gloss", color: "${material}" } ]`, javascriptGenerator.ORDER_NONE];
  },
};
