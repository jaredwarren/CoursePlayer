Ext.define('Player.controller.LMSController', {
  extend: 'Ext.app.Controller',
  requires: [
    'Player.controller.NoneMixin',
    'Player.controller.LocalMixin',
    'Player.controller.SCORM12Mixin',
    // /'Player.controller.AICCMixin',
    'Player.controller.SCORM2004Mixin'
  ],
  config: {
    stores: ['SCORM']
  },

  init: function(application) {
    application.on('loadscorm', this.onLoadscorm, this);
  },

  onLoadscorm: function() {
    var me = this,
      settings = Player.settings,
      tracking = settings.get('tracking').toUpperCase();

    switch (tracking) {
      case 'LOCAL':
      case 'COOKIE':
        me.self.mixin('LocalMixin', Player.controller.LocalMixin);
        break;
      case 'AICC':
        me.self.mixin('AICCMixin', Player.controller.AICCMixin);
        break;
      case 'SCORM1.2':
        me.self.mixin('SCORM12Mixin', Player.controller.SCORM12Mixin);
        break;
      case 'SCORM1.3':
      case 'SCORM2004':
        me.self.mixin('SCORM2004Mixin', Player.controller.SCORM2004Mixin);
        break;
      case 'TINCAN':
      case 'TCAPI':
        me.self.mixin('TINCANMixin', Player.controller.TINCANMixin);
        break;
      case 'AUTO':
        me.detectLMS();
        break;
      default:
        me.self.mixin('NoneMixin', Player.controller.NoneMixin);
        break;
    }
    // make global
    window.SCORM = me;
    // init
    me.Initialize(settings.data);
  },
  detectLMS: function() {
    var me = this,
      api;
    if (Player.params.hasOwnProperty('AICC_URL') && !! Player.params['AICC_URL']) {
      me.self.mixin('AICCMixin', Player.controller.AICCMixin);
      return;
    } else {
      me.self.mixin('SCORM2004Mixin', Player.controller.SCORM2004Mixin);
      api = me.getAPI();
      if (!api) {
        me.self.mixin('SCORM12Mixin', Player.controller.SCORM2004Mixin);
        api = me.getAPI();
        if (!api) {
          me.self.mixin('NoneMixin', Player.controller.NoneMixin);
        }
      }
    }
  }
});