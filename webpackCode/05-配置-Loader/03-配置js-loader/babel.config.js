module.exports = function (api) {
  api.cache(true);
  console.log(api)

  const presets = [ 
    [
      '@babel/preset-env',
      // option 参数
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        useBuiltIns: false,
      }
    ]
   ];

  const plugins = [ 
    '@babel/transform-runtime'
   ];

  return {
    presets,
    plugins
  };
}