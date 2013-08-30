/**
 * @package Sprites
 * @version 1.0.0
 * @description Simple sprite generator.
 */

/**
 * Define plugin namespace.
 */
var Sprites = {};

/**
 * Define plugin defaults.
 */
Sprites.defaults = {};

/**
 * Define plugin settings.
 */
Sprites.config = {
	name: 'Sprites',
	resolution: 72,
	mode: NewDocumentMode.RGB,
	initialFill: DocumentFill.TRANSPARENT,
	pixelAspectRatio: 1,
	units: {
		ruler: Units.PIXELS,
		type: TypeUnits.PIXELS
	},
	displayDialogs: DialogModes.NO
};

/**
 * Define plugin messages.
 */
Sprites.messages = {
	NO_INPUT: 'There is no selected folder with files.',
	BAD_DOC: 'The file is corrupt.',
	IS_NAN: 'The string is not a number.'
};

/**
 * @method setSettings
 * @description Updates the Photoshop settings with plugin settings.
 */
Sprites.setSettings = function(){

	// save current Photoshop settings for later
	Sprites.defaults = {
		units: {
			ruler: app.preferences.rulerUnits,
			type: app.preferences.typeUnits
		},
		displayDialogs: app.displayDialogs
	};

	// update current settings with plugin settings
	app.preferences.rulerUnits = Sprites.config.units.ruler;
	app.preferences.typeUnits  = Sprites.config.units.type;
	app.displayDialogs         = Sprites.config.displayDialogs;

};

/**
 * @method restoreSettings
 * @description Restores the original Photoshop settings.
 */
Sprites.restoreSettings = function(){

	// restore the settings
	app.preferences.rulerUnits = Sprites.defaults.units.ruler;
	app.preferences.typeUnits  = Sprites.defaults.units.type;
	app.displayDialogs         = Sprites.defaults.displayDialogs;

};

/**
 * @method setupUI
 * @description Setups the UI for plugin.
 */
Sprites.setupUI = function(){

	// create Window instance
	Sprites.UI = new Window('dialog', 'Sprites');

	// setup Window instance
	Sprites.UI.alignChildren = 'fill';

	// add source
	Sprites.UI.sourcePnl = Sprites.UI.add('panel', undefined, 'Select a source folder.');

	Sprites.UI.sourceGrp = Sprites.UI.sourcePnl.add('group');
	Sprites.UI.sourceGrp.orientation = 'row';
	Sprites.UI.sourceGrp.margins = 5;

	Sprites.UI.sourceTxt = Sprites.UI.sourceGrp.add('edittext', undefined, 'No selected folder.');
	Sprites.UI.sourceTxt.preferredSize = [300, 25];

	Sprites.UI.sourceBtn = Sprites.UI.sourceGrp.add('button', undefined, 'Browse...');
	Sprites.UI.sourceBtn.preferredSize = [100, 25];
	Sprites.UI.sourceBtn.addEventListener('click', Sprites.browse);

	// add margin
	Sprites.UI.marginPnl = Sprites.UI.add('panel', undefined, 'Enter a margin.');

	Sprites.UI.marginGrp = Sprites.UI.marginPnl.add('group');
	Sprites.UI.marginGrp.orientation = 'row';
	Sprites.UI.marginGrp.margins = 5;
	Sprites.UI.marginGrp.alignment = 'left';

	Sprites.UI.marginTxt = Sprites.UI.marginGrp.add('edittext', undefined, '0');
	Sprites.UI.marginTxt.preferredSize = [100, 25];

	// add layout
	Sprites.UI.layoutPnl = Sprites.UI.add('panel', undefined, 'Select a sprite layout.');

	Sprites.UI.layoutGrp = Sprites.UI.layoutPnl.add('group');
	Sprites.UI.layoutGrp.orientation = 'row';
	Sprites.UI.layoutGrp.margins = 5;
	Sprites.UI.layoutGrp.alignment = 'left';

	Sprites.UI.layoutX = Sprites.UI.layoutGrp.add('radiobutton', undefined, 'Horizontal');
	Sprites.UI.layoutY = Sprites.UI.layoutGrp.add('radiobutton', undefined, 'Vertical');

	Sprites.UI.layoutX.value = true;

	// add buttons
	Sprites.UI.buttonsGrp = Sprites.UI.add('group');
	Sprites.UI.buttonsGrp.orientation = 'row';
	Sprites.UI.buttonsGrp.alignment = 'right';

	Sprites.UI.generateBtn = Sprites.UI.buttonsGrp.add('button', undefined, 'Generate');
	Sprites.UI.cancelBtn = Sprites.UI.buttonsGrp.add('button', undefined, 'Cancel');

	Sprites.UI.generateBtn.preferredSize = [100, 25];
	Sprites.UI.cancelBtn.preferredSize = [100, 25];

	Sprites.UI.generateBtn.addEventListener('click', Sprites.generate);
	Sprites.UI.cancelBtn.addEventListener('click', Sprites.close);

};

