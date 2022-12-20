import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let setGravity = {
  init: function () {
    this.appendValueInput("MS").setCheck("Number").appendField("set gravity to ");
    this.appendDummyInput().appendField("m/s²");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block) {
    let ms = javascriptGenerator.valueToCode(block, "MS", javascriptGenerator.ORDER_NONE);

    return `threeD.setGravity(${ms});`;
  },
};
