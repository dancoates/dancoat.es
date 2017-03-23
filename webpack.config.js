require('dotenv').config({silent: true});
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const extractSASS = new ExtractTextPlugin({
    filename: 'style-[contenthash].css'
});

const STYLE_LOADERS = [
    {
        loader: 'css-loader'
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: function() {
                return [autoprefixer];
            }
        }
    },
    {
        loader: 'sass-loader'
    }
];


module.exports = {
    entry: {
        public: './src/client-public/index.js',
        admin: './src/client-admin/index.js'
    },
    output: process.env.NODE_ENV === 'production'
        ? {
            path: path.resolve(__dirname, 'public'),
            filename: '[name]-[hash].js',
            publicPath: '/'
        }
        : {
            path: path.resolve(__dirname, 'public'),
            filename: '[name].js',
            publicPath: '/'
        },
    devtool: 'source-map',
    plugins: [
        extractSASS,
        new ManifestPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            SERVER_PROTOCOL: '',
            SERVER_HOST: '',
            SERVER_PORT: '',
            WS_PROTOCOL: '',
            WS_HOST: '',
            WS_PORT: ''
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                options: {
                    extends: path.resolve(__dirname, '.babelrc-client'),
                    babelrc: false
                }
            },
            {
                test: /\.s?css$/,
                include: [
                    path.resolve(__dirname, 'src/client-public'),
                    path.resolve(__dirname, 'src/client-admin')
                ],
                use: process.env.NODE_ENV === 'production'
                    ? extractSASS.extract({
                        use: STYLE_LOADERS
                    })
                    : [{loader: 'style-loader'}].concat(STYLE_LOADERS)
            },
            {
                test: /\.graphql$/,
                loader: 'raw-loader',
                include: [
                    path.resolve(__dirname, 'src/client-public'),
                    path.resolve(__dirname, 'src/client-admin')
                ]
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss']
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        compress: true,
        port: process.env.CLIENT_PORT || 5555,
        proxy: {
            '/' : 'http://' + (process.env.SERVER_HOST || '0.0.0.0') + ':' + (process.env.SERVER_PORT || '4444')
        }
    }
};