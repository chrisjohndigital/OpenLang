var webpack = require("webpack");
var path = require('path');

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, "dist/assets"),
		filename: "bundle.js",
		publicPath: "/assets/"
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"]
                        }
                }
			},
            {
                 test: /\.scss$/,
                    use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            { 
                test: /\.png$/, 
                loader: 'file-loader' 
            }
		]
	}
}