import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let setLightColor = {
  getFirstVar: function() {
    let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace()).filter((m) => m.type === "LIGHT");;
    if (varModels.length > 0){
        return varModels[0]["name"];
    } else {
        return "light_1";
    }
  },

  init: function () {
    this.appendDummyInput()
      .appendField("set color of ")
      .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["LIGHT"], "LIGHT"), "VAR")
      .appendField("to")
      .appendField(new Blockly.FieldColour("#ffffff", null), "COLOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
  },

  transpile: function (block) {
    let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    let color = block.getFieldValue("COLOR");

    return `threeD.setLightColor(${variable}, "${color}");`;
  },
};
