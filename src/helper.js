import _ from 'lodash';

class Helper {

    /**
     *
     * @param {Array.<Object>} requests
     * @returns {Object}
     */
    static mergeRequests (requests) {
        const firstRequest = requests[0];
        const mergedData = _.merge(...requests.map(request => request.data));

        return {
            type: firstRequest.type,
            url: firstRequest.url,
            data: mergedData,
            options: firstRequest.options
        }
    }
}

export default Helper;