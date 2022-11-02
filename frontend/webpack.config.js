const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const pkg = require('../package.json');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || pkg.port || 8080;
const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'build/www');
const LIB_DIR = path.resolve(__dirname, '../lib');
const APP_VERSION = pkg.version;
const NODE_ENV = process.env.NODE_ENV || 'production';
const BUILD_ENV = process.env.BUILD_ENV || 'production';
const AUTO_LOGOUT_MINS = process.env.AUTO_LOGOUT_MINS || 10;
const ZipkinURL = process.env.ZipkinURL || 'http://localhost:9411';
const ZipkinAPIV1 = '/api/v1/spans';
const ZipkinAPIV2 = '/api/v2/spans';
const interopioLoggingURL = process.env.interopioLoggingURL || 'https://interopio-dev.com';
const appInfo = process.env.appInfo || '{}';
const consoleLogLevel = process.env.consoleLogLevel || 'silent';
const ioLogLevel = process.env.ioLogLevel || 'silent';

const hashFuncNames = ['sha256', 'sha512'];

// Put the paths to any modules that would require to be transpiled outside of the main SRC and LIB folders
const MODULES_TO_TRANSPILE = [
    path.resolve(__dirname, '../node_modules/text-copy'),
    path.resolve(__dirname, '../node_modules/d3-array'),
    path.resolve(__dirname, '../node_modules/d3-array'),
    path.resolve(__dirname, '../node_modules/d3-color'),
    path.resolve(__dirname, '../node_modules/d3-format'),
    path.resolve(__dirname, '../node_modules/d3-interpolate'),
    path.resolve(__dirname, '../node_modules/d3-path'),
    path.resolve(__dirname, '../node_modules/d3-scale'),
    path.resolve(__dirname, '../node_modules/d3-shape'),
    path.resolve(__dirname, '../node_modules/d3-time'),
    path.resolve(__dirname, '../node_modules/d3-time-format'),
];

const APP_NAME = process.env.APP_NAME || pkg.name;

const useHTTPS = !!process.env.HTTPS;
const lessVariables = require(SRC_DIR + '/style/globalVariables.json');

const SRIEnabled = BUILD_ENV !== 'local';

const getFileIntegrity = (filePaths = []) => {
    if (SRIEnabled || true) {
        const filePath = filePaths.find((file) => fs.existsSync(`${file}`));

        console.log('filePath/filePath', filePath)

        const hashes = hashFuncNames.map((hash) => `${hash}-${crypto.createHash(hash).update(fs.readFileSync(filePath).toString()).digest('base64')}`);

        return hashes.join(' ');
    }
    return null;
}

const templatesCommonOptions = {
    inject: false,
    backgroundColor: lessVariables['color-main-background'],
    color: lessVariables['color-main'],
    consoleLogLevel,
    ioLogLevel,
    extLibs: [],
    extStyle: [
        {
            file: '/favicon.png',
            integrity: getFileIntegrity([`${SRC_DIR}/assets/img/favicon.png`]),
        },
        {
            file: '/css/nunito-sans/index.css',
            integrity: getFileIntegrity([`${SRC_DIR}/../externals/nunito-sans/index.css`]),
        },
        {
            file: '/css/kalam/index.css',
            integrity: getFileIntegrity([`${SRC_DIR}/../externals/kalam/index.css`]),
        },
    ],
};

