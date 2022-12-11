import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let grass = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Grass: ');
        let options = [
            [{'src': '../assets/materials/grass/Grass001_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Grass001'}, 'grass/Grass001'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { pbr: "${material}", roughness: 1 } ]`, javascriptGenerator.ORDER_NONE];
    }
};