Ext.define('Player.Application', {
  extend: 'Ext.app.Application',
  namespace: 'Player',

  //sets up the icon and startup screens for when the app is added to a phone/tablet home screen
  startupImage: {
    '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
    '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
    '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
    '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
    '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
    '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
    '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
  },

  isIconPrecomposed: false,
  icon: {
    57: 'resources/icons/icon.png',
    72: 'resources/icons/icon@72.png',
    114: 'resources/icons/icon@2x.png',
    144: 'resources/icons/icon@144.png'
  },

  init: function() {
    var profile = Player.params['profile'],
      m;

    profile = (profile && profile[1]) || 'modern-neptune';

    m = profile.match(/^([\w\-]+)-(?:he)$/);
    Player.profileName = m ? m[1] : profile;
  }
});