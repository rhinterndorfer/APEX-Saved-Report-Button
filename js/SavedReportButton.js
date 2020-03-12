// APEX Saved Report Button
// Author: Raphael Hinterndorfer
// Version: 0.2


jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

var savedReportButton = {

    observeIGSavedReports: function(target$, changeCallbackFunction){
            // Create an observer instance
            var observer = new MutationObserver(function( mutations ) {
                changeCallbackFunction();
            });
            
            // Configuration of the observer:
            var config = { 
                attributes: true, 
                childList: true, 
                subtree: true,
                characterData: true,
                attributeFilter: ["style"]
            };
            
            target$.each(
                function(i, target){
                    // Pass in the target node, as well as the observer options
                    observer.observe(target, config);
                }
            );
        },


    createButtonsIR: function() {
            // remove existing buttons
            $("button[srb-ir-option][srb-ir-option!='']").remove();
            
            // create a button for each select option (saved report)
            $("select.a-IRR-selectList:regex(id,.*_saved_reports) > optgroup > option").each(function(i, opt) 
            {
                // id of select
                var selectId = $(opt).closest('select[id]').attr('id');

                // check if its a private report
                var optgroupName = $(opt).parent().attr('label');
                
                // create button with reference to original select option
                var buttonText = opt.text.replace(/[0-9]+\.\s/gm,'');
                var addclasses = opt.selected ? " SavedReportButtonSelected" : "";

                $(".a-IRR-selectList[id="+selectId+"]").before('<button type="button" srb-ir-id="'+selectId
                    +'" srb-ir-option="'+opt.value
                    +'" style="" class="a-Button a-IRR-button a-IRR-button--actions js-menuButton SavedReportButton '+addclasses
                    +'"><div class="SavedReportButtonText">' + buttonText 
                    +'</div><div class="SavedReportButtonGroupText">(' + optgroupName + ')'
                    +'</div>'
                    + '</button>');
            });


            // click event
            $("button[srb-ir-option][srb-ir-option!='']").on('click', function(){
                    // disable button to prevent multi click
                    $(this).attr("disabled", "disabled");
                
                    // get select option
                    var option = $(this).attr("srb-ir-option");
                    var selectId = $(this).attr("srb-ir-id");

                    // set option value and trigger change
                    $('.a-IRR-selectList[id='+selectId+']').val(option).change();	
            });


            // hide saved reports select
            $('select.a-IRR-selectList:regex(id,.*_saved_reports)').hide();
        },

    createButtonsIG: function() {
            // remove existing buttons
            //$("button[srb-ig-option][srb-ig-option!='']").remove();
            $("div.SaveReportButtonIGContainer").remove();
            
            // create a button for each select option (saved report)
            $("select.a-Toolbar-selectList[data-action=change-report]").each(function(i, selectElement){
                if($(selectElement).attr('style') != 'display: none;') {

                    // id of select
                    var selectId = $(selectElement).closest('div[id]').attr('id');

                    $(selectElement).parent().after('<div class="a-Toolbar-group SaveReportButtonIGContainer" srb-ig-id="' + selectId +'"></div>');
                    $(selectElement).parent().addClass('SaveReportButtonIGSelectContainer');
                    
                    $(selectElement).find("optgroup > option").each(function(i, opt) {
                        // if not displayed use only first element
                        
                            // check if its a private report
                            var optgroupName = $(opt).parent().attr('label');
                            
                            // create button with reference to original select option
                            var buttonText = opt.text.replace(/[0-9]+\.\s/gm,'');
                            var addclasses = opt.selected ? addclasses + " SavedReportButtonSelected" : "";
                            $("div.SaveReportButtonIGContainer[srb-ig-id][srb-ig-id=" + selectId +"]").append('<button type="button" srb-ig-id="' + selectId
                                +'" srb-ig-option="'+opt.value
                                +'" style="" class="a-Button a-IRR-button a-IRR-button--actions js-menuButton SavedReportButton ' + addclasses
                                +'"><div class="SavedReportButtonText">' + buttonText 
                                +'</div><div class="SavedReportButtonGroupText">(' + optgroupName + ')'
                                +'</div>'
                                +'</button>');
                        
                    });
                    
                }
            });
            
            


            // click event
            $("button[srb-ig-option][srb-ig-option!='']").on('click', function(){
                    // get select option
                    var option = $(this).attr("srb-ig-option");
                    var selectId = $(this).attr("srb-ig-id");
                    
                    // unselect other buttons
                    $("button[srb-ig-option][srb-ig-option!=''][srb-ig-id][srb-ig-id="+selectId+"].SavedReportButtonSelected").removeClass("SavedReportButtonSelected");
                    
                    // set button selected
                    $(this).addClass("SavedReportButtonSelected");
                    
                    // set option value and trigger change
                    $('div[id='+selectId+'] * .a-Toolbar-selectList[data-action=change-report]').val(option).change();	
            });
        }
}


