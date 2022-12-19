import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let keepDistanceOf = {
    init: function () {
        this.appendValueInput("UNITS")
            .setCheck("Number")
            .appendField("keep distance of")
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    },

    transpile: function (block) {
        let units = javascriptGenerator.valueToCode(block, 'UNITS', javascriptGenerator.ORDER_NONE);
        if (units === "") return "";

        return `threeD.keepDistanceOf(${units});`;
    }
};