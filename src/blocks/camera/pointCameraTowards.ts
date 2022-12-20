import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let pointCameraTowards = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace()).filter((m) => m.type === "SHAPE");
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "item";
        }
    },
    init: function () {
        this.appendDummyInput()
            .appendField("point camera towards ")
            .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "VAR")
            this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");

        return `threeD.pointCameraTowards(${variable});`;
    }
};