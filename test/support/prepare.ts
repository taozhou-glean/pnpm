import mkdirp = require('mkdirp')
import fs = require('fs')
import path = require('path')
import {stripIndent} from 'common-tags'
import globalPath from './globalPath'
import {Test} from 'tape'

const root = process.cwd()
process.env.ROOT = root

const tmpPath = path.join(root, '.tmp')
mkdirp.sync(tmpPath)
const npmrc = stripIndent` 
  store-path = ./node_modules/.store
  fetch-retries = 5
  fetch-retry-maxtimeout = 180000
  registry = http://localhost:4873/
  quiet = true
  global-path = ${globalPath}
`
fs.writeFileSync(path.join(tmpPath, '.npmrc'), npmrc, 'utf-8')

let dirNumber = 0

export default function prepare (t: Test, pkg?: Object) {
  dirNumber++
  const dirname = dirNumber.toString()
  const pkgTmpPath = path.join(tmpPath, dirname)
  mkdirp.sync(pkgTmpPath)
  const json = JSON.stringify(pkg || {})
  fs.writeFileSync(path.join(pkgTmpPath, 'package.json'), json, 'utf-8')
  process.chdir(pkgTmpPath)
  t.pass(`create testing package ${dirname}`)
}
