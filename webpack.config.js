const webpack = require('webpack');
const path = require('path');
const meteorExternals = require('webpack-meteor-externals');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const clientConfig = {
	mode: 'development',
	target: 'web',
	entry: './client/main.js',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'spacebars-loader',
				exclude: path.resolve(__dirname, 'client/main.html'),
			},
		],
	},
	devServer: {
		// does not work withouht, hot. No clue why
		hot: true
	},
	output: {
		publicPath: '/'
	},
	externals: [meteorExternals()],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './client/main.html',
			hash: true
		})
	]
};

const serverConfig = {
	mode: 'development',
	target: 'node', // in order to ignore built-in modules like path, fs, etc.
	externals: [meteorExternals(), nodeExternals()], // in order to ignore all modules in node_modules folder
	entry: './server/main.js',
	devServer: {
		// does not work withouht, hot. No clue why
		hot: true
	},
};
// TODO: probably install webpack-hot-server-middleware
// TODO: which dependencies are dev and which are not?
module.exports = [clientConfig, serverConfig];