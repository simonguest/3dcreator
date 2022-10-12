export let building = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Building: ');
        let options = [
            [{'src': '../assets/materials/brick.jpg', 'width': 50, 'height': 50, 'alt': 'Brick'}, 'brick.jpg'],
        ];
        input.appendField(new Blockly.FieldDropdown(options), 'MATERIAL');
        this.setOutput(true, "MATERIAL");
        this.setColour(100);
        this.setTooltip("");
        this.setHelpUrl("");    },

    transpile: function (block) {
        let material = block.getFieldValue('MATERIAL');

        return [`"${material}"`, Blockly.JavaScript.ORDER_NONE];
    }
};