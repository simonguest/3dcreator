import {javascriptGenerator} from "blockly/javascript";
import { v4 as uuid } from 'uuid';

export let sphere = {
    init: function () {
        this.appendValueInput("DIAMETER")
            .setCheck("Number")
            .appendField("Sphere of diameter ");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at ");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(330);
    },

    transpile: function (block) {
        let diameter = javascriptGenerator.valueToCode(block, 'DIAMETER', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);
        if (coords === "") coords = "{ x: 0, y: 0, z: 0}";

        return [`{ id: "${uuid()}", type: "sphere", diameter: ${diameter}, coords: ${coords}}`, javascriptGenerator.ORDER_NONE];
    }
};