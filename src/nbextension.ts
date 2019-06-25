// Copyright (c) Julian Rüth.
// Distributed under the terms of the Modified BSD License.

import { name as python_name } from "./python";

// This runs when the notebook opens. It contains the minimal requirejs setup
// so that our widget can later be loaded when we need it.
export function setupNotebook(package_json: any) {
	// Some static assets may be required by the custom widget javascript. The base
	// url for the notebook is not known at build time and is therefore computed
	// dynamically.
	(window as any).__webpack_public_path__ = document.querySelector('body')!.getAttribute('data-base-url') + 'nbextensions/flatsurf_widgets';

	(window as any)['requirejs'].config({
	map: {
		"*" : {
		// The index.js in nbextension/ gets copied here and is then loaded by requirejs.
		[name]: `nbextensions/${ python_name(package_json.name) }/index`,
		}
	}
	});
}