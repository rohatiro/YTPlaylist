/**
 * Sample JavaScript code for youtube.playlists.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

window.ytpitems = [];

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner" })
        .then(function () { console.log("Sign-in successful"); },
            function (err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey(config.API_KEY);
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); execute(); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    getPlayListItems();
}

function getPlayListItems() {
    let param = {
        "part": "contentDetails,snippet",
        "maxResults": 50,
        "playlistId": config.PLAYLIST_ID
    };

    let GetNextItems = function(res) {
        let result = res.result;
        let items = result.items;
        let nextpagetoken = result.nextPageToken;
        let params = Object.assign({"pageToken": nextpagetoken}, param);

        if(items.lenght) return;
        
        ytpitems.push(...items);

        if(nextpagetoken) {
            console.log(res, nextpagetoken, params, param);
            return gapi.client.youtube.playlistItems.list(params).then(GetNextItems);
        }
    };

    return gapi.client.youtube.playlistItems.list(param)
        .then(
            GetNextItems,
            function (err) { console.error("Execute error", err); });
}


gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: config.CLIENT_ID });
});