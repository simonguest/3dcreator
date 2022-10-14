import {javascriptGenerator} from "blockly/javascript";

export let createObject = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT", "Array"])
            .appendField("Create");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);

        return `threeD.createObject(${object});`;
    }
};