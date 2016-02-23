Ext.define('Player.page.StepbyStep', {
  extend: 'Player.page.Page',
  xtype: 'StepbyStep',

  requires: [
    'Player.page.components.TextImage'
  ],

  constructor: function(cfg) {
    var me = this,
      treeSteps = [];
    cfg = cfg || {};

    Ext.Object.each(cfg.steps, function(key, value, myself) {
      var keyParts = key.match(/^step(\d+?)$/);
      if (keyParts && keyParts.length == 2) {
        var stepNum = keyParts[1],
          index = stepNum - 1;
        treeSteps[index] = {
          stepNum: stepNum,
          index: index,
          title: value.stepText,
          pText: value['#text'],
          imageFile: value.imageFile
        };
      }
    });

    me.callParent([Ext.apply({
      layout: 'border',
      scrollable: false,
      items: [{
        region: 'west',
        width: 250,
        split: true,
        reference: 'treelistContainer',
        layout: {
          type: 'vbox',
          align: 'stretch'
        },
        items: [{
          xtype: 'gridpanel',
          itemId: 'distractorGrid',
          store: {
            fields: ['stepNum', 'title'],
            data: treeSteps
          },
          enableColumnHide: false,
          enableColumnMove: false,
          columns: [{
            text: 'Step',
            dataIndex: 'stepNum',
            sortable: false,
            width: 65,
            align: 'center'
          }, {
            header: cfg.taskTitle,
            sortable: false,
            dataIndex: 'title',
            flex: 1
          }],
          listeners: {
            select: me.onSelect,
            scope: me
          }
        }]
      }, {
        xtype: 'panel',
        itemId: 'stepDetailPanel',
        region: 'center',
        layout: 'fit',
        flex: 1,
        title: ' ',
        header: {
          items: [{
            xtype: 'button',
            itemId: 'previousStepBtn',
            iconCls: 'pictos pictos-arrow_left',
            listeners: {
              click: me.onPreviousStep,
              scope: me
            }
          }, {
            xtype: 'title',
            itemId: 'indexTitle',
            text: '1 0f 10',
            margin: 4
          }, {
            xtype: 'button',
            itemId: 'nextStepBtn',
            iconCls: 'pictos pictos-arrow_right',
            listeners: {
              click: me.onNextStep,
              scope: me
            }
          }]
        }
      }]
    }, cfg)]);
  },

  onNextStep: function() {
    var me = this,
      distractorGrid = me.queryById('distractorGrid');
    distractorGrid.getSelectionModel().selectNext();
  },

  onPreviousStep: function() {
    var me = this,
      distractorGrid = me.queryById('distractorGrid');
    distractorGrid.getSelectionModel().selectPrevious();
  },

  onSelect: function(grid, record, index, eOpts) {
    var me = this,
      stepDetailPanel = me.queryById('stepDetailPanel'),
      distractorGrid = me.queryById('distractorGrid'),
      totalSteps = distractorGrid.store.totalCount;

    // previous button
    if (index <= 0) {
      me.queryById('previousStepBtn').disable();
    } else {
      me.queryById('previousStepBtn').enable();
    }
    // next button
    if (index >= totalSteps - 1) {
      me.queryById('nextStepBtn').disable();
    } else {
      me.queryById('nextStepBtn').enable();
    }

    // steps index
    me.queryById('indexTitle').setText((index + 1) + ' of ' + totalSteps);

    // update step title, 
    stepDetailPanel.setTitle(record.data.title);

    // detil panel
    stepDetailPanel.removeAll();
    stepDetailPanel.add({
      xtype: 'textimage',
      cls: 'page-content',
      height: '100%',
      flex: 1,
      itemId: 'textImage',
      pText: record.data.pText,
      imageFile: record.data.imageFile,
      iconType: 'zoom',
      imgPos: 'center',
      imageWidth: '50'
    });
  },
  start: function() {
    var me = this,
      distractorGrid = me.queryById('distractorGrid'),
      sm = distractorGrid.getSelectionModel();
    me.callParent(arguments);

    sm.doSelect(0);
  }
});