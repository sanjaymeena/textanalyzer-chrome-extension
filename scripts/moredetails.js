chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        var data = "";
        if (request.action == "showTAInfo") {

            data = request.information;

            processTextAnalyzerResponse(data, "dummy");
        } else if (request.action == "showJSON") {

            data = request.information;

            showJSON(data);
        }


    });


function showJSON(data) {

    var html = "";
    var str = JSON.stringify(data, undefined, 4);
    // document.body.appendChild(document.createElement('pre')).innerHTML = inp;
    output(syntaxHighlight(str));
}

function output(inp) {

    var html = "<pre>";
    html += inp;
    html += "</pre>";

    $('#jsonresult').html(html);
    // document.body.appendChild(document.createElement('pre')).innerHTML = inp;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


/**
 * This function will process the text analysis server response and render sentence information
 * @param {type} response
 * @param {type} selectedElement
 * @returns {undefined}
 */
function processTextAnalyzerResponse(response, selectedElement) {

    //var selectedText = $(selectedElement).text();


    var sentenceData = "";
    //var jsonResponse = JSON.parse(response);
    var html = "";

    var wordTemplate = "";

    var documentContent = response.content;

    html += "<h3 style='color:DarkBlue '>Language: English</h3>";
    html += "<h3 style='color:DarkBlue'>Document Content:  </h3>";
    html += "<p>" + documentContent + "</p>";
    html += "<hr>";
    var paragraphs = response.paragraphs;

    html += "<h3 style='color:FireBrick '> Paragraph Information </h3>";

    for (var i = 0; i < paragraphs.length; i++) {



        var paragraph = paragraphs[i].value;
        var sentenceMap = paragraph.sentenceMap;

        var paraNo = paragraph.paragraphNo;
        var paraContent = paragraph.content;


        html += "<h4 style='color:IndianRed  '>Paragraph No:" + paraNo + "</h4>";
        html += "<h4 style='color:IndianRed  '>Content:</h4>";
        html += "<p>" + paraContent + "</p>";
        html += "<hr>";
        html += "<h3 style='color:DarkGreen'>Information on Individual Sentences in Paragraph </h3>";

        for (var sentenceIndex = 0; sentenceIndex < sentenceMap.length; sentenceIndex++) {

            var sentenceObject = sentenceMap[sentenceIndex].value;
            var sentenceType = sentenceObject.type;
            var wordInformation = sentenceObject.wordInformation;
            var string = sentenceObject.sentence;
            var verbs = wordInformation.verbs;
            var nouns = wordInformation.nouns;
            var adverbs = wordInformation.adverbs;
            var adjectives = wordInformation.adjectives;


            var sentence_template = "<div class='sentence'><p>";
            sentence_template = "<span style='color:green'> <b> Sentence</b> :" + string + "</span><br> ";
            sentence_template += "<span style='color:DarkBlue'><b> Type </b>: " + sentenceType + "</span><br>";

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

            sentence_template += "<div>";
            sentence_template += "<hr>";
            sentenceData += sentence_template;


        }
    }

    html += sentenceData;

    //console.log(element);

    $('.textnode').html(html);


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
