/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Player.view.main.UpperToolbarModel', {
	extend: 'Ext.app.ViewModel',

	alias: 'viewmodel.uppertoolbar',

	data: {
		showClose: false,
		showHelp: true,

		coursetitle: 'Course Title...',
		courseclass: 'coursetitle-small',
		_topictitle: 'Topic Title....'
	},
	formulas: {
		topictitle: {
			get: function(get) {
				return this.get('_topictitle');
			},
			set: function(value) {
				this.set({
					_topictitle: value,
					courseclass: (!value) ? 'coursetitle-large' : 'coursetitle'
				});
			}
		}
	}
});