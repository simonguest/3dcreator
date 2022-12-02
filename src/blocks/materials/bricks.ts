import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let bricks = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Bricks: ');
        let options = [
            [{'src': '../assets/materials/bricks/Bricks057_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Brick057'}, 'bricks/Bricks057'],

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