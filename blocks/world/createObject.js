export let createObject = {
    init: function () {
        this.appendValueInput("OBJECT")
            .setCheck("OBJECT")
            .appendField("Create");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("at ");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
    },

    transpile: function (block) {
        let object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_NONE);
        let coords = Blockly.JavaScript.valueToCode(block, 'COORDS', Blockly.JavaScript.ORDER_NONE);

        return `threeD.createObject(${object}, ${coords});`;
    }
};