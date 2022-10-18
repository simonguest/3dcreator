import {javascriptGenerator} from "blockly/javascript";

export let move = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck(["OBJECT"])
            .appendField("Move");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("to ");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
    },

    transpile: function (block) {
        let object = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE);
        let coords = javascriptGenerator.valueToCode(block, 'COORDS', javascriptGenerator.ORDER_NONE);

        return `threeD.move(${object}, ${coords});`;
    }
};