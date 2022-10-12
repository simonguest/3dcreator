export let none = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('None');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        return [`null`, Blockly.JavaScript.ORDER_NONE];
    }
};