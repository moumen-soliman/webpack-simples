const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: {
        main: [
            './src/main.js',
            './src/main.scss'
        ],
        vendor: ['jquery']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    watchOptions: {
        poll: true
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        'sass-loader'
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[hash].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].[contenthash].css'),
        new webpack.LoaderOptionsPlugin({
          minimize: inProduction
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'index.html')),
            minimize: inProduction
        }),
        new CleanWebpackPlugin(['dist', 'build'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ]
};

if (inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}