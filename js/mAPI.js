//Objects definitions
function parameter(allowedValues, dataTypeID, dataTypeName, name, description, paramIndex, type, input) {

  this.allowedValues = new Array([]);
  this.dataTypeID = dataTypeID;
  this.dataTypeName = dataTypeName;
  this.name = name;
  this.description = description;
  this.input = input;
  this.paramIndex = paramIndex;
  this.type = type;
  this.allowedValues = allowedValues;

  function addValues(value) {
    this.allowedValues.add(value);
  }
}

function file(category, creationTime, data, dataTypeId, description, f, format, id, name, owner, parentId) {
  this.category = category;
  this.creationTime = creationTime;
  this.data = data;
  this.dataTypeId = dataTypeId;
  this.description = description;
  this.f = f;
  this.format = format;
  this.id = id;
  this.name = name;
  this.owner = owner;
  this.parentId = parentId;
}

//SOAP Definition
function soap() {
  $.soap({
    url: 'http://chirimoyo.ac.uma.es/ApiWs/services/Api',
    appendMethodToURL: false,
    SOAPAction: '',

    envAttributes: { // additional attributes (like namespaces) for the Envelope:
      'xmlns:q0': 'http://api.bitlab.org',
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },

    HTTPHeaders: {},

    error: function(soapResponse) {
      // NEED TO IMPLEMENT
      console.log(SOAPResponse.toString());
    }
  });
};


//Methods ApiWS

function getToolListAsXML(repoName) {
  soap();
  $.soap({
    method: 'getToolListAsXML',
    namespaceQualifier: 'q0',

    data: {
      getEmptyFC: 'true',
      repoid: repoName.toString()
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      // NEED TO IMPLEMENT
      console.log(soapResponse.toString());
    },
    error: function(SOAPResponse) {
      // NEED TO IMPLEMENT
      console.log(SOAPResponse.toString());
    }
  });
};

function loginWS(user, pass) {
  soap();
  $.soap({
    method: 'loginWS',
    namespaceQualifier: 'q0',
    async: false,

    data: {
      "auth0": [{
        "key": "login",
        "value": user
      }, {
        "key": "pass",
        "value": pass
      }]
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
      $.mobile.loading("show");
    },

    success: function(soapResponse) {

      if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(soapResponse.toString(), "text/xml");
      } else // Internet Explorer
      {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(soapResponse.toString());
      }

      var token = xmlDoc.getElementsByTagName("loginWSReturn")[0].childNodes[0].nodeValue;

      //Create a cookie for the token
      var now = new Date();
      var time = now.getTime();
      time += 3600 * 1000;
      now.setTime(time);
      document.cookie = 'token=' + token + '; expires=' + now.toUTCString();
      document.cookie = 'username=' + user + '; expires=' + now.toUTCString();

      console.log(soapResponse.toString());
      $.mobile.loading("hide");
    },

    error: function(SOAPResponse) {
      $.mobile.loading("hide");
      alert("Wrong user. Please, try again.");
      console.log(SOAPResponse.toString());

    }
  });
}

function getOperations(toolID, repoID)  {
  soap();
  $.soap({
    method: 'getOperations',
    namespaceQualifier: 'q0',

    //Need to be fixed in the API.
    data: {
      toolid: toolID.toString(),
      repoid: repoID.toString()
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      // NEED TO IMPLEMENT
      console.log(soapResponse.toString());
    },

    error: function(SOAPResponse) {
      // NEED TO IMPLEMENT
      console.log(SOAPResponse.toString());
    }
  });


}

