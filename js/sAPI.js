var list = "";
var filesList = new Array();

function readXMLToolList(repofile) {

  list = "";

  var route = "data/" + repofile;

  console.log("Loading XML Document...")
  var xmlDoc = cargarXMLDoc(route)
  console.log("XML document: " + (new XMLSerializer()).serializeToString(xmlDoc))
  console.log("Parsing XML response")

  var noderoot = xmlDoc.documentElement;
  list += "<ul data-role='listview' id='tree'>"
  generateTree(noderoot)
  list += "</ul>"

  //generateArrray(noderoot)

  console.log('Final: ' + list);
}

function generateTree(node) {
  if (node != null && node.nodeType == Node.ELEMENT_NODE) {
    if (node.hasChildNodes()) {
      list += '<li><img src="img/tree_folder.png" alt="' + node.getAttribute("label") + '" class="ui-li-icon">' + node.getAttribute("label")
      list += "<ul>"
      for (var i = 0; i < node.childNodes.length; i++)
        generateTree(node.childNodes[i]);
      list += "</ul></li>"
    } else {
      list += '<li><a href="#" onclick="loadService(' + "'" + node.getAttribute("label") + "'" + ')' + '"' + '><img src="img/serviceicon.png" alt="' + node.getAttribute("label") + '" class="ui-li-icon">' + node.getAttribute("label") + '</a>'
      list += "</li>"
    }
  }
}

function cargarXMLDoc(archivoXML) {
  var xmlDoc;

  if (window.XMLHttpRequest) {
    xmlDoc = new window.XMLHttpRequest();
    xmlDoc.open("GET", archivoXML, false);
    xmlDoc.send("");
    return xmlDoc.responseXML;
  }
  // para IE 5 y IE 6
  else if (ActiveXObject("Microsoft.XMLDOM")) {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.load(archivoXML);
    return xmlDoc;
  }
  alert("Error cargando el documento.");
  return null;
}

function fechaHoraExt() {

  var d = new Date();
  var day = d.getUTCDate();
  var h = d.getHours();
  var m = d.getMinutes();

  return (day+'-'+h+'H'+m + 'M.txt');

}

