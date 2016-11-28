require('dotenv').config({ silent: true })

const _ = require('lodash-addons')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const Contentful = require('spike-contentful')
const marked = require('marked')
const locals = {}

// temp workaround bug in spike-contentful

const myPageId = function pageId (ctx) {
  if (ctx.options) {
    return ctx.resourcePath.replace(`${ctx.options.context}/`, '').replace(/(.*)?(\..+?$)/, '$1').replace(new RegExp(`(?:${ctx.options.spike.dumpDirs.join('|')})/`), '').replace(/\//g, '-')
  }
  return 'vendor'
}

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
      locals: Object.assign(
        {pageId: myPageId(ctx) },
        locals,
        { marked: marked },
        { _: _ })
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
          name: 'index',
          id: 'page',
          filters: {
            'sys.id': '4GP68pszosicYwowA2QuY2'
          }
        },
        {
          name: 'about',
          id: 'page',
          filters: {
            'sys.id': '1ShmJTtfuo0mgCcIOAu6Qi'
          }
        },
        {
          name: 'contact',
          id: 'page',
          filters: {
            'sys.id': '3ioJJTHOFyoOOksMuYEswa'
          }
        },
        {
          name: 'sales',
          id: 'page',
          filters: {
            'sys.id': '60aMIbHglykAuUwgg2QkUO'
          }
        },
        {
          name: 'vendors',
          id: 'vendor',
          filters: {
            order: 'fields.title'
          },
          template: {
            path: 'views/layouts/vendor.sgr',
            output: (vendor) => { return `vendors/${_.slugify(vendor.title)}.html` }
          }
        }
      ],
      json: 'data/data.json'
    })
  ],
  server: { open: false }
}
