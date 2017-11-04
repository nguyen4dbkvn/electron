"use strict"

const config = require('./configuration.js');

let installCounter = 0;

// Reference to the Salesforce OAuth plugin
let oauthPlugin;
let oauthCallbackURL = 'http://localhost';

let toQueryString = obj => {
    let parts = [],
        i;
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
};

module.exports = {
    createInstance: (appId, loginURL, oauthCallbackURL) => {
        return window.cordova ? new OAuthCordova(appId, loginURL, oauthCallbackURL) : new OAuthWeb(appId, loginURL, oauthCallbackURL);
    }
}

class OAuth {
  constructor() {
    installCounter = installCounter + 1;
    this.instanceId = installCounter;

    this.loginURL = config.readSettings('host') || 'https://login.salesforce.com';
    this.appId = config.readSettings('clientId');
    this.clientSecret = config.readSettings('clientSecret');
    this.clientUserName = config.readSettings('clientUserName');
    this.clientPassword = config.readSettings('clientPassword');
    this.useProxy = (window.cordova || window.SfdcApp || window.sforce) ? false : true;
  }

  login() {
  }
}

class OAuthCordova extends OAuth{

    login() {
        return new Promise((resolve, reject) => {
            document.addEventListener("deviceready", () => {
                oauthPlugin = cordova.require("com.salesforce.plugin.oauth");
                if (!oauthPlugin) {
                    console.error("Salesforce Mobile SDK OAuth plugin not available");
                    reject("Salesforce Mobile SDK OAuth plugin not available");
                    return;
                }
                oauthPlugin.getAuthCredentials(
                    function (creds) {
                        resolve({
                            accessToken: creds.accessToken,
                            instanceURL: creds.instanceUrl,
                            refreshToken: creds.refreshToken,
                            userId: creds.userId
                        });
                    },
                    function (error) {
                        console.log(error);
                        reject(error);
                    }
                );
            }, false);
        });
    }

}

class OAuthWeb extends OAuth {
  login() {
    return new Promise((resolve, reject) => {
       /*document.addEventListener("oauthCallback", (event) => {
         alert(event);
       });*/
      var xhr = new XMLHttpRequest(),
      params = {
        "grant_type": "password",
        "client_id": this.appId,
        "client_secret": this.clientSecret,
        "username": this.clientUserName,
        "password": this.clientPassword
      };

      let authURL = this.loginURL + "/services/oauth2/token?" + toQueryString(params);

      xhr.onreadystatechange  = () => {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                console.log(res);

                resolve({
                  appId: this.appId,
                  accessToken: res.access_token,
                  instanceURL: res.instance_url,
                  refreshToken: res.refresh_token,
                  userId: res.id.split("/").pop()
                });
              } else {
                console.log("Error while trying to refresh token: " + xhr.responseText);
                reject(xhr.responseText);
              }
          }
      };

      xhr.open("POST", authURL, true);
      xhr.setRequestHeader("Accept", "application/json");
      if (!this.useProxy) {
        xhr.setRequestHeader("Target-URL", this.loginURL);
      }
      xhr.send();
    });
  }

}
