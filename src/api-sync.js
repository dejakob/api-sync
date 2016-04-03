import AjaxQueue from './ajax-queue';

const _ajaxQueue = new AjaxQueue();

class ApiSync
{
    static get timeout () {
        return _ajaxQueue.TIMEOUT;
    }

    static set timeout (val) {
        _ajaxQueue.TIMEOUT = val;
    }

    static add () {
        return _ajaxQueue.add.apply(_ajaxQueue, arguments);
    }

    static remove () {
        return _ajaxQueue.remove.apply(_ajaxQueue, arguments);
    }
}

window.ApiSync = ApiSync;
export default ApiSync;