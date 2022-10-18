import { v4 as uuid } from 'uuid';
import {javascriptGenerator} from "blockly/javascript";

export let ground = {
    init: function () {
        this.appendValueInput("LENGTH")
            .setCheck("Number")
            .appendField("Ground with length");
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("and width");
        this.appendValueInput("MATERIAL")
            .setCheck("MATERIAL")
            .appendField("with material");
        this.setInputsInline(false);
        this.setOutput(true, "OBJECT");
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE);
        let length = javascriptGenerator.valueToCode(block, 'LENGTH', javascriptGenerator.ORDER_NONE);
        let material = javascriptGenerator.valueToCode(block, 'MATERIAL', javascriptGenerator.ORDER_NONE);

        return [`{ id: "${uuid()}", type: "ground", width: ${width}, length:${length}, material:${material} }`, javascriptGenerator.ORDER_NONE];
    }
};