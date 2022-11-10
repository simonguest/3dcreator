import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let createShapeAs = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "item";
        }
    },
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT", "Array"])
            .appendField("Create shape as")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at coords");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
        if (object === "") return "";
        if (coords === "") return "";

        return `${variable} = ${object}; threeD.createShape(${variable}, ${coords});`;
    }
};