import {javascriptGenerator} from "blockly/javascript";

export let createShape = {
    init: function () {
        this.appendValueInput("SHAPE")
            .setCheck("SHAPE")
            .appendField("create shape");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at coords");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let shape = javascriptGenerator.valueToCode(block, 'SHAPE', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);
        if (shape === "") return "";
        if (coords === "") return "";

        return `threeD.createShape(${shape}, ${coords});`;
    }
};