class ApiAirtable {

     myHeaders= new Headers();
     myapiJS = new ApiClient();
     DB="";
     table="";

    constructor(DB_id, tab, mdp) {
        //Authorization: Bearer 
        this.myHeaders.append("Authorization", "Bearer " + mdp);
        this.myHeaders.append("Content-Type", "application/json");

        this.DB = DB_id;
        this.table = tab;
    }
    /**
     * 
     * @param Array fields (list de field)
     * @returns 
     */
    getAirtable(fields, filter = null) {
        var url = "https://api.Airtable.com/v0/" + this.DB +"/" + this.table + "?";
        if (fields != null) {
            if (fields.length == 1) {
                url += "fields[]=" + fields[0];
            } else if (fields.length > 1) {
                fields.forEach(element => {
                    url += "fields[]=" + element + "&";
                });
            }
            if (filter != null) {
                url += "&";
            }
        }
        if (filter != null) {
            url += filter;
        }
        console.log(url);
        return this.myapiJS.get(url, this.myHeaders, true)
    }



    /**
     * 
     * @param Array list (liste de {'fields': { 'field1': 'val1','field2':'val2' }} )
     * @returns 
     */
    addAirtable(list) {

        var url = "https://api.Airtable.com/v0/" + this.DB +
            "/" + this.table;

        data = JSON.stringify({ "records": list });
        //data= "{\"records\":[{\"fields\":{\"Name\":\"88\"} } ]}";
        return this.myapiJS.post(url, data, this.myHeaders, true);

    }


    //PATCH  (update)
    /**
     * 
     * @param Array list (liste de {'id':'xxxxxxxxxxx','fields':[{'field1': 'val1'},{'field2': 'val2'}]} )
     * @returns 
     */
    updateAirtable(list) {


        var url = "https://api.Airtable.com/v0/" + this.DB +
            "/" + this.table;

        data = JSON.stringify({ "records": list });
        //data= "{\"records\":[{\"fields\":{\"Name\":\"88\"} } ]}";
        console.log(data);
        return this.myapiJS.patch(url, data, this.myHeaders, true);

    }


    /**
     * 
     * @param Array list (list des ID a suprimmer)
     * @returns 
     */
    deleteAirtable(list) {

        var url = "https://api.Airtable.com/v0/" + this.DB +
            "/" + this.table;

        if (list.length == 1) {
            url += "/" + list[0];
        } else {
            url += "?"
            list.forEach(element => {
                url += "records[]=" + element + "&";
            });
        }
        return this.myapiJS.delete(url, null, this.myHeaders, true);
    }

}
