import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let setAmbientLightIntensity = {
  init: function () {
    this.appendValueInput("INTENSITY")
      .setCheck("Number")
      .appendField("set brightness of ambient light to")
      .appendField("to");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
  },

  transpile: function (block) {
    let intensity = javascriptGenerator.valueToCode(block, 'INTENSITY', javascriptGenerator.ORDER_NONE);

    return `threeD.setAmbientLightIntensity("${intensity}");`;
  },
};
