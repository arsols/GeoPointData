/** Bulk Skip Tracing  */

const BST_FORM_ID = '80';
const BST_FIELD_ID_ROW_COUNT = '6';
const BST_FIELD_ID_TOTAL_COST = '9';
const BST_FIELD_ID_FILE_ID = '0';
const BST_FIELD_ID_ORIGINAL_FILE_NAME = '1';
const BST_FIELD_ID_ORIGINAL_FILE_PATH = '2';
const BST_FIELD_ID_EXPORTED_FILE_PATH = '3';
const BST_FIELD_ID_MAPPING = '4';

const BST_FIELD_ID_BTN_VALIDATE = '3';
const BST_FIELD_ID_BTN_REVIEW = '17';
const BST_FIELD_ID_BTN_SUBMIT = '20';

const MAPPING_DROPDOWNS_IDS = ['FULL_ADDRESS', 'STREET', 'CITY', 'STATE', 'ZIP', 'UNIT', 'FULL_NAME', 'FIRST_NAME', 'LAST_NAME'];

const STRIPE_MIN_AMOUNT = 0.50;

// File validation logic
$(document).ready(function () {
    // showForms();
    initSteps();
    initTippyJs();
    initSelect2();
    prependLoadingOverlay();
    bindDropDownsChangeListener();
    bindSkipTraceValiadtionLogic();
});

function showForms() {
    $('.ipt_uif_init_loader').hide();
    $('.ipt_uif_hidden_init').css("opacity", "1").css("visibility", "visible").show();
}

function initSteps() {
    $("#fsqm_form" + BST_FORM_ID + "_tab_pos").bind("change", function() { 
        $(".upload-img").removeClass("active active2");
        $(".select-address").removeClass("active active2");
        $(".select-name").removeClass("active active2");
        $(".submit-pay").removeClass("active active2");
        
        if ($(this).val() == "0") {
            $(".upload-img").addClass("active");
        } else if ($(this).val() == "1") {
            $(".upload-img").addClass("active2");
            $(".select-address").addClass("active");
        } else if ($(this).val() == "2") {
            $(".upload-img, .select-address").addClass("active2");
            $(".select-name").addClass("active");
        } else if ($(this).val() == "3") {
            $(".upload-img, .select-address, .select-name, .submit-pay").addClass("active2");
        }
    });
}

function initTippyJs() {
    tippy.setDefaultProps({
		theme: 'gpd',
		allowHTML: true,
		placement: 'right-start'
	});

	tippy(jQuery('#premium-data-icon').get(), {
		content: '<p class="tooltip-heading">Premium Skip Trace includes:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td"><ul class="tooltip-ul"><li>Property Type</li><li>Market Value</li><li>Purchase Price</li><li>Purchase Date</li><li>Length of Ownership</li><li>First Mortgage</li><li>Loan to Value</li><li>Year Built</li><li>Living Square Feet</li><li>Lot Square Feet</li><li>Bedrooms</li></ul></td><td class="tooltip-td"><ul class="tooltip-ul"><li>Bathrooms</li><li>Stories</li><li>Parking Types</li><li>Parking Spaces</li><li>Pool (Y/N)</li><li>Vacancy (Y/N)</li><li>Absentee (Y/N)</li><li>Corporate Owned (Y/N)</li><li>Title Owners Name 1</li><li>Title Owners Name 2</li><li>Owner Age</li></ul></td><td class="tooltip-td"><ul class="tooltip-ul"><li>Kids Age Groups</li><li>Household Income</li><li>Household Net Worth</li><li>Owner Education</li><li>Credit Rating</li><li>Marital Status</li><li>Ethnic Group</li><li>Senior Adult in HH (Y/N)</li><li>Single Parent (Y/N)</li><li>Veteran in HH (Y/N)</li><li>List Stack</li></ul></td></tr></tbody></table>',
		trigger: 'click',
        maxWidth: 650
	});
}

function initSelect2() {
    MAPPING_DROPDOWNS_IDS.forEach(function(dropDownId) {
        $('#' + dropDownId).select2({allowClear: true, placeholder: {id: '-1', text: 'Select a column head'}});
    });
}

