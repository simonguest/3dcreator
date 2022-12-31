import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let marble = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('marble: ');
        let options = [
            [{'src': './assets/materials/marble/Marble008_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Marble008'}, 'marble/Marble008'],
            [{'src': './assets/materials/marble/Marble012_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Marble012'}, 'marble/Marble012'],
            [{'src': './assets/materials/marble/Marble017_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Marble017'}, 'marble/Marble017'],
            [{'src': './assets/materials/marble/Marble023_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Marble023'}, 'marble/Marble023'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}", metallic: 0.2, roughness: 0.2, bumpLevel: 0 } ]`, javascriptGenerator.ORDER_NONE];
    }
};