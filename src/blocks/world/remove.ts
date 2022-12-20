import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let remove = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace()).filter((m) => m.type === "SHAPE");;
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "shape_1";
        }
    },
    init: function () {
        this.appendDummyInput()
            .appendField("remove")
            .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "VAR")
            .appendField("from scene");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");

        return `threeD.remove(${variable});`;
    }
};