function prependLoadingOverlay() {
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_tab_0').parent().prepend('<div id="form-loading-overlay-1" class="bst-loading-overlay"><div class="bst-loading-overlay-img"><img src="/wp-content/uploads/2020/06/overlay-loader.gif"/><br/><span>Validating file...</span></div></div>');
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_tab_3').prepend('<div id="form-loading-overlay-2" class="bst-loading-overlay"><div class="bst-loading-overlay-img"><img src="/wp-content/uploads/2020/06/overlay-loader.gif"/><br/><span>Validating file...</span></div></div>');
}

function toggleLoadingOverlay(visible) {
    if (visible) {
        $('.bst-loading-overlay').show();
    } else {
        $('.bst-loading-overlay').hide();
    }
}

function switchToTab2() {
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_design_' + BST_FIELD_ID_BTN_VALIDATE + ' a[href$="#eform-next"]').trigger('click');
}

function updateHiddenFields(data, fileName) {
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_FILE_ID + '_value').val(data.fileId);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_ORIGINAL_FILE_NAME + '_value').val(fileName);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_ORIGINAL_FILE_PATH + '_value').val(data.originalFilePath);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_EXPORTED_FILE_PATH + '_value').val(data.exportedFilePath);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_MAPPING + '_value').val($('#headers-map').val());
}

function clearHiddenFields() {
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_FILE_ID + '_value').val(null);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_ORIGINAL_FILE_NAME + '_value').val(null);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_ORIGINAL_FILE_PATH + '_value').val(null);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_EXPORTED_FILE_PATH + '_value').val(null);
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_pinfo_' + BST_FIELD_ID_MAPPING + '_value').val(null);
}

function updateRowsCount(count) {
    var rowsCountInputId = $('label:contains("Number of Records")').attr('for');
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_freetype_' + BST_FIELD_ID_ROW_COUNT + '_value').val(count).trigger('change');
}

function updateHeadersMap() {
    var mappingDropDowns = $('#address-mapping,#name-mapping').find('select');
    if (mappingDropDowns.length > 0) {
        var headersMap = {};
        for (var i=0; i < mappingDropDowns.length; i++) {
            var headerName = mappingDropDowns[i].id;
            var headerIndex = $(mappingDropDowns[i]).find(":selected").val();
            if(headerIndex != null && Number(headerIndex) != -1) {
                headersMap[headerName] = Number(headerIndex);
            }
        }
        if (!$.isEmptyObject(headersMap)) {
            $('#headers-map').val(JSON.stringify(headersMap));
            return;
        }
    } 
    
    $('#headers-map').val('');
}

function updatePreviewData(data) {
    if (!data) {
        return;
    }
    var list = $('#bst-address-data-preview,#bst-name-data-preview');
    list.empty();
    for (var i=0; i < data.length; i++) {
        list.append($('<li>').append($('<span>', {text: data[i].header})).append($('<span>', {text: data[i].value})));
    }
    $('#preview-data').val(JSON.stringify(data));
}

function updateAvailableHeaders(data) {
    $('#available-headers').val(JSON.stringify(data));
}

function updateSubmitBtnStatus(enabled, msg) {
    var btn = $('#ipt_fsqm_form_' + BST_FORM_ID + '_design_' + BST_FIELD_ID_BTN_SUBMIT + ' a[href="#bst-submit"]');
    if (enabled) {
        btn.css('cursor', 'pointer').attr('title', '');
        btn.attr('disabled', false);
    } else {
        btn.css('cursor','not-allowed').attr('title', msg);
        btn.attr('disabled', true);
    }
}

function updateMappingDropDowns(response) {
    if (response && response.headersValidation && response.headersValidation.mapping) {
        var headers = response.headersValidation.headers;
        var mapping = response.headersValidation.mapping;
        for (var i=0; i < mapping.length; i++) {
            var select = $('#' + mapping[i].key);
            select.empty();
            select.append($('<option>', {value: -1, text: '', selected: (mapping[i].index == '-1')}));
            for (var j=0; j < headers.length; j++) {
                select.append($('<option>', {value: j, text: headers[j], selected: (mapping[i].index == j)}));
            }
        }
        removeSelectedDropDownsOptions();
    } else {
        MAPPING_DROPDOWNS_IDS.forEach(function(dropDownId) {
            $('#' + dropDownId).empty();
        });
    }
}

function updateDropDownsDataPreviewChangeListener() {
    if ($('#preview-data').val()) {
        var data = JSON.parse($('#preview-data').val());
        MAPPING_DROPDOWNS_IDS.forEach(function(dropDownId) {
            var dropDown = $('#' + dropDownId);
            var dropDownPreview = $('#' + dropDownId + '-preview');        
            
            updateMappingDropDownPreview(dropDown, dropDownPreview, data);
            dropDown.off('change.preview');
            dropDown.on('change.preview', function () {
                updateMappingDropDownPreview(dropDown, dropDownPreview, data);
            });
        });
    }
}

