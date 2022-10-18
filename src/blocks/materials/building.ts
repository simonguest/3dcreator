import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let building = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Building: ');
        let options = [
            [{'src': '../assets/materials/brick.jpg', 'width': 25, 'height': 25, 'alt': 'Brick'}, 'brick.jpg'],
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