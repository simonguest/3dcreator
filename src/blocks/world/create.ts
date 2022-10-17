import {javascriptGenerator} from "blockly/javascript";

export let create = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT", "Array"])
            .appendField("Create");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);

        return `threeD.create(${object});`;
    }
};