function generateInterface(parameters, serviceName) {

  document.write("<div data-role='content'>" +
    "<form name='parametersForm' action='javascript:processParameters()' method='post' id='parametersFormID'>");

  document.write('<div id="inputs"></div><div id="outputs"></div>');

  for (var x = 0; x < parameters.length; x++) {


    var outputCount = 0; var outputIndex = 0;
    var parametersDiv;
      (parameters[x].input=='true') ? parametersDiv = $("#inputs") : parametersDiv = $("#outputs");

    var infoTextHtml = "";
    console.log("parameters[" + x + "].description: " + parameters[x].description);


    if (parameters[x].description) {
      infoTextHtml = '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-inline="true" data-jsb_prepared="2nis0xjxn9">No text</a>';
    }

    if(parameters[x].input == 'true') {
      switch (parameters[x].dataTypeName) {
        case 'Integer':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');
          parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');

          if (parameters[x].allowedValues.length > 1) {
            parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');
            var selectAux = '<select name="select-choice-mini" id="parameter' + x + '" data-mini="true" data-inline="true">';
            for (var y = 0; y < parameters[x].allowedValues.length; y++) {
              var selectedValue = "";
              if (parameters[x].allowedValues == parameters[x].defaultValue) {
                selectedValue = "selected";
              }
              selectAux += '<option ' + selectedValue + ' value="' + parameters[x].allowedValues[y] + '">' + parameters[x].allowedValues[y] + '</option>';
            }
            selectAux += '</select>';
            parametersDiv.append(selectAux);
          } else {
            parametersDiv.append('<input type="number" name="text-basic" id="parameter' + x + '" value="" data-inline="true" step="any" min="0">')
          }

          // poner esto sólo si lo hay!
          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

          // document.write('<div style="float: right">' +
          //   '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-jsb_prepared="2nis0xjxn9">No text</a>' +
          //   '</div>');

          parametersDiv.append('</div>');
          break;

        case 'Float':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');
          parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');

          if (parameters[x].allowedValues.length > 1) {
            parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');
            var selectAux = '<select name="select-choice-mini" id="parameter' + x + '" data-mini="true" data-inline="true">';
            for (var y = 0; y < parameters[x].allowedValues.length; y++) {
              selectAux += '<option value="' + parameters[x].allowedValues[y] + '">' + parameters[x].allowedValues[y] + '</option>';
            }
            selectAux += '</select>';
            parametersDiv.append(selectAux);
          } else {
            parametersDiv.append('<input type="number" name="text-basic" id="parameter' + x + '" value="" data-inline="true" step="any" min="0">')
          }

          // poner esto sólo si lo hay!
          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

          // document.write('<div style="float: right">' +
          //   '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-jsb_prepared="2nis0xjxn9">No text</a>' +
          //   '</div>');

          parametersDiv.append('</div>');
          break;

        case 'CEL':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');
          parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');
          parametersDiv.append('<input type="text" name="text-basic" id="parameter' + x + '" value="">');

          // poner esto sólo si lo hay!
          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

          // document.write('<div style="float: right">' +
          //   '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-jsb_prepared="2nis0xjxn9">No text</a>' +
          //   '</div>');

          parametersDiv.append('</div>');
          break;

        case 'String':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');

          //If it has allowedValues, it needs a 'select' box
          if (parameters[x].allowedValues.length > 1) {
            parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');
            var selectAux = '<select name="select-choice-mini" id="parameter' + x + '" data-mini="true" data-inline="true">';
            for (var y = 0; y < parameters[x].allowedValues.length; y++) {
              var selectedValue = "";
              console.log("Allowed: " + parameters[x].allowedValues[y] + " Default: " + parameters[x].defaultValue);
              if (parameters[x].allowedValues[y] == parameters[x].defaultValue) {
                console.log("EntraIF");
                selectedValue = "selected";
              }
              selectAux += '<option ' + selectedValue + ' value="' + parameters[x].allowedValues[y] + '">' + parameters[x].allowedValues[y] + '</option>';
            }
            selectAux += '</select>';
            parametersDiv.append(selectAux);

            // poner esto sólo si lo hay!
            parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

            // document.write('<div style="float: right">' +
            //   '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-jsb_prepared="2nis0xjxn9">No text</a>' +
            //   '</div>');

          } else {
            parametersDiv.append('<div class="ui-grid-a" style="border-width: 2px; border-style: double; border-color: #FF8C00; ">' +
            '<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>' +
            '<div class="ui-block-stringa">' +
            '<div data-role="fieldcontain">' +
              //'<input type="text" name="text-basic" id="parameter'+x+'" value="" data-inline="true">' +
            '<textarea name="text-basic" id="parameter' + x + '" value="" data-inline="true"></textarea>' +
            '</div></div>' +
            '<div class="ui-block-stringb">' +
              //'<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all" data-inline="true">No text</a>' +
              //'<a href="#" class="ui-btn ui-icon-cloud ui-btn-icon-notext ui-corner-all" data-inline="true">No text</a>' +
            infoTextHtml +
              // '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-jsb_prepared="2nis0xjxn9">No text</a>' +
            '</div></div>');
          }

          parametersDiv.append('</div>');
          break;

        case 'Boolean':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');
          parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');
          parametersDiv.append('<input type="checkbox" data-role="flipswitch" name="switch" id="parameter' + x + '" data-on-text="True" data-off-text="False">');
          /*document.write('<select name="flip" id="flip" data-role="slider">');
           document.write('<option value="true" selected="">True</option>');
           document.write('<option value="false">False</option>');
           document.write('</select>');*/


          // poner esto sólo si lo hay!
          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

          // document.write('<div style="float: right">' +
          //   '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-jsb_prepared="2nis0xjxn9">No text</a>' +
          //   '</div>');

          parametersDiv.append('</div>');
          break;

        default:

          if (parameters[x].input == "false") {
            break;
          }


          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">' +
              '<div class="ui-grid-a" style="border-width: 2px; border-style: double; border-color: #FF8C00; ">' +
              '<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>' +
              '<div class="ui-block-a">' +
              '<div data-role="fieldcontain">' +
              '<p id="parameterhidden' + x + '" class="texthidden"></p>' +
              '<input type="text" name="text-basic" id="parameter' + x + '" value="" data-inline="true" placeholder="Fetch a file from mORCA previous outputs">' +
                //'<textarea name="text-basic" id="parameter'+x+'" value="" data-inline="true"> </textarea>' +
              '</div></div>' +
              '<div class="ui-block-b" style="padding-top:5px">' +
                // elminado lápiz
                // '<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all">No text</a>' +
              '<a href="#popupMenu' + x + '" data-rel="popup" data-transition="slideup" id="' + x + '"class="ui-btn ui-icon-cloud ui-btn-icon-left ui-corner-all" data-inline="true" data-jsb_prepared="2nis0xjxn9">Cloud files</a>' +

                // poner esto sólo si lo hay!
              infoTextHtml +

              '</div><div class="ui-block-c ui-screen-hidden" style="padding-top:7px">' +
              '<fieldset data-role="controlgroup">' +
              '<label for="checkbox' + x + '" data-inline="true" >File</label>' +
              '<input type="checkbox" id="checkbox' + x + '" data-inline="true">' +
              '</fieldset></div></div></div>'
          );

          var generatePopup='<div data-role="popup" id="popupMenu' + x + '" data-theme="b">' +
          '<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="arrow-l" data-iconpos="notext" class="ui-btn-right">Close</a>' +
          '<ul data-role="listview" data-inset="true" style="min-width:210px;">' +
          '<li data-role="list-divider">Files:</li>';


          if (!getCookie('username')) {
            generatePopup +='<li><i>You must be logged to use the file system!</i></li>';
          } else {
            for (var y in filesList) {
              generatePopup +=
                  '<li><a onclick="nuevoParametro(' + x + ',\''
                  + filesList[y].id + '\',\''
                  + filesList[y].name + '\'); $(\'#popupMenu' + x + '\').popup(\'close\');">' + filesList[y].name + '</a></li>';
            }
          }

          generatePopup+=('</ul></div></div>');

          parametersDiv.append(generatePopup);

          repoid = String(window.location.href.split('?')[2]);
          repoid = decodeURI(repoid);


          // document.ready(function(){
          //     $("#resultbutton").click(function(){
          //         getFile(resultfile,getCookie("token"), repoid);
          //         $("#mainresults").text("");
          //     });


          break;
      }

      parametersDiv.append('<div data-role="popup" id="popupDescription' + x + '" data-theme="b">' +
      '<p>' + parameters[x].description + '</p>' +
      '</div>');
    } else if (outputCount==0){
      outputIndex = x;
    }
  }

  parametersDiv = $("#outputs");

  var laFechaHoraExt = fechaHoraExt();
  var fileName = serviceName +'_' + laFechaHoraExt;
  // var fileName = name + " give me a name!";

  parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">' +
    '<label for="nameFile"><b>'+parameters[outputIndex].name+':</b>  <font color = "gray">(Output File)</font></label>' +
    '<input type="text" name="text-basic" id="nameFile" data-inline="true" value="' + fileName + '">' +
    '</div>');

  parametersDiv.append(
    "<button type='submit' id='runrun' class='show-page-loading-msg' data-textonly='false' data-textvisible='true' >Run</button>");
  parametersDiv.append("</form></div>");
}


