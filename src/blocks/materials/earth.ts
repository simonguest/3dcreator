import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let earth = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Earth: ');
        let options = [
            [{'src': '../assets/materials/dirt.jpg', 'width': 25, 'height': 25, 'alt': 'Dirt'}, 'dirt.jpg'],
            [{'src': '../assets/materials/grass.png', 'width': 25, 'height': 25, 'alt': 'Grass'}, 'grass.png']
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`"${material}"`, javascriptGenerator.ORDER_NONE];
    }
};