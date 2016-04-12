import Helper from './helper';
import ajax from '@fdaciuk/ajax';
import { ACTION_TYPES } from './config';

/**
 * Ajax Queue
 */
class AjaxQueue
{
    /**
     *
     * @returns {Number}
     * @constructor
     */
    get TIMEOUT () {
        return this._TIMEOUT;
    }

    /**
     *
     * @param {Number} val
     * @constructor
     */
    set TIMEOUT (val) {
        this._TIMEOUT = val;
    }

    /**
     *
     */
    constructor () {
        this._TIMEOUT = 1000;
        this._queue = {};
        this._failedQueue = {};
        this._isWaiting = false;
    }

    /**
     * Add a request to the queue
     * @param {String} type
     * @param {String} url
     * @param {Object} [data]
     * @param {String} [optionsKey]
     */
    add (type, url, data = {}, optionsKey) {
        type = type.toLowerCase();

        const key = AjaxQueue._generateKey(type, url);
        const foundItemInQueue = this._queue[key];

        if (
            typeof foundItemInQueue === 'undefined' ||
            foundItemInQueue === null
        ) {
            this._queue[key] = [];
        }

        this._queue[key].push({ type, url, data, optionsKey });
        this._wait();
    }

    /**
     * Remove all requests with a specified type and url from the queue
     * @param {String} type
     * @param {String} url
     */
    remove (type, url) {
        const key = AjaxQueue._generateKey(type, url);
        delete this._queue[key];
    }

    /**
     * @param {String} type
     * @param {String} url
     * @returns {String}
     * @private
     */
    static _generateKey (type, url) {
        return `${type}|${url}`;
    }

    /**
     * Run the queue
     * @returns {Promise}
     * @private
     */
    _run () {
        let queueKeys = Object.keys(this._queue);
        const queueKey = queueKeys[0];

        if (!queueKey || !this._queue.hasOwnProperty(queueKey)) {
            throw new Error(`Queue key${queueKey} not found`);
        }

        const requestsBundle = Helper.mergeRequests(this._queue[queueKey]);
        const { type, url, data, optionsKey } = requestsBundle;
        const method = type.toLowerCase();
        const ajaxInstance = ajax();

        if (!ajaxInstance.hasOwnProperty(method)) {
            throw new Error(`${method} is not recognised as an ajax method type`);
        }

        return ajaxInstance[method](url, data)
            .then(_onComplete.bind(this, requestsBundle))
            .catch(_onFailed.bind(this, requestsBundle));

        /**
         * Sending a bundled request succeeded
         * @param {Object} requestsBundle
         * @param {Object} response
         * @private
         */
        function _onComplete (requestsBundle, response) {
            if (typeof requestsBundle.optionsKey === 'string') {
                postMessage({
                    action: ACTION_TYPES.ON_COMPLETE,
                    optionsKey: requestsBundle.optionsKey,
                    response
                });
            }

            delete this._queue[queueKey];
            queueKeys.splice(0, 1);

            this._isWaiting = false;
            _next.call(this);
        }

        /**
         * Sending a bundled request failed
         * @param {Object} requestsBundle
         * @param {Object} errorDetails
         * @private
         */
        function _onFailed (requestsBundle, errorDetails) {
            if (typeof requestsBundle.optionsKey === 'string') {
                postMessage({
                    action: ACTION_TYPES.ON_FAILED,
                    optionsKey: requestsBundle.optionsKey,
                    errorDetails
                });
            }
        }

        /**
         * Run the next item of the queue
         * @private
         */
        function _next () {
            if (queueKeys.length > 0) {
                this._wait();
            }
            else {
                this._isWaiting = false;
            }
        }
    }

    /**
     * Wait the timeout, then run
     * @private
     */
    _wait () {
        if (this._isWaiting === false) {
            this._isWaiting = setTimeout(this._run.bind(this), this._TIMEOUT);
        }
    }
}

export default AjaxQueue;