import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let walls = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Wall: ');
        let options = [
            [{'src': '../assets/materials/walls/Bricks057_1K_Color.jpg', 'width': 25, 'height': 25, 'alt': 'Red Brick Wall'}, 'walls/Bricks057_1K_Color.jpg'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`[ { image: "${material}" } ]`, javascriptGenerator.ORDER_NONE];
    }
};