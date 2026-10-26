const path = require('path');

function getPlugin(name) {
  try {
    return require.resolve(name);
  } catch (e) {
    try {
      return require.resolve(path.resolve(__dirname, 'node_modules', name));
    } catch (e2) {
      return `C:/Users/ADMIN/AppData/Roaming/npm/node_modules/${name}`;
    }
  }
}

module.exports = {
  plugins: {
    [getPlugin('tailwindcss')]: {},
    [getPlugin('autoprefixer')]: {},
  },
};
