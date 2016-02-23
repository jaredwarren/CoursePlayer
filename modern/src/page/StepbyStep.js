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
      scrollable: false,
      items: [{
        xtype: 'panel',
        items: [{
          xtype: 'panel',
          docked: 'left',
          hidden: Ext.os.is.Phone,
          width: 250,
          split: true,
          reference: 'treelistContainer',
          layout: {
            type: 'vbox',
            align: 'stretch'
          },
          items: [{
            xtype: 'container',
            cls: 'x-panel-header',
            styleHtmlContent: true,
            layout: {
              type: 'hbox',
              pack: 'center',
              align: 'end'
            },
            docked: 'top',
            items: [{
              html: cfg.taskTitle
            }],
            cls: 'x-panel-header',
            height: 44
          }, {
            xtype: 'list',
            itemId: 'distractorGrid',
            itemTpl: '{stepNum} - {title}',
            data: treeSteps,
            listeners: {
              select: me.onSelect,
              scope: me
            }
          }]
        }, {
          xtype: 'panel',
          itemId: 'stepDetailPanel',
          region: 'center',
          title: ' ',
          header: {
            items: [{
              xtype: 'button',
              itemId: 'previousStepBtn',
              iconCls: 'pictos pictos-arrow_left',
              listeners: {
                tap: me.onPreviousStep,
                scope: me
              }
            }, {
              xtype: 'title',
              itemId: 'indexTitle',
              title: '1 of 10',
              margin: 4
            }, {
              xtype: 'button',
              itemId: 'nextStepBtn',
              iconCls: 'pictos pictos-arrow_right',
              listeners: {
                tap: me.onNextStep,
                scope: me
              }
            }]
          }
        }]
      }]
    }, cfg)]);
  },

  onNextStep: function() {
    var me = this,
      distractorGrid = me.queryById('distractorGrid'),
      recordData,
      record = distractorGrid.getSelection();
    if (record.hasOwnProperty('data')) {
      recordData = record.data;
    } else {
      recordData = record;
    }
    distractorGrid.setSelection(distractorGrid.getData()[recordData.index + 1]);
  },

  onPreviousStep: function() {
    var me = this,
      distractorGrid = me.queryById('distractorGrid'),
      recordData,
      record = distractorGrid.getSelection();
    if (record.hasOwnProperty('data')) {
      recordData = record.data;
    } else {
      recordData = record;
    }
    distractorGrid.setSelection(distractorGrid.getData()[recordData.index - 1]);
  },

  onSelect: function(grid, record, eOpts) {
    var me = this,
      stepDetailPanel = me.queryById('stepDetailPanel'),
      distractorGrid = me.queryById('distractorGrid'),
      index = 0,
      recordData,
      totalSteps = distractorGrid.getData().length;

    if (record.hasOwnProperty('data')) {
      recordData = record.data;
    } else {
      recordData = record;
    }

    index = recordData.index;

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
    me.queryById('indexTitle').setTitle((index + 1) + ' of ' + totalSteps);

    // update step title, 
    stepDetailPanel.setTitle(recordData.title);

    // detil panel
    stepDetailPanel.removeAll();
    stepDetailPanel.add({
      xtype: 'textimage',
      cls: 'page-content',
      itemId: 'textImage',
      pText: recordData.pText,
      imageFile: recordData.imageFile,
      iconType: 'zoom',
      imgPos: 'center',
      imageWidth: '50'
    });
  },
  start: function() {
    var me = this,
      distractorGrid = me.queryById('distractorGrid');

    me.callParent(arguments);

    distractorGrid.setSelection(distractorGrid.getData()[0]);
  }
});