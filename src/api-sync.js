import { ACTION_TYPES } from './config';
import workerScript from '../dist/worker';

class ApiSync
{
    constructor () {
        const blob = new Blob([
            window.workerScript
        ], { type: "text/javascript" });

        this.worker = new Worker(window.URL.createObjectURL(blob));
        this.worker.onmessage = this._processIncomingMessage.bind(this);
        this._optionsStore = {};
    }

    set timeout (timeout) {
        this.worker.postMessage({
            action: ACTION_TYPES.SET_TIMEOUT,
            timeout
        });
    }

    add (type, url, data, options) {
        const optionsKey = `${Date.now()}-${Math.random()}`;
        this._optionsStore[optionsKey] = options;

        this.worker.postMessage({
            action: ACTION_TYPES.ADD_ITEM_TO_QUEUE,
            type,
            url,
            data,
            optionsKey
        });
    }

    remove (type, url) {
        this.worker.postMessage({
            action: ACTION_TYPES.REMOVE_FROM_QUEUE,
            type,
            url
        })
    }

    _processIncomingMessage (message) {
        switch (message.data.action) {
            case ACTION_TYPES.LOG_ERROR:
                return this._logError(message.data.errorMessage);

            case ACTION_TYPES.ON_COMPLETE:
                return this._onComplete(message.data.optionsKey, message.data.response);

            case ACTION_TYPES.ON_FAILED:
                return this._onFailed(message.data.optionsKey, message.data.errorDetails);
        }
    }

    _onComplete (optionsKey, response) {
        const options = this._optionsStore[optionsKey];

        if (options && typeof options.onComplete === 'function') {
            options.onComplete(response, options);
        }

        delete this._optionsStore[optionsKey];
    }

    _onFailed (optionsKey, errorDetails) {
        const options = this._optionsStore[optionsKey];

        if (options && typeof options.onComplete === 'function') {
            options.onComplete(errorDetails, options);
        }

        delete this._optionsStore[optionsKey];
    }

    _logError (errorMessage) {
        console.log('[API-SYNC WORKER]', errorMessage);
    }
}

const apiSyncInstance = new ApiSync();

if (typeof window === 'object' && window !== null) {
    window.ApiSync = apiSyncInstance;
}

export default apiSyncInstance;