const config = {
    // Set mode to development or production
    mode: NODE_ENV,
    entry: {
        splashscreen: [
            'core-js/stable',
            SRC_DIR + '/splashscreen/splashscreen.js',
        ],
        logger: [
            'core-js/stable',
            'md5',
            'uuid',
            SRC_DIR + '/logger/logger.js',
        ],
        vendor: [
            'core-js/stable',
            'jwt-decode',
            'lodash',
            '@material-ui/core',
            '@material-ui/icons',
            'prop-types',
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'react-router-dom',
            'redux',
            'redux-logger',
            'redux-thunk',
            'zipkin',
        ],
        bundle: [
            'core-js/stable',
            SRC_DIR + '/index.jsx',
        ],
    },
    output: {
        path: DIST_DIR,
        filename: '[name]-[chunkhash].js',
        publicPath: '/',
        crossOriginLoading: 'anonymous',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: [SRC_DIR, LIB_DIR],
                exclude: [/externals/, /__storage__/],
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.less$/,
                include: [SRC_DIR, LIB_DIR],
                exclude: [/externals/, /__storage__/],
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
            },
            {
                test: /\.jsx?$/,
                include: [SRC_DIR, LIB_DIR, MODULES_TO_TRANSPILE],
                exclude: [/externals/, /__storage__/],
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                corejs: 3,
                                modules: false,
                                useBuiltIns: 'entry',
                                targets: {
                                    ie: 11,
                                },
                            },
                        ],
                        '@babel/preset-react',
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime'],
                    ],
                },
            },
        ],
    },
    resolve: {
        fallback: {
            os: require.resolve('os-browserify/browser'),
            url: require.resolve('url/'),
        },
        extensions: ['.js', '.jsx'],
    },
    context: __dirname,
    plugins: [
        new SubresourceIntegrityPlugin({
            hashFuncNames,
            enabled: SRIEnabled,
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
            __NODE_ENV__: JSON.stringify(NODE_ENV),
            'process.env.BUILD_ENV': JSON.stringify(BUILD_ENV),
            __BUILD_ENV__: JSON.stringify(BUILD_ENV),
            APP_VERSION: JSON.stringify(APP_VERSION),
            APP_NAME: JSON.stringify(APP_NAME),
            __ZIPKIN__: JSON.stringify(ZipkinURL),
            __Zipkin_API_V1__: JSON.stringify(ZipkinAPIV1),
            __Zipkin_API_V2__: JSON.stringify(ZipkinAPIV2),
            __INTEROPIO_LOGGING_URL__: JSON.stringify(interopioLoggingURL),
            __APP_INFO__: JSON.stringify(appInfo),
            'process.env.AUTO_LOGOUT_MINS': JSON.stringify(AUTO_LOGOUT_MINS),
            __AUTO_LOGOUT_MINS__: JSON.stringify(AUTO_LOGOUT_MINS),
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: SRC_DIR + '/assets/img/favicon.png',
                    to: DIST_DIR,
                },
                {
                    from: SRC_DIR + '/assets/img',
                    to: DIST_DIR + '/img/',
                },
                {
                    context: SRC_DIR + '/../../node_modules/fhirclient/',
                    from: '**/fhir-client.min.js',
                    to: DIST_DIR + '/externals/',
                },
                {
                    context: SRC_DIR + '/../../node_modules/fhirclient/build/',
                    from: '**/fhir-client.min.js',
                    to: DIST_DIR + '/externals/',
                },
                {
                    from: SRC_DIR + '/../externals/nunito-sans',
                    to: DIST_DIR + '/css/nunito-sans/',
                },
                {
                    from: SRC_DIR + '/../externals/kalam',
                    to: DIST_DIR + '/css/kalam/',
                },
                {
                    from: SRC_DIR + '/../../node_modules/whatwg-fetch/dist/fetch.umd.js',
                    to: DIST_DIR + '/externals/',
                },
                {
                    from: SRC_DIR + '/../../node_modules/promise-polyfill/dist/polyfill.min.js',
                    to: DIST_DIR + '/externals/',
                },
            ],
        }, {
            ignore: ['.DS_Store'],
        }),

        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].min.css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            filename: DIST_DIR + '/index.html',
            template: SRC_DIR + '/index.ejs',
            ...templatesCommonOptions,
        }),
        new HtmlWebpackPlugin({
            filename: DIST_DIR + '/link.html',
            template: SRC_DIR + '/link.ejs',
        }),
    ],
    devtool: 'source-map',
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true,
    },
    devServer: {
        https: useHTTPS ? {
            cert: '/usr/local/etc/ssl/certs/cert.pem',
            key: '/usr/local/etc/ssl/private/key.pem',
        } : false,
        allowedHosts: 'all',
        historyApiFallback: true,
        host: HOST,
        port: PORT,
        // public: "/"
        proxy: {
            '/api': {
                target: 'http://localhost:38135',
                pathRewrite: { '^/api': '' },
            },
        },
    },
};

const entires = [
    ['Webpack', 'started'],
    ['', ''],
    ['APP_NAME', APP_NAME],
    ['NODE_ENV / Mode', NODE_ENV],
    ['BUILD_ENV / Deployment', BUILD_ENV],
    ['APP_VERSION', APP_VERSION],
    ['ZIPKIN_URL', ZipkinURL],
    ['ZipkinAPIV1', ZipkinAPIV1],
    ['ZipkinAPIV2', ZipkinAPIV2],
    ['Console Logging Level', consoleLogLevel],
    ['interopiO Logging Level', ioLogLevel],
    ['Techonology', 'EcmaScript 2021'],
    ...Object.entries(JSON.parse(appInfo)),
];

const titleMaxLength = entires.reduce((last, entry) => Math.max(entry[0].length, last), 0)

entires.forEach((entry) => {
    const rawTitle = entry[0];
    const padding = ''.padEnd(titleMaxLength - rawTitle.length + 4, '.')

    console.log(`:: ${rawTitle}${padding} ${entry[1]}`);
});
console.log('');

module.exports = config;
