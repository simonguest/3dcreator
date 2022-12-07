import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let setCameraType = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set camera type to ")
            .appendField(new Blockly.FieldDropdown([["Rotate", "ArcRotate"], ["GamePad", "GamePad"], ["Follow", "Follow"], ["VR", "VR"]]), "CAMERATYPE")
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
    },

    transpile: function (block) {
        let cameraType = block.getFieldValue("CAMERATYPE");

        return `threeD.setCameraType("${cameraType}");`;
    }
};