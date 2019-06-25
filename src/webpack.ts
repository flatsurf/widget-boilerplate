// Provides some repeated defaults to include in your webpack.config.js.

import path from "path";
import { name } from './python';
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { name as python_name } from "./python";

export function createDefaults(package_json: any): webpack.Configuration {
	const rules = [
		{ test: /\.js$/, loader: 'source-map-loader' },
		{ test: /\.css$/, use: ['css-loader'] },
	];

	// Packages that shouldn't be bundled but are loaded at runtime
	const externals = ['@jupyter-widgets/base'];

	return {
		devtool: 'source-map',
		module: { rules },
		externals,
	};
}

export function devServer(package_json: any, notebook_path: string): WebpackDevServer.Configuration {
	const isHotUpdate = /\.hot-update\.(js|json|js\.map)$/;
	return {
		port: 9000,
		hot: true,
		public: 'localhost:9000',
		index: '',
		sockPath: '/hot-node',
		proxy: {
			target: notebook_path,
			context: function (path: string) {
				let ret = true;
				if (path.match(/^\/hot-node\//)) {
					// The dev server handles websocket connections to the hot-reloading machinery
					ret = false;
				} else if (path.match(new RegExp(`/^\\/nbextensions\\/${name(package_json)}\\/extension\\.js/`))) {
					// The dev server handles this extension's bundle
					ret = false;
				} else if (path.match(isHotUpdate)) {
					if (path.match(/.+\//)) {
						// We proxy hot requests so we can fix their path (strip initial
						// path components such as /notebooks/examples)
						ret = true;
					} else {
						// If the path is already stripped, we want to handle it from the dev server
						ret = false;
					}
				}
				return ret;
			},
			pathRewrite: function (path: string) {
				let ret = path;
				if (path.match(isHotUpdate)) {
					ret = path.replace(/.*\//, '/');
				}
				return ret;
			},
			router: function (req: any) {
				const path = req.url;
				if (path.match(isHotUpdate)) {
					return "http://localhost:9000";
				} else {
					return notebook_path;
				}
			},
			ws: true,
		} as any
	};
}

export function createConfig(package_json: any, config: any): webpack.Configuration[] {
	return [
		// Compiles our main TypeScript into JavaScript blobs. This is the generic code
		// without any of the glue for the Notebook or Jupyter Lab.
		{
			...config.defaults,
			name: "lib",
			entry: './src/typescript/index.ts',
			output: {
				filename: 'index.js',
				path: path.resolve(__dirname, 'lib'),
				libraryTarget: 'commonjs'
			},
		},
		// JupyterLab widget registration.
		{
			...config.defaults,
			name: "labextension",
			entry: './src/typescript/plugin.ts',
			output: {
				filename: 'plugin.js',
				path: path.resolve(__dirname, 'lib'),
				libraryTarget: 'commonjs'
			},
			// plugin.ts references index.ts which is the entrypoint for the actual
			// widget code. We do not want to include this into the compiled blob as
			// Jupyter Lab will load that only when necessary.
			externals: [...config.defaults.externals, './index'],
		},
		// This bundle contains the part of the JavaScript that is run on load of
		// the notebook (which sets up requirejs so the actual code can be loaded
		// when necessary.)
		{
			...config.defaults,
			name: "nbextension",
			entry: './src/typescript/nbextension.ts',
			output: {
				filename: 'extension.js',
				path: path.resolve(__dirname, python_name(package_json), 'nbextension'),
				libraryTarget: 'amd'
			},
		},
		// The actual JavaScript code for our Notebook extension.
		{
			...config.defaults,
			name: "amd-lib",
			entry: './src/typescript/index.ts',
			output: {
				filename: 'index.js',
				path: path.resolve(__dirname, python_name(package_json), 'nbextension'),
				libraryTarget: 'amd'
			},
		},
		// A variant of the above notebook entries that serves bundles thorugh a
		// server that provides hot module reloading (see README.)
		{
			...config.defaults,
			name: "hot-nbextension",
			entry: {
			  extension: './src/typescript/nbextension.ts',
			  index: './src/typescript/index.ts',
			},
			output: {
			  filename: `nbextensions/${ python_name(package_json) }/[name].js`,
			  libraryTarget: 'amd'
			},
			devServer: devServer(package_json, "http://localhost:8889"),
		  },		
	]
}