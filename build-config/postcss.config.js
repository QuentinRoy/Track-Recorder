/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */

module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ })
  ]
};
