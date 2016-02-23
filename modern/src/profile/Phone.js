Ext.define('Player.profile.Phone', {
  extend: 'Ext.app.Profile',

  requires: [
    'Player.view.phone.MainPhone'
  ],
  
  config: {
    name: 'Phone',
    views: [
      'Player.view.phone.MainPhone'
    ],
    mainView: 'Player.view.phone.MainPhone'
  },
  isActive: function() {
    var isPhone,
      active = !! Ext.os.is.Phone;
    if (Player.params.hasOwnProperty('isPhone')) {
      isPhone = Player.params.isPhone;
      active = !(isPhone == '0' || isPhone == 'false');
    }
    if(active){
      console.info("Profile: Phone");
    }
    return active;
  }
});