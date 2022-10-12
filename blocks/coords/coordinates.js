export let coordinates = {
    init: function() {
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("x:");
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("y:");
        this.appendValueInput("Z")
            .setCheck("Number")
            .appendField("z:");
        this.setInputsInline(true);
        this.setOutput(true, "COORDS");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE);
        let y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);
        let z = Blockly.JavaScript.valueToCode(block, 'Z', Blockly.JavaScript.ORDER_NONE);

        return [`{x:${x}, y:${y}, z:${z}}`, Blockly.JavaScript.ORDER_NONE];
    }
};