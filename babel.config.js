//这是项目发布阶段需要用到的babel插件
const productePlugins = []
if (process.env.NODE_ENV === 'production') {
  productePlugins.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    //发布产品时的插件数组
    ...productePlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
