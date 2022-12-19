import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let tiles = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Tiles: ');
        let options = [
            [{'src': '../assets/materials/tiles/Tiles033_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Tiles033'}, 'tiles/Tiles033'],
            [{'src': '../assets/materials/tiles/Tiles053_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Tiles053'}, 'tiles/Tiles053'],
            [{'src': '../assets/materials/tiles/Tiles065_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Tiles065'}, 'tiles/Tiles065'],
            [{'src': '../assets/materials/tiles/Tiles074_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Tiles074'}, 'tiles/Tiles074'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}", metallic: 0.25, roughness: 1 } ]`, javascriptGenerator.ORDER_NONE];
    }
};