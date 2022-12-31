import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let road = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('road: ');
        let options = [
            [{'src': './assets/materials/road/Road003_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Road003'}, 'road/Road003'],
            [{'src': './assets/materials/road/Road006_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Road006'}, 'road/Road006'],
            [{'src': './assets/materials/road/Road007_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Road007'}, 'road/Road007'],
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