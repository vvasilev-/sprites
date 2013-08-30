/**
 * @package Sprites
 * @subpackage Core
 * @description The core file for Sprites plugin.
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
Sprites.Core = {};

/**
 * @method generateSprite
 * @param {Array} files 
 * @description Merges all images into one file.
 */
Sprites.Core.generateSprite = function(files){

	// variables
	var sprite = null,
		orientation = 'vertical';

	// loop the files
	for (var i = 0; i < files.length; i++) {

		// variables
		var file   = files[i],
			doc    = null,
			bounds = [];

		if (file instanceof File) {

			// open file in new document
			doc = open(file);

			// try to merge all visible layers
			try {
				doc.mergeVisibleLayers();
			} catch (e) {}

			// make selection and copy layers
			doc.selection.selectAll();
			doc.selection.copy();

			// create new sprite document
			if (!sprite) {
				sprite = documents.add(
					parseInt(doc.width, 10),
					parseInt(doc.height, 10),
					72,
					'Sprites',
					NewDocumentMode.RGB,
					DocumentFill.TRANSPARENT,
					1
				);
			}

			// make sprite document active
			app.activeDocument = sprite;

			// resize the canvas
			if (orientation == 'vertical') {
				sprite.resizeCanvas(
					((sprite.width >= doc.width) ? sprite.width : doc.width),
					(sprite.height + doc.height),
					AnchorPosition.TOPLEFT
				);
			} else {
				(sprite.width + doc.width),
				((sprite.height >= doc.height) ? sprite.height : doc.height),
				AnchorPosition.TOPLEFT
			}

			// calculate the canvas
			if (orientation == 'vertical') {
				bounds = [
					[0, sprite.height - doc.height],
					[sprite.width, sprite.height - doc.height],
					[sprite.width, sprite.height],
					[0, sprite.height]
				];
			} else {
				bounds = [
					[sprite.width - doc.width, 0],
					[sprite.width, 0],
					[sprite.width, doc.height],
					[sprite.width - doc.width, doc.height]
				];
			}

			// paste the file
			sprite.selection.select(bounds);
			sprite.paste(true);

			// close the file
			doc.close(SaveOptions.DONOTSAVECHANGES);

		}

	}

};
