import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let planets = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('planet: ');
        let options = [
            [{'src': '../assets/materials/planets/earth.jpg', 'width': 25, 'height': 25, 'alt': 'Earth'}, 'planets/earth.jpg'],
            [{'src': '../assets/materials/planets/jupiter.jpg', 'width': 25, 'height': 25, 'alt': 'Jupiter'}, 'planets/jupiter.jpg'],
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