/**
 * @method browse
 * @description Launches the file browsing window.
 */
Sprites.browse = function(){

	// open the dialog
	var dialog = Folder.selectDialog('Select a folder with files for the sprite.');

	if (dialog) {
		Sprites.UI.sourceTxt.text = dialog.fsName;
		Sprites.parseFolder(dialog);
	} else {
		Sprites.UI.sourceTxt.text = 'No selected folder.';
	}

};

/**
 * @method parseFolder
 * @param {Object} dialog 
 * @description Process all valid files from selected folder.
 */
Sprites.parseFolder = function(dialog){

	// filter the files
	var files = dialog.getFiles(/\.(jpg|png|gif|psd)$/i);

	// loop the files
	if (files && files.length) {

		// update selectedFiles
		Sprites.selectedFiles = files;

	}

};

/**
 * @method generate
 * @description Merges all images into one file.
 */
Sprites.generate = function(){

	// variables
	var spriteDoc = null,
		layout = Sprites.UI.layoutX.value ? 'horizontal' : 'vertical',
		margin = parseInt(Sprites.UI.marginTxt.text, 10),
		files = Sprites.selectedFiles;

	// loop the files
	for (var i = 0; i < files.length; i++) {

		// variables
		var file = files[i],
			doc = null,
			bounds = [];

		if (file instanceof File) {

			// open current file
			doc = open(file);

			if (!doc) {
				alert(Sprites.messages.BAD_DOC);
				return false;
			}

			// try to merge all visibile layers
			try { doc.mergeVisibleLayers(); }
			catch(e) {}

			// make selection and copy
			doc.selection.selectAll();
			doc.selection.copy();

			// resize the canvas
			if (spriteDoc) {

				app.activeDocument = spriteDoc;

				if (layout == 'vertical') {

					spriteDoc.resizeCanvas(
						(spriteDoc.width >= doc.width ? spriteDoc.width : doc.width),
						(spriteDoc.height + doc.height + margin),
						AnchorPosition.TOPLEFT
					);

				} else {

					spriteDoc.resizeCanvas(
						(spriteDoc.width + doc.width + margin),
						(spriteDoc.height >= doc.height ? spriteDoc.height : doc.height),
						AnchorPosition.TOPLEFT
					);

				}

			} else {
				spriteDoc = documents.add(
					parseInt(doc.width, 10),
					parseInt(doc.height, 10),
					Sprites.config.resolution,
					Sprites.config.name,
					Sprites.config.mode,
					Sprites.config.initialFill,
					Sprites.config.pixelAspectRatio
				);
			}

			// calculate the canvas
			if (layout == 'vertical') {

				bounds = [
					[0, spriteDoc.height - doc.height],
					[spriteDoc.width, spriteDoc.height - doc.height],
					[spriteDoc.width, spriteDoc.height],
					[0, spriteDoc.height]
				];

			} else {

				bounds = [
					[spriteDoc.width - doc.width, 0],
					[spriteDoc.width, 0],
					[spriteDoc.width, doc.height],
					[spriteDoc.width - doc.width, doc.height]
				];

			}

			// paste the selection
			spriteDoc.selection.select(bounds);
			spriteDoc.paste(true);

			// close the file
			doc.close(SaveOptions.DONOTSAVECHANGES);

		}

	}

};

/**
 * @method close
 * @description Closes the plugin UI.
 */
Sprites.close = function(){

	Sprites.restoreSettings();
	Sprites.UI.close();

};


/**
 * Start the plugin.
 */
Sprites.setSettings();

Sprites.setupUI();
Sprites.UI.center();
Sprites.UI.show();
