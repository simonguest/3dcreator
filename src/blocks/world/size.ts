import {javascriptGenerator} from "blockly/javascript";

export let size = {
    init: function() {
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("l:");
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("h:");
        this.appendValueInput("Z")
            .setCheck("Number")
            .appendField("w:");
        this.setInputsInline(true);
        this.setOutput(true, "SIZE");
        this.setColour(250);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_NONE);
        let y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_NONE);
        let z = javascriptGenerator.valueToCode(block, 'Z', javascriptGenerator.ORDER_NONE);

        return [`{x:${x}, y:${y}, z:${z}}`, javascriptGenerator.ORDER_NONE];
    }
};