function getParameters(operationID, repoID, returnFunction)  {
  soap();
  $.soap({
    method: 'getParameters',
    namespaceQualifier: 'q0',
    async: false,

    data: {
      operationid: operationID.toString(),
      repoid: repoID.toString()
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {

      var response = soapResponse.toXML();
      var noderoot = response.documentElement;
      var parameters = new Array();

      parametersReturns = noderoot.getElementsByTagName("getParametersReturn");
      for (x = 0; x < parametersReturns.length; x++) {

        //Getting allowedValues for this parameter
        var allowedValues = new Array([]);

        allowedValuesNodes = parametersReturns[x].getElementsByTagName("allowedValues");
        for (y = 0; y < allowedValuesNodes.length; y++) {
          if (typeof(allowedValuesNodes[y].childNodes[0]) != "undefined") {
            allowedValues.push(allowedValuesNodes[y].childNodes[0].nodeValue);
          }
        }

        //Getting the other values
        var dataTypeID = parametersReturns[x].getElementsByTagName("dataTypeID")[0].childNodes[0].nodeValue;
        var dataTypeName = parametersReturns[x].getElementsByTagName("dataTypeName")[0].childNodes[0].nodeValue;
        var name = parametersReturns[x].getElementsByTagName("name")[0].childNodes[0].nodeValue;
        if (parametersReturns[x].getElementsByTagName("description")[0].childNodes.length != 0) {
          var description = parametersReturns[x].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        } else {
          var description = "";
        }
        var paramIndex = parametersReturns[x].getElementsByTagName("paramIndex")[0].childNodes[0].nodeValue;
        var type = parametersReturns[x].getElementsByTagName("type")[0].childNodes[0].nodeValue;
        var input = parametersReturns[x].getElementsByTagName("input")[0].childNodes[0].nodeValue;

        parameters.push(new parameter(allowedValues, dataTypeID, dataTypeName, name, description, paramIndex, type, input));

      }

      returnFunction(parameters);
    },

    error: function(SOAPResponse) {
      // NEED TO IMPLEMENT
      console.log(SOAPResponse.toString());
    }
  });

}


function executeService(inputList, outputList, urlOperation, idOperation, nameFile, idFolder, token, user, repoID)  {
  soap();
  $.soap({
    method: 'executeService',
    namespaceQualifier: 'q0',

    data: function(SOAPObject) {
      SOAPObject = new SOAPObject("soapenv:Body")
      var execute = SOAPObject.newChild('q0:executeService')

      //Creating input parameters list
      for (var x in inputList) {
        var input = execute.newChild("q0:inputList")

        if (inputList[x][0] != null) {
          input.addParameter("q0:data", inputList[x][0])
        } else {
          input.newChild("q0:data").attr("nil", "true");
        }

        if (inputList[x][1] != null) {
          input.addParameter("q0:dataType", inputList[x][1])
        } else {
          input.newChild("q0:dataType").attr("nil", "true");
        }

        if (inputList[x][2] != null) {
          input.addParameter("q0:format", inputList[x][2])
        } else {
          input.newChild("q0:format").attr("nil", "true");
        }

        if (inputList[x][3] != null) {
          input.addParameter("q0:name", inputList[x][3])
        } else {
          input.newChild("q0:name").attr("nil", "true");
        }

        if (inputList[x][4] != null) {
          input.addParameter("q0:paramType", inputList[x][4])
        } else {
          input.newChild("q0:paramType").attr("nil", "true");
        }

        if (inputList[x][5] != null) {
          input.addParameter("q0:store", inputList[x][5])
        } else {
          input.newChild("q0:store").attr("nil", "true");
        }

        if (inputList[x][6] != null) {
          input.addParameter("q0:type", inputList[x][6])
        } else {
          input.newChild("q0:type").attr("nil", "true");
        }

        if (inputList[x][6] != null) {
          input.addParameter("q0:file", inputList[x][7])
        } else {
          input.newChild("q0:file").attr("nil", "true");
        }

      }

      //Creating output parameters list
      for (var y in outputList) {
        var output = execute.newChild("q0:outputList")
        output.addParameter("q0:data", outputList[y][0])
        output.addParameter("q0:dataType", outputList[y][1])
        output.addParameter("q0:format", outputList[y][2])
        output.addParameter("q0:name", outputList[y][3])
        output.addParameter("q0:paramType", outputList[y][4])
        output.addParameter("q0:store", outputList[y][5])
        output.addParameter("q0:type", outputList[y][6])
        output.addParameter("q0:file", outputList[y][7])
      }

      //Creating service parameters
      execute.addParameter("q0:urlOperation", urlOperation.toString())
      execute.addParameter("q0:idOperation", idOperation.toString())
      execute.addParameter("q0:nameFile", nameFile.toString())
      execute.addParameter("q0:idFolder", idFolder.toString())
      execute.addParameter("q0:token", token.toString())
      execute.addParameter("q0:user", user.toString())
      execute.addParameter("q0:repoid", repoID.toString())

      return SOAPObject;
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      var response = soapResponse.toXML();
      var noderoot = response.documentElement;
      resultfile = noderoot.getElementsByTagName("executeServiceReturn")[0].childNodes[0].nodeValue;
      $.mobile.loading('hide');
      $('#resultbutton').prop('disabled', "").removeClass('ui-disabled');
    },

    error: function(SOAPResponse) {
      // NEED TO IMPLEMENT
      $.mobile.loading('hide');
      console.log(SOAPResponse.toString());
    }
  });


}

function getFile(idfile, session, repoid) {
  soap();
  $.soap({
    method: 'getFile',
    namespaceQualifier: 'q0',

    data: {
      id: idfile,
      session: session,
      repoid: repoid
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(soapResponse.toString(), "text/xml");
      } else // Internet Explorer
      {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(soapResponse.toString());
      }

      var data = xmlDoc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
      // resultadosFinales = data;
      // $("#mainresults").text("resultadosFinales: " + resultadosFinales);
      $("#rmainresults").text("desde geFile: " + data);
      alert("Output: " + data);
      return data;
    },
    error: function(SOAPResponse) {
      // NEED TO IMPLEMENT
      console.log(SOAPResponse.toString());
    }
  });
};

