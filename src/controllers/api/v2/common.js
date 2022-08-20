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
 *  Updated:    2/14/19 12:30 AM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

import crypto from 'crypto'
import moment from 'moment'
import logger from '../../../logger'
import apiUtils from '../apiUtils'
import { SessionModel, UserModel } from '../../../models'
import jwt from 'jsonwebtoken'
import config from '../../../config'

const commonV2 = {}

commonV2.login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) return apiUtils.sendApiError_InvalidPostData(res)

  try {
    const user = await UserModel.getByUsername(username)
    if (!user) return apiUtils.sendApiError(res, 401, 'Invalid Username/Password')

    if (!UserModel.validatePassword(password, user.password))
      return apiUtils.sendApiError(res, 401, 'Invalid Username/Password')

    const hash = crypto.createHash('sha256')

    const session = await SessionModel.create({
      user: user._id,
      refreshToken: hash.update(user._id.toString()).digest('hex'),
      exp: moment()
        .utc()
        .add(96, 'hours')
        // .add(1, 'minutes')
        .toDate()
    })

    const cookie = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
      // maxAge: 1000 * 60 // 1 min
    }

    const tokens = await apiUtils.generateJWTToken(user, session)

    res.cookie('_rft_', tokens.refreshToken, cookie)

    // This is temporary to handle middleware.hasAuth() until we can handle passing the token to download links,
    // such as backups and to load /uploads static files.
    // req.logIn(user, err => {
    //   if (err) throw err

    return apiUtils.sendApiSuccess(res, tokens)
    // })
  } catch (e) {
    logger.warn(e)
    return apiUtils.sendApiError(res, 500, e.message)
  }
}

commonV2.logout = async (req, res) => {
  try {
    const rftJWT = req.cookies['_rft_']
    if (!rftJWT) return apiUtils.sendApiSuccess(res)

    const decoded = await jwt.verify(rftJWT, config.get('tokens:secret'))
    if (!decoded) return apiUtils.sendApiSuccess(res)
    const sessionId = decoded.s

    await SessionModel.deleteOne({ _id: sessionId })
    res.cookie('_rft_', null, { maxAge: 0 })

    return apiUtils.sendApiSuccess(res)
  } catch (e) {
    logger.warn(e)
    return apiUtils.sendApiError(res, 401, e)
  }
}

commonV2.token = async (req, res) => {
  const refreshToken = req.cookies['_rft_']
  if (!refreshToken) return apiUtils.sendApiSuccess(res)
  try {
    const decoded = jwt.verify(refreshToken, config.get('tokens:secret'))
    if (!decoded || !decoded.s) return apiUtils.sendApiError(res, 401)
    const sessionId = decoded.s

    let session = await SessionModel.findOne({ _id: sessionId })
    if (!session) {
      res.cookie('_rft_', null, { maxAge: 0 })
      return apiUtils.sendApiError(res, 401)
    }

    const expDate = new Date(session.exp)
    if (expDate < Date.now()) {
      await SessionModel.deleteOne({ _id: sessionId })
      res.cookie('_rft_', null, { maxAge: 0 })
      return apiUtils.sendApiError(res, 401)
    }

    // session.exp = moment()
    //   .utc()
    //   .add(96, 'hours')
    //   .toDate()

    const user = await UserModel.findOne({ _id: session.user })
    if (!user) {
      res.cookie('_rft_', null, { maxAge: 0 })
      await SessionModel.deleteOne({ _id: sessionId })
      return apiUtils.sendApiError(res, 401)
    }

    const tokens = await apiUtils.generateJWTToken(user, session)

    return apiUtils.sendApiSuccess(res, {
      token: tokens.token
    })
  } catch (e) {
    res.cookie('_rft_', null, { maxAge: 0 })
    return apiUtils.sendApiError(res, 500, e.message)
  }
}

commonV2.viewData = async (req, res) => {
  return apiUtils.sendApiSuccess(res, { viewdata: req.viewdata })
}

module.exports = commonV2
