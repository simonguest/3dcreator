import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let codeorg = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Code.org Logos: ');
        let options = [
            [{'src': '../assets/materials/codeorg/CodeOrg.jpg', 'width': 25, 'height': 25, 'alt': 'Code.org Logo'}, 'codeorg/CodeOrg.jpg'],
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