function updateMappingDropDownPreview(dropDown, dropDownPreview, data) {    
    if (dropDown.val() == null || dropDown.val() == '-1') {
        dropDownPreview.parent().css('visibility', 'hidden');
        dropDownPreview.text('');
    } else {
        dropDownPreview.parent().css('visibility', 'visible');
        dropDownPreview.text(data[dropDown.val()].value);
    }
}

function bindDropDownsChangeListener() {
    MAPPING_DROPDOWNS_IDS.forEach(function(dropDownId) {
        var dropDown = $('#' + dropDownId);
        dropDown.on('change.headers', function () {
            removeSelectedDropDownsOptions();
            readdUnselectedOptions();
        });
    });
}

function bindSkipTraceValiadtionLogic() {
    $('#ipt_fsqm_form_' + BST_FORM_ID + '_design_' + BST_FIELD_ID_BTN_VALIDATE + ' a[href="#bst-validate"],#ipt_fsqm_form_' + BST_FORM_ID + '_design_' + BST_FIELD_ID_BTN_REVIEW + ' a').on('click', function () {
        updateRowsCount(0);
        updateHeadersMap();
        clearHiddenFields();
        resetValidationMsgs();
        resetValidationSuccessMsg();
        updateSubmitBtnStatus(false, 'Please update columns mapping & re-validate the file in order to proceed');

        var fileLnk = $('tbody.files').find('.template-download').find('p.name').find('a');
        if (!fileLnk.length) {
            showValidationMsgs([{'type': 'error', 'text': 'Please upload your file in order to proceed.'}]);
            return;
        }
  
        var fileName = fileLnk.attr('title');
        var fileUrl = fileLnk.attr('href');
        fileUrl = fileUrl.replace(fileLnk.prop('hostname'), document.location.hostname).replace('http:', 'https:');
  
        toggleLoadingOverlay(true);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', fileUrl, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {
                var formData = new FormData();
                formData.append('file', this.response, fileName);
                formData.append('headers', $('#headers-map').val());
                $.ajax({
                    type: 'POST',
                    url: config.BST_ROOT_URL + '/data-append/validate/' + unique_id(),
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        toggleLoadingOverlay(false);
                        if (data.status.key == 'SUCCESS') {
                            updateMappingDropDowns(data);
                            updatePreviewData(data.headersValidation.previewData);
                            updateAvailableHeaders(data.headersValidation.headers);
                            updateHeadersMap();
                            updateRowsCount(data.total);
                            updateHiddenFields(data, fileName);
                            updateSubmitBtnStatus(true, null);                            
                            showValidationMsgs(data.headersValidation.messages);
                            showLlcCountMessage(data.business, data.businessLimit);
                            showValidationSuccessMsg();
                            validateTotalValMin();
                            switchToTab2();       
                        } else if (data.status.key == 'INVALID_FILE_HEADERS') {
                            updateMappingDropDowns(data);
                            updatePreviewData(data.headersValidation.previewData);
                            updateAvailableHeaders(data.headersValidation.headers);
                            updateSubmitBtnStatus(false, 'Please update columns mapping & re-validate the file in order to proceed');
                            showValidationMsgs(data.headersValidation.messages);
                            switchToTab2();
                        } else {
                            updateSubmitBtnStatus(false, 'Your file is invalid. Please update it in order to proceed.');
                            showValidationMsgs([{'type': 'error', 'text': data.status.message}]);
                        }
                        updateDropDownsDataPreviewChangeListener();
                    },
                    error: function(xhr, err) {
                        toggleLoadingOverlay(false);
                        updateSubmitBtnStatus(false, "An error occurred while validating file. Please try again or contact support directly at support@geopointdata.com");
                        showValidationMsgs([{'type': 'error', 'text': 'An error occurred while validating file. Please try again or contact support directly at <a href="mailto:support@geopointdata.com">support@geopointdata.com</a>'}]);
                    }
                });
            } else {
                toggleLoadingOverlay(false);
            }
        };
        xhr.send();
    });

    $('#ipt_fsqm_form_' + BST_FORM_ID + '_design_' + BST_FIELD_ID_BTN_SUBMIT + ' a[href="#bst-submit"]').on('click', function () {
        if ($(this).attr('disabled') != 'disabled') {
            resetValidationMsgs();
            resetValidationSuccessMsg();
            $('#ipt_fsqm_form_' + BST_FORM_ID + '_design_' + BST_FIELD_ID_BTN_SUBMIT + ' a[href$="#eform-submit"]').trigger('click');
        }
    });

    $('body').on('mouseup', 'button.delete', function(event) {
        updateRowsCount(0);
        updateMappingDropDowns(null);
        updateHeadersMap();
        clearHiddenFields();
        resetValidationMsgs();
        resetValidationSuccessMsg();
        updateSubmitBtnStatus(false, 'Please update a file in order to proceed');
    });

    $('body').on('change', '.eform-bst-select-container > select', function () { 
        updateSubmitBtnStatus(false, 'Columns mapping was updated. Please re-validate the file in order to proceed');
    });

    $('body').on('select2:open', '.eform-bst-select-container > select', function () { 
        $('.select2-results__options').unmousewheel();
    });
}

