/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Player.view.main.LowerToolbarModel', {
	extend: 'Ext.app.ViewModel',

	alias: 'viewmodel.lowertoolbar',

	data: {
		narration: true,
		glossary: true,
		pageNumbering: true,

		pageNumber: 0,
		totalPageNumber: 0,
		narrationDisabled: false
	}
});