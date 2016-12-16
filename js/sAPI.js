var list = "";
var filesList = new Array();
var repoid = "Bitlab [chirimoyo.ac.uma.es]";
var toolid = "urn:symbiomath:tool:";

function readXMLToolList(repofile) {

  list = "";

  var route = "data/" + repofile;

  var xmlDoc = cargarXMLDoc(route);
  var noderoot = xmlDoc.documentElement;
  list += "<ul data-role='listview' id='tree'>";
  generateTree(noderoot);
  list += "</ul>";

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

  console.log("Parameters: ");
  console.log(parameters);

  $("#serviceInterface").append("<div data-role='content'>" +
    "<form name='parametersForm' action='javascript:processParameters()' method='post' id='parametersFormID'>");

  $("#parametersFormID").append('<div id="inputs"></div><div id="outputs"></div>');

  for (var x = 0; x < parameters.length; x++) {

    var outputCount = 0; var outputIndex = 0;
    var parametersDiv;
      (parameters[x].input=='true') ? parametersDiv = $("#inputs") : parametersDiv = $("#outputs");

    var infoTextHtml = "";

    if ((parameters[x].description) && (parameters[x].description != "NULL")) {
      infoTextHtml = '<a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-icon-info ui-btn-icon-notext ui-corner-all" data-transition="pop" data-inline="true" data-jsb_prepared="2nis0xjxn9">No text</a>';
    }

    if(parameters[x].input == 'true') {
      switch (parameters[x].dataTypeName) {
        case 'Integer':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');
          parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');

          if (parameters[x].allowedValues.length > 1) {
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
            $('#parameter'+x).val(parameters[x].defaultValue);
          }

          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

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
            console.log("Float -> DefaultValue: "+parameters[x].defaultValue)
            parametersDiv.append('<input type="number" name="text-basic" id="parameter' + x + '" value="" data-inline="true" step="0.01" min="0">')
            $('#parameter'+x).val(parameters[x].defaultValue);
          }

          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

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
              if (parameters[x].allowedValues[y] == parameters[x].defaultValue) {
                selectedValue = "selected";
              }
              selectAux += '<option ' + selectedValue + ' value="' + parameters[x].allowedValues[y] + '">' + parameters[x].allowedValues[y] + '</option>';
            }
            selectAux += '</select>';
            parametersDiv.append(selectAux);

            parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

          } else {
            parametersDiv.append('<div class="ui-grid-a" style="border-width: 2px; border-style: double; border-color: #FF8C00; ">' +
            '<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>' +
            '<div class="ui-block-stringa">' +
            '<div data-role="fieldcontain">' +
              //'<input type="text" name="text-basic" id="parameter'+x+'" value="" data-inline="true">' +
            '<textarea name="text-basic" id="parameter' + x + '" value="" data-inline="true"></textarea>' +
            '</div></div>' +
            '<div class="ui-block-stringb">' +
            infoTextHtml +
            '</div></div>');
          }

          parametersDiv.append('</div>');
          break;

        case 'Boolean':
          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">');
          parametersDiv.append('<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>');
          parametersDiv.append('<input type="checkbox" data-role="flipswitch" name="switch" id="parameter' + x + '" data-on-text="True" data-off-text="False">');

          parametersDiv.append('<div style="float: right">' + infoTextHtml + '</div>');

          parametersDiv.append('</div>');
          break;

        default:

          if (parameters[x].input == "false") {
            break;
          }

          if ((parameters[x].description) && (parameters[x].description != "NULL")) {
            infoTextHtml = '<div class="ui-block-b"><a href="#popupDescription' + x + '" data-rel="popup" class="ui-btn ui-mini ui-icon-info ui-btn-icon-left ui-corner-all" data-transition="pop" data-inline="true" data-jsb_prepared="2nis0xjxn9">Info</a></div>';
          }

          parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">' +
              '<div class="parameterWrapper"">' +
              '<label for="parameter' + x + '">' + capitalise(parameters[x].name) + '</label>' +
              '<div>' +
              '<div data-role="fieldcontain">' +
              '<p id="parameterhidden' + x + '" class="texthidden"></p>' +
              '<input type="text" name="text-basic" id="parameter' + x + '" value="" data-inline="true" placeholder="Fetch a file from mORCA previous outputs">' +
              '</div></div>' +
              '<div class="ui-grid-b">' +
              '<div class="ui-block-a"><a href="#popupMenu' + x + '" data-rel="popup" data-transition="slideup" id="' + x + '"class="ui-btn ui-mini ui-icon-cloud ui-btn-icon-left ui-corner-all" data-jsb_prepared="2nis0xjxn9">Cloud files</a></div>' +

              infoTextHtml +

              '</div><div class="ui-screen-hidden" style="padding-top:7px">' +
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
            console.log(filesList);
            for (var y in filesList) {
              alert(filesList[y].name);
              console.log(filesList[y]);
                generatePopup +=
                    '<li><a onclick="nuevoParametro(' + x + ',\''
                    + filesList[y].id + '\',\''
                    + filesList[y].name + '\'); $(\'#popupMenu' + x + '\').popup(\'close\');">' + filesList[y].name + '</a></li>';
            }
          }

          generatePopup+=('</ul></div></div>');

          parametersDiv.append(generatePopup);

          repoid = repoID;
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

  parametersDiv.append('<div data-role="fieldcontain" id="parameterbox">' +
    '<label for="nameFile"><b>'+parameters[outputIndex].name+':</b>  <font color = "gray">(Output File)</font></label>' +
    '<input type="text" name="text-basic" id="nameFile" data-inline="true" placeholder="Insert output file name" maxlength="60">' +
    '</div>');

  parametersDiv.append(
    "<button type='submit' id='runrun' class='show-page-loading-msg' data-textonly='false' data-textvisible='true' >Run</button>");
  parametersDiv.append("</form></div>");

  $("#servicePage").trigger("create");
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

