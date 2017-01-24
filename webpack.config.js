const path = require('path');
module.exports = {
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'src/client')
                ],
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src/client')
        ],
        extensions: ['.js', '.json', '.jsx']
    },
    devtool: 'source-map'
};