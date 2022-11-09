import Blockly from 'blockly';
import {javascriptGenerator} from "blockly/javascript";

export let skybox = {
    init: function () {
        let input = this.appendDummyInput()
            .appendField('Set sky to: ');
        let options = [
            [{'src': '../assets/skyboxes/skybox/skybox_nx.jpg', 'width': 25, 'height': 25, 'alt': 'Clouds'}, 'skybox'],
            [{'src': '../assets/skyboxes/skybox2/skybox2_nx.jpg', 'width': 25, 'height': 25, 'alt': 'City'}, 'skybox2'],
            [{'src': '../assets/skyboxes/TropicalSunnyDay/TropicalSunnyDay_nx.jpg', 'width': 25, 'height': 25, 'alt': 'Airplane Window'}, 'TropicalSunnyDay'],

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

        return `threeD.createSkybox({ type: "skybox", asset: "${skybox}"});`;
    }
};