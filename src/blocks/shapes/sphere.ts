import {javascriptGenerator} from "blockly/javascript";

export let sphere = {
    init: function () {
        this.appendValueInput("SIZE")
            .setCheck("SIZE")
            .appendField("Sphere of size ");
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
        let material = javascriptGenerator.valueToCode(block, 'MATERIAL', javascriptGenerator.ORDER_NONE);

        return [`[{ id: "${block.id}", type: "sphere", size: ${size}, material: ${material}}]`, javascriptGenerator.ORDER_NONE];
    }
};