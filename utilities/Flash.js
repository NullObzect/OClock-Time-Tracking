class Flash {
  constructor(req) {
    this.req = req
    this.success = this.extractFlashMessageName('success')
    this.fail = this.extractFlashMessageName('fail')
  }

  extractFlashMessageName(name) {
    const message = this.req.flash(name)
    return message.length > 0 ? message[0] : false
  }

  hasMessage() {
    return !(!this.success && !this.fail)
  }

  static getMessage(req) {
    const flash = new Flash(req)
    return {
      success: flash.success,
      fail: flash.fail,
      hasMessage: flash.hasMessage(),
    }
  }
}

module.exports = Flash
