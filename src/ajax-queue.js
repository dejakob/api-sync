import Helper from './helper';
import ajax from '@fdaciuk/ajax';

/**
 * Ajax Queue
 */
class AjaxQueue
{
    get TIMEOUT () {
        return this._TIMEOUT;
    }

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
     *
     * @param {String} type
     * @param {String} url
     * @param {Object} [data]
     * @param {Object} [options]
     */
    add (type, url, data = {}, options = {}) {
        type = type.toLowerCase();

        const key = this._generateKey(type, url);
        const foundItemInQueue = this._queue[key];

        if (
            typeof foundItemInQueue === 'undefined' ||
            foundItemInQueue === null
        ) {
            this._queue[key] = [];
        }

        this._queue[key].push({ type, url, data, options });
        this._wait();
    }

    /**
     *
     * @param {String} type
     * @param {String} url
     */
    remove (type, url) {
        const key = this._generateKey(type, url);
        delete this._queue[key];
    }

    /**
     * @param {String} type
     * @param {String} url
     * @returns {String}
     * @private
     */
    _generateKey (type, url) {
        return `${type}|${url}`;
    }

    /**
     *
     * @returns {Promise}
     * @private
     */
    _run () {
        let queueKeys = Object.keys(this._queue);
        const queueKey = queueKeys[0];
        const vm = this;

        if (!queueKey || !this._queue.hasOwnProperty(queueKey)) {
            throw new Error(`Queue key${queueKey} not found`);
        }

        const { type, url, data, options } = Helper.mergeRequests(this._queue[queueKey]);
        const method = type.toLowerCase();
        const ajaxInstance = ajax();

        if (!ajaxInstance.hasOwnProperty(method)) {
            throw new Error(`${method} is not recognised as an ajax method type`);
        }

        return ajaxInstance[method](url, data)
            .then(_onComplete.bind(this))
            .catch(_onFailed.bind(this));

        function _onComplete (response) {
            if (typeof options.onComplete === 'function') {
                options.onComplete(response);
            }

            delete this._queue[queueKey];
            queueKeys.splice(0, 1);

            this._isWaiting = false;
            _again.call(this);
        }

        function _onFailed () {
            if (typeof options.onFailed === 'function') {
                option.onFailed();
            }

            this._failedQueue[queueKey] = this._queue[queueKey];

            delete this._queue[queueKey];
            queueKeys.splice(0, 1);

            this._isWaiting = false;
            _again.call(this);
        }

        function _again () {
            if (queueKeys.length > 0) {
                this._wait();
            }
            else {
                this._isWaiting = false;
            }
        }
    }

    /**
     *
     * @private
     */
    _wait () {
        if (this._isWaiting === false) {
            this._isWaiting = setTimeout(this._run.bind(this), this._TIMEOUT);
        }
    }
}

export default AjaxQueue;