import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let rotate = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT", "Array"])
            .appendField("Rotate");
        this.appendValueInput("DEGREES")
            .setCheck("Number")
            .appendField("on")
            .appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"], ["z", "z"]]), "AXIS")
            .appendField("axis by");
        this.appendDummyInput()
            .appendField("degrees");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);
        let axis = block.getFieldValue("AXIS");
        let degrees = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_NONE);

        return `threeD.rotate(${object}, "${axis}", ${degrees});`;
    }
};