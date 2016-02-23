/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Player.view.main.PageInfoModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.pageinfo',
	data: {
		pageNumbering: true,
		pageNumber: 0,
		totalPageNumber: 0,
		pageTitle:'--'
	}
});