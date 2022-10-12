export let createSphere = {
    init: function () {
        this.appendValueInput("DIAMETER")
            .setCheck("Number")
            .appendField("Create Sphere of size ");
        this.appendValueInput("X")
            .setCheck("Number")
            .appendField("located at ");
        this.appendValueInput("Y")
            .setCheck("Number")
            .appendField("and ");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let diameter = Blockly.JavaScript.valueToCode(block, 'DIAMETER', Blockly.JavaScript.ORDER_NONE);
        let x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE);
        let y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);

        return `tD.createSphere(${diameter}, ${x}, ${y}, 0);`;
    }
};