export let earth = {
    init: function() {
        let input = this.appendDummyInput()
            .appendField('Earth: ');
        let options = [
            [{'src': '../assets/materials/dirt.jpg', 'width': 50, 'height': 50, 'alt': 'Dirt'}, 'dirt.jpg'],
            [{'src': '../assets/materials/grass.png', 'width': 50, 'height': 50, 'alt': 'Grass'}, 'grass.png']
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