import Blockly from "blockly";

export let amibentOn = {
  init: function () {
    let input = this.appendDummyInput()
      .appendField("turn on ambient light of color: ")
      .appendField(new Blockly.FieldColour("#ffffff", null), "COLOR");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(60);
    this.setTooltip("");
    this.setHelpUrl("");
  },

  transpile: function (block) {
    let color = block.getFieldValue("COLOR");
    return `threeD.ambientOn("${color}");`;
  },
};
