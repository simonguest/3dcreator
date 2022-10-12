export let box = {
    init: function () {
        this.appendValueInput("HEIGHT")
            .setCheck("Number")
            .appendField("Box of height");
        this.appendValueInput("WIDTH")
            .setCheck("Number")
            .appendField("width");
        this.appendValueInput("DEPTH")
            .setCheck("Number")
            .appendField("depth");
        this.setInputsInline(true);
        this.setOutput(true, "OBJECT");
        this.setColour(330);
    },

    transpile: function (block) {
        let height = Blockly.JavaScript.valueToCode(block, 'HEIGHT', Blockly.JavaScript.ORDER_NONE);
        let width = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_NONE);
        let depth = Blockly.JavaScript.valueToCode(block, 'DEPTH', Blockly.JavaScript.ORDER_NONE);

        return [`{type: "box", height: ${height}, width: ${width}, depth: ${depth}}`, Blockly.JavaScript.ORDER_NONE];
    }
};