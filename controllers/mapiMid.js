/**
 * Created by Yeyo on 17/10/16.
 */

var jsdom = require("jsdom").jsdom;
var doc = jsdom();
var window = doc.defaultView;
var $ = require("jquery")(window);
var soap = require('./node_modules/jquery-soap/lib/jquery.soap.js');


function configureSoap() {
    soap.soap({
        url: 'http://chirimoyo.ac.uma.es/ApiWs/services/Api',
        appendMethodToURL: false,
        SOAPAction: '',
        crossDomain: true,

        envAttributes: { // additional attributes (like namespaces) for the Envelope:
            'xmlns:q0':      'http://api.bitlab.org',
            'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
            'xmlns:xsd':     'http://www.w3.org/2001/XMLSchema',
            'xmlns:xsi':     'http://www.w3.org/2001/XMLSchema-instance',
        },

        HTTPHeaders: {},

        error: function(soapResponse) {
            // NEED TO IMPLEMENT
            console.log(SOAPResponse.toString());
        },
    });
}

function getToolListAsXML(reponame) {
    configureSoap();
    soap.soap({
        method: 'getToolListAsXML',
        namespaceQualifier: 'q0',

        data: {
            getEmptyFC: 'true',
            repoid: reponame.toString()
        },

        success: function(soapResponse) {
            console.log(soapResponse.toString());
        },
        error: function(SOAPResponse) {
            console.log(SOAPResponse.toString());
        }
    });
}