function removeSelectedDropDownsOptions() {
    MAPPING_DROPDOWNS_IDS.forEach(function(dropDownId) {
        var optionValue = $('#' + dropDownId).val();
        if (optionValue == "-1") {
            return;
        }
        $(".eform-bst-select-container select option[value='" + optionValue + "']").not("#" + dropDownId + " option[value='" + optionValue + "']").remove();
    });
}

function readdUnselectedOptions() {
    var allHeaders = JSON.parse($('#available-headers').val());
    var selectedHeadersIndexes = $('.eform-bst-select-container select').map(function(i,v) {return $(this).val();}).toArray();

    MAPPING_DROPDOWNS_IDS.forEach(function(dropDownId) {
        var dropDown = $("#" + dropDownId);
        for (var i = 0; i < allHeaders.length; i++) {
            if (selectedHeadersIndexes.includes('' + i)) {
                continue;
            }
            if (dropDown.find("option[value='" + i + "']").length > 0) {
                continue;
            }
            insertDropDownOptionInOrder(dropDownId, $('<option>', {value: i, text: allHeaders[i]}), (i-1));
        }
    });
}

function insertDropDownOptionInOrder(dropDownId, option, predecessorVal) {
    var dropDown = $("#" + dropDownId);
    for (var i = predecessorVal; i >= -1; i--) {
        var predecessorOption = dropDown.find("option[value='" + i + "']");
        if (predecessorOption.length > 0) {
            predecessorOption.after(option);
            break;
        }
    }
}

function validateTotalValMin() {
    var total = $('#ipt_fsqm_form_' + BST_FORM_ID + '_freetype_' + BST_FIELD_ID_TOTAL_COST + ' input').val();
    if (total < STRIPE_MIN_AMOUNT) {
        resetValidationMsgs();
        resetValidationSuccessMsg();
        showValidationMsgs([{'type': 'error', 'text': 'The minimum allowed amount is $' + STRIPE_MIN_AMOUNT.toFixed(2)}]);
        updateSubmitBtnStatus(false, 'The minimum allowed amount is $' + STRIPE_MIN_AMOUNT.toFixed(2));
    }
}

function resetValidationMsgs() {
    $('#validation-messages').empty().css('display','none');
}

function showValidationMsgs(msgs) {
    if (msgs.length > 0) {
        msgs.forEach(renderValidationMessage);
        $('#validation-messages').css('display','block');
    }
}

function renderValidationMessage(msg) {
    var messageSpan = '<span id="validation-message" class="gpd-message gpd-' + msg.type.toLowerCase() + '-message">' + msg.text + '</span>';
    $(messageSpan).appendTo('#validation-messages');
}

function resetValidationSuccessMsg() {
    $('#validation-success-message').css('display','none');
}

function showValidationSuccessMsg() {
    $('#validation-success-message').css('display','block');
}

function showLlcCountMessage(llcCount, rowsPerLlc) {
    if (llcCount > 0) {
        showValidationMsgs([{'type': 'info', 'text': llcCount + ' ' + (llcCount == 1? 'row appears' : 'rows appear') + ' to have LLC and/or corporate names. An attempt will be made to find a maximum of (' + rowsPerLlc + ') members for each company. The price below reflects these possible matches. If company information is not found for a row, no charge will be added'}]);
    }
}

function unique_id() {
    return Math.floor(new Date().valueOf() * Math.random());
}