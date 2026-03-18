const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix asset registry path
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'svg', 'gif');

module.exports = config;
