import {javascriptGenerator} from "blockly/javascript";
import { v4 as uuid } from 'uuid';

export let box = {
    init: function () {
        this.appendValueInput("SIZE")
            .setCheck("SIZE")
            .appendField("Box of size ");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at coords");
        this.appendValueInput("MATERIAL")
            .setCheck("MATERIAL")
            .appendField("with material");
        this.setInputsInline(false);
        this.setOutput(true, "OBJECT");
        this.setColour(200);
    },

    transpile: function (block) {
        let size = javascriptGenerator.valueToCode(block, 'SIZE', javascriptGenerator.ORDER_NONE);
        if (size === "") size = "{ x: 0, y: 0, z: 0}";
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);
        if (coords === "") coords = "{ x: 0, y: 0, z: 0}";
        let material = javascriptGenerator.valueToCode(block, 'MATERIAL', javascriptGenerator.ORDER_NONE);

        return [`{ id: "${uuid()}", type: "box", size: ${size}, coords: ${coords}, material: ${material}}`, javascriptGenerator.ORDER_NONE];
    }
};