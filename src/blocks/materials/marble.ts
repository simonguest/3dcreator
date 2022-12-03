import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let marble = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Marble: ');
        let options = [
            [{'src': '../assets/materials/marble/Marble012_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Marble012'}, 'marble/Marble012'],
            [{'src': '../assets/materials/marble/Marble017_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Marble017'}, 'marble/Marble017'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}", metallic: 1.0, roughness: 0, bumpLevel: 0 } ]`, javascriptGenerator.ORDER_NONE];
    }
};