// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function() {

	// An object that will contain the "methods"
	// we can use from our event script.
	var methods = {};

	// This method will eventually return
	// background colors from the current page.
	methods.getBgColors = function() {



		var currentPageUrl = "";
		if (typeof this.href === "undefined") {
			currentPageUrl = document.location.toString().toLowerCase();
		} else {
			currentPageUrl = this.href.toString().toLowerCase();
		}


		sendRequestNLP();



		return currentPageUrl;


	}




	// POST the data to the server using XMLHttpRequest
	function sendRequestNLP() {
		
		var postUrl = 'http://192.168.1.203:9000/SemanticRoleLabelingService';

		// Set up an asynchronous AJAX POST request
		var xhr = new XMLHttpRequest();


		var string = "Jack is a new boy."
		var params = 'text=' + string +
			'&option=' + 1;

		// Replace any instances of the URLEncoded space char with +
		params = params.replace(/%20/g, '+');


		postUrl = postUrl + "?" + params;

		//open the connection 
		xhr.open('GET', postUrl, true);
		// Set correct header for form data 
		xhr.setRequestHeader('Content-type', 'text/plain; charset=UTF-8');

		// Handle request state change events
		xhr.onreadystatechange = function() {
			// If the request completed
			if (xhr.readyState == 4) {
				
				if (xhr.status == 200) {
					var response = xhr.responseText;
					processNLPServerResponse(response);


					
				} else {
					
					alert('error : ' + xhr.statusText);
				}
			}
		};

		// Send the request and set status
		//xhr.send(params);
		xhr.send();
		//statusDisplay.innerHTML = 'Saving...';
	}

	function processNLPServerResponse(response) {

		var jsonResponse = JSON.parse(response);
		var text = jsonResponse.document;


	var div_wrapper="<div class='para'> </div>";
	var para_prepend_inside=" <a href='#' class='paragraph'> <paragraph> </a>";
	var para_append="<paragraph>";

		$('p').each(function(i) {

			$(this ).wrap( div_wrapper );
			$(this).prepend( para_prepend_inside );
			$(this).append(para_append);

			var iTotalWords = $(this).text().split(' ').length;

			$(this).append("<b> " + iTotalWords + " words </b>");

		});



		alert('success : ' + text);



	}

	// This tells the script to listen for
	// messages from our extension.
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		var data = {};
		// If the method the extension has requested
		// exists, call it and assign its response
		// to data.
		if (methods.hasOwnProperty(request.method)) data = methods[request.method]();
		// Send the response back to our extension.
		sendResponse({
			data: data
		});
		return true;
	});

	return true;
})();
