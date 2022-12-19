import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let metal = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('metal color: ')
            .appendField(new Blockly.FieldColour('#ffffff',null), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { texture: "metal", color: "${material}" } ]`, javascriptGenerator.ORDER_NONE];
    }
};