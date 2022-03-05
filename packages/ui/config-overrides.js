const { override, addLessLoader, fixBabelImports } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@text-selection-bg': '#184167',
      '@primary-color': '#0E0E0E',
      '@text-color': '#0E0E0E',

      // Button
      '@btn-border-radius-base': '10px',
      '@btn-font-size-lg': '14px',
      '@btn-primary-color': '#DECA91',

      // Link
      '@link-color': '#5395FF'
    }
  })
)
