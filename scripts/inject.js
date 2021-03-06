/* 
 * This javascript injects the nlp information extracted from Text Analyzer server into the current page
 */
// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var count = 1;
var injected = injected || (function(information) {

    // An object that will contain the "methods"
    // we can use from our event script.
    var methods = {};

    // This method will eventually return
    // background colors from the current page.
    methods.textAnalysis = function(information) {



            //alert(selectedText+"Modified");
            sendRequestToTextAnalyzerServer(information);



            return "";


        }
        /**
         * // POST the data to the NLP server using XMLHttpRequest
         * @returns {undefined}
         */

    function sendRequestToTextAnalyzerServer(information) {
        // The URL to POST our data to

	var postUrl = 'http://104.131.121.5:9000/TextAnalyzerWebService';
         // var postUrl = 'http://atcub2.asus.com/TextAnalyzerWebService';
        //var postUrl = 'https://192.168.1.203:9443/TextAnalyzerWebService';
        //var postUrl = 'http://192.168.1.203/TextAnalyzerWebService';
        // var postUrl = 'http://192.168.1.107:9000/TextAnalyzerWebService';



        var selectedElement = getSelectionBoundaryElement(false);
        var selectedText = information.selectionText;
        var language = "en";
        var module = "SentenceAnalysis";

        var uri = chrome.extension.getURL("images/ajax-loader.gif");
        //var ajaxLoading="<div id='ajaxloadingTA' style='display:none;'> <img src="+uri+" alt='Ajax Loader' /></div>";
        //$(selectedElement).append(ajaxLoading);	

        var request = $.ajax({
            url: postUrl,
            type: "get", //send it through get method
            dataType: "json",
            data: {
                text: selectedText,
                language: language,
                module: module
            },
            beforeSend: function() {
                // show gif here, eg:

                $(selectedElement).css('background', 'url(' + uri + ')  no-repeat');
            },
            complete: function() {
                // hide gif here, eg:
                $(selectedElement).css('background', 'none');
            }

        });

        request.done(function(response) {

            processTextAnalyzerResponse(response, selectedElement);

        });

        request.fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });



    }


    /**
     * This function will process the text analysis server response and render sentence information
     * @param {type} response
     * @param {type} selectedElement
     * @returns {undefined}
     */
    function processTextAnalyzerResponse(response, selectedElement) {

        var selectedText = $(selectedElement).text();


        var sentenceData = "";
        //var jsonResponse = JSON.parse(response);
        var html = "<div id='tooltipdiv' class='tooltipdiv'>";

        var wordTemplate = "";

        var paragraphs = response.paragraphs;


        for (var i = 0; i < paragraphs.length; i++) {
            var paragraph = paragraphs[i].value;
            var sentenceMap = paragraph.sentenceMap;
            for (var sentenceIndex = 0; sentenceIndex < sentenceMap.length; sentenceIndex++) {

                var sentenceObject = sentenceMap[sentenceIndex].value;
                var sentenceType = sentenceObject.type;
                var wordInformation = sentenceObject.wordInformation;
                var string = sentenceObject.sentence;
                var verbs = wordInformation.verbs;
                var nouns = wordInformation.nouns;
                var adverbs = wordInformation.adverbs;
                var adjectives = wordInformation.adjectives;


                var sentence_template = "<span style='color:green' <font size='6'><b> Sentence</b> :" + string + "</font></span><br> ";
                sentence_template += "<span style='color:DarkBlue' <font size='5'><b> Type </b>: " + sentenceType + "</font></span><br>";

                if ((typeof verbs != 'undefined') && verbs.length > 0) {
                    sentence_template += "<span style='color:Crimson'><b>Verbs:</b> </span><br>";
                    sentence_template += "<div style='margin-left: 2em;'>";

                    for (var i = 0; i < verbs.length; i++) {
                        var verb = verbs[i];

                        wordTemplate = createWordTemplate(verb);

                        //var word_html = Mustache.to_html(wordTemplate, verb);
                        sentence_template += wordTemplate;
                    }
                    sentence_template += "</div>";
                }

                if ((typeof nouns != 'undefined') && nouns.length > 0) {
                    sentence_template += "<span style='color:Crimson'><b>Nouns:</b> </span><br>";
                    sentence_template += "<div style='margin-left: 2em;'>";

                    for (var i = 0; i < nouns.length; i++) {
                        var noun = nouns[i];
                        wordTemplate = createWordTemplate(noun);
                        sentence_template += wordTemplate;
                    }
                    sentence_template += "</div>";
                }

                if ((typeof adjectives != 'undefined') && adjectives.length > 0) {
                    sentence_template += "<span style='color:Crimson'><b>Adjectives:</b> </span><br>";
                    sentence_template += "<div style='margin-left: 2em;'>";

                    for (var i = 0; i < adjectives.length; i++) {
                        var adjective = adjectives[i];
                        wordTemplate = createWordTemplate(adjective);
                        sentence_template += wordTemplate;
                    }
                    sentence_template += "</div>";
                }

                if ((typeof adverbs != 'undefined') && adverbs.length > 0) {
                    sentence_template += "<span style='color:Crimson'><b>Adverbs:</b> </span><br>";
                    sentence_template += "<div style='margin-left: 2em;'>";

                    for (var i = 0; i < adverbs.length; i++) {
                        var adverb = adverbs[i];
                        wordTemplate = createWordTemplate(adverb);
                        sentence_template += wordTemplate;
                    }
                    sentence_template += "</div>";
                }


                sentence_template += "<hr>";
                sentenceData += sentence_template;


            }
        }

        var localid = "close" + count;
	
	var tooltipId='tooltip'+localid;
	var tooltipIdCheck='#'+'tooltip'+localid;
        var moreInfoID = "#" + "moreInformation";
        var viewJSONID = "#" + "viewJSON";

        html += "<p>";
        html += "<span id='moreInformation' class='moreInformation'>More Information</span>";
        html += "&nbsp;&nbsp;&nbsp; <span id='viewJSON' class='viewJSON'>View JSON</span>";
        html += "&nbsp;&nbsp;&nbsp; <span class='closeTooltip' id='" + tooltipId + "'><b> x </b></span>";
        html += "</p>";
        html += "<hr  style='color:DarkBlue' >";
        html += sentenceData + "</div>";

        $(selectedElement).attr("id", localid);
        var id = '#' + localid;
	

        // console.log(html);
        //var jQueryObject = $.parseHTML(html);
        
        $(id).tooltipster({
            animation: 'grow',
            delay: 100,
            position: 'bottom',
            interactive: 'true',
            theme: 'tooltipster-shadow',
            touchDevices: false,
            //maxWidth: 900,
            //multiple:true,
            restoration: 'none',
            contentAsHTML: true,
            content: $(html)
            

        });



        $(document).bind('click', function(e) {
            var target = $(e.target);

            if (target.is(tooltipIdCheck)) {
                e.preventDefault(); // if you want to cancel the event flow
                $(id).tooltipster().tooltipster('destroy');
                // do something
            } else if (target.is(moreInfoID)) {
                e.preventDefault(); // if you want to cancel the event flow


                chrome.extension.sendMessage({
                    method: "seeMoreInformation",
                    data: response
                });
            } else if (target.is(viewJSONID)) {
                e.preventDefault(); // if you want to cancel the event flow


                chrome.extension.sendMessage({
                    method: "viewJSONData",
                    data: response
                });
            }

        });
        count++;

    }


    /**
     *
     * @param {type} word
     * @returns {String}
     */
    function createWordTemplate(word) {
        var fontsize = "'-1'";
        var wordTemplate = "<span style='color:DarkRed  ' <font size=" + fontsize + "> Word : </font></span>" + word.word + " &nbsp;&nbsp;";
        wordTemplate += "<span style='color:DarkBlue  ' <font size=" + fontsize + "> Lemma : </font></span>" + word.lemma + "&nbsp;&nbsp;";
        wordTemplate += "<span style='color:green  ' <font size=" + fontsize + "> POS : </font></span>" + word.pos + "&nbsp;&nbsp;"
        wordTemplate += "<span style='color:FireBrick  ' <font size=" + fontsize + "> Definition : </font></span>" + word.definition + " &nbsp;&nbsp;";
        wordTemplate += "<br>";

        return wordTemplate;
    }

    /**
     *This function gets the HTML DOM element of the selected text.
     */
    function getSelectionBoundaryElement(isStart) {
        var range, sel, container;
        if (document.selection) {
            range = document.selection.createRange();
           // range.collapse(isStart);
            return range.parentElement();
        } else {
            sel = window.getSelection();
            if (sel.getRangeAt) {
                if (sel.rangeCount > 0) {
                    range = sel.getRangeAt(0);
                }
            } else {
                // Old WebKit
                range = document.createRange();
                range.setStart(sel.anchorNode, sel.anchorOffset);
                range.setEnd(sel.focusNode, sel.focusOffset);

                // Handle the case when the selection was selected backwards (from the end to the start in the document)
                if (range.collapsed !== sel.isCollapsed) {
                    range.setStart(sel.focusNode, sel.focusOffset);
                    range.setEnd(sel.anchorNode, sel.anchorOffset);
                }
            }

            if (range) {
                container = range[isStart ? "startContainer" : "endContainer"];

                // Check if the container is a text node and return its parent if so
                return container.nodeType === 3 ? container.parentNode : container;
            }
        }
    }


    // This tells the script to listen for
    // messages from our extension.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var data = {};
        // If the method the extension has requested
        // exists, call it and assign its response
        // to data.
        if (methods.hasOwnProperty(request.method))
            data = methods[request.method](request.information);
        // Send the response back to our extension.
        sendResponse({
            data: data
        });
        return true;
    });

    return true;
})();
