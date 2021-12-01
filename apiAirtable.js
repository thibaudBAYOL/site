var myapiJS = new ApiClient();
//Authorization: Bearer 
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxx");
myHeaders.append("Content-Type", "application/json");

var DB="xxx";
var table="xxx";

/**
 * 
 * @param Array fields (list de field)
 * @returns 
 */
function getAirtable(fields,filter=null) {
    url = "https://api.airtable.com/v0/"+DB +
        "/"+table+"?";
    if (fields != null) {
        if (fields.length == 1) {
            url += "fields[]=" + fields[0];
        } else if (fields.length > 1) {
            fields.forEach(element => {
                url += "fields[]=" + element + "&";
            });
        }
        if(filter != null){
            url+="&";
        }
    }
    if(filter != null){
        url+=filter;
    }
    console.log(url);
    return myapiJS.get(url, myHeaders, true)
}



/**
 * 
 * @param Array list (liste de {'fields': { 'field1': 'val1','field2':'val2' }} )
 * @returns 
 */
function addAirtable(list) {


    url = "https://api.airtable.com/v0/"+DB +
        "/"+table;

    data = JSON.stringify({ "records": list });
    //data= "{\"records\":[{\"fields\":{\"Name\":\"88\"} } ]}";
    console.log(data);
    return myapiJS.post(url, data, myHeaders, true);

}


//PATCH  (update)
/**
 * 
 * @param Array list (liste de {'id':'xxxxxxxxxxx','fields':[{'field1': 'val1'},{'field2': 'val2'}]} )
 * @returns 
 */
function updateAirtable(list) {


    url = "https://api.airtable.com/v0/"+DB +
        "/"+table;

    data = JSON.stringify({ "records": list });
    //data= "{\"records\":[{\"fields\":{\"Name\":\"88\"} } ]}";
    console.log(data);
    return myapiJS.patch(url, data, myHeaders, true);

}


/**
 * 
 * @param Array list (list des ID a suprimmer)
 * @returns 
 */
function deleteAirtable(list) {

    var url = "https://api.airtable.com/v0/"+DB +
        "/"+table;

    if (list.length == 1) {
        url += "/" + list[0];
    } else {
        url += "?"
        list.forEach(element => {
            url += "records[]=" + element + "&";
        });
    }


    //data= "{\"records\":[{\"fields\":{\"Name\":\"88\"} } ]}";

    //myapiJS.post(url, data, myHeaders, true).then((rep) => { cach = rep; console.log(JSON.stringify(cach)); });
    return myapiJS.delete(url, null, myHeaders, true);
}
