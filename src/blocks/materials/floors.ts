import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let floors = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Floor: ');
        let options = [
            [{'src': '../assets/materials/floors/WoodFloor051_1K_Color.jpg', 'width': 25, 'height': 25, 'alt': 'Birch'}, 'floors/WoodFloor051_1K_Color.jpg'],
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