import { v4 as uuid } from 'uuid';
import {javascriptGenerator} from "blockly/javascript";

export let ground = {
    init: function () {
        this.appendValueInput("LENGTH")
            .setCheck("Number")
            .appendField("Set ground to");
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("x");
        this.appendValueInput("MATERIAL")
            .setCheck("MATERIAL")
            .appendField("with material");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE);
        let length = javascriptGenerator.valueToCode(block, 'LENGTH', javascriptGenerator.ORDER_NONE);
        let material = javascriptGenerator.valueToCode(block, 'MATERIAL', javascriptGenerator.ORDER_NONE);

        return `threeD.createGround({ id: "${uuid()}", type: "ground", width: ${width}, length:${length}, material:${material} });`;
    }
};