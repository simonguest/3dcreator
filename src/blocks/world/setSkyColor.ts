import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let setSkyColor = {
  init: function () {
    this.appendDummyInput()
      .appendField("set color of sky to")
      .appendField(new Blockly.FieldColour("#000", null), "COLOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block) {
    let color = block.getFieldValue("COLOR");

    return `threeD.setSkyColor("${color}");`;
  },
};
