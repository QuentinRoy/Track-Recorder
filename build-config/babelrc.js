const packageConfig = require('../package.json');

module.exports = {
  presets: [
    [
      'env',
      {
        targets: { browsers: packageConfig.browserslist },
        modules: false,
        loose: true
      }
    ]
  ],
  plugins: ['transform-runtime'],
  env: {
    test: {
      presets: [
        [
          'env',
          {
            targets: { node: 'current' }
          }
        ]
      ]
    }
  }
};
