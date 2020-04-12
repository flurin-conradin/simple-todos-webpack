const webpack = require('webpack');
const path = require('path');
const meteorExternals = require('webpack-meteor-externals');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const clientConfig = {
	mode: 'development',
	target: 'web',
	entry: './client/main.coffee',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'spacebars-loader',
				exclude: path.resolve(__dirname, 'client/main.html'),
			},
			{
				test: /\.coffee$/,
				use: [ 'coffee-loader' ]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'less-loader',
					},
				],
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
	],
	resolve: {
		modules: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, './'), // enables you to use 'imports/...' instead of '/imports/...'
		],
		alias: {
			'/imports': path.resolve(__dirname, './imports'),
			// '/ui': path.resolve(__dirname, './ui'),
			// ... and any other directories you might have
		}
	}
};

const serverConfig = {
	mode: 'development',
	target: 'node', // in order to ignore built-in modules like path, fs, etc.
	externals: [meteorExternals(), nodeExternals()], // in order to ignore all modules in node_modules folder
	entry: './server/main.coffee',
	devServer: {
		// does not work withouht, hot. No clue why
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.coffee$/,
				use: [ 'coffee-loader' ]
			}
		],
	},
};
// TODO: probably install webpack-hot-server-middleware
// TODO: read about webpack-dev-middleware webpack-server-middleware
// TODO: which dependencies are dev and which are not?
module.exports = [clientConfig, serverConfig];