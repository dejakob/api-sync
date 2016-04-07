import { ACTION_TYPES } from './config';
import workerScript from '../dist/worker';

class ApiSync
{
    constructor () {
        const blob = new Blob([
            window.workerScript
        ], { type: "text/javascript" });

        this.worker = new Worker(window.URL.createObjectURL(blob));
        this.worker.onmessage = this._processIncomingMessage;
    }

    set timeout (timeout) {
        this.worker.postMessage({
            action: ACTION_TYPES.SET_TIMEOUT,
            timeout
        });
    }

    add (type, url, data, options) {
        this.worker.postMessage({
            action: ACTION_TYPES.ADD_ITEM_TO_QUEUE,
            type,
            url,
            data,
            options
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
                return this._logError(message.errorMessage);
        }
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