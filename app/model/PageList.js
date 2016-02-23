Ext.define('Player.model.PageList', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {
                name: 'pType',
                type: 'string'
            },
            {
                name: 'pageName',
                type: 'string'
            },
            {
                defaultValue: false,
                name: 'supported',
                type: 'boolean'
            }
        ]
    }
});