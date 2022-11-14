import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let planets = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Planet: ');
        let options = [
            [{'src': '../assets/materials/earth.jpg', 'width': 25, 'height': 25, 'alt': 'Earth'}, 'earth.jpg'],
            [{'src': '../assets/materials/jupiter.jpg', 'width': 25, 'height': 25, 'alt': 'Jupiter'}, 'jupiter.jpg'],
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