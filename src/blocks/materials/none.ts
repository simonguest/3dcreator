import {javascriptGenerator} from "blockly/javascript";

export let none = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('none');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        return [`null`, javascriptGenerator.ORDER_NONE];
    }
};