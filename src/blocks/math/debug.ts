import {javascriptGenerator} from "blockly/javascript";

export let debug = {
    init: function () {
        this.appendValueInput("OBJECT")
            .appendField("debug");
        this.appendDummyInput()
            .appendField("to console");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);
        if (object === "") return "";

        return `console.log(${object});`;
    }
};