/**
 * @package Sprites
 * @subpackage Browser
 * @description The browser file for Sprites plugin.
 */

/**
 * Define nested namespace.
 */
Sprites.Dialog = {};

/**
 * Define module variables.
 */
Sprites.Dialog.masterWindow = false;

/**
 * @method run
 * @description Initialize the module.
 */
Sprites.Dialog.run = function(){

	// setup master window
	Sprites.Dialog.setupMasterWindow();

};

/**
 * @method setupMasterWindow
 * @description Setup the plugin master window.
 */
Sprites.Dialog.setupMasterWindow = function(){

	// window variable
	var win = Sprites.Dialog.masterWindow = new Window('dialog', 'Sprites');

	// setup the window
	win.alignChildren = 'left';

	// add and setup the layout panel
	win.layoutPnl = win.add('panel');
	win.layoutPnl.text = 'Select a sprite layout.';
	win.layoutPnl.alignChildren = 'left';

	// add layout radios
	win.layoutPnl.add('radiobutton', undefined, 'Vertical', { name: 'layoutY' });
	win.layoutPnl.add('radiobutton', undefined, 'Horizontal', { name: 'layoutX' });

	// check vertical layout
	win.findElement('layoutY').value = true;

	// add and setup the margin panel
	win.marginPnl = win.add('panel');
	win.marginPnl.text = 'Enter a margin.';
	win.marginPnl.alignChildren = 'left';

	// add margin field
	win.marginPnl.add('edittext', [0, 0, 50, 20], '0', { name: 'margin' });

	// add and setup the browse panel
	win.browsePnl = win.add('panel');
	win.browsePnl.text = 'Select a folder.';
	win.browsePnl.alignChildren = 'left';

	// add browse elements
	win.browsePnl.add('statictext', undefined, 'No selected folder.', { name: 'browseText' });
	win.browsePnl.add('button', undefined, 'Choose...', { name: 'browse' });

	// attach event handler
	win.findElement('browse').addEventListener('click', function(){

		// show the browse window
		Sprites.Browser.showBrowse();

	});

	// center the window
	win.center();

	// show the window
	win.show();

	// save window reference
	Sprites.Dialog.masterWindow = win;

};
