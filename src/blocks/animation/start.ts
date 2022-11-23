import { javascriptGenerator } from "blockly/javascript";
import Blockly, { FieldDropdown } from "blockly";

export let start = {
  init: function () {
    this.appendDummyInput("INPUT")
      .appendField("Start animation")
      .appendField(new Blockly.FieldDropdown([["none","none"]]), "ANIMATIONS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
    this.dropdownOptions = {};
  },

  updateDropDown: function () {
    let fieldDropDown = new Blockly.FieldDropdown(() => {
      let optionsAsArray = [["none", "none"]];
      Object.keys(this.dropdownOptions).forEach((key) => {
        var value = this.dropdownOptions[key];
        optionsAsArray.push([value, key]);
      });
      return optionsAsArray;
    });
    this.getInput("INPUT").removeField("ANIMATIONS");
    this.getInput("INPUT").appendField(fieldDropDown, "ANIMATIONS");
  },

  mutationToDom: function () {
    let container = Blockly.utils.xml.createElement("mutation");
    var dropdownOptionsAsJson = JSON.stringify(this.dropdownOptions);
    container.setAttribute("dropdownOptions", dropdownOptionsAsJson);
    return container;
  },

  domToMutation: function (xmlElement) {
    let dropdownOptionsAsJson = xmlElement.getAttribute("dropdownOptions");
    if (dropdownOptionsAsJson !== "undefined") {
      this.dropdownOptions = JSON.parse(dropdownOptionsAsJson);
      this.updateDropDown();
    }
  },

  transpile: function (block) {
    let animation = block.getFieldValue("ANIMATIONS");
    return `threeD.startAnimation("${animation}");`;
  },
};
