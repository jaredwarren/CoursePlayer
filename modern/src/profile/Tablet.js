Ext.define('Player.profile.Tablet', {
  extend: 'Ext.app.Profile',

  requires: [
    'Player.view.tablet.MainTablet'
  ],

  config: {
    name: 'Tablet',
    views: [
      'Player.view.tablet.MainTablet'
    ],
    mainView: 'Player.view.tablet.MainTablet'
  },
  isActive: function() {
    var isPhone,
      active = !! Ext.os.is.Tablet;
    if (Player.params.hasOwnProperty('isPhone')) {
      isPhone = Player.params.isPhone;
      active = (isPhone != '1' && isPhone != 'true');
    } else { 
      active = !! Ext.os.is.Tablet;
    }
    // if modern and desktop assume tablet
    if(Ext.os.is.desktop){
      active = true;
    }
    if (active) {
      console.info("Profile: Tablet");
    }
    return active;
  }
});