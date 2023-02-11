import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let createShapeAndAddTo = {
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
      .appendField("create shape")
    this.appendValueInput("SHAPE")
      .setCheck("SHAPE")
      .appendField("and add to")
      .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "VAR")
      this.appendValueInput("COORDS").setCheck("COORDS").appendField("at coords");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block) {
    let shape = javascriptGenerator.valueToCode(block, "SHAPE", javascriptGenerator.ORDER_NONE);
    let coords = javascriptGenerator.valueToCode(block, "COORDS", javascriptGenerator.ORDER_NONE);
    let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    if (shape === "") return "";
    if (coords === "") return "";

    return `threeD.createShapeAndAddTo(${shape}, ${variable}, ${coords}, scene);`;
  },
};
