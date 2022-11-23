import {javascriptGenerator} from "blockly/javascript";
import Blockly from "blockly";

export let loop = {
    init: function () {
        this.appendStatementInput("LOOP")
            .setCheck(null)
            .appendField("Animation loop")
            .appendField(new Blockly.FieldTextInput("animation"), "NAME");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    transpile: function (block) {
        let statements = javascriptGenerator.statementToCode(block, 'LOOP');

        return `threeD.createAnimationLoop("${block.id}", () => {${statements}});`;
    }
};