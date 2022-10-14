import {javascriptGenerator} from "blockly/javascript";

export let setPosition = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT"])
            .appendField("Set Position");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("to ");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);

        return `threeD.setPosition(${object}, ${coords});`;
    }
};