///////// Login Functions ////////////////

function logged() {
  if (getCookie('username')) {
    return true;
  } else {
    mainLogin('guest','guest');
    return false;
  }
};

function mainLogin(user, pass) {
    loginWS(user, pass)
};

function mainLogout() {
  if (logged()) {
    eraseCookie('username');
    eraseCookie('token');

    $('.loginButton').html('Sign in');
    $('.loginButton').removeAttr('onclick');

    // $("#usernamediv").html("");
    $("#usernamediv").text("Bye bye!");

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

function loginS3(username, password, bucketname, region) {

  console.log(username + " : " +password + " : " +bucketname+ " : "+region);

  var now = new Date();
  var time = now.getTime();
  time += 3600 * 1000;
  now.setTime(time);
  document.cookie = 's3user=' + username + '; expires=' + now.toUTCString();
  document.cookie = 's3key=' + password + '; expires=' + now.toUTCString();
  document.cookie = 's3bucketname='+bucketname +'; expires=' +now.toUTCString();
  document.cookie = 's3region=' + region + '; expires =' +now.toUTCString();

  listS3Bucket()
}

function listS3Bucket() {

  AWS.config.update({
    //accessKeyId: 'AKIAJV3P4CABYULYMOCQ',
    //secretAccessKey: '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'

    accessKeyId: getCookie("s3user"),
    secretAccessKey: getCookie("s3key")

  });


  AWS.config.region = getCookie("s3region"); //"eu-west-1"
  var ep = new AWS.Endpoint('s3-'+getCookie("s3region")+'.amazonaws.com');
  var s3 = new AWS.S3({
    endpoint: ep
  });

  var bucket = new AWS.S3({
    params: {
      Bucket: getCookie("s3bucketname") //"morcabucket"
    }
  });
  bucket.listObjects(function(err, data) {
    if (err) {
      $('#status').html("");
      $('#status').append('<p>Could not load objects from S3</p>');
    } else {
      $('#objects').html("");
      $('#status').html("");
      $('#status').append('<p>Loaded ' + data.Contents.length + ' items from S3</p>');
      for (var i = 0; i < data.Contents.length; i++) {
        $('#objects').append('<li><a href="#" id="' + i + '" onclick="importFile(' + "'" + data.Contents[i].Key + "'" + ');">' + data.Contents[i].Key + '</a></li>');
        $('#objects').listview().listview('refresh');
      }
    }
  });

}


////// jQuery Interface Functions /////

jQuery.expr[':'].fuzzyicontains = function(a, i, m) {

  var title = jQuery(a).text();
  var searchValue = m[3];

  return compareFuzzy(title, searchValue);
};

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

$.mobile.filterable.prototype.options.filterCallback = function(text, searchValue ) {

  function findLongestSubstring(str1, str2){

    str1 = str1.replace(/\s+/g, '');
    str2 = str2.replace(/\s+/g, '');

    var longest = "";
    for (var i = 0; i < str1.length; ++i) {
      for (var j = 0; j < str2.length; ++j) {
        if (str1[i] === str2[j]) {
          var str = str1[i];
          var k = 1;
          while (i + k < str1.length && j + k < str2.length && str1[i+k] === str2[j+k]) { // same letter
            str += str1[i+k];
            ++k;
          }

          if (str.length > longest.length) { longest = str }
        }
      }

    }
    return longest;
  }

  if(searchValue.length>0) {
    searchValue = searchValue.toLowerCase();
    var title = $(this).find("h2").first().text().toLowerCase();

    console.log("SearchValue: "+searchValue+" this: "+title);

    if(title.indexOf(searchValue)>-1) {
      $(this).css("background", "");
      return false;
    } else {
      var subst = findLongestSubstring(searchValue,title);
      if(subst.length*100/searchValue.length>=60){
        $(this).css("background", "");
        return false;
      } else {
        if ($(this).find("li").find("h2").is(':fuzzyicontains("'+searchValue+'")')) {
          $(this).css("background", "#B2D5C4");
          $(this).css("background-color", "#B2D5C4");
          return false;
        } else {
          $(this).css("background", "");
          return true;
        }
      }
    }
  } else {
    $(this).css("background", "");
  }

};

function compareFuzzy(title, searchValue){

  function findLongestSubstring(str1, str2){

    str1 = str1.replace(/\s+/g, '');
    str2 = str2.replace(/\s+/g, '');

    var longest = "";
    for (var i = 0; i < str1.length; ++i) {
      for (var j = 0; j < str2.length; ++j) {
        if (str1[i] === str2[j]) {
          var str = str1[i];
          var k = 1;
          while (i + k < str1.length && j + k < str2.length && str1[i+k] === str2[j+k]) { // same letter
            str += str1[i+k];
            ++k;
          }

          if (str.length > longest.length) { longest = str }
        }
      }

    }
    return longest;
  }

  if(searchValue.length>0) {
    searchValue = searchValue.toLowerCase();
    title = title.toLowerCase();

    console.log("F: SearchValue: "+searchValue+" this: "+title);

    if(title.indexOf(searchValue)>-1) {
      console.log("F: Lo tiene completo");
      return true;
    } else {
      var subst = findLongestSubstring(searchValue,title);
      console.log("F: Subcadena mas larga: "+subst);
      if(subst.length*100/searchValue.length>=60){
        console.log("F: Pasa el 60%");
        return true;
      } else {
        console.log("F: No pasa el 60%");
        return false;
      }
    }
  } else {
    return false;
  }
}

function changeRepository() {

  var selectRepository = document.getElementById("selectRepository");
  var selectedValue = selectRepository.options[selectRepository.selectedIndex].value;

  switch (selectedValue) {
    case 'INB':
      $("#treeview").load("data/inb.html");
      toolid = "urn:lsid:biomoby.org:serviceinstance:chirimoyo.ac.uma.es";
      repoid = "INB  [chirimoyo.ac.uma.es]";
      break;

    case 'MrSymbiomath':
      $("#treeview").load("data/mrsymbiomath.html");
      toolid = "urn:symbiomath:tool:";
      repoid = "Bitlab [chirimoyo.ac.uma.es]";
      break;

    case 'Biotools':
      $("#treeview").load("data/biotools.html");
      toolid = "urn:biotools:tool:";
      repoid = "Biotools";
      break;

    case 'Biocatalogue':
      $("#treeview").load("data/biocatalogue.html");
      toolid = "urn:biocatalogue:tool:";
      repoid = "biocatalogue";
      break;

  }
}

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

function generateFileBrowserInterface(){

  var token = getCookie("token");
  var user = getCookie("username");

  $('#fileListUL').empty();

  $('#fileListUL').append("<li data-role='list-divider'>" +
      '<div class="rowElement">' +
      '<div class="ui-bar ui-grid-a" id="filelistheader">' +
      "<div class='ui-block-a' >Filename</div>" +
      "<div class='ui-block-b center padding-refresh'><a onclick='loadFileBrowser()' class='ui-btn ui-icon-refresh ui-btn-icon-notext ui-corner-all'>No text</a></div>" +
      "</div></div> </li>");

  for (x = 0; x < filesList.length; x++) {

    var filename =  trimFilename(filesList[x].name, 20);

    $('#fileListUL').append('<li class="ui-btn">' +
        '<div class="rowElement">' +
        '<div class="ui-bar ui-grid-a">' +
        '<div class="ui-block-a"><span class="fileText">' + filename + '</span></div>' +
        // '<div class="ui-block-a"><span class="fileText">' + filesList[x].name.substr(0, 25) + '</span></div>' +
        '<div class="ui-block-b">' +
        '<a onclick="loadFileInFileViewer(filesList[' + x + '].id)" class="ui-btn ui-icon-eye ui-btn-icon-notext ui-corner-all">No text</a>' +
        '<a onclick="deleteElement(filesList[' + x + '].id,' + token + ', repoid.toString());" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all">No text</a>' +
        '<a onclick="downloadResults(filesList[' + x + '].id,' + token + ', repoid.toString(),'+"'"+ filesList[x].name +"'"+');" class="ui-btn ui-icon-arrow-d ui-btn-icon-notext ui-corner-all downloadLink">No text</a>' +
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

  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if(iOS) $(".downloadLink").addClass("ui-disabled");

}

function downloadResults (idFile, token, repoid, filename) {
  if (logged()) {
    var token = getCookie("token");

    $.soap({
      method: 'getFile',
      namespaceQualifier: 'q0',

      data: {
        id: idFile,
        session: token,
        repoid: repoid
      },

      success: function (soapResponse) {
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
        var clData = cleanData(data);

        var file = new File([clData], filename, {type: "text/plain;charset=utf-8"});
          saveAs(file);

      }

    });
  }
}

function downloadFile(name, contents, mime_type) {
  mime_type = mime_type || "text/plain";

  var blob = new Blob([contents], {type: mime_type});

  var dlink = document.createElement('a');
  dlink.download = name;
  dlink.href = window.URL.createObjectURL(blob);
  dlink.onclick = function(e) {
    // revokeObjectURL needs a delay to work properly
    var that = this;
    setTimeout(function() {
      window.URL.revokeObjectURL(that.href);
    }, 1500);
  };

  dlink.click();
  dlink.remove();
}

function loadHandler(event) {
  var data = event.target.result;
}

function loadFileBrowser() {
    var token = getCookie("token");
    var user = getCookie("username");
    getRoot(user, token, '', repoid.toString());
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

function loadFileInFileViewer(id){
  var session = getCookie('token');
  $("#results").html();
  getFile(id,session,repoid);
  $( "body" ).pagecontainer( "change", "#fileViewer", {transition: "slide"});
}

////// BioTools  //////////

function loadBioToolsServiceList(){

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  $.ajax({
    url: "https://bio.tools/api/tool?format=json"
  }).then(function(data) {
    var list = '<ul data-role="listview" id="tree" data-inset="true">';
    for (var i = 0; i < data.length; i++) {
      var service = data[i];
      var interface = service.interface;
      for (var j = 0; j < interface.length; j++){
        if(interface[j].interfaceType === 'SOAP WS' &&
            (typeof interface[j].interfaceSpecURL !== 'undefined' || endsWith(service.homepage,".wsdl"))) {
          list += '<li>' +
                      '<a href="#"><img src="img/serviceicon.png" alt="'+service.name+'">'+
                      '<h2>'+service.name+'</h2>'+
                      '<p>'+service.description+'</p></a></li>'
        }
      }
    }
  });
}

////// END BioTools  //////////

function listBiocatalogue() {

  $.ajax({
    url: 'getJSON.php',
    success: function(data) {
      data = jQuery.parseJSON(data);
      data = data.search.results;
      var list = '<ul data-role="listview" id="tree" data-inset="true">';
      for (var i = 0; i < data.length; i++) {
        var service = data[i];
        list += '<li>' +
            '<a href="#"><img src="img/serviceicon.png" alt="'+service.name+'">'+
            '<h2>'+service.name+'</h2>'+
            '<p>'+service.resource+'</p></a></li>'
          }
    }
  });
}

////// Monitoring /////

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


  var someoneRunning = false;
  var token = "";

  if(logged()){
    token = getCookie("token");

    $('#jobTable > tbody').html("");

    if(jobs.length>0){     //Order array DESC
      jobs.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a>b ? -1 : a<b ? 1 : 0;
      });
      $('#monitoringInfo').html("");
    } else {
      $('#monitoringInfo').html("<p class='codeText'> NO SERVICES LAUNCHED </p>");
    }



    //Append each job as a row in the table
    for (i in jobs) {
      var date = new Date(jobs[i].date);
      var minutes = function (){
        if (date.getUTCMinutes() <10){
          return "0"+date.getUTCMinutes();
        } else {
          return date.getUTCMinutes();
        }
      };

      if(jobs[i].status=='Running') {
        someoneRunning = true;
      }

      var classes = jobs[i].status;
      var viewFile = "";
      var downloadFile = "";

      if(jobs[i].outputFile!='NOT' && jobs[i].outputFile!="" && jobs[i].outputFile!='InvalidInput') {
        viewFile = '<a onclick="loadFileInFileViewer('+"'"+jobs[i].outputFile+"'"+')" data-inline="true" data-role="button" data-icon="eye" data-iconpos="notext">Open</a>';
        downloadFile = '<a onclick="downloadResults('+"'"+jobs[i].outputFile+"',"+ token + ",'" + repoid.toString() + "','" +jobs[i].nameFile+"'"+')" data-inline="true" data-role="button" data-icon="arrow-d" data-iconpos="notext">Download</a>';
      } else {
        viewFile = '<a class="ui-disabled" data-inline="true" data-role="button" data-icon="eye" data-iconpos="notext">Open</a>';
        downloadFile = '<a class="ui-disabled" onclick="downloadResults('+"'"+jobs[i].outputFile+"',"+ token + ",'" + repoid.toString() + "','" +jobs[i].nameFile+"'"+')" data-inline="true" data-role="button" data-icon="arrow-d" data-iconpos="notext">Download</a>';
      }

      var filename =  trimFilename(jobs[i].nameFile, 15);

      $('#jobTable > tbody').append('<tr class="'+classes+'"> <td>'+jobs[i].jobName+'</td><td>'+filename+'</td><td>'+date.getUTCDate()+'/'+date.getUTCMonth()+'/'+date.getUTCFullYear()+' - '+date.getUTCHours()+':'+minutes()+'</td><td>'+viewFile+'<a onclick="deleteJobByID('+"'"+jobs[i]._id+"'"+')"data-inline="true" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>'+downloadFile+'</td></tr>').trigger('create');
    }

    $('#jobTable').table("refresh");

  }

  if(someoneRunning) return true; else return false;
}

function refreshAutomatically (running){

  var jobs = getJobList();
  running = generateJobMonitoringInterface(jobs);

  var time = 1000;

  var myFunction = function(){
    clearInterval(interval);
    if (time < 15000) time += time;

    if(running) {
        var jobs = getJobList();
        running = generateJobMonitoringInterface(jobs);
        clearInterval(interval)
      }

    if(running) interval = setInterval(myFunction, time);
  };

  var interval = setInterval(myFunction, time);
}

function deleteJobByID (id) {

  if(logged()){
    var username = getCookie('username');
    var data = {
      'id' : id,
      'username':username
    };

    $.ajax({
      type: 'POST',
      async: false,
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://pistacho.ac.uma.es/morcanode/deleteJob',
      success: function(data) {
        var jobs = getJobList();
        generateJobMonitoringInterface(jobs);
      },
      error: function(err){
        console.log(err)
      }
    });
  }

}

///// Service JS /////

var name, urlOperation, idOperation, repoID;
var parameters = new Array();
var resultfile = "";
filesList = new Array();

function loadService(name) {
  loadServiceInfo(name);
  $("body").pagecontainer( "change", "#servicePage", {transition: "slide"} );
};

function loadServiceInfo(serviceName) {
  name = serviceName;
  urlOperation = toolid + name;
  idOperation = toolid + name + ";" + name;

  repoID = repoid;
};

function processParameters() {


  if (logged() && $('#nameFile').val().length != 0) {
    var d = new Date();
    d.setTime(d.getTime());
    var nameFile = document.getElementById("nameFile").value
    var idFolder = "";
    var token = getCookie("token");
    var user = getCookie("username");
    var inputList = new Array();
    var outputList = new Array();

    for (var x = 0; x < parameters.length; x++) {

      if (parameters[x].input == "true") {
        var parameter = new Array();
        var generatedID = 'parameter' + x + '';

        var para = document.getElementById('parameter' + x).value;

        try {para = document.getElementById('parameterhidden' + x).value } catch(e){};

        parameter.push(para);

        parameter.push(parameters[x].dataTypeID);
        parameter.push("Moby");
        parameter.push(parameters[x].name);
        parameter.push(null);
        parameter.push(null);
        parameter.push(parameters[x].type);

        if (document.getElementById("checkbox" + x)) {
          if (document.getElementById("checkbox" + x).checked) {
            parameter.push("true");
          } else {
            parameter.push("false");
          }

        } else {
          parameter.push("false");
        }

        inputList.push(parameter);
      }
    };

    for (var x = 0; x < parameters.length; x++) {
      if (parameters[x].input == "false") {

        var outParameter = new Array();
        outParameter.push(null);
        outParameter.push(parameters[x].dataTypeID);
        outParameter.push("");
        outParameter.push(parameters[x].name);
        outParameter.push(null);
        outParameter.push(null);
        outParameter.push(parameters[x].type);
        outParameter.push("false");

        outputList.push(outParameter);
      }
    }

    executeService(inputList, outputList, urlOperation, idOperation, nameFile, idFolder, token, user, repoID);

  } else {
    $.mobile.loading("hide");
    if(logged()) {
      $('#nameFile').attr("placeholder", "Please, insert a output file name. (i.e. 'myFile.txt')")
      $('#nameFile').focus()
    } else {
      alert("Please, log in if you want to execute a service");
    }
  }
}

// Navigation Fix
if ( ("standalone" in window.navigator) && window.navigator.standalone ) {
  $(document).on('click', "a[rel*=external], area[rel*=external]", function(){
    self.location=this.href;
    return false;
  });
}

window.nuevoParametro = function(id, hiddentext, text) {
  $("#popupMenu" + id).popup("close")
  $("#parameter" + id).val(text);
  $("#parameterhidden" + id).val(hiddentext);
  $('#checkbox' + id).prop('checked', true).checkboxradio('refresh');
  document.getElementById("runrun").disabled = false;
  // poner un nombre adecuado, si no le han puesto ya uno
  // var currentFileName = $("#nameFile").value;
  var currentFileName = document.getElementById("nameFile").value;
  if (currentFileName.length > 0) {
    var posseparation = currentFileName.lastIndexOf(' give me a name!');
    if (posseparation == -1) {
      posseparation = currentFileName.indexOf('-WITH-')
    }
    if (posseparation >= 0) {
      currentFileName = currentFileName.substr(0,posseparation) + '-WITH-' + $("#parameter" + id).val() + '_' +fechaHoraExt();
    }
  } else {
    currentFileName = $("#parameter" + id).val() + '_' +fechaHoraExt()
  }
  document.getElementById("nameFile").value = currentFileName;

}

//// ---------- ////

function trimFilename(filename, length){

  if (filename.length > 20) {
    filename = filename.substr(0,20);
    filename += "..."
  }

  return filename;
}

