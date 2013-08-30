/**
 * @package Sprites
 * @subpackage Browser
 * @description The browser file for Sprites plugin.
 */

/**
 * Define plugin namespace.
 */
if (!Sprites) {
	var Sprites = {};
}

/**
 * Define nested namespace.
 */
Sprites.Browser = {};

/**
 * Define module variables.
 */
Sprites.Browser.selectedFiles = [];

/**
 * @method run
 * @description Initialize the module.
 */
Sprites.Browser.run = function(){

	// show the browse dialog
	Sprites.Browser.showDialog();

};

/**
 * @method showDialog
 * @description Lauch the file browsing window.
 */
Sprites.Browser.showDialog = function(){

	// browse dialog
	var dialog = Folder.selectDialog('Select files for the sprite.');

	// process selected folder
	if (dialog) {
		Sprites.Browser.processFolder(dialog);
	}

};

/**
 * @method processFolder
 * @param {Object} dialog 
 * @description Process all valid files from selected folder.
 */
Sprites.Browser.processFolder = function(dialog){

	// filter the files
	var files = dialog.getFiles(/\.(jpg|png|gif)$/i);

	// loop the files
	if (files && files.length) {

		// clean old selectedFiles
		Sprites.Browser.selectedFiles = [];

		for (var i = 0; i < files.length; i++) {

			// current file
			var file = files[i];

			if (file instanceof File) {

				// open the file
				var doc = open(file);

				if (doc) {

					// save instance to this file into selectedFiles
					Sprites.Browser.selectedFiles.push(
						new Sprites.Browser.ImageInfo(
							file,
							parseInt(doc.width, 10),
							parseInt(doc.height, 10)
						)
					);

					// close document for this file
					doc.close(SaveOptions.DONOTSAVECHANGES);

				}

			}

		}

	}

};

/**
 * @method Image Info
 * @param {Object} file 
 * @param {Number} width 
 * @param {Number} height 
 * @description Save information about the file.
 */
Sprites.Browser.ImageInfo = function(file, width, height){

	this.file        = file;
	this.width       = width;
	this.height      = height;

	this.posX        = NaN;
	this.posY        = NaN;
	this.hasPosition = false;

};