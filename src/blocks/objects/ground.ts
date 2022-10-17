import { v4 as uuid } from 'uuid';
import {javascriptGenerator} from "blockly/javascript";

export let ground = {
    init: function () {
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("Ground with width");
        this.appendValueInput("DEPTH")
            .setCheck("Number")
            .appendField("and depth");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE);
        let depth = javascriptGenerator.valueToCode(block, 'DEPTH', javascriptGenerator.ORDER_NONE);

        return [`{ id: "${uuid()}", type: "ground", width: ${width}, depth:${depth} }`, javascriptGenerator.ORDER_NONE];
    }
};