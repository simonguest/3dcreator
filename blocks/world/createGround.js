export let createGround = {
    init: function () {
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("Create Ground with width");
        this.appendValueInput("LENGTH")
            .setCheck("Number")
            .appendField("and length");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let width = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_NONE);
        let length = Blockly.JavaScript.valueToCode(block, 'LENGTH', Blockly.JavaScript.ORDER_NONE);

        return `threeD.createGround(${width}, ${length});`;
    }
};