import { javascriptGenerator } from "blockly/javascript";
import Blockly from "blockly";

export let createLightAs = {
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
    this.appendValueInput("LIGHT")
      .setCheck("LIGHT")
      .appendField("create light as")
      .appendField(new Blockly.FieldVariable(this.getUniqueNameForVar("light")), "VAR");
    this.appendValueInput("COORDS").setCheck("COORDS").appendField("at coords");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
  },

  transpile: function (block) {
    let light = javascriptGenerator.valueToCode(block, "LIGHT", javascriptGenerator.ORDER_NONE);
    let coords = javascriptGenerator.valueToCode(block, "COORDS", javascriptGenerator.ORDER_NONE);
    let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    if (light === "") return "";
    if (coords === "") return "";

    return `${variable} = ${light}; threeD.createLight(${variable}, ${coords});`;
  },
};
