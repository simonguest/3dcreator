import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let getPosition = {
  getFirstVar: function () {
    let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
    if (varModels.length > 0) {
      return varModels[0]["name"];
    } else {
      return "item";
    }
  },
  init: function () {
    this.appendDummyInput()
      .appendField("Position of")
      .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR")
      .appendField("along")
      .appendField(
        new Blockly.FieldDropdown([
          ["x", "x"],
          ["y", "y"],
          ["z", "z"],
        ]),
        "AXIS"
      )
      .appendField("axis");
    this.setOutput(true, "Number");
    this.setColour(250);
  },

  transpile: function (block) {
    let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    let axis = block.getFieldValue("AXIS");

    return [`threeD.getPosition(${variable}, "${axis}")`, javascriptGenerator.ORDER_NONE];
  },
};
