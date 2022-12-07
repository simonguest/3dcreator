import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let moveCameraAlong = {
    init: function () {
        this.appendValueInput("UNITS")
            .setCheck("Number")
            .appendField("Move camera along")
            .appendField(new Blockly.FieldDropdown([["x", "x"], ["y", "y"], ["z", "z"]]), "AXIS")
            .appendField("axis by");
        this.appendDummyInput()
            .appendField("units");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    },

    transpile: function (block) {
        let axis = block.getFieldValue("AXIS");
        let units = javascriptGenerator.valueToCode(block, 'UNITS', javascriptGenerator.ORDER_NONE);

        if (units === "") return "";

        return `threeD.moveCameraAlong("${axis}", ${units});`;
    }
};