/////// Cookie Functions ////////

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0)
      return c.substring(name.length, c.length);
  }
  return false;
};


function checkCookies() {
  /*var user = getCookie('username');
  if(user){
      document.write('<div id="usernamediv"><p>Welcome '+user+'!</p></div>')
  } else {
      document.write('<div id="usernamediv"><p>Welcome!</p></div>')
  }*/
};

function eraseCookie(cname) {
  if (getCookie(cname)) {
    document.cookie = cname + '=' + '-1' + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

////////// END Cookie Functions //////////////


///////// Login Functions ///////////////////


function logged() {
  if (getCookie('username')) {
    return true;
  } else {
    return false;
  }
};

function mainLogin(user, pass) {
  if (!logged()) {
    loginWS(user, pass)

    // $("#usernamediv").html("");
    $("#usernamediv").html("<font size=1>Logged in as: <b>" + user + "</b></font>")

    $('#loginButton').html('Logout');
    $('#loginButton').removeAttr('href');
    $('#loginButton').attr('onclick', 'mainLogout()');

  }
};

function mainLogout() {
  if (logged()) {
    eraseCookie('username');
    eraseCookie('token');

    $('#loginButton').html('Sign in');
    $('#loginButton').removeAttr('onclick');

    // $("#usernamediv").html("");
    $("#usernamediv").text("Bye bye!")

    window.location.reload();
  }
};

function S3Logged() {
  if (getCookie('s3user')) {
    return true
  } else {
    return false
  }
}

function loginS3(username, password) {

  var now = new Date();
  var time = now.getTime();
  time += 3600 * 1000;
  now.setTime(time);
  document.cookie = 's3user=' + username + '; expires=' + now.toUTCString();
  document.cookie = 's3key=' + password + '; expires=' + now.toUTCString();

  $('#loginS3button').closest('.ui-btn').hide();
  $('#importS3button').closest('.ui-btn').show();

  window.location.reload();
}

///// END Login Functions //////////////



////// jQuery Interface Functions /////


function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


$(document).on("click", ".show-page-loading-msg", function() {
    var $this       = $(this),
        theme       = $this.jqmData("theme")       || $.mobile.loader.prototype.options.theme,
        msgText     = $this.jqmData("msgtext")     || $.mobile.loader.prototype.options.text,
        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
        textonly    = !!$this.jqmData("textonly");

    html = $this.jqmData("html") || "";

    $.mobile.loading("show", {
      text        : msgText,
      textVisible : textVisible,
      theme       : theme,
      textonly    : textonly,
      html        : html
    });
  })
  .on("click", ".hide-page-loading-msg", function() {
    $.mobile.loading("hide");
    // intento que automáticamente se carguen los resultados al terminar

  });

////// END jQuery Interface Functions //////////

////// File Browser Functions  //////////

function fileUploadHandler() {

  var data = null;
  var user = getCookie('username');
  var session = getCookie('token');
  var repoid = 'Bitlab [chirimoyo.ac.uma.es]';

  getRoot(user, session, '', repoid);

  if (window.FileReader) {
    // FileReader are supported.
    var input = document.getElementById('fileToUpload');
    var reader = new FileReader();

    reader.onload = function() {
      data = reader.result;
      name = input.files[0].name;
      format = 'Moby';
      folderid = '';
      user = user;
      session = session;
      description = 'Test Description';
      repoid = repoid;


      var selectFileType = document.getElementById("selectFileType");
      var type = selectFileType.options[selectFileType.selectedIndex].value;

      switch (type) {
        case "Fasta":
          var preF = '<AminoAcidSequence id="" namespace=""><String articleName="SequenceString">';
          var postF = '</String><Integer articleName="Length"></Integer></AminoAcidSequence>';
          data = preF + data + postF;
          break;
        case 'Moby':
          // data = data;
          break;
      }

      newFile(name, data, format, folderid, description, user, session, repoid);

    };

    reader.readAsText(input.files[0]);
  } else {
    alert('FileReader is not supported in this browser.');
  }

}

function loadHandler(event) {
  var data = event.target.result;
}

function loadFileBrowser() {
  var token = getCookie("token");
  var user = getCookie("username");
  getRoot(user, token, '', repoid.toString());

  $('#fileListUL').empty();

  $('#fileListUL').append("<li data-role='list-divider'>" +
    '<div class="rowElement">' +
    '<div class="ui-bar ui-grid-a" id="filelistheader">' +
    "<div class='ui-block-a' >File</div>" +
    "<div class='ui-block-b center padding-refresh'><a onclick='window.location.reload()' class='ui-btn ui-icon-refresh ui-btn-icon-notext ui-corner-all'>No text</a></div>" +
    "</div></div> </li>");

  for (x = 0; x < filesList.length; x++) {
    $('#fileListUL').append('<li class="ui-btn">' +
      '<div class="rowElement">' +
      '<div class="ui-bar ui-grid-a">' +
      '<div class="ui-block-a"><span class="fileText">' + filesList[x].name + '</span></div>' +
      // '<div class="ui-block-a"><span class="fileText">' + filesList[x].name.substr(0, 25) + '</span></div>' +
      '<div class="ui-block-b">' +
      // eliminado lápiz
      // '<a href="#fileInfo' + x + '"data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all">No text</a>' +
      '<a onclick="loadFileInFileViewer(filesList[' + x + '].id)" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all">No text</a>' +
      // '<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all">No text</a>' +
      '<a onclick="deleteElement(filesList[' + x + '].id,' + token + ', repoid.toString());" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all">No text</a>' +
      '</div> </div> </div> </li>');
  }

  $('#fileInfoPopups').empty();

  for (x = 0; x < filesList.length; x++) {
    $('#fileInfoPopups').append("<div data-role='popup' id='fileInfo" + x + "' data-theme='a' class='ui-corner-all'>" +
      "<p>Name: " + filesList[x].name + "</p></br>" +
      "<p>Created: " + filesList[x].creationTime + "</p></br>" +
      "</div>");

    $('#fileInfo' + x).popup();
  }


}


function importFile(fileName, type) {
  AWS.config.update({ accessKeyId: 'AKIAIMXVBS4HNMY45OZA', secretAccessKey: '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' });
  AWS.config.region = 'eu-west-1';
  var ep = new AWS.Endpoint('s3-eu-west-1.amazonaws.com');
  var s3 = new AWS.S3({ endpoint: ep });

  s3.getObject({ Bucket: "morcabucket", Key: fileName },
    function(error, data) {
      if (error != null) {
        alert("Failed to retrieve an object: " + error);
      } else {

        var dataAux = data.Body.toString();

        switch (type) {
          case "Fasta":
            var preF = '<AminoAcidSequence id="" namespace=""><String articleName="SequenceString">'
            var postF = '</String><Integer articleName="Length"></Integer></AminoAcidSequence>'
            dataAux = preF + dataAux + postF;
            break;
          case 'Moby':
            var regexpresion = new RegExp("(<!\\[CDATA\\[(...)]]>)");
            dataAux = dataAux.replace(regexpresion, "");
            dataAux = dataAux.replace(new RegExp('(<!\\[CDATA\\[)', "g"), "");
            dataAux = dataAux.replace(new RegExp('(]]>)', "g"), "");
            dataAux = dataAux.replace(new RegExp('(<\\?xml version="1.0" encoding="UTF-8"\\?>)'), "");
            dataAux = dataAux.replace(new RegExp('(<Integer><articleName="Length">)'), '<Integer articleName="Length">');
            break;
        }

        user        = getCookie('username');
        session     = getCookie('token');
        repoid      = 'Bitlab [chirimoyo.ac.uma.es]';
        data        = dataAux;
        name        = fileName;
        format      = 'Moby';
        folderid    = '';
        user        = user;
        session     = session;
        description = 'Test Description';
        repoid      = repoid;

        newFile(name, data, format, folderid, description, user, session, repoid);
      }
    }
  );
}

////// END File Browser Functions  //////////


////// BioTools  //////////

function loadBioToolsServiceList(){

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  $.ajax({
    url: "https://bio.tools/api/tool?format=json"
  }).then(function(data) {
    content = data;
    var list = '<ul data-role="listview" id="tree" data-inset="true">';
    for (var i = 0; i < content.length; i++) {
      var object = content[i];
      var interface = object.interface;
      for (var j = 0; j < interface.length; j++){
        //document.write('interfaceType: ' + interface[j].interfaceType);
        if(interface[j].interfaceType === 'SOAP WS' && (typeof interface[j].interfaceSpecURL !== 'undefined' || endsWith(object.homepage,".wsdl"))) {
          list += '<li>' +
                      '<a href="#"><img src="img/serviceicon.png" alt="'+object.name+'">'+'<h2>'+object.name+'</h2>'+'<p>'+object.description+'</p></a></li>'
        }
      }
    }
    console.log("Biotools: "+list)
  });
};

////// END BioTools  //////////

function listBiocatalogue() {

  $.ajax({
    url: 'getJSON.php',
    success: function(data) {
      var content = jQuery.parseJSON(data);
      console.log(content);
      content = content.search.results;
      console.log(content);
      var list = '<ul data-role="listview" id="tree" data-inset="true">';
      for (var i = 0; i < content.length; i++) {
        var object = content[i];
        list += '<li>' +
            '<a href="#"><img src="img/serviceicon.png" alt="'+object.name+'">'+'<h2>'+object.name+'</h2>'+'<p>'+object.resource+'</p></a></li>'
          }

      console.log(list)
    }
  });
}

function generateJobMonitoringInterface (jobs) {


  /* Dictionary for id/namefile

   var token = getCookie("token");
   var user = getCookie("username");
   getRoot(user, token, '', repoid.toString());

   var files = [];
   for (i in filesList) {
   var key = filesList[i].id ;
   files[key] = filesList[i].name
   }

   */

  //Order array DESC
  jobs.sort(function(a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a>b ? -1 : a<b ? 1 : 0;
  });


  console.log(jobs);

  $('#jobTable > tbody').html("");

  //Append each job as a row in the table
  for (i in jobs) {
    var date = new Date(jobs[i].date);
    var minutes = function (){
      if (date.getUTCMinutes() <10){
        return "0"+date.getUTCMinutes();
      } else {
        return date.getUTCMinutes();
      }
    }
    var classes = jobs[i].status



    $('#jobTable > tbody').append('<tr class="'+classes+'"> <td>'+jobs[i].jobName+'</td><td><a onClick="loadFileInFileViewer('+"'"+jobs[i].outputFile+"'"+')" data-inline="true" data-role="button" data-icon="action" data-iconpos="notext">Open</a><a href="index.html" data-inline="true" data-role="button" data-icon="delete" data-iconpos="notext">Open</a></td><td>'+date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear()+' - '+date.getUTCHours()+':'+minutes()+'</td></tr>').trigger('create');


  }

  $('#jobTable').table("refresh");
}