import {javascriptGenerator} from "blockly/javascript";
import { v4 as uuid } from 'uuid';

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
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at ");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(330);
    },

    transpile: function (block) {
        let height = javascriptGenerator.valueToCode(block, 'HEIGHT', javascriptGenerator.ORDER_NONE);
        let width = javascriptGenerator.valueToCode(block, 'WIDTH', javascriptGenerator.ORDER_NONE);
        let depth = javascriptGenerator.valueToCode(block, 'DEPTH', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);

        return [`{ id: "${uuid()}", type: "box", height: ${height}, width: ${width}, depth: ${depth}, coords: ${coords}}`, javascriptGenerator.ORDER_NONE];
    }
};