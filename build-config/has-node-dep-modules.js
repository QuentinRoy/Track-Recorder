/* eslint-disable */

const path = require('path');

// Check if a node module will be loaded using `module` or `jsnext`.
const MODULE_DIR = /(.*([\/\\]node_modules|\.\.)[\/\\](@[^\/\\]+[\/\\])?[^\/\\]+)([\/\\].*)?$/g;
module.exports = function hasNodeDepModules(filePath) {
  if (filePath.split(/[/\\]/).indexOf('node_modules') === -1) return false;
  let pkg,
    manifest = path.resolve(filePath.replace(MODULE_DIR, '$1'), 'package.json');
  try {
    pkg = JSON.parse(fs.readFileSync(manifest));
  } catch (e) {
    return false;
  }
  return !!(pkg.module || pkg['jsnext:main']);
};
