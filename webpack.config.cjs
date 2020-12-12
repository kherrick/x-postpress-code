const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = (rel) => path.resolve(__dirname, '.', rel)
const load = (test, ...use) => ({test, use, exclude: /node_modules/})

module.exports = (env) => {
	return ({
		mode: env.prod ? 'production' : 'development',
		devtool: env.prod ? false : 'source-map',
		entry: resolve('src/x-postpress-code.ts'),
		output: {
			path: resolve('dist'),
			filename: 'x-postpress-code.js',
			library: `x-postpress-code`,
			libraryTarget: 'umd',
		},
		module: {
			rules: [
				load(/\.(j|t)s?$/, 'babel-loader'),
			]
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		plugins: [
			env.dev ? new HtmlWebpackPlugin({
				template: resolve('index.html'),
				inject: 'head',
			}) : {apply: () => null},
		],
		devServer: {
			port: 8088,
			historyApiFallback: true,
		},
	})
}
