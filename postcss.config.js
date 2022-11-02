var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano")({ preset: 'default' });

module.exports = {
    ident: 'postcss',
    plugins: [
        autoprefixer,
        cssnano
    ],
    minimize: true
};
