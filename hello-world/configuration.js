'use strict'

const path = require('path')
const nconf = require('nconf').file({file: path.join(__dirname, 'config.json')})

function saveSettings(settingKey, settingValue) {
  nconf.set(settingKey, settingValue)
  nconf.save()
}

function readSettings(settingKey) {
  nconf.load()

  return nconf.get(settingKey)
}

module.exports = {
  saveSettings: saveSettings,
  readSettings: readSettings
}
