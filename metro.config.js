const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver = {
    ...config.resolver,
    sourceExts: ["js", "jsx", "json", "ts", "tsx", "cjs"],
    assetExts: [
      ...config.resolver.assetExts,
      "glb",
      "gltf",
      "mtl",
      "obj",
      "png",
      "jpg",
    ],
  };

  return config;
})();
