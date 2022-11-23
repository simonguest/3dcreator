import {javascriptGenerator} from "blockly/javascript";

export let createShape = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT", "Array"])
            .appendField("Create shape");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at coords");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);
        if (object === "") return "";
        if (coords === "") return "";

        return `threeD.createShape(${object}, ${coords});`;
    }
};