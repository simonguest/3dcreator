import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let applyForce = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "";
        }
    },
    init: function () {
        this.appendDummyInput()
            .appendField("Apply force to")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR");
        this.appendValueInput("UNITS")
            .setCheck("Number")
            .appendField("along")
            .appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"], ["z", "z"]]), "AXIS")
            .appendField("axis by");
        this.appendDummyInput()
            .appendField("units");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
        let axis = block.getFieldValue("AXIS");
        let units = javascriptGenerator.valueToCode(block, 'UNITS', javascriptGenerator.ORDER_NONE);

        if (units === "") return "";

        return `threeD.applyForce(${variable}, "${axis}", ${units});`;
    }
};