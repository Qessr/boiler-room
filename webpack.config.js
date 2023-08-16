/**
 * Configuration for Webpack 
 * 
 * NOTE - this was config that worked with serverless framework, will need a tweak for terraform
 */

const path = require("path");
const slsw = require('serverless-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    // Use every path for Lambda's
    entry: slsw.lib.entries,
    // Target Node.js as runtime enviroment
    target: 'node',
    // Optimise package
    mode: 'production',
    // Output as little as possible in console
    stats: 'minimal',

    optimization: {
        minimize: true
    },

    // In AWS Lambda, the `aws-sdk` is available and we almost certainly want to 
    // exclude it from our bundle(s). Similarly, because it's a Node lambda, 
    // Node's native modules will also be available. 
    externals: ['aws-sdk'],

    output: {
        // libraryTarget: 'commonjs2',
        library: {
            type: 'commonjs2'
        },
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        chunkFilename: "[id].js",
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, '.webpack'),
                        path.resolve(__dirname, '.serverless'),
                    ],
                ],
                // And here we have options for ts-loader
                // https://www.npmjs.com/package/ts-loader#options
                options: {
                    // Disable type checking, this will lead to improved build times
                    transpileOnly: true,
                    // Enable file caching, can be quite useful when running offline
                    experimentalFileCaching: true,
                },
            },
        ],
    },
    // We still want type checking, just without the burden on build performance, 
    // so we use a plugin to take care of it on another thread.
    plugins: [new ForkTsCheckerWebpackPlugin()],
}
