import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let setLightIntensity = {
  getFirstVar: function () {
    let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
    if (varModels.length > 0) {
      return varModels[0]["name"];
    } else {
      return "item";
    }
  },

  init: function () {
    this.appendValueInput("INTENSITY")
      .setCheck("Number")
      .appendField("Set brightness of ")
      .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR")
      .appendField("to");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
  },

  transpile: function (block) {
    let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    let intensity = javascriptGenerator.valueToCode(block, 'INTENSITY', javascriptGenerator.ORDER_NONE);

    return `threeD.setLightIntensity(${variable}, "${intensity}");`;
  },
};
