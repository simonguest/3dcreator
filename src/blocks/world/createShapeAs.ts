import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let createShapeAs = {
  getUniqueNameForVar: function (prefix) {
    let counter = 1;
    let vars = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
    while (true) {
      var newName = prefix + "_" + counter;
      //@ts-ignore
      if (!vars.map(v => v.name).includes(newName)) {
        return newName;
      }
      counter++;
    }
  },

  init: function () {
    this.appendValueInput("OBJECT")
      .setCheck(["OBJECT", "Array"])
      .appendField("Create shape as")
      .appendField(new Blockly.FieldVariable(this.getUniqueNameForVar("shape")), "VAR");
    this.appendValueInput("COORDS").setCheck("COORDS").appendField("at coords");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block) {
    let object = javascriptGenerator.valueToCode(block, "OBJECT", javascriptGenerator.ORDER_NONE);
    let coords = javascriptGenerator.valueToCode(block, "COORDS", javascriptGenerator.ORDER_NONE);
    let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    if (object === "") return "";
    if (coords === "") return "";

    return `${variable} = ${object}; threeD.createShape(${variable}, ${coords});`;
  },
};
