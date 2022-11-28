import {javascriptGenerator} from "blockly/javascript";

export let sphere = {
    init: function () {
        this.appendDummyInput()
            .appendField("Sphere ");
        this.appendValueInput("L")
            .setCheck("Number")
            .appendField("l:");
        this.appendValueInput("H")
            .setCheck("Number")
            .appendField("h:");
        this.appendValueInput("W")
            .setCheck("Number")
            .appendField("w:");
        this.appendValueInput("MATERIAL")
            .setCheck("MATERIAL")
            .appendField("with material");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(200);
    },

    transpile: function (block) {
        let l = javascriptGenerator.valueToCode(block, 'L', javascriptGenerator.ORDER_NONE);
        let w = javascriptGenerator.valueToCode(block, 'W', javascriptGenerator.ORDER_NONE);
        let h = javascriptGenerator.valueToCode(block, 'H', javascriptGenerator.ORDER_NONE);
        let material = javascriptGenerator.valueToCode(block, 'MATERIAL', javascriptGenerator.ORDER_NONE);

        return [`[{ id: "${block.id}", type: "sphere", size: { l: ${l}, w: ${w}, h: ${h}}, material: ${material}}]`, javascriptGenerator.ORDER_NONE];
    }
};