function getFolder(id, username, session, dtid, repoid) {
  soap();
  $.soap({
    method: 'getFolder',
    namespaceQualifier: 'q0',

    data: {

      id: id,
      user: username,
      session: session,
      dtid: dtid,
      repoid: repoid
    },

    beforeSend: function(SOAPEnvelope) {
      //Need to implement
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      //Need to implement
      console.log(soapResponse.toString());
    },

    error: function(SOAPResponse) {
      //Need to implement
      console.log(SOAPResponse.toString());

    }
  });
}


function getRoot(username, session, dtid, repoid) {
  soap();
  $.soap({
    method: 'getRoot',
    namespaceQualifier: 'q0',
    async: false,

    data: {
      user: username,
      session: session,
      dtid: dtid,
      repoid: repoid
    },

    beforeSend: function(SOAPEnvelope) {
      //Need to implement
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      //Need to implement

      filesList.length = 0;

      var response = soapResponse.toXML();
      var noderoot = response.documentElement;
      getRootReturns = noderoot.getElementsByTagName("getRootReturn");

      for (x = 0; x < getRootReturns.length; x++) {
        var category = null;
        var creationTime = null;
        var data = null;
        var dataTypeId = null;
        var description = null;
        var f = null;
        var format = null;
        var id = null;
        var name = null;
        var owner = null;
        var parentId = null;
        // alert("Dentro de getRoot: " + getRootReturns[x].getElementsByTagName("category")[0].childNodes[0])
        try {category =     getRootReturns[x].getElementsByTagName("category"     )[0].childNodes[0].nodeValue; } catch(e){}
        try {creationTime = getRootReturns[x].getElementsByTagName("creationTime" )[0].childNodes[0].nodeValue; } catch(e){}
        try {data =         getRootReturns[x].getElementsByTagName("data"         )[0].childNodes[0].nodeValue; } catch(e){}
        try {dataTypeId =   getRootReturns[x].getElementsByTagName("dataTypeId"   )[0].childNodes[0].nodeValue; } catch(e){}
        try {description =  getRootReturns[x].getElementsByTagName("description"  )[0].childNodes[0].nodeValue; } catch(e){}
        try {f =            getRootReturns[x].getElementsByTagName("f"            )[0].childNodes[0].nodeValue; } catch(e){}
        try {format =       getRootReturns[x].getElementsByTagName("format"       )[0].childNodes[0].nodeValue; } catch(e){}
        try {id =           getRootReturns[x].getElementsByTagName("id"           )[0].childNodes[0].nodeValue; } catch(e){}
        try {name =         getRootReturns[x].getElementsByTagName("name"         )[0].childNodes[0].nodeValue; } catch(e){}
        try {owner =        getRootReturns[x].getElementsByTagName("owner"        )[0].childNodes[0].nodeValue; } catch(e){}
        try {parentId =     getRootReturns[x].getElementsByTagName("parentId"     )[0].childNodes[0].nodeValue; } catch(e){}

        filesList.push(new file(category, creationTime, data, dataTypeId, description, f, format, id, name, owner, parentId));
      }
    },

    error: function(SOAPResponse) {
      //Need to implement
      console.log(SOAPResponse.toString());

    }

  });
}

function newFile(name, data, format, folderid, description, user, session, repoid) {

  var preData = '<![CDATA[';
  var postData = ']]>';

  soap();
  $.soap({
    method: 'newFile',
    namespaceQualifier: 'q0',

    data: {

      name: name,
      data: preData + data + postData,
      //data: data,
      format: format,
      folderid: folderid,
      description: description,
      user: user,
      session: session,
      repoid: repoid
    },

    beforeSend: function(SOAPEnvelope) {
      //Need to implement
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      //Need to implement
      console.log("Success");
      window.location.reload();
      console.log(soapResponse.toString());
    },

    error: function(SOAPResponse) {
      //Need to implement
      console.log("Error");
      console.log(SOAPResponse.toString());

    }
  });
}

function deleteElement(elementid, session, repoid) {
  soap();
  $.soap({
    method: 'deleteElement',
    namespaceQualifier: 'q0',

    data: {
      elementid: elementid,
      session: session,
      repoid: repoid
    },

    beforeSend: function(SOAPEnvelope) {
      console.log(SOAPEnvelope.toString());
    },

    success: function(soapResponse) {
      window.location.reload();
      console.log(soapResponse.toString());
    },
    error: function(SOAPResponse) {
      // NEED TO IMPLEMENT
      console.log(SOAPResponse.toString());
    }
  });
};
