Ext.define('Player.store.HiddenPages', {
    extend: 'Ext.data.Store',
    requires: [
        'Player.model.PageModel'
    ],

    config: {
        autoLoad: true,
        autoSync: false,
        clearOnLoad: false,
        model: 'Player.model.PageModel',
        nodeParam: 'page',
        storeId: 'hiddenPages',
        proxy: {
            type: 'ajax',
            pageParam: 'notPage',
            defaultHeaders: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            url: 'data/hiddenPages.json',
            reader: {
                type: 'json',
                rootProperty: 'page',
                totalProperty: 'totalCount'
            }
        }
    },
    findRecordByType: function(type, value) {
        var i,
            ln = this.data.all.length,
            tempNode;
        if(type == 'id'){
            for (i = 0; i < ln; i++) {
                tempNode = this.data.all[i];
                if(tempNode.id == value){
                    return tempNode;
                }
            }
        }
        else{
            for (i = 0; i < ln; i++) {
                tempNode = this.data.all[i];
                if(tempNode.raw[type] == value || tempNode.data[type] == value){
                    return tempNode;
                }
            }
        }
        return null;
    },
    getTotalCount: function(){
        return this.getProxy().getReader().rawData.total;
        // else I've got to count them
    }
});