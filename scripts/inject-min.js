var count=1;var injected=injected||function(e){function n(e){var t="http://192.168.1.203/TextAnalyzerWebService";var n=s(true);var i=e.selectionText;var o="en";var u="SentenceAnalysis";var a=chrome.extension.getURL("images/ajax-loader.gif");var f=$.ajax({url:t,type:"get",dataType:"json",data:{text:i,language:o,module:u},beforeSend:function(){$(n).css("background","url("+a+")  no-repeat")},complete:function(){$(n).css("background","none")}});f.done(function(e){r(e,n)});f.fail(function(e,t){alert("Request failed: "+t)})}function r(e,t){var n=$(t).text();var r="";var s="<div id='tooltipdiv' style='resize:both; overflow-x: scroll;overflow-y: auto; height:200px; width:350px align:left'>";var o="";var u=e.sentenceMap;for(var a=0;a<u.length;a++){var f=u[a].value;var l=f.type;var c=f.wordInformation;var h=f.string;var p=c.verbs;var d=c.nouns;var v=c.adverbs;var m=c.adjectives;var g="<span style='color:green' <font size='5'><b> Sentence</b> :"+""+"</font></span><br> ";g+="<span style='color:DarkBlue' <font size='5'><b> Type </b>: "+l+"</font></span><br>";if(typeof p!="undefined"&&p.length>0){g+="<span style='color:Crimson'><b>Verbs:</b> </span><br>";g+="<div style='margin-left: 2em;'>";for(var y=0;y<p.length;y++){var b=p[y];o=i(b);g+=o}g+="</div>"}if(typeof d!="undefined"&&d.length>0){g+="<span style='color:Crimson'><b>Nouns:</b> </span><br>";g+="<div style='margin-left: 2em;'>";for(var y=0;y<d.length;y++){var w=d[y];o=i(w);g+=o}g+="</div>"}if(typeof m!="undefined"&&m.length>0){g+="<span style='color:Crimson'><b>Adjectives:</b> </span><br>";g+="<div style='margin-left: 2em;'>";for(var y=0;y<m.length;y++){var E=m[y];o=i(E);g+=o}g+="</div>"}if(typeof v!="undefined"&&v.length>0){g+="<span style='color:Crimson'><b>Adverbs:</b> </span><br>";g+="<div style='margin-left: 2em;'>";for(var y=0;y<v.length;y++){var S=v[y];o=i(S);g+=o}g+="</div>"}g+="<hr>";r+=g}var x="close"+count;s+="<span class='close' id='"+x+"'><b>x</b></span>";s+=r+"</div>";$(t).attr("id",x);var T="#"+x;$(T).tooltipster({animation:"grow",delay:50,autoClose:true,position:"bottom",interactive:"true",theme:"tooltipster-shadow",touchDevices:false,maxWidth:900,restoration:"none",contentAsHTML:true,content:$(s),hideOnClick:true});$(document).bind("click",function(e){var t=$(e.target);if(t.is(T)){e.preventDefault();$(T).tooltipster().tooltipster("destroy")}});count++}function i(e){var t="'-1'";var n="<span style='color:DarkRed  ' <font size="+t+"> Word : </font></span>"+e.word+" &nbsp;&nbsp;";n+="<span style='color:DarkBlue  ' <font size="+t+"> Lemma : </font></span>"+e.lemma+"&nbsp;&nbsp;";n+="<span style='color:green  ' <font size="+t+"> POS : </font></span>"+e.pos+"&nbsp;&nbsp;";n+="<span style='color:FireBrick  ' <font size="+t+"> Definition : </font></span>"+e.definition+" &nbsp;&nbsp;";n+="<br>";return n}function s(e){var t,n,r;if(document.selection){t=document.selection.createRange();t.collapse(e);return t.parentElement()}else{n=window.getSelection();if(n.getRangeAt){if(n.rangeCount>0){t=n.getRangeAt(0)}}else{t=document.createRange();t.setStart(n.anchorNode,n.anchorOffset);t.setEnd(n.focusNode,n.focusOffset);if(t.collapsed!==n.isCollapsed){t.setStart(n.focusNode,n.focusOffset);t.setEnd(n.anchorNode,n.anchorOffset)}}if(t){r=t[e?"startContainer":"endContainer"];return r.nodeType===3?r.parentNode:r}}}var t={};t.textAnalysis=function(e){n(e);return""};chrome.runtime.onMessage.addListener(function(e,n,r){var i={};if(t.hasOwnProperty(e.method))i=t[e.method](e.information);r({data:i});return true});return true}()