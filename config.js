'use strict'
const fs = require('fs')

exports.wechat = {
  account: (file) => {
    let result = fs.readFileSync(file);
    let config = JSON.parse(result.toString())
    return config.wechat_account === '' ? false : config.wechat_account
  },
  menu: (file) => {
    let result = fs.readFileSync(file);
    let config = JSON.parse(result.toString())
    return config.wechat_menu === '' ? false : config.wechat_menu
  }
}