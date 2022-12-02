import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let chip = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Circuit Board: ');
        let options = [
            [{'src': '../assets/materials/chip/Chip001_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Chip001'}, 'chip/Chip001'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}" } ]`, javascriptGenerator.ORDER_NONE];
    }
};