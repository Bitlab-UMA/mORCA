var urlMagallanes = "https://chirimoyo.ac.uma.es/magallanes-web/";
var parser = new DOMParser();
var serializer = new XMLSerializer();
var styleResults = "padding: 10px; border-width: 2px; margin: 10px; border-style: double; border-color: #FF8C00;";
var styleResultsDiv = 'width: auto; padding: 4px; margin: 0; color: #333333;	font-family: "Lucida Console", Monaco, monospace;	font-size: 75%;	white-space: normal; display: block;	outline: none;';
var repoidINB = "INB  [chirimoyo.ac.uma.es]";
var repoidBitlab = "Bitlab [chirimoyo.ac.uma.es]";
var toolidINB = "urn:lsid:biomoby.org:serviceinstance:chirimoyo.ac.uma.es";
var toolidBitlab = "urn:symbiomath:tool:";
var ServiceLinkDiv = '<div class="serviceLink"><a href="#" onclick="loadServiceFromMagallanes(this.parentNode.parentNode.parentNode)" class="ui-btn ui-shadow ui-corner-all ui-icon-action ui-btn-icon-right">Open Service</a></div>';
var moreResultsButton = '<center><a id="moreResultsButton" onclick="showMoreResults();" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-right" style="max-width: 150px;">More results</a></center>';
var resultsShown = 10;


$(document).ready(function(){
  getPage(urlMagallanes, true);
});

function getPage(url, flag) {
    $("#search-form").submit(function(e){
      e.preventDefault();
      $.post(url, $("#search-form").serialize(), function(data) {
        var resultsHTML = cleanHTMLResults(data);
        var resultsDOM = parser.parseFromString(resultsHTML, "text/html");
        $("#resultsDiv").html(resultsHTML);
        checkDidYouMean(resultsHTML, resultsDOM);
        $.mobile.loading('hide');
        window.location.href="#resultsPage";
      });
  });
}

function cleanHTMLResults(results) {
  var htmlDoc = parser.parseFromString(results, "text/html");
  var body = htmlDoc["body"];
  var prefiltered = 0;
  $(body).find('table')[0].remove();
  eraseTimeFromStats($(body).find('.stats')[0]);
  $(body).find('#results')[0].setAttribute("style", styleResultsDiv);
  prefiltered = getNumberOfPrefilteredResults(body);
  if (prefiltered != 0) {
    var eliminated = filterResultsAndReturnNumberOfEliminatedEntries(body);
  }
  replaceNumberOfResults(body, eliminated, prefiltered);
  return body.innerHTML;
}

function eraseTimeFromStats(stats) {
  stats.innerText = stats.innerText.substring(0, stats.innerText.indexOf('.'));
}

function getNumberOfPrefilteredResults(body) {
  var stats = $(body).find('.stats')[0].innerText;
  return parseInt(stats.substring(0, stats.indexOf(' ')));
}

function checkDidYouMean(resultsHTML, resultsDOM) {
  if(bodyContainsDidYouMean(resultsDOM)) {
    didYouMeanFlag = true;
    $('#results').click(function(e) {
      e.preventDefault();
      $.mobile.loading('show');
      var newURL = urlMagallanes + "index.jsp?query=" + didYouMeanWord(resultsDOM);
      $.get(newURL, function(data) {
        var didYouMeanResults = cleanHTMLResults(data);
        $("#resultsDiv").html(didYouMeanResults);
        setServiceLinksAndResultsStyle();
        $.mobile.loading('hide');
      });
    });
  } else {
    setServiceLinksAndResultsStyle();
  }
}

function setServiceLinksAndResultsStyle() {
  var index = 0;
  if ($("#results").children().length > 10) {
    $('#resultsDiv').append(moreResultsButton);
  }
  $('#results').children().each(function () {
    var urn = $(this).find('.id')[0].innerText;
    toolid = obtainToolId(urn);
    if ($(this).is(".service") && availableTool(toolid)) {
      $(this).append(ServiceLinkDiv)
    }
    changeStyle(this);
    if (index > resultsShown) {
      $(this).hide();
    }
    index++;
  });
}

function showMoreResults() {
  var i = resultsShown;
  var numberOfResults = $("#results").children().length;
  while (i < resultsShown + 10 && i < numberOfResults) {
    $($($('#results').children())[i++]).show();
  }
  resultsShown += 10;
  if(resultsShown > numberOfResults) {
    $("#moreResultsButton").hide();
  }
}

function obtainToolId(urn) {
  toolid = urn.substring(0, urn.indexOf(','));
  toolid = toolid != "" ? toolid : urn.substring(0, (urn.indexOf(':tool:') + 6));
  return toolid;
}

function changeStyle(element) {
  element.setAttribute("style", styleResults);
  $(element).append('<h4 class="ui-bar ui-bar-a"></h4>');
  $(element).append('<div class="ui-body"></div>');
  $(element).children().each(function () {
    if ($(this).is(".type")) {
      $(element).find("h4")[0].innerText = this.innerText.substring(0, this.innerText.indexOf(': '));
    } else if ($(this).is(".name")) {
      $(element).find("h4")[0].innerText += " | " + this.innerText;
    } else if ($(this).is(".description")) {
      $(element).find('.ui-body')[0].innerHTML += "<p>" + this.innerText + "</p>";
    } else if ($(this).is(".link")) {
      $(element).find('.ui-body')[0].innerHTML += '<p><a href="' + this.innerText + '">Link</a></p>';
    } else if ($(this).is(".serviceLink")) {
      $(element).find('.ui-body')[0].innerHTML += "<p>" + this.innerHTML + "</p>";
    }
    if (!$(this).is(".ui-body") && !$(this).is("h4")) {
      $(this).hide();
    }
  })
}

function availableTool(toolid) {
  return toolid == toolidINB || toolid == toolidBitlab;
}

function loadServiceFromMagallanes(current) {
  repoid = $(current).find('.repo')[0].innerText;
  var urn = $(current).find('.id')[0].innerText;
  switch (repoid) {
    case repoidINB:
      service = urn.substring(urn.indexOf(',') + 1, urn.length);
      toolid = toolidINB;
      break;
    case repoidBitlab:
      service = urn.substring(urn.indexOf('tool:') + 5, urn.length);
      toolid = toolidBitlab;
    break;
  }
  loadService(service);
}

function filterResultsAndReturnNumberOfEliminatedEntries(body) {
  var eliminated = 0;
  var list = $(body).find("#results")[0].children;
  for (i = 0; i < list.length; i++) {
    repoid = $(list[i]).find('.repo')[0].innerText;
    if (!existsRepository(repoid)) {
      list[i--].remove();
      eliminated++;
    }
  }
  return eliminated;
}

function existsRepository(repoid) {
  return repoid == repoidINB || repoid == repoidBitlab;
}

function replaceNumberOfResults(body, eliminated, prefiltered) {
  var stats = $(body).find('.stats')[0].innerText;
  var text = stats.substring(stats.indexOf(' '), stats.length);
  var number = prefiltered == 0 ? 0 : String(getNumberOfPrefilteredResults(body) - eliminated);
  $(body).find('.stats')[0].innerText = number + text;
}

function bodyContainsDidYouMean(resultsDOM) {
  return $(resultsDOM).find('b').length > 0;
}

function didYouMeanWord(resultsDOM) {
  return $(resultsDOM).find('a')[0].innerText;
}

function showLoading(){
  $.mobile.loading('show');
}
