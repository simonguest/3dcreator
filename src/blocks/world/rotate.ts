import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let rotate = {
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
            .appendField("rotate")
            .appendField(new Blockly.FieldVariable(this.getFirstVar(), null, ["SHAPE"], "SHAPE"), "VAR");
        this.appendValueInput("DEGREES")
            .setCheck("Number")
            .appendField("on")
            .appendField(new Blockly.FieldDropdown([["x", "X"], ["y", "Y"], ["z", "Z"]]), "AXIS")
            .appendField("axis by");
        this.appendDummyInput()
            .appendField("degrees");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
        let axis = block.getFieldValue("AXIS");
        let degrees = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_NONE);

        return `threeD.rotate(${variable}, "${axis}", ${degrees}, scene);`;
    }
};