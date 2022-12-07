import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let moveShape = {
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
            .appendField("Move shape")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("to ");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
        if (coords === "") return "";

        return `threeD.moveShape(${variable}, ${coords});`;
    }
};