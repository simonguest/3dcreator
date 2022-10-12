export let createSphere = {
    init: function () {
        this.appendValueInput("DIAMETER")
            .setCheck("Number")
            .appendField("Create Sphere of diameter ");
        this.appendValueInput("COORDS")
            .setCheck("COORDS")
            .appendField("located at ");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let diameter = Blockly.JavaScript.valueToCode(block, 'DIAMETER', Blockly.JavaScript.ORDER_NONE);
        let coords = Blockly.JavaScript.valueToCode(block, 'COORDS', Blockly.JavaScript.ORDER_NONE);

        return `threeD.createSphere(${diameter}, ${coords});`;
    }
};