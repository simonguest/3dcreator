import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let addTo = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "item";
        }
    },
    init: function () {
        this.appendDummyInput()
            .appendField("Add")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "CHILD")
            .appendField("to")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "PARENT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let child = javascriptGenerator.nameDB_.getName(block.getFieldValue("CHILD"), "VARIABLE");
        let parent = javascriptGenerator.nameDB_.getName(block.getFieldValue("PARENT"), "VARIABLE");

        return `threeD.addTo(${child}, ${parent});`;
    }
};