import {javascriptGenerator} from "blockly/javascript";

export let createGround = {
    init: function () {
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("Create Ground with width");
        this.appendValueInput("LENGTH")
            .setCheck("Number")
            .appendField("and length");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE);
        let length = javascriptGenerator.valueToCode(block, 'LENGTH', javascriptGenerator.ORDER_NONE);

        return `threeD.createGround(${width}, ${length});`;
    }
};