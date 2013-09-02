/**
 * @package Sprites
 * @version 1.0.0
 * @description Simple CSS sprite generator for Photoshop.
 */

/**
* Sprites
*
* MIT License
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Define plugin namespace.
 */
var Sprites = {};

/**
 * Define app defaults.
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
	displayDialogs: DialogModes.NO,
	exportFileName: 'style.css',
	exportTpl: '.icon-{{filename}} { width: {{width}}px; height: {{height}}px; background-position: {{x}}px {{y}}px; }'
};

/**
 * Define plugin messages.
 */
Sprites.messages = {
	NO_INPUT: 'There is no selected folder with files.',
	NO_TPL: 'The template cannot be empty.',
	BAD_DOC: 'The file is corrupt.',
	IS_NAN: 'The margin is not a number.'
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
	Sprites.UI.sourceGrp.alignment = 'left';

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

	// add export
	Sprites.UI.exportPnl = Sprites.UI.add('panel', undefined, 'Export template.');

	Sprites.UI.exportGrp = Sprites.UI.exportPnl.add('group');
	Sprites.UI.exportGrp.orientation = 'column';
	Sprites.UI.exportGrp.margins = 5;
	Sprites.UI.exportGrp.alignment = 'left';
	Sprites.UI.exportGrp.alignChildren = 'left';

	Sprites.UI.exportHelp = Sprites.UI.exportGrp.add('statictext', undefined, 'Available template tags: {{filename}}, {{width}}, {{height}}, {{x}}, {{y}}');
	Sprites.UI.exportTxt = Sprites.UI.exportGrp.add('edittext', undefined, Sprites.config.exportTpl);

	// add buttons
	Sprites.UI.buttonsGrp = Sprites.UI.add('group');
	Sprites.UI.buttonsGrp.orientation = 'row';
	Sprites.UI.buttonsGrp.alignment = 'right';

	Sprites.UI.generateBtn = Sprites.UI.buttonsGrp.add('button', undefined, 'Generate');
	Sprites.UI.closeBtn = Sprites.UI.buttonsGrp.add('button', undefined, 'Close');

	Sprites.UI.generateBtn.preferredSize = [100, 25];
	Sprites.UI.closeBtn.preferredSize = [100, 25];

	Sprites.UI.generateBtn.addEventListener('click', Sprites.generate);
	Sprites.UI.closeBtn.addEventListener('click', Sprites.close);

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
		Sprites.folder = dialog;
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
		margin = Math.abs(parseInt(Sprites.UI.marginTxt.text, 10)),
		files = Sprites.selectedFiles;

	if (!files) {
		alert(Sprites.messages.NO_INPUT);
		return;
	}

	if (isNaN(margin)) {
		alert(Sprites.messages.IS_NAN);
		return;
	}

	if (Sprites.UI.exportTxt.text == '') {
		alert(Sprites.messages.NO_TPL);
		Sprites.UI.exportTxt.text = Sprites.config.exportTpl;
		return;
	}

	Sprites.processFiles = [];

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

			var docHeight = parseInt(doc.height, 10),
				docWidth  = parseInt(doc.width, 10);

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
					docWidth,
					docHeight,
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

			var x = parseInt(bounds[0][0], 10),
				y = parseInt(bounds[0][1], 10);

			if (layout == 'vertical') {
				x = (parseInt(spriteDoc.width, 10) - docWidth)/2;
			}

			x = x == 0 ? x : -x;
			y = y == 0 ? y : -y;

			Sprites.processFiles.push({
				filename: file.name.split('.')[0],
				width: docWidth,
				height: parseInt(doc.height, 10),
				x: x,
				y: y
			});

			spriteDoc.paste(true);

			// close the file
			doc.close(SaveOptions.DONOTSAVECHANGES);

		}

	}

	// output the css
	Sprites.outputCss();

	// close plugin
	Sprites.close();

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
 * @method ouputCss
 * @description Generates the CSS file.
 */
Sprites.outputCss = function(){

	// variables
	var style = new File(Sprites.folder.absoluteURI + '/' + Sprites.config.exportFileName);

	// open the file
	style.open('w');

	for (var i = 0; i < Sprites.processFiles.length; i++) {

		// variable
		var tpl = Sprites.UI.exportTxt.text;

		for (var j in Sprites.processFiles[i]) {

			var regEx = new RegExp('\{\{' + j + '\}\}'),
				matches = tpl.match(regEx);

			if (matches) {
				tpl = tpl.replace(matches[0], Sprites.processFiles[i][j]);
			}

		}

		style.writeln(tpl);

	}

	// save the file
	style.close();

};

/**
 * Start the plugin.
 */
Sprites.setSettings();

Sprites.setupUI();
Sprites.UI.center();
Sprites.UI.show();
