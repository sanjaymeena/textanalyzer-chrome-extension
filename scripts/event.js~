// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod(tab, method, info, callback) {
    chrome.tabs.executeScript(tab.id, {
        file: 'inject.js'
    }, function() {
        chrome.tabs.sendMessage(tab.id, {
            method: method,
            information: info
        }, callback);
    });
}


// When the browser action is clicked, call the
// getBgColors function.
//chrome.browserAction.onClicked.addListener(getBgColors);



// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
    var context = "selection";
    var title = "Text Analyzer";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "id": "context" + context
    });
});




chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
    var sText = info.selectionText;
    injectedMethod(tab, 'textAnalysis', info, function(response) {

        // var d=response.data;
        // var url=d

    })
};


var nlpdata;

//check if the two tabs have the same id
function isOpenUrl(tab1, tab2) {
    if (tab1 === tab2)
        return true;

    else {
        return false;
    }

}


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    var viewTabUrl = "";
    if (request.method === "seeMoreInformation") {
        nlpdata = request.data;


        viewTabUrl = chrome.extension.getURL('ta.html');

        chrome.tabs.getAllInWindow(undefined, function(tabs) {
            for (var i = 0, tab; tab = tabs[i]; i++) {
                if (tab.url && isOpenUrl(viewTabUrl, tab.url)) {
                    chrome.tabs.update(tab.id, {
                        selected: true
                    }, showTAInformation);
                    return;
                }
            }


            chrome.tabs.create({
                'url': viewTabUrl
            }, showTAInformation);
        });
    } else if (request.method === "viewJSONData") {
        nlpdata = request.data;


        viewTabUrl = chrome.extension.getURL('json.html');


        chrome.tabs.getAllInWindow(undefined, function(tabs) {
            for (var i = 0, tab; tab = tabs[i]; i++) {
                if (tab.url && isOpenUrl(viewTabUrl, tab.url)) {
                    chrome.tabs.update(tab.id, {
                        selected: true
                    }, showJSONData);
                    return;
                }
            }

            chrome.tabs.create({
                'url': viewTabUrl
            }, showJSONData);

        });




    }


});


function showJSONData(tab) {
    chrome.tabs.sendMessage(tab.id, {
        "action": "showJSON",
        information: nlpdata
    });
}


function showTAInformation(tab) {
    chrome.tabs.sendMessage(tab.id, {
        "action": "showTAInfo",
        information: nlpdata
    });
}
