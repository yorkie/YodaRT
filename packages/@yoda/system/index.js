'use strict'

/**
 * @module @yoda/system
 */

var native = require('./system.node')
/**
 * Reboot the system.
 * @function reboot
 * @returns {Boolean}
 */
exports.reboot = native.reboot

/**
 * Verify the OTA image, including hash(md5) check, section check and header check.
 * @function verifyOtaImage
 * @returns {Boolean}
 */
exports.verifyOtaImage = native.verifyOtaImage

/**
 * Prepare the OTA procedure. It should be called before start upgrading.
 * @function prepareOta
 * @private
 * @param {string} path the image path to be installed, **empty string** if resetting ota
 * @returns {Number} native method status code, 0 on success, non-0 otherwise
 */
exports.prepareOta = native.prepareOta

/**
 * @private
 */
exports.GetOtaFlag = native.GetOtaFlag

/**
 * @typedef DiskUsage
 * @property {number} available
 * @property {number} free
 * @property {number} total
 */

/**
 * Get disk usage at a path.
 *
 * @function diskUsage
 * @param {string} path - the path to be analyzed
 * @returns {module:@yoda/system~DiskUsage}
 */
exports.diskUsage = native.diskUsage