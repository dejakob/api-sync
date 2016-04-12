import AjaxQueue from './ajax-queue';
import { ACTION_TYPES } from './config';

const ApiSyncWorker =
{
    init () {
        ApiSyncWorker.ajaxQueue = new AjaxQueue();
        ApiSyncWorker.postMessage = postMessage;
    },

    processIncomingMessage (message) {
        switch (message.data.action) {
            case ACTION_TYPES.SET_TIMEOUT:
                return ApiSyncWorker._setTimeout(message.data.timeout);
            case ACTION_TYPES.ADD_ITEM_TO_QUEUE:
                const { type, url, data, optionsKey } = message.data;
                return ApiSyncWorker._addItemToQueue(type, url, data, optionsKey);
            case ACTION_TYPES.REMOVE_FROM_QUEUE:
                return ApiSyncWorker._removeItemFromQueue(message.data.type, message.data.url);
        }
    },

    _setTimeout (timeout) {
        if (typeof timeout !== 'number') {
            ApiSyncWorker.logError('Timeout should be a number');
        }

        ApiSyncWorker.ajaxQueue.TIMEOUT = timeout;
    },

    _addItemToQueue (type, url, data, optionsKey) {
        if (typeof type !== 'string') {
            ApiSyncWorker.logError('Request type should be a string');
        }

        if (typeof url !== 'string') {
            ApiSyncWorker.logError('Url should be a string');
        }

        try {
            ApiSyncWorker.ajaxQueue.add(type, url, data, optionsKey);
        }
        catch (ex) {
            ApiSyncWorker.logError(ex.toString());
        }
    },

    _removeItemFromQueue (type, url) {
        if (typeof type !== 'string') {
            ApiSyncWorker.logError('Request type should be a string');
        }

        if (typeof url !== 'string') {
            ApiSyncWorker.logError('Url should be a string');
        }

        try {
            ApiSyncWorker.ajaxQueue.remove(type, url);
        }
        catch (ex) {
            ApiSyncWorker.logError(ex.toString());
        }
    },

    logError (errorMessage) {
        postMessage({
            action: ACTION_TYPES.LOG_ERROR,
            errorMessage
        });
    }
};

ApiSyncWorker.init();
onmessage = ApiSyncWorker.processIncomingMessage;