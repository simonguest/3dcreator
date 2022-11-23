import {javascriptGenerator} from "blockly/javascript";
import Blockly from 'blockly';

export let onClick = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "item";
        }
    },
    init: function () {
        this.appendStatementInput("EVENT")
            .appendField("When")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR")
            .appendField("is clicked");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
        let statements = javascriptGenerator.statementToCode(block, 'EVENT');

        return `threeD.onClick(${variable}, () => {${statements}});`;
    }
};