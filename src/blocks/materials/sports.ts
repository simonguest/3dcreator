import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let sports = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Sport: ');
        let options = [
            [{'src': '../assets/materials/soccerball.png', 'width': 25, 'height': 25, 'alt': 'Soccer'}, 'soccerball.png'],
            [{'src': '../assets/materials/tennis.png', 'width': 25, 'height': 25, 'alt': 'Tennis'}, 'tennis.png'],
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