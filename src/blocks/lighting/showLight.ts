import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let showLight = {
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
            .appendField("Show light")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR")
            .appendField("in scene");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");

        return `threeD.showLight(${variable});`;
    }
};