/* 
 * This javascript injects the nlp information extracted from Text Analyzer server into the current page
 */

// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function () {

    // An object that will contain the "methods"
    // we can use from our event script.
    var methods = {};

    // This method will eventually return
    // background colors from the current page.
    methods.textAnalysis = function () {




        sendRequestNLP();



        return "";


    }


    /**
     * // POST the data to the NLP server using XMLHttpRequest
     * @returns {undefined}
     */

    function sendRequestNLP() {
        // The URL to POST our data to
        var postUrl = 'http://192.168.1.203:8080/TextAnalyzerWebService';

        // Set up an asynchronous AJAX POST request
        var xhr = new XMLHttpRequest();


        var currentPageUrl = "";
        if (typeof this.href === "undefined") {
            currentPageUrl = document.location.toString().toLowerCase();
        } else {
            currentPageUrl = this.href.toString().toLowerCase();
        }

        //var string = "Jack is a new boy."
        var params = 'url=' + currentPageUrl +
                '&language=en'+'&module=CompletePipeLine'  ;

        // Replace any instances of the URLEncoded space char with +
        params = params.replace(/%20/g, '+');


        postUrl = postUrl + "?" + params;

        //open the connection 
        xhr.open('GET', postUrl, true);
        // Set correct header for form data 
        xhr.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');

        // Handle request state change events
        xhr.onreadystatechange = function () {
            // If the request completed
            if (xhr.readyState === 4) {
                // alert('success');
                // statusDisplay.innerHTML = '';
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    processNLPServerResponse(response);


                } else {

                    alert('error : ' + xhr.statusText);
                }
            }
        };

        // Send the request 

        xhr.send();

    }



    /**
     * This function creates the html template and tooltip to show the paragraph information
     * @param {type} paragraph
     * @param {type} id1
     * @param {type} id2
     * @returns {undefined}
     */
    function createTemplateForParagraphInformation(paragraph, id1, id2) {



        var paragraphNo = paragraph.paragraphNo;
        var paragraph_content = paragraph.content;
        var sentenceMap = paragraph.sentenceMap;
        paragraph_content = $.trim(paragraph_content);


        //let try the mustache template
        //   var paragraph_div="<div class='paragraph' style='display:none;' ";
        var paragraph_div = "<div class='paragraph'  ";
        // e.g. id='p1' >		
        var paragraph_id = "id='p" + paragraphNo + "'>";
        paragraph_div = paragraph_div + paragraph_id;
        var template = "<h3>Para : {{paragraphNo}} </h3> Content : {{content}}";
        var final_temp = paragraph_div + template + "</div>";
        var html = Mustache.to_html(final_temp, paragraph);



        //Set the tooltip
        $(id1).tooltipster({
            animation: 'fade',
            delay: 200,
            theme: 'tooltipster-shadow',
            touchDevices: false,
            trigger: 'hover',
            contentAsHTML: true,
            content: $(html),
            maxWidth: 500

        });


    }








    /**
     * /Function which create the discourse information for the current paragraph using the paragraph discourse map
     * @param {type} paragraph
     * @param {type} paragraphDiscourseMap
     * @param {type} currentWebParagraph
     * @returns {undefined}
     */
    function   createParagraphDiscourseInformation(paragraph, paragraphDiscourseMap, currentWebParagraph) {
        var discourse_div = "<div class='paradiscourse-tooltip'  ";
        var discourse_template = "<h4> Paragraph Discourse </h4> <p> Connector : {{connector}} </p> <p>Value : {{value}} </p>";
        var para_discourse_connector = "<div class='discourseconnector'>  <p> -----> </p></div>";
        var para_discourse_connector_attached = false;
        var paragraphNo = paragraph.paragraphNo;

        for (var discourseIndex = 0; discourseIndex < paragraphDiscourseMap.length; discourseIndex++)
        {
            var discourseRow = paragraphDiscourseMap[discourseIndex];
            var id1 = discourseRow.id1;
            var id2 = discourseRow.value.id2;
            if (id1 === paragraphNo) {

                var connectorObject = discourseRow.value.connector;
                var connector = connectorObject.connector;
                //var value = connectorObject.value;

                //we have consecutive discourse connector;
                if ((id1 + 1) === id2) {


                    //let try the mustache template


                    // e.g. id='p1' >	

                    //pdc= paragraph discourse connector	
                    var discourse_tooltip_id = "id='pdc" + paragraphNo + "'>";
                    discourse_div = discourse_div + discourse_tooltip_id;

                    var final_temp = discourse_div + discourse_template + "</div>";
                    var html = Mustache.to_html(final_temp, connectorObject);


                    var output = connector.split(/[_]+/).pop();
                    para_discourse_connector = "<div class='discourseconnector' " + " id='pd" + paragraphNo + "'>" + " <p> <-----connector:" + output + "----> </p></div>";


                    para_discourse_connector_attached = true;
                    $(currentWebParagraph).after(para_discourse_connector);
                    //Set the tooltip for discourse connector

                    var discourse_div_id = "#pd" + paragraphNo;
                    $(discourse_div_id).tooltipster({
                        animation: 'fade',
                        delay: 200,
                        theme: 'tooltipster-shadow',
                        touchDevices: false,
                        trigger: 'hover',
                        contentAsHTML: true,
                        content: $(html),
                        maxWidth: 500

                    });


                    console.log("Discourse connector attached to div id: " + discourse_div_id + " with tooltip id: " + discourse_tooltip_id);
                }

            }





        }

        if (!para_discourse_connector_attached) {

            $(currentWebParagraph).after(para_discourse_connector);
        }

    }
    
    
    
    /**
     * 
     * Removes all special characters, white spaces from string. This is useful for 
     * string match as different string segmentation rules can produce slightly
     * different strings.
     * 
     * @param {type} sentence
     * @returns {unresolved}
     */
    function escapeString(sentence){
      
        
         var lower = sentence.toLowerCase();
    var upper = sentence.toUpperCase();

    var res = "";
    for(var i=0; i<lower.length; ++i) {
        if(lower[i] != upper[i] || lower[i].trim() === '')
            res += sentence[i];
    }
        
        res = res.replace(/\s+/g, '');
     
        return res;
        
    }

    /**
     * 
     * Create Information for sentences in a paragraph
     * 
     * @param {type} paragraph
     * @param {type} currentWebParagraph
     * @returns {undefined}
     */
    function createInformationForParagraphSentences(paragraph, currentWebParagraph) {

        var paragraphNo = paragraph.paragraphNo;
       
        var sentenceMap = paragraph.sentenceMap;

        var cptext = $(currentWebParagraph).text();
        var sentence_prepend="";
        var sentence_append = "";

        var currentSentenceIndex = 0;

        var web_para_sentences = cptext.match(/[^\.!\?]+[\.!\?]+/g);

         var content = "";


        for (var sentenceIndex = 0; sentenceIndex < sentenceMap.length; sentenceIndex++)
        {
             var sentenceFound=false;
            var sentenceObject = sentenceMap[sentenceIndex].value;
            var sentence = sentenceObject.content;
            var sentenceNumber=sentenceObject.sentenceNumber;
            sentence=escapeString(sentence);

            if (web_para_sentences === null) {
                  console.log("Extracted sentence: " + sentence);
                  console.log("web para sentence: " + cptext);
                if (sentence === cptext) {
                   
                 sentence_prepend = "<span class='sentencespan'" + "id= 'ssb" + sentenceNumber + "'> <b>&lt;sentence&gt; </b> </span> ";
                 sentence_append = "<span class='sentencespan'" + "id= 'spe" + sentenceNumber + "'>  <b>&lt;/sentence&gt; </b></span>";     
                    
                 content=content+sentence_prepend +cptext + sentence_append;
               
                }
                
                else{
                    
                     content=content+cptext ;
                }
            }

            else {
                
                for (var websentenceIndex = currentSentenceIndex; websentenceIndex < web_para_sentences.length; websentenceIndex++)
                {
                    
                    var webSentence = web_para_sentences[websentenceIndex];
                    //var cptext = $.trim($(cp).text())
                     webSentence=escapeString(sentence);
                    
                    
                     if (sentence === webSentence) {
                    
                      sentence_prepend = "<span class='sentence'" + "id= 'ssb" + sentenceNumber + "'> <b>&lt;sentence&gt; </b> </span> ";
                      sentence_append = "<span class='sentence'" + "id= 'spe" + sentenceNumber + "'>  <b>&lt;/sentence&gt; </b></span>";     
                
                    content=content+sentence_prepend +webSentence + sentence_append;
                    currentSentenceIndex=websentenceIndex;
                    sentenceFound=true;

                }
                
                
                else{
                     content=content+webSentence ;
                    
                    }

                 if(sentenceFound)break;
                }
            }
            
        }
       $(currentWebParagraph).html(content); 
        
        createTemplateForParagraphSentences(paragraph);
        // console.log("Current Sentence html: " + $(currentWebParagraph).html());

    }
    
    /**
     * 
     * @param {type} paragraph
     * @returns {undefined}
     */
     function createTemplateForParagraphSentences(paragraph){
        var template = "<h3>Sentence : {{sentenceNumber}} </h3> <h4> Type: {{type}} </h4> <p>Content : {{content}} </p> ";

         
         var sentenceMap = paragraph.sentenceMap;
          
          for (var sentenceIndex = 0; sentenceIndex < sentenceMap.length; sentenceIndex++)
        {
             var sentenceObject = sentenceMap[sentenceIndex].value;
    
            var sentenceNumber=sentenceObject.sentenceNumber;
             

            var id1 = "#ssb" + sentenceNumber;
            var id2 = "#sse" + sentenceNumber;
            
             //let try the mustache template
        //   var paragraph_div="<div class='paragraph' style='display:none;' ";
        var sentence_div = "<div class='sentence'  ";
        // e.g. id='p1' >		
        var sentence_id = "id='s" + sentenceNumber + "'>";
        sentence_div = sentence_div + sentence_id;
       
        var final_temp = sentence_div + template + "</div>";
        var html = Mustache.to_html(final_temp, sentenceObject);



        //Set the tooltip
        $(id1).tooltipster({
            animation: 'fade',
            delay: 200,
            theme: 'tooltipster-shadow',
            touchDevices: false,
            trigger: 'hover',
            contentAsHTML: true,
            content: $(html),
            maxWidth: 500

        });
            
            
        }
          
          
     }
    
    
    
    
    /**
     * Main function which which processes the NLP Information received from the server. 
     * 
     * @param {type} response
     * @returns {undefined}
     */
    function processNLPServerResponse(response) {

        var jsonResponse = JSON.parse(response);
        var text = jsonResponse.document;


        console.log(response);
	alert(response);




        var sentence_prepend = "<a href='#' class='sentence'> &lt;sentence&gt; </a> ";
        var sentence_append = "<a href='#' class='sentence'>  &lt;/sentence&gt; </a>";



        var sentence_discourse_connector = "<span class='discourseconnector'> ---> </span>";




        var paragraphs = jsonResponse.paragraphs;
        var paragraphDiscourseMap = jsonResponse.paragraphdiscourseMap;
        var currentwebParaIndex = 0;

//filter the paragraphs which are too small in text length
        var webParagraphs = $("p").filter(function () {

            var text =$.trim($(this).text());

            return (text.length > 5);
        });


// Iterate over the extracted paragraphs. Find the right paragraph on the webpage based on string match. 
        for (var i = 0; i < paragraphs.length; i++)
        {
            var paragraph = paragraphs[i].value;
            var paragraphNo = paragraph.paragraphNo;
            var paragraph_content = paragraph.content;
            paragraph_content = escapeString(paragraph_content);

            //console.log(paragraph_content);
            //get the filtered list of paragraphs from the webpage

            for (var webparaIndex = currentwebParaIndex; webparaIndex < webParagraphs.length; webparaIndex++)
            {

                var cp = webParagraphs[webparaIndex];
                var cptext = escapeString($(cp).text());

                //content is matched to check if we are at the right paragraph. 
                if (paragraph_content === cptext) {
                    currentwebParaIndex = webparaIndex;


                    createInformationForParagraphSentences(paragraph, cp);

                    //Sentence Matching 

//                 
//                  for (var i = 0; i < sentenceMap.length; i++)
//        {
//             var sentence = sentenceMap[i].value;
//        }
                    //$('body').append(html);


                    //spb=span paragraph begin , sbe= span paragraph end
                    var para_prepend1 = "<span class='paragraphspan'" + "id= 'spb" +paragraphNo + "'> <b>&lt;para&gt; </b> </span> ";
                    var para_append1 = "<span class='paragraphspan'" + "id= 'spe" + paragraphNo + "'>  <b>&lt;/para&gt; </b></span>";


                    //$(cp).wrap(div_wrapper);
                    $(cp).prepend(para_prepend1);
                    $(cp).append(para_append1);



                    //Function which adds the discourse information to the paragraph
                    createParagraphDiscourseInformation(paragraph, paragraphDiscourseMap, cp);





                    var id1 = "#spb" + paragraphNo;
                    var id2 = "#spe" + paragraphNo;

                    //This function creates the paragraph information template and sets the tooltip for the paragraph
                    createTemplateForParagraphInformation(paragraph, id1, id2);


                    //console.log("HTML of the page: "+ html);

                    console.log("Match found for paragraph : " + paragraphNo + "#Content:" + paragraph_content);
                    break;
                }


                else {

                    //console.log("Match not found for article paragraph: "+ cptext);

                    // console.log("corresponding extracted paragraph: " + paragraph_content );

                }



            }


        }

        //perform paragraph level manipulation. loop through each paragraph
        $('p').each(function (i) {

            var psize = $(this).text().split(' ').length;
            if (psize > 3)
            {
                var paragraphContent = $(this).text();
                //split the paragraph into sentences
                var content = "";

                var sentences = $(this).text().split('.');
                $.each(sentences, function (index, sentence) {
                    if (index < sentences.length - 1) {

                        var newSentence = sentence_prepend + sentence + sentence_append;
                        //$(this).append(sentence_prepend);
                        //$(this).prepend(sentence_append);
                        content = content + newSentence;
                        if (index < sentences.length - 2)
                            content = content + sentence_discourse_connector;
                    }

                    //$(this).text().replace(sentence,newSentence);
                    //console.log(newSentence);

                });

                //  $(this).html(content);
                //  $(this).wrap(div_wrapper);
                // $(this).prepend(para_prepend_inside);
                //  $(this).append(para_append);
                //  $(this).after(para_discourse_connector);
            }



        });

    }

    // This tells the script to listen for
    // messages from our extension.
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var data = {};
        // If the method the extension has requested
        // exists, call it and assign its response
        // to data.
        if (methods.hasOwnProperty(request.method))
            data = methods[request.method]();
        // Send the response back to our extension.
        sendResponse({
            data: data
        });
        return true;
    });

    return true;
})();

