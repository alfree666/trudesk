/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    5/17/19 2:03 AM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

import _ from 'lodash'
import NodeCache from 'node-cache'
import path from 'path'
import { ChildProcess, fork } from 'child_process'
import type { NamedChildProcess } from '../typedefs/global'

export interface TrudeskCache {
  fork?: ChildProcess
  env?: NodeJS.ProcessEnv
  memLimit?: string
}

const cache: TrudeskCache = {}

export function init(cacheEnvVars: any) {
  global.cache = new NodeCache({ checkperiod: 0 })
  cache.memLimit = process.env['CACHE_MEMLIMIT'] || '2048'
  const env = { FORK: 1, NODE_ENV: global.env, TIMEZONE: global.timezone }
  cache.env = _.merge(cacheEnvVars, env)

  spawnCache()
  setInterval(spawnCache, 55 * 60 * 1000)
}

export function forceRefresh() {
  spawnCache()
}

function spawnCache() {
  const n = fork(path.join(__dirname, './index'), {
    // execArgv: ['--max-old-space-size=' + cache.memLimit],
    env: cache.env,
  })

  cache.fork = n

  global.forks.push({ name: 'cache', fork: n })

  n.on('message', function (data: { cache: NodeCache }) {
    if (data.cache) {
      global.cache.data = data.cache.data
    }
  })

  n.on('close', function () {
    _.remove(global.forks, function (i: NamedChildProcess) {
      return i.name === 'cache'
    })
  })
}

export default cache