import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let onKeyPress = {
  init: function () {
    this.appendStatementInput("EVENT")
      .appendField("when key")
      .appendField(
        new Blockly.FieldDropdown(Array.from("abcdefghijklmnopqrstuvwxyz1234567890").map(l => [l.toUpperCase(),l])),
        "KEY"
      )
      .appendField("is pressed");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(295);
  },

  transpile: function (block) {
    let key = block.getFieldValue("KEY");
    let statements = javascriptGenerator.statementToCode(block, "EVENT");

    return `threeD.onKeyPress("${key}", () => {${statements}});`;
  },
};
