const crypto = require('crypto')
const { HASHKEY, HASHIV } = process.env

function genDataChain(TradeInfo) {
  const results = []
  for (const k of Object.entries(TradeInfo)) {
    results.push(`${k[0]}=${k[1]}`)
  }
  return results.join('&')
}

function createSesEncrypt(TradeInfo) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY, HASHIV)
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex')
  return enc + encrypt.final('hex')
}

function createShaEncrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256')
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`

  return sha.update(plainText).digest('hex').toUpperCase()
}

function createSesDecrypt(TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV)
  decrypt.setAutoPadding(false)
  const text = decrypt.update(TradeInfo, 'hex', 'utf8')
  const plainText = text + decrypt.final('utf8')
  const result = plainText.replace(/[\x00-\x20]+/g, '')
  return JSON.parse(result)
}

module.exports = { createSesEncrypt, createShaEncrypt, createSesDecrypt }
