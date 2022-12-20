import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let getPosition = {
  getFirstVar: function () {
    let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace()).filter((m) => m.type === "SHAPE");
    if (varModels.length > 0) {
      return varModels[0]["name"];
    } else {
      return "shape_1";
    }
  },
  init: function () {
    this.appendDummyInput()
      .appendField("position of")
      .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "VAR")
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
