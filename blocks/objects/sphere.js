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
        let diameter = Blockly.JavaScript.valueToCode(block, 'DIAMETER', Blockly.JavaScript.ORDER_NONE);

        return [`{type: "sphere", diameter: ${diameter}}`, Blockly.JavaScript.ORDER_NONE];
    }
};