'use strict'

/**
 * @module @yoda/multimedia
 * @description The multimedia includes support for playing variety of common
 * media types, so that you can easily integrate audio into your applications.
 *
 * ```js
 * var AudioManager = require('@yoda/audio').AudioManager;
 * var MediaPlayer = require('@yoda/multimedia').MediaPlayer;
 *
 * var player = new MediaPlayer(AudioManager.STREAM_PLAYBACK);
 * player.start('/res/play.ogg');
 * ```
 */

var native = require('./multimedia.node')
var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var AudioManager = require('@yoda/audio').AudioManager

/**
 * @constructor
 * @param {Number} [stream=STREAM_PLAYBACK] - the stream type of the player.
 * @fires module:@yoda/multimedia~MediaPlayer#prepared
 * @fires module:@yoda/multimedia~MediaPlayer#playbackcomplete
 * @fires module:@yoda/multimedia~MediaPlayer#bufferingupdate
 * @fires module:@yoda/multimedia~MediaPlayer#seekcomplete
 * @fires module:@yoda/multimedia~MediaPlayer#error
 */
function MediaPlayer (stream) {
  EventEmitter.call(this)
  this._stream = stream || AudioManager.STREAM_PLAYBACK
  this._handle = null
  this._seekcompleteCb = null
  this._initialize()
}
inherits(MediaPlayer, EventEmitter)

/**
 * Initialize the media player, set callbacks
 * @private
 */
MediaPlayer.prototype._initialize = function () {
  this._handle = new native.Player(this._tag)
  this._handle.onprepared = this.onprepared.bind(this)
  this._handle.onplaybackcomplete = this.onplaybackcomplete.bind(this)
  this._handle.onbufferingupdate = this.onbufferingupdate.bind(this)
  this._handle.onseekcomplete = this.onseekcomplete.bind(this)
  this._handle.onerror = this.onerror.bind(this)
}

/**
 * Prepare is ready
 * @private
 */
MediaPlayer.prototype.onprepared = function () {
  /**
   * Prepared event, media resource is loaded
   * @event module:@yoda/multimedia~MediaPlayer#prepared
   */
  this.emit('prepared')
}

MediaPlayer.prototype.onplaybackcomplete = function () {
  /**
   * Fired when media playback is complete.
   * @event module:@yoda/multimedia~MediaPlayer#playbackcomplete
   */
  this.emit('playbackcomplete')
}

MediaPlayer.prototype.onbufferingupdate = function () {
  /**
   * Fired when media buffer is update.
   * @event module:@yoda/multimedia~MediaPlayer#bufferingupdate
   */
  this.emit('bufferingupdate')
}

MediaPlayer.prototype.onseekcomplete = function () {
  if (typeof this._seekcompleteCb === 'function') {
    this._seekcompleteCb()
    this._seekcompleteCb = null
  }
  /**
   * Fired when media seek is complete.
   * @event module:@yoda/multimedia~MediaPlayer#seekcomplete
   */
  this.emit('seekcomplete')
}

MediaPlayer.prototype.onerror = function () {
  /**
   * Fired when something went wrong.
   * @event module:@yoda/multimedia~MediaPlayer#error
   * @type {Error}
   */
  this.emit('error', new Error('something went wrong'))
}

/**
 * prepare with the given resource(URI) and start asynchronously.
 * @param {String} uri - The resource uri to play
 */
MediaPlayer.prototype.start = function (uri) {
  if (!uri) { throw new Error('url must be a valid string') }
  return this._handle.prepare(uri)
}

/**
 * pause the playing media.
 */
MediaPlayer.prototype.pause = function () {
  return this._handle.pause()
}

/**
 * resume the paused media.
 */
MediaPlayer.prototype.resume = function () {
  return this._handle.resume()
}

/**
 * seek to `pos`.
 * @param {Number} pos - the position in ms.
 * @param {Function} callback - get called when seek complete
 */
MediaPlayer.prototype.seek = function (pos, callback) {
  if (typeof callback === 'function') {
    this._seekcompleteCb = callback
  }
  return this._handle.seek(pos)
}

/**
 * stop the player.
 */
MediaPlayer.prototype.stop = function () {
  return this._handle.stop()
}

/**
 * reset the player.
 */
MediaPlayer.prototype.reset = function () {
  return this._handle.reset()
}

/**
 * disconnect and cleanup the player.
 */
MediaPlayer.prototype.disconnect = function () {
  return this._handle.disconnect()
}

/**
 * @peoperty {String} id
 * @readonly
 */
Object.defineProperty(MediaPlayer.prototype, 'id', {
  get: function () {
    return this._handle.idGetter()
  }
})

/**
 * @property {Boolean} playing
 * @readable
 */
Object.defineProperty(MediaPlayer.prototype, 'playing', {
  get: function () {
    return this._handle.playingStateGetter()
  }
})

/**
 * @property {Number} duration
 * @readable
 */
Object.defineProperty(MediaPlayer.prototype, 'duration', {
  get: function () {
    return this._handle.durationGetter()
  }
})

/**
 * @property {Number} position
 * @readable
 */
Object.defineProperty(MediaPlayer.prototype, 'position', {
  get: function () {
    return this._handle.positionGetter()
  }
})

/**
 * @property {Boolean} loopMode
 * @readable
 * @writable
 */
Object.defineProperty(MediaPlayer.prototype, 'loopMode', {
  get: function () {
    return this._handle.loopModeGetter()
  },
  set: function (mode) {
    return this._handle.loopModeSetter(mode)
  }
})

/**
 * @property {Number} volume
 * @readable
 * @writable
 */
Object.defineProperty(MediaPlayer.prototype, 'volume', {
  get: function () {
    return this._handle.volumeGetter()
  },
  set: function (vol) {
    return this._handle.volumeSetter(vol)
  }
})

/**
 * @property {String} sessionId
 * @readable
 * @writable
 */
Object.defineProperty(MediaPlayer.prototype, 'sessionId', {
  get: function () {
    return this._handle.sessionIdGetter()
  },
  set: function (id) {
    return this._handle.sessionIdSetter(id)
  }
})

exports.MediaPlayer = MediaPlayer