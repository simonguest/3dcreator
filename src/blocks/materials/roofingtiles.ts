import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let roofingtiles = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('roofing tiles: ');
        let options = [
            [{'src': '../assets/materials/roofingtiles/RoofingTiles003_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'RoofingTiles003'}, 'roofingtiles/RoofingTiles003'],
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