import {javascriptGenerator} from "blockly/javascript";

export let box = {
    init: function () {
        this.appendValueInput("HEIGHT")
            .setCheck("Number")
            .appendField("Box of height");
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("width");
        this.appendValueInput("DEPTH")
            .setCheck("Number")
            .appendField("depth");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(330);
    },

    transpile: function (block) {
        let height = javascriptGenerator.valueToCode(block, 'HEIGHT', javascriptGenerator.ORDER_NONE);
        let width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE);
        let depth = javascriptGenerator.valueToCode(block, 'DEPTH', javascriptGenerator.ORDER_NONE);

        return [`{type: "box", height: ${height}, width: ${width}, depth: ${depth}}`, javascriptGenerator.ORDER_NONE];
    }
};