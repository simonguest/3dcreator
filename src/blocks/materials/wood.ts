import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let wood = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('wood: ');
        let options = [
            [{'src': './assets/materials/wood/Wood048_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Wood048'}, 'wood/Wood048'],

        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}", metallic: 0.5, roughness: 0.9 } ]`, javascriptGenerator.ORDER_NONE];
    }
};