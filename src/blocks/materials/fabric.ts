import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let fabric = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Fabric: ');
        let options = [
            [{'src': '../assets/materials/fabric/Fabric026_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Fabric026'}, 'fabric/Fabric026'],
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