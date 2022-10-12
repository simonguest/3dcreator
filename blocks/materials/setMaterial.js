export let setMaterial = {
    init: function () {
        this.appendValueInput("MATERIAL")
            .setCheck("MATERIAL")
            .appendField("Set material");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let material = Blockly.JavaScript.valueToCode(block, 'MATERIAL', Blockly.JavaScript.ORDER_NONE);

        return `threeD.material = ${material};`;
    }
};