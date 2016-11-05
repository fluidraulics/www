require('dotenv').config({ silent: true })

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const Contentful = require('spike-contentful')
const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/readme.md', '**/layouts/*', '**/includes/*', '**/_*', '**/.*'],
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: { pageId: pageId(ctx) }
    })
  },
  postcss: (ctx) => {
    return cssStandards({ webpack: ctx })
  },
  babel: { presets: [jsStandards] },
  plugins: [
    new Contentful({
      addDataTo: locals,
      accessToken: process.env.accessToken,
      spaceId: process.env.spaceId,
      contentTypes: [
        {
          name: 'vendors',
          id: 'vendor'
          /* 
          template: {
            path: 'views/layout.sgr',
            output: (tm) => { return `testimonials/${_.slugify(tm.title)}.html` }
          }
          */
        }
      ],
      json: 'data/vendors.json'
    })
  ],
  server: { open: false }
}
