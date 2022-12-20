import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let addTo = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace()).filter((m) => m.type === "SHAPE");
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "shape_1";
        }
    },
    init: function () {
        this.appendDummyInput()
            .appendField("add")
            .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "CHILD")
            .appendField("to")
            .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "PARENT");
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