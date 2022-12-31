import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let planets = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('planet: ');
        let options = [
            [{'src': './assets/materials/planets/mercury.jpg', 'width': 25, 'height': 25, 'alt': 'Mercury'}, 'planets/mercury.jpg'],
            [{'src': './assets/materials/planets/venus.jpg', 'width': 25, 'height': 25, 'alt': 'Venus'}, 'planets/venus.jpg'],
            [{'src': './assets/materials/planets/earth.jpg', 'width': 25, 'height': 25, 'alt': 'Earth'}, 'planets/earth.jpg'],
            [{'src': './assets/materials/planets/mars.jpg', 'width': 25, 'height': 25, 'alt': 'Mars'}, 'planets/mars.jpg'],
            [{'src': './assets/materials/planets/jupiter.jpg', 'width': 25, 'height': 25, 'alt': 'Jupiter'}, 'planets/jupiter.jpg'],
            [{'src': './assets/materials/planets/saturn.jpg', 'width': 25, 'height': 25, 'alt': 'Saturn'}, 'planets/saturn.jpg'],
            [{'src': './assets/materials/planets/uranus.jpg', 'width': 25, 'height': 25, 'alt': 'Uranus'}, 'planets/uranus.jpg'],
            [{'src': './assets/materials/planets/neptune.jpg', 'width': 25, 'height': 25, 'alt': 'Neptune'}, 'planets/neptune.jpg'],
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