/**
 * @package Sprites
 * @subpackage Browser
 * @description The browser file for Sprites plugin.
 */

/**
 * Define nested namespace.
 */
Sprites.Browser = {};

/**
 * Define module variables.
 */
Sprites.Browser.selectedFiles = [];

/**
 * @method showBrowse
 * @description Lauch the file browsing window.
 */
Sprites.Browser.showBrowse = function(){

	// browse dialog
	var dialog = Folder.selectDialog('Select files for the sprite.');

	// process selected folder
	if (dialog) {
		Sprites.Browser.processFolder(dialog);
		Sprites.Core.generateSprite(Sprites.Browser.selectedFiles);
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

		// update selectedFiles
		Sprites.Browser.selectedFiles = files;

	}

};
