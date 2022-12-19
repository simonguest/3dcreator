import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let skybox = {
    init: function () {
        let input = this.appendDummyInput()
            .appendField('set sky to: ');
        let options = [
            [{'src': '../assets/env/clouds_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'clouds'}, 'clouds'],
            [{'src': '../assets/env/deep_space_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'deep_space'}, 'deep_space'],
            [{'src': '../assets/env/orlando_stadium_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'orlando_stadium'}, 'orlando_stadium'],
            [{'src': '../assets/env/modern_buildings_PREVIEW.jpg', 'width': 25, 'height': 25, 'alt': 'modern_buildings'}, 'modern_buildings'],
            
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'SKYBOX');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let skybox = block.getFieldValue('SKYBOX');

        return `threeD.createSkybox({ asset: "${skybox}"});`;
    }
};