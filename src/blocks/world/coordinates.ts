import {javascriptGenerator} from "blockly/javascript";

export let coordinates = {
    init: function() {
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("x:");
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("y:");
        this.appendValueInput("Z")
            .setCheck("Number")
            .appendField("z:");
        this.setInputsInline(false);
        this.setOutput(true, "COORDS");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_NONE);
        let y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_NONE);
        let z = javascriptGenerator.valueToCode(block, 'Z', javascriptGenerator.ORDER_NONE);

        return [`[{x:${x}, y:${y}, z:${z}}]`, javascriptGenerator.ORDER_NONE];
    }
};