import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let grass = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Grass: ');
        let options = [
            [{'src': '../assets/materials/grass/Grass001_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Grass001'}, 'grass/Grass001'],
            [{'src': '../assets/materials/grass/Grass002_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Grass002'}, 'grass/Grass002'],
            [{'src': '../assets/materials/grass/Grass003_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Grass003'}, 'grass/Grass003'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}", roughness: 1, metallic: 0 } ]`, javascriptGenerator.ORDER_NONE];
    }
};