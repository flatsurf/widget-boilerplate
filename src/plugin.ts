// Copyright (c) Julian Rüth
// Distributed under the terms of the Modified BSD License.

// This is the registration code that makes our plugin known to the Jupyter Lab frontend.
// See the jupyterlab section in package.json.

import { Application, IPlugin } from '@phosphor/application';

import { Widget } from '@phosphor/widgets';

import { parse } from "./package";

export function createPlugin(package_json: any, widgetExports: any): IPlugin<Application<Widget>, void> {
	const info = parse(package_json);

  const { IJupyterWidgetRegistry } = require('@jupyter-widgets/base');

	const EXTENSION_ID = `${info.name}:plugin`;

	return {
		id: EXTENSION_ID,
		requires: [IJupyterWidgetRegistry],
		activate(app: Application<Widget>, registry: any) {
			registry.registerWidget({
				name: info.name,
				version: info.version,
				exports: widgetExports,
			});			
		},
		autoStart: true
	};
}
