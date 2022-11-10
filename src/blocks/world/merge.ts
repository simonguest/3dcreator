import {javascriptGenerator} from "blockly/javascript";
import { v4 as uuid } from 'uuid';
import Blockly from 'blockly';

let RANGE_MAX = 10;

export let merge = {
    getFirstVar: function() {
        let varModels = Blockly.Variables.allUsedVarModels(Blockly.getMainWorkspace());
        if (varModels.length > 0){
            return varModels[0]["name"];
        } else {
            return "item";
        }
    },
    init: function () {
        this.setColour(250);
        this.setInputsInline(false);
        this.appendDummyInput()
            .appendField("Merge into")
            .appendField(new Blockly.FieldVariable(this.getFirstVar()), "VAR")
            .appendField(new Blockly.FieldImage(
                "https://fonts.gstatic.com/s/i/materialiconsoutlined/remove/v4/24px.svg?download=true",
                15,
                15,
                "*", function () {
                    this.getSourceBlock().minus();
                }))
            .appendField(new Blockly.FieldImage(
                "https://fonts.gstatic.com/s/i/materialiconsoutlined/add/v4/24px.svg?download=true",
                15,
                15,
                "*", function () {
                    this.getSourceBlock().plus();
                }));
        this.appendValueInput('in1')
        this.appendValueInput('in2')
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },

    mutationToDom: function () {
        let container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('inputCount', this.inputsC);
        return container;
    },


    domToMutation: function (xmlElement) {
        this.inputsC = parseInt(xmlElement.getAttribute('inputCount'), 10) || 2;
        this.drawShape();
    },

    drawShape: function () {
        let childBlockCount = this.inputList.length - 1;

        // Need to add a new child object?
        if (this.inputsC > childBlockCount) {
            for (let x = childBlockCount + 1; x <= this.inputsC; x++) {
                this.appendValueInput('in' + x);
            }
        } else if (this.inputsC < childBlockCount) {
            for (let x = this.inputsC + 1; x <= childBlockCount; x++) {
                this.removeInput('in' + x);
            }
        }
    },


    plus: function () {
        if (this.inputsC < RANGE_MAX) {
            this.inputsC += 1;
            this.drawShape();
        }
    },

    minus: function () {
        if (this.inputList.length > 3) {
            this.inputsC -= 1;
            this.drawShape();
        }
    },

    transpile: function (block) {
        let variable = javascriptGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");

        let objects = [];
        for (let o = 1; o < this.inputList.length; o++){
            let object = javascriptGenerator.valueToCode(block, `in${o}`, javascriptGenerator.ORDER_NONE);
            if (object !== "") objects.push(object);
        }
        return `${variable} = [{id: "${uuid()}"}]; threeD.merge(${variable}, [${objects.toString()}]);`;
    }
};