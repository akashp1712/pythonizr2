$(function(){

	/************
	    CONFIG
	 ************/
	var config = {

		defaultModules:{
			regression: [
			        'data_loading',
			        'train_test_split',
			        'linear_reg'
                ],
			classification: [
			        'data_loading',
			        'train_test_split',
			        'naive_bayes'
                 ]
		},
		baseUrl:'https://pythonizr.com:80/builder?'
	};
	
	/************
	   VARIABLES
	 ************/

	var dataPreProcessing;
	$.getJSON( "resources/data/pre-processing.json", function(data) {
        dataPreProcessing = data;
    });

    var dataModels;
	$.getJSON( "resources/data/models.json", function(data) {
        dataModels = data;
    });

	var codeList = [];
	var pipelineData = {};

	/**********
	   EVENTS
	 **********/	

	$('input').click(function(){
		update();
	});
	
	$('#preconfig-regression').click(function(){
		fillDefaultModules('regression');
		$('#regression-models').show();
		$('#classification-models').hide();
	});

	$('#preconfig-classification').click(function(){
		fillDefaultModules('classification');
		$('#regression-models').hide();
		$('#classification-models').show();
	});

	/*********
	   LOGIC
	 *********/
	
	function fillDefaultModules(type){
		$('input').attr('checked', false);
				
		for (var i = 0, curModule; curModule = config.defaultModules[type][i++];){
			$('input[value=' + curModule +']').attr('checked', true);
		};
		update();
		$('#hidden-section').fadeIn('slow');
	}

	function update(){
		updateModules();
		updateCode();
		updatePipeline();
	}

	function updateModules(){
		codeList = [];
		pipelineData = {};

        pipelineData["pre-processing"] = [];
		$("#pre-processing").find("input:checked").each(function() {
		    var value = $(this).val();
		    if (value != "none") {
                codeList.push(dataPreProcessing[value]);
                pipelineData["pre-processing"].push(value);
            }
        });

        pipelineData["models"] = [];
        $("#models").find("input:checked").each(function() {
            var value = $(this).val();
            codeList.push(dataModels[value]);
            pipelineData["models"].push(value);
        });

        $("#post-processing").find("input:checked").each(function() {
            // TODO: do same as above
        });
	}

	function updateCode() {

        var codeFull = [];
		for (var i = 0, code; code = codeList[i++];){
		    if (i != 1) { codeFull = codeFull.concat(["",""]); }
		    codeFull = codeFull.concat(code);
		}

        displayData(codeFull);

        function displayData(codeLines) {
            // Display the data
            var codeElem = "";

            codeLines.forEach(function(value) {
                codeElem = codeElem + value + "<br>";
            });

            $("#code").html(codeElem);
            $('pre code').each(function(i, e) {hljs.highlightBlock(e);}); // highlight the code
        }
    }

    function updatePipeline() {

        var dataPipe = document.getElementById("data-pipe");
        dataPipe.innerHTML = '';

        var header = document.createElement('h3');
        header.innerHTML="Data";
        dataPipe.appendChild(header);

        pipelineData["pre-processing"].forEach(function(value) {
            var p = document.createElement('p');
            p.innerHTML = value;
            dataPipe.appendChild(p);
		});

    }

	/***********
	   HELPERS
	 ***********/
	
	if (!Array.indexOf){
		Array.prototype.indexOf = function(searchedElement){
			for (var i = 0; i < this.length; i++){
				if (this[i] === searchedElement)
					return i;
			};
			return -1;
		};
	}
	
	Array.prototype.remove = function(searchedElement){
		var i = this.indexOf(searchedElement);
		if (i != -1)
			this.splice(i, 1);
	};
	
	/***********
	    MAIN
	 ***********/

	if ($('input:checked').length > 0)
		$('#hidden-section').fadeIn(0);

	update();

});
