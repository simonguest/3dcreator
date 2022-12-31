import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let fabric = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('fabric: ');
        let options = [
            [{'src': './assets/materials/fabric/Fabric026_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Fabric026'}, 'fabric/Fabric026'],
            [{'src': './assets/materials/fabric/Fabric046_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Fabric046'}, 'fabric/Fabric046'],
            [{'src': './assets/materials/fabric/Fabric051_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Fabric051'}, 'fabric/Fabric051'],
            [{'src': './assets/materials/fabric/Fabric057_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Fabric057'}, 'fabric/Fabric057'],
            [{'src': './assets/materials/fabric/Fabric069_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'Fabric069'}, 'fabric/Fabric069'],
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