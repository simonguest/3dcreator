import {javascriptGenerator} from "blockly/javascript";

export let sphere = {
    init: function () {
        this.appendValueInput("DIAMETER")
            .setCheck("Number")
            .appendField("Sphere of diameter ");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(330);
    },

    transpile: function (block) {
        let diameter = javascriptGenerator.valueToCode(block, 'DIAMETER', javascriptGenerator.ORDER_NONE);

        return [`{type: "sphere", diameter: ${diameter}}`, javascriptGenerator.ORDER_NONE];
    }
};