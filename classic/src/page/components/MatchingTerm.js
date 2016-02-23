Ext.define('Player.page.components.MatchingTerm', {
    //extend: 'Ext.dataview.component.ListItem',
    xtype: 'matchingterm',

    config: {
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        cls: 'matching-term',
        height: 40

    },
    updateRecord: function(newData, oldData) {
        var me = this;
        if(newData){
            me.setHtml(newData.raw.term);
        }
    }
});