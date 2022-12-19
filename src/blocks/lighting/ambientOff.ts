import Blockly from "blockly";

export let ambientOff = {
  init: function () {
    this.appendDummyInput()
      .appendField("turn off ambient light")
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  transpile: function (block) {
    return `threeD.ambientOff();`;
  },
};
