const force = require('./forcejs_wrapper')
const config = require('./configuration')

console.log(config.readSettings('host'))

let result = document.querySelector('#result');

var oauth = force.OAuth.createInstance();
function load() {
  oauth.login().then(function(oauthResult) {
    console.log("oauthResult: ", oauthResult);
      var service = force.DataService.createInstance(
        oauthResult,
        {
          loginURL: "https://test.salesforce.com",
          apiVersion: "v37.0",
          proxyURL: oauthResult.instanceURL
        });
      loadContacts();
  });
}

function loadContacts() {
    var service = force.DataService.getInstance();

    service.query('select id, Name from contact LIMIT 50')
        .then(function(response) {
          console.log(response)
            var contacts = response.records;
            result.innerHTML = contacts;
        });
}

document.querySelector('#loadDataBtn').addEventListener('click', load)
