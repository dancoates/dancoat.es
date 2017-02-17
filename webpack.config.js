const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'src/client')
                ],
                loader: 'babel-loader',
                options: {
                    extends: path.resolve(__dirname, '.babelrc-client'),
                    babelrc: false
                }
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: ['.js', '.json', '.jsx']
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        compress: true,
        port: process.env.CLIENT_PORT || 5555,
        proxy: {
            '/' : 'http://' + (process.env.SERVER_HOST || '0.0.0.0') + ':' + (process.env.SERVER_PORT || '4444')
        }
    }
};