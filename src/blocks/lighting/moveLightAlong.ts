import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let moveLightAlong = {
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
            .appendField("move light")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR");
        this.appendValueInput("STEPS")
            .setCheck("Number")
            .appendField("along")
            .appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"], ["z", "z"]]), "AXIS")
            .appendField("axis by");
        this.appendDummyInput()
            .appendField("steps");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
        let axis = block.getFieldValue("AXIS");
        let steps = javascriptGenerator.valueToCode(block, 'STEPS', javascriptGenerator.ORDER_NONE);

        if (steps === "") return "";

        return `threeD.moveLightAlong(${variable}, "${axis}", ${steps});`;
    }
};