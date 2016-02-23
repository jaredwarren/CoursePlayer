/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Player.view.main.HelpPanelModel', {
	extend: 'Ext.app.ViewModel',

	alias: 'viewmodel.helppanel',

	data: {
		showClose: true,
		showHelp: true,
		showGlossary: true,
		showNarration: true,
		isTablet: false
	}
});