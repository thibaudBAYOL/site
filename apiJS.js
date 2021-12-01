
class ApiClient {

    /**
     * 
     * @param String url 
     * @param String type (GET,POST,PATCH,PUT,DELETE)
     * @param String data = null
     * @param Headers myHeaders = null
     * @param Bool json = false
     * @returns Promise<any> retour
     */
    request(url, type, data = null, myHeaders = null, json = false) {
        return new Promise(function (resolve, reject) {
            var init = { method: type };
            myHeaders ? init["headers"] = myHeaders : null;
            data ? init["body"] = data : null;

            fetch(url, init).then(function (response) {
                var rep;
                if (json) {
                    rep = response.json();
                } else {
                    rep = response.text();
                }
                rep.then(function (text) {
                    resolve(text);
                }, reject);
            }, reject);
        });
//response.headers.get("content-type");
    }
    /**
     * GET
     * @param String url 
     * @param Headers myHeaders = null
     * @param Bool json = false 
     * @returns Promise<any> retour
     */
    get(url, myHeaders = null, json = false) {
        return this.request(url, "GET", null, myHeaders, json);
    }
    /**
     * POST
     * @param String url 
     * @param String data
     * @param Headers myHeaders = null
     * @param Bool json = false 
     * @returns Promise<any> retour
     */
    post(url, data, myHeaders = null, json = false) {
        return this.request(url, "POST", data, myHeaders, json);
    }
    /**
     * PATCH
     * @param String url 
     * @param String data
     * @param Headers myHeaders = null
     * @param Bool json = false 
     * @returns Promise<any> retour
     */
    patch(url, data, myHeaders = null, json = false) {
        return this.request(url, "PATCH", data, myHeaders, json);
    }
    /**
     * DELETE
     * @param String url 
     * @param String data = null
     * @param Headers myHeaders = null 
     * @param Bool json = false
     * @returns Promise<any> retour
     */
    delete(url, data = null, myHeaders = null, json = false) {
        return this.request(url, "DELETE", data, myHeaders, json);
    }
    /**
     * PUT
     * @param String url 
     * @param String data = null
     * @param Headers myHeaders = null 
     * @param Bool json = false
     * @returns Promise<any> retour
     */
    put(url, data = null, myHeaders = null, json = false) {
        return this.request(url, "PUT", data, myHeaders, json);
    }

}