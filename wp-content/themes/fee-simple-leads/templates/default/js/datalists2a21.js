/** Data Lists  */

const MIN_LEADS = 100;
const DEFAULT_LEADS = 1000;
const MAX_LEADS = 50000;
const MIN_YEAR_BUILT = 1900;
const MAX_YEAR_BUILT = new Date().getFullYear();
const MIN_SALE_DATE = '1800-01-01';
const LEAD_COUNT_UPDATE_ATTEMPTS_INTERVAL = 500;
const LEAD_COUNT_UPDATE_ATTEMPTS_MAX = 20;
const MOTIVATORS_VALID_FLAGS = ['vacant', 'high-income', 'low-income', 'high-credit', 'low-credit', '60-plus', 'empty-nesters', 'motivated-landlord', 'reverse-mortgage', 'zero-mortgage', 'two-mortgages', 'three-plus-mortgages', 'multi-property-landlord'];
const PROP_TYPES_VALID_FLAGS = ['single-family', 'condos', 'two-four-plex', 'one-story-only', 'two-story-only'];

const DL_FORM_ID = '82';
const DL_FIELD_ID_CONTACT_INFO = '0';
const DL_FIELD_ID_CITIES = '1';
const DL_FIELD_ID_COUNTIES = '2';
const DL_FIELD_ID_ZIP_CODES = '3';
const DL_FIELD_ID_OCCUPANT = '4';
const DL_FIELD_ID_MOTIVATOR_OP = '5';
const DL_FIELD_ID_MOTIVATOR_FLAGS = '6';
const DL_FIELD_ID_PROP_TYPE = '7';
const DL_FIELD_ID_PREMIUM = '8';
const DL_FIELD_ID_MIN_SALE_DATE = '9';
const DL_FIELD_ID_MAX_SALE_DATE = '10';
const DL_FIELD_ID_SQFT = '11';
const DL_FIELD_ID_YEAR_BUILT = '12';
const DL_FIELD_ID_PURCHASE_PRICE = '13';
const DL_FIELD_ID_MARKET_VALUE = '14';
const DL_FIELD_ID_OWNER_AGE = '15';
const DL_FIELD_ID_LTV = '16';
const DL_FIELD_ID_SUPPRESS = '17';
const DL_FIELD_ID_USER_EMAIL = '18';
const DL_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL = '19';
const DL_FIELD_ID_GENERATE_UNIQUE_IDS = '20';
const DL_FIELD_ID_REQUEST_ID = '21';
const DL_FIELD_ID_SUPPRESSION_IDS = '22';
const DL_FIELD_ID_MIN_FORECLOSURE_DATE = '23';
const DL_FIELD_ID_MAX_FORECLOSURE_DATE = '24';
const DL_FIELD_ID_LEADS_COUNT_SLIDER = '0';
const DL_FIELD_ID_BTNS = '1';

const PP_FORM_ID = '83';
const PP_FIELD_ID_CONTACT_INFO = '0';
const PP_FIELD_ID_CITIES = '1';
const PP_FIELD_ID_COUNTIES = '2';
const PP_FIELD_ID_ZIP_CODES = '3';
const PP_FIELD_ID_OCCUPANT = '4';
const PP_FIELD_ID_MOTIVATOR_FLAGS = '6';
const PP_FIELD_ID_PROP_TYPE = '7';
const PP_FIELD_ID_PREMIUM = '8';
const PP_FIELD_ID_MAX_SALE_DATE = '10';
const PP_FIELD_ID_PURCHASE_PRICE = '13';
const PP_FIELD_ID_OWNER_AGE = '15';
const PP_FIELD_ID_LTV = '16';
const PP_FIELD_ID_SUPPRESS = '17';
const PP_FIELD_ID_USER_EMAIL = '18';
const PP_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL = '19';
const PP_FIELD_ID_GENERATE_UNIQUE_IDS = '20';
const PP_FIELD_ID_LEADS_COUNT_SLIDER = '0';
const PP_FIELD_ID_BTNS = '2';

const IMG_DATA_LISTS_SECTION = '/wp-content/themes/fee-simple-leads/templates/default/img/affiliates/data-list-image.png';
const IMG_GET_STARTED_SECTION = '/wp-content/themes/fee-simple-leads/templates/default/img/affiliates/aff-get-started.png';

$(document).ready(function () {
    switchAffiliateImages();
    initDatePickers();
    initDynamicLists();
    initSelect2();
    initTippyJs();
    initPrepackages();
    initPresetHiddenFields();
    toggleAdminArea();
    toggleSuppressionArea();
    bindSuppressionEmailValidationLogic();
    bindLocationPreviewUpdate();
    bindHiddenFieldsUpdateEvents();
    bindTabChangedEvent();
    bindCountLogic();
    bindPrepackagingLogic();
    bindPrepackageSelectedEvent();
    bindRubberBandEffectFix();
    bindForeclosureCheckedEvent();
    applyUrlParams();
    configurePrepackages();
});

$(document).on('click', '.location-preview-item i', removeLocationPreview);

function switchAffiliateImages() {
    var topImg = $('.ambassador-banner-img img');
    var btmImg = $('.get-started-img img');
    if (topImg.attr('data-src')) {
        if (Cookies.get("affwp_ref")) {
            topImg.attr('data-src', IMG_DATA_LISTS_SECTION);
            btmImg.attr('data-src', IMG_GET_STARTED_SECTION);
        }
        topImg.attr('src', topImg.attr('data-src'));
        btmImg.attr('src', btmImg.attr('data-src'));
    }
}

function uniqueArray(arr) {
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        if(unique.indexOf(arr[i]) < 0) {
            unique.push(arr[i]);
        }
    }
    return unique;
}

function initDatePickers() {
    $('#min-sale-date').pikaday({
        format: 'YYYY-MM-DD',
        maxDate: new Date(),
        yearRange: [1800, new Date().getFullYear()]
    });

    $('#max-sale-date').pikaday({
        format: 'YYYY-MM-DD',
        maxDate: new Date(),
        yearRange: [1800, new Date().getFullYear()]
    });

    $('#min-foreclosure-date').pikaday({
        format: 'YYYY-MM-DD',
        maxDate: new Date(),
        yearRange: [1800, new Date().getFullYear()]
    });

    $('#max-foreclosure-date').pikaday({
        format: 'YYYY-MM-DD',
        maxDate: new Date(),
        yearRange: [1800, new Date().getFullYear()]
    });
}

function initDynamicLists() {
    var yearBuiltMin = $('#min-year-built');
    var yearBuiltMax = $('#max-year-built');
    for (var i = MIN_YEAR_BUILT; i <= MAX_YEAR_BUILT; i++) {
        yearBuiltMin.append($('<option>', {value: i, text: i}));
        yearBuiltMax.append($('<option>', {value: i, text: i}));
    }
    yearBuiltMin.val(MIN_YEAR_BUILT);
    yearBuiltMax.val(MAX_YEAR_BUILT);
}

function initSelect2() {
    $('#locations').select2({
        templateResult: formatLocation,
        placeholder: 'Enter City, County or Zip code',
        minimumInputLength: 3,
        multiple: true,
        closeOnSelect: false,
        width: '100%',
        ajax: {
            url: config.DO_ROOT_URL + '/data-origination/location',
            data: function (params) {
              var query = {
                  keyword: params.term
              }
              return query;
            },
            processResults: function(data) {
                return {
                    results: $.map(data.results, function(item, index) {
                        return {
                            'id': item.type + '|' + item.code,
                            'text': item.display,
                            'type': item.type
                        };
                    })
                };
            },
            dataType: 'json',
            delay: 250,
            cache: true
        }
    });

    $('#custom-suppression-email,#pp-custom-suppression-email').select2({
        placeholder: 'Find existing suppression emails or enter a new one',
        minimumInputLength: 2,
        multiple: false,
        allowClear: true,
        tags: true,
        width: '100%',
        ajax: {
            url: config.DO_ROOT_URL + '/data-origination/emails',
            data: function (params) {
              var query = {
                  keyword: params.term
              }
              return query;
            },
            processResults: function(data) {
                return {
                    results: $.map(data.results, function(item, index) {
                        return {
                            'id': item,
                            'text': item
                        };
                    })
                };
            },
            createTag: function (params) {
                return {
                    id: params.term,
                    text: params.term,
                    newOption: true
                }
            },
            dataType: 'json',
            delay: 250,
            cache: true
        }
    });

    $('#admin-area b[role="presentation"],#pp-admin-area b[role="presentation"]').hide();

    $('#min-sqft,#max-sqft,#min-year-built,#max-year-built,#min-purchase-price,#max-purchase-price,#min-market-value,#max-market-value,#min-owner-age,#max-owner-age,#min-market-ltv,#max-market-ltv').select2({
        width: '100%'
    });
}

function initTippyJs() {
    tippy.setDefaultProps({
		theme: 'gpd',
		allowHTML: true,
		placement: 'right-start'
	});

	tippy($('#high-income').parent().get(), {
		content: '<p class="tooltip-heading">High Income:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Household with a high *syndicated income compared to the value of their home.</strong></p><p class="tooltip-high-margin">*syndicated means created by modeling using variables algorithmically likely to mimic the actual credit score.</p><p class="tooltip-high-margin">This is not their actual household income.</p></td></tr></tbody></table>'
	});
	
	tippy($('#low-income').parent().get(), {
		content: '<p class="tooltip-heading">Low Income:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Household with a low *syndicated income</strong></p><p class="tooltip-high-margin">*syndicated means created by modeling using variables algorithmically likely to mimic the actual credit score.</p><p class="tooltip-high-margin">This is not their actual household income.</p></td></tr></tbody></table>'
	});

	tippy($('#high-credit').parent().get(), {
		content: '<p class="tooltip-heading">High Credit:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>700+ *syndicated credit score.</strong></p><p class="tooltip-high-margin">*syndicated means created by modeling using variables algorithmically likely to mimic the actual credit score.</p><p class="tooltip-high-margin">This is not their actual credit score.</p></td></tr></tbody></table>'
	});
	
	tippy($('#low-credit').parent().get(), {
		content: '<p class="tooltip-heading">Low Credit:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Below 575 *syndicated credit score.</strong></p><p class="tooltip-high-margin">*syndicated means created by modeling using variables algorithmically likely to mimic the actual credit score.</p><p class="tooltip-high-margin">This is not their actual credit score.</p></td></tr></tbody></table>'
	});

	tippy($('#60-plus').parent().get(), {
		content: '<p class="tooltip-heading">60+:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Owners that are 60 years old or greater</strong></p></td></tr></tbody></table>'
	});
	
	tippy($('#empty-nesters').parent().get(), {
		content: '<p class="tooltip-heading">Empty Nesters:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Refers a parent(s) 50 and older with children whose ages are statistically likely to have moved out of the property.</strong></p></td></tr></tbody></table>'
	});

    tippy($('#motivated-landlord').parent().get(), {
		content: '<p class="tooltip-heading">Motivated Landlord:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Landlords that are likely to have a strong need to sell their property. They may offer a low offer price, massive discount, or flexible terms.</strong></p></td></tr></tbody></table>'
	});

    tippy($('#foreclosure-date').parent().get(), {
		content: '<p class="tooltip-heading">Foreclosure:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p>Foreclosure data date range refers to the filing or recording date of pre-foreclosure notification.</p></td></tr></tbody></table>'
	});

    tippy($('#reverse-mortgage').parent().get(), {
		content: '<p class="tooltip-heading">Reverse Mortgage:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Homeowners that are 62 and older that converted part of the home\'s equity into cash.</strong></p></td></tr></tbody></table>'
	});

    tippy($('#zero-mortgage').parent().get(), {
		content: '<p class="tooltip-heading">Zero Mortgage:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>\'Free and Clear\' Properties that have no reported mortgages or liens on the property.</strong></p></td></tr></tbody></table>'
	});

    tippy($('#two-mortgages').parent().get(), {
		content: '<p class="tooltip-heading">Two Mortgages:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Properties that have two mortgages on a property.</strong></p></td></tr></tbody></table>'
	});

    tippy($('#three-plus-mortgages').parent().get(), {
		content: '<p class="tooltip-heading">Three Mortgages:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Properties that have three mortgages on a property.</strong></p></td></tr></tbody></table>'
	});

    tippy($('#multi-property-landlord').parent().get(), {
		content: '<p class="tooltip-heading">Multi-property Landlord:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p><strong>Properties that are owned by a landlord with 2+ rental properties.</strong></p></td></tr></tbody></table>'
	});
    
    tippy($('#sale-date-i').get(), {
        content: '<p class="tooltip-heading">Min & Max Sale Dates:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Definition:</strong></p><p>Min & Max Sales Date refers to the last sale date of the property.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>How to use:</strong></p><p>Select minimum and maximum dates of last sale on the property. The only reason to use min sales date is if you specifically want between a date range.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Example:</strong></p><p>If you are looking for properties that have been owned for 10+ years, leave the minimum sale date blank (includes all prior to max sales date) and select 10 years prior to today’s date as a maximum sales date.</p></td></tr></tbody></table>',
        trigger: 'click'
    });
	
	tippy($('#sqft-i').get(), {
		content: '<p class="tooltip-heading">Square Footage:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Definition:</strong></p><p>Square footage refers to living space within a property.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>How to use:</strong></p><p>Slide to, or type in, minimum and maximum square footage.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Example:</strong></p><p>If you are looking for properties with less than 2000 square feet, select the default 1 square footage as your minimum and also select 2000 square footage as your maximum.</p></td></tr></tbody></table>',
        trigger: 'click'
	});
	
	tippy($('#year-built-i').get(), {
		content: '<p class="tooltip-heading">Year Built:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Definition:</strong></p><p>Year built refers to the year a property was built.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>How to use:</strong></p><p>Choose the minimum and/or maximum year built of the properties you are looking for.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Example:</strong></p><p>If you are looking for homes built between 1960 and 1990, select 1960 as a minimum year built and also select 1990 as a maximum year built.</p></td></tr></tbody></table>',
        trigger: 'click'
	});
	
	tippy($('#market-value-i').get(), {
		content: '<p class="tooltip-heading">Market Value:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Definition:</strong></p><p>Market value refers to the estimated amount for which a property should exchange on the date of valuation between a willing buyer and a willing seller.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>How to use:</strong></p><p>Choose the market value of the properties you are looking for.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Example:</strong></p><p>If you are looking for homes with a max market value of 300k, select the default $1 minimum market value and also select $300k as a market value maximum.</p></td></tr></tbody></table>',
        trigger: 'click'
	});
	
	tippy($('#owner-age-i').get(), {
		content: '<p class="tooltip-heading">Owner Age:</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Definition:</strong></p><p>Age of owner of the property.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>How to use:</strong></p><p>Select the minimum and/or maximum age of the property owner.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Example:</strong></p><p>If you are looking for properties with owners aged between 50 and 80, select 50 as a minimum and also select 80 as a maximum.</p></td></tr></tbody></table>',
        trigger: 'click'
	});
	
	tippy($('#market-ltv-i').get(), {
		content: '<p class="tooltip-heading">Loan-to-value (LTV):</p><table class="tooltip-table"><tbody><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Definition:</strong></p><p>LTV refers to the Ratio lenders use to determine how much risk they&apos;re taking on with a secured loan. It is calculated by taking the outstanding loan value divided by the properties value.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>How to use:</strong></p><p>Select the minimum and/or maximum LTV on the properties.</p></td></tr><tr class="tooltip-row"><td class="tooltip-td-img"><img src="/wp-content/themes/fee-simple-leads/templates/default/img/site-img.png" alt="" width="28" height="28" /></td><td class="tooltip-td"><p class="tooltip-low-margin"><strong>Example:</strong></p><p>if you are looking for 50% equity in the property, you will select "0" as a minimum value and also select "50" as the maximum value. The lower the LTV the higher the equity in the property.</p></td></tr></tbody></table>',
        trigger: 'click'
	});
}

function initPresetHiddenFields() {
    var sqft = $('#min-sqft').val() + '|' + $('#max-sqft').val();
    var yearBuilt = $('#min-year-built').val() + '|' + $('#max-year-built').val();
    var purchasePrice = $('#min-purchase-price').val() + '|' + $('#max-purchase-price').val();
    var marketValue = $('#min-market-value').val() + '|' + $('#max-market-value').val();
    var ownerAge = $('#min-owner-age').val() + '|' + $('#max-owner-age').val();
    var ltv = $('#min-market-ltv').val() + '|' + $('#max-market-ltv').val();

    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_SQFT + '_value').val(sqft);
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_YEAR_BUILT + '_value').val(yearBuilt);
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PURCHASE_PRICE + '_value').val(purchasePrice);
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MARKET_VALUE + '_value').val(marketValue);
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_OWNER_AGE + '_value').val(ownerAge);
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_LTV + '_value').val(ltv);
}

function initPrepackages() {
    resetPrepackagesForm();
}

function configurePrepackages() {
    if (!$('#affiliate-config').val()) {
        return setTimeout(configurePrepackages, 500);
    }

    var affiliateConfig = JSON.parse($('#affiliate-config').val());
    
    if (affiliateConfig['title']) {
        $('#toggle-packaged').text(affiliateConfig['title']);
    }

    if (affiliateConfig['hide_contact_info']) {
        $('#pp-include-contact-info').closest('.data-list-criteria').hide();
    }
    
    if (affiliateConfig['with_contact_info_selected']) {
        $('#pp-include-contact-info').prop("checked", true).trigger('change');
    }

    var packagesRadios = [];
    for (var i=0; i < affiliateConfig['packageGroups'].length; i++) {
        for (var j=0; j < affiliateConfig['packageGroups'][i]['packages'].length; j++) {
            var packageGroup = affiliateConfig['packageGroups'][i];
            var package = affiliateConfig['packageGroups'][i]['packages'][j];
            
            var packageRadio = $('<div class="pp-package" style="' + (package['show'] ? '' : 'display: none;') + '"><label class="radio"><input type="radio" name="pre-packages"><span class="box"></span><i class="pp-title"></i></label><div class="pp-package-right"><span class="pp-leads-count" style="display: inline;"></span><span class="pp-error"><i class="pp-error-message"></i><i class="fa fa-refresh pp-error-retry" title="Retry"></i></span><img src="/wp-content/themes/fee-simple-leads/templates/default/img/spinner.svg" class="pp-loading"></div></div>');
            var radioInput = packageRadio.find('input[name="pre-packages"]');
            radioInput.attr('data-order', package['order']);
            radioInput.attr('data-group', packageGroup['ref']);
            radioInput.attr('data-flags', package['flags']);
            radioInput.attr('data-motivator', package['motivator']);
            radioInput.attr('data-occupant', packageGroup['occupant']);
            radioInput.attr('data-prop-type', packageGroup['propType']);
            radioInput.attr('data-max-sale', packageGroup['maxSaleDate']);
            radioInput.attr('data-purchase-price', packageGroup['purchasePrice']);
            radioInput.attr('data-ltv', packageGroup['ltv']);
            radioInput.attr('data-owner-age', packageGroup['ownerAge']);
            radioInput.attr('data-premium-filters', packageGroup['premiumFilters']);
            radioInput.attr('data-count', '0');
            
            var packageTitle = packageRadio.find('.pp-title');
            var packageLabel = packageRadio.find('label');

            if (package['extraCost'] == null) {
                packageTitle.text(package['title']);
                packageLabel.attr('title', package['title']);
            } else {
                packageTitle.html(package['title'] + " [<i class='fa fa-usd pp-tooltip' aria-hidden='true'></i>]");
                tippy(packageTitle.get(), {
                    content: '+$' + package['extraCost'] + ' per lead',
                    placement: 'right'
                });
            }

            packagesRadios.push(packageRadio);
        }
    }

    var packagesDiv = $('#pp-radio-buttons');
    for (var i=1; i <= packagesRadios.length; i++) {
        for (var j=0; j < packagesRadios.length; j++) {
            if (parseInt(packagesRadios[j].find('input').attr('data-order')) == i) {
                packagesDiv.append(packagesRadios[j]);
                break;
            }
        }
    }
}

function applyUrlParams() {
    var locations = getUrlParameter('locations');
    if (locations.length > 0) {
        locations.forEach(function(key) {
            var locationKey = key.toUpperCase();
            var locationType = getLocationType(key);
            var locationDisplay = locationValfromKey(key);
            if (locationType && locationDisplay) {
                $('#' + locationType + '-preview').append($('<li>', {text: locationDisplay, class: 'location-preview-item', 'data-key': locationKey}).append($('<i>', {class: 'fa fa-times'})));
                $('#locations').append($('<option>', {value: locationKey, text: locationDisplay, selected: true}));
            }
        });
    }
    
    var includeContactInfoParam = getUrlParameter('include-contact-info');
    if (includeContactInfoParam.length > 0) {
        if (includeContactInfoParam[0] === 'yes') {
            $('#include-contact-info').prop('checked', true).trigger('change');
        } else if (includeContactInfoParam[0] === 'no') {
            $('#include-contact-info').prop('checked', false).trigger('change');
        }
    }

    var ltbdParam = getUrlParameter('ltbd');
    if (ltbdParam.length > 0) {
        if (ltbdParam[0] === 'yes') {
            $('#distressed').prop('checked', true).trigger('change');
        } else if (ltbdParam[0] === 'no') {
            $('#distressed').prop('checked', false).trigger('change');
        }
    }

    var mllParam = getUrlParameter('motivated-landlord');
    if (mllParam.length > 0) {
        if (mllParam[0] === 'yes') {
            $('#motivated-landlord').prop('checked', true).trigger('change');
        } else if (ltbdParam[0] === 'no') {
            $('#motivated-landlord').prop('checked', false).trigger('change');
        }
    }

    var motivatorsOpParam = getUrlParameter('motivators-op');
    if (motivatorsOpParam.length > 0) {
        if (motivatorsOpParam[0] === 'all') {
            $('#motivator-operator-all').prop('checked', true).trigger('change');
        } else if (motivatorsOpParam[0] === 'any') {
            $('#motivator-operator-any').prop('checked', true).trigger('change');
        }
    }

    var motivatorParam = getUrlParameter('motivators');
    if (motivatorParam.length > 0 && motivatorParam[0]) {
        var motivatorArray = motivatorParam[0].split(',');
        for (var i=0; i < motivatorArray.length; i++) {
            if (MOTIVATORS_VALID_FLAGS.includes(motivatorArray[i])) {
                $('#' + motivatorArray[i]).prop('checked', true).trigger('change');
            }
        }
    }

    var propTypesParam = getUrlParameter('prop-types');
    if (propTypesParam.length > 0 && propTypesParam[0]) {
        var propTypeArray = propTypesParam[0].split(',');
        for (var i=0; i < propTypeArray.length; i++) {
            if (PROP_TYPES_VALID_FLAGS.includes(propTypeArray[i])) {
                $('#' + propTypeArray[i]).prop('checked', true).trigger('change');
            }
        }
    }

    var leadsCountParam = getUrlParameter('leads');
    if (leadsCountParam.length > 0) {
        var leadsCount =  parseInt(leadsCountParam[0]);
        if (!isNaN(leadsCount) && leadsCount > 0) {
            attemptSliderValUpdate(1, leadsCount);
        }
    }
}

function attemptSliderValUpdate (attempt, count) {
    if($('#ipt_fsqm_form_wrap_' + DL_FORM_ID + ' .ipt_uif_hidden_init').is(':visible')) {
        $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider').slider('value', count).trigger('change');
    } else {
        if (attempt < LEAD_COUNT_UPDATE_ATTEMPTS_MAX) {            
            setTimeout(function() {
                attemptSliderValUpdate(++attempt, count);
            }, LEAD_COUNT_UPDATE_ATTEMPTS_INTERVAL);
        }
    }
}

function toggleAdminArea() {
    var accountEmail = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_USER_EMAIL + '_value').val();
    if (accountEmail == null || config.DO_ADMINS.indexOf(accountEmail) === -1) {
        $('#admin-area').remove();
        $('#pp-admin-area').remove();
    }
}

function toggleSuppressionArea() {
    var accountEmail = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_USER_EMAIL + '_value').val();
    if (!accountEmail) {
        $('#suppression-area').remove();
        $('#pp-suppression-area').remove();
    }
}

function bindSuppressionEmailValidationLogic() {
    $(document.body).on('change', '#custom-suppression-email', function() {
        if (isValidEmail($(this).val())) {
            $('#custom-suppression-email-validation').hide(); 
        } else {
            $('#custom-suppression-email-validation').show();
        }
    });
    $(document.body).on('change', '#pp-custom-suppression-email', function() {
        if (isValidEmail($(this).val())) {
            $('#pp-custom-suppression-email-validation').hide(); 
        } else {
            $('#pp-custom-suppression-email-validation').show();
        }
    });
}

function bindLocationPreviewUpdate() {
    $('#locations').on('change', function() { 
        var locations = $('#locations').val();
        if (locations) {
            locations.forEach(function(key) {
                if ($(".location-preview-item[data-key='" + key + "']").length == 0) {
                    var type = getLocationType(key);
                    var display = $("#locations option[value='" + key + "']").text();
                    $('#' + type + '-preview').append($('<li>', {text: display, class: 'location-preview-item', 'data-key': key}).append($('<i>', {class: 'fa fa-times'})));
                }
            });

            var previews = $('.location-preview-item').map(function(i,v) {return $(this).attr('data-key');}).toArray();
            if(previews.length > 0) {
                previews.forEach(function(key) {
                    if (!locations.includes(key)) {
                        $(".location-preview-item[data-key='" + key + "']").remove();
                    }
                });
            }
        } else {
            $('.location-preview-item').remove();
        }
    });
}

function bindHiddenFieldsUpdateEvents() {

    $('#CITY-preview').on('DOMSubtreeModified', function() {
        var keys = $('#CITY-preview li').map(function(i,v) {return $(this).attr('data-key').replace('CITY|','');}).toArray();
        if (keys.length > 0) {
            $('#CITY-preview').parent().show();
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CITIES + '_value').val(keys);
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CITIES + '_value').val(keys);
        } else {
            $('#CITY-preview').parent().hide();
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CITIES + '_value').val('N/A');
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CITIES + '_value').val('N/A');
        }
    });

    $('#COUNTY-preview').on('DOMSubtreeModified', function() {
        var keys = $('#COUNTY-preview li').map(function(i,v) {return $(this).attr('data-key').replace('COUNTY|','');}).toArray();
        if (keys.length > 0) {
            $('#COUNTY-preview').parent().show();
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_COUNTIES + '_value').val(keys);
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_COUNTIES + '_value').val(keys);
        } else {
            $('#COUNTY-preview').parent().hide();
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_COUNTIES + '_value').val('N/A');
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_COUNTIES + '_value').val('N/A');
        }
    });

    $('#ZIP_CODE-preview').on('DOMSubtreeModified', function() {
        var keys = $('#ZIP_CODE-preview li').map(function(i,v) {return $(this).attr('data-key').replace('ZIP_CODE|','');}).toArray();
        if (keys.length > 0) {
            $('#ZIP_CODE-preview').parent().show();
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_ZIP_CODES + '_value').val(keys);
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_ZIP_CODES + '_value').val(keys);
        } else {
            $('#ZIP_CODE-preview').parent().hide();
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_ZIP_CODES + '_value').val('N/A');
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_ZIP_CODES + '_value').val('N/A');
        }
    });

    $('#include-contact-info').on('change', function() {
        var parent = $(this).closest('div');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
        $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CONTACT_INFO + '_value').val($(this).is(':checked')? 'Yes' : 'No').trigger('change');
    });

    $('input[name="occupancy"]').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        var ids = $('input[name="occupancy"]:checked').map(function(i,v) {return $(this).attr('id');}).toArray();
        if (ids.length > 0) {
            bgGrey(parent);
            var values = [];
            ids.forEach(function(key) {
                switch (key) {
                    case 'absentee-owner':
                        values.push('Absentee Owner');
                        break;
                    case 'owner-occupied':
                       values.push('Owner Occupied');
                        break;
                    case 'corporate-owned':
                        values.push('Corporate Owned');
                        break;
                    default:
                }
            });
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_OCCUPANT + '_value').val(values.join(','));
        } else {
            bgClear(parent);
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_OCCUPANT + '_value').val('');
        }
    });
    
    $('input[name="motivator-operator"]').on('change', function() {
        var id = $('input[name="motivator-operator"]:checked').attr('id');
        var val = (id == 'motivator-operator-all')? 'ALL of the selected motivators' : 'ANY of the selected motivators';
        $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MOTIVATOR_OP + '_value').val(val);
    });

    $('input[name="motivator"]').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        var ids = $('input[name="motivator"]:checked').map(function(i,v) {return $(this).attr('id');}).toArray();
        if (ids.length > 0) {
            bgGrey(parent);
            var values = [];
            ids.forEach(function(key) {
                switch (key) {
                    case 'vacant':
                        values.push('Vacant');
                        break;
                    case 'high-income':
                       values.push('High Income');
                        break;
                    case 'low-income':
                        values.push('Low Income');
                        break;
                    case 'high-credit':
                        values.push('High Credit');
                        break;
                    case 'low-credit':
                        values.push('Low Credit');
                        break;
                    case '60-plus':
                        values.push('60+');
                        break;
                    case 'empty-nesters':
                        values.push('Empty Nesters');
                        break;
                    case 'motivated-landlord':
                        values.push('Motivated Landlord');
                        break;
                    case 'reverse-mortgage':
                        values.push('Reverse Mortgage');
                        break;
                    case 'zero-mortgage':
                        values.push('Zero Mortgage');
                        break;
                    case 'two-mortgages':
                        values.push('Two Mortgages');
                        break;
                    case 'three-plus-mortgages':
                        values.push('Three+ Mortgages');
                        break;
                    case 'multi-property-landlord':
                        values.push('Multi-Property Landlord');
                        break;
                    default:
                }
            });
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MOTIVATOR_FLAGS + '_value').val(values.join(','));
        } else {
            bgClear(parent);
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MOTIVATOR_FLAGS + '_value').val('');
        }
    });

    $('input[name="prop-type"]').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        var ids = $('input[name="prop-type"]:checked').map(function(i,v) {return $(this).attr('id');}).toArray();
        if (ids.length > 0) {
            bgGrey(parent);
            var values = [];
            ids.forEach(function(key) {
                switch (key) {
                    case 'single-family':
                        values.push('Single Family');
                        break;
                    case 'condos':
                       values.push('Condos');
                        break;
                    case 'two-four-plex':
                        values.push('2 - 4 Plex');
                        break;
                    case 'one-story-only':
                        values.push('1 Story Only');
                        break;
                    case 'two-story-only':
                        values.push('2 Story Only');
                        break;
                    default:
                }
            });
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PROP_TYPE + '_value').val(values.join(','));
        } else {
            bgClear(parent);
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PROP_TYPE + '_value').val('');
        }
    });

    $('input[name="premium-flags"]').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        var ids = $('input[name="premium-flags"]:checked').map(function(i,v) {return $(this).attr('id');}).toArray();
        if (ids.length > 0) {
            bgGrey(parent);
            var values = [];
            ids.forEach(function(key) {
                switch (key) {
                    case 'distressed':
                        values.push('Likely To Be Distressed');
                        break;
                    case 'motivated-landlord':
                        values.push('Motivated Landlord');
                        break;
                    case 'foreclosure-date':
                        values.push('Foreclosure');
                        break;
                    default:
                }
            });
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PREMIUM + '_value').val(values.join(',')).trigger('change');
        } else {
            bgClear(parent);
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PREMIUM + '_value').val('').trigger('change');
        }
    });

    $('#min-foreclosure-date,#max-foreclosure-date').on('change', function() {
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var minHiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MIN_FORECLOSURE_DATE + '_value');
        var maxHiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MAX_FORECLOSURE_DATE + '_value');
        
        if ($('#foreclosure-date').is(':checked') && $('#min-foreclosure-date').val()) {
            validateDateRangeAndSet($('#min-foreclosure-date').val(), $('#max-foreclosure-date').val(), validationMessage, minHiddenField, maxHiddenField);
        } else {
            minHiddenField.val('').trigger('change');
            maxHiddenField.val('').trigger('change');
            validationMessage.html('A start date is required');
            validationMessage.show();
        }
    });

    $('#min-sale-date,#max-sale-date').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var minHiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MIN_SALE_DATE + '_value');
        var maxHiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MAX_SALE_DATE + '_value');        
        validateDateRangeAndSet($('#min-sale-date').val(), $('#max-sale-date').val(), validationMessage, minHiddenField, maxHiddenField);
    });

    $('#min-sqft,#max-sqft').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var hiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_SQFT + '_value');
        validateNumericRangeAndSet($('#min-sqft').val(), $('#max-sqft').val(), $('#min-sqft').val() + '|' + $('#max-sqft').val(), validationMessage, hiddenField);
    });

    $('#min-year-built,#max-year-built').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var hiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_YEAR_BUILT + '_value');
        validateNumericRangeAndSet($('#min-year-built').val(), $('#max-year-built').val(), $('#min-year-built').val() + '|' + $('#max-year-built').val(), validationMessage, hiddenField);
    });

    $('#min-purchase-price,#max-purchase-price').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var hiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PURCHASE_PRICE + '_value');
        validateNumericRangeAndSet($('#min-purchase-price').val(), $('#max-purchase-price').val(), $('#min-purchase-price').val() + '|' + $('#max-purchase-price').val(), validationMessage, hiddenField);
    });

    $('#min-market-value,#max-market-value').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var hiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MARKET_VALUE + '_value');
        validateNumericRangeAndSet($('#min-market-value').val(), $('#max-market-value').val(), $('#min-market-value').val() + '|' + $('#max-market-value').val(), validationMessage, hiddenField);
    });

    $('#min-owner-age,#max-owner-age').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var hiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_OWNER_AGE + '_value');
        validateNumericRangeAndSet($('#min-owner-age').val(), $('#max-owner-age').val(), $('#min-owner-age').val() + '|' + $('#max-owner-age').val(), validationMessage, hiddenField);
    });

    $('#min-market-ltv,#max-market-ltv').on('change', function() {
        bgGrey($(this).closest('.accordion-section'));
        var validationMessage = $(this).closest('.accordion-content-half-body').find('.validation-message');
        var hiddenField = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_LTV + '_value');
        validateNumericRangeAndSet($('#min-market-ltv').val(), $('#max-market-ltv').val(), $('#min-market-ltv').val() + '|' + $('#max-market-ltv').val(), validationMessage, hiddenField);
    });

    $('#suppress-data').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
        $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_SUPPRESS + '_value').val($(this).is(':checked')? '1' : '').trigger('change');
    });

    $('#generate-unique-id').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
        $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_GENERATE_UNIQUE_IDS + '_value').val($(this).is(':checked')? '1' : '').trigger('change');
    });

    $('#custom-suppression-email').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        $(this).val() != null && $(this).val().length > 0? bgGrey(parent) : bgClear(parent);
        if (isValidEmail($(this).val())) {
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL + '_value').val($(this).val());
        } else {
            $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL + '_value').val(null);
        }
    });

    $('#pp-include-contact-info').on('change', function() {
        var parent = $(this).closest('div');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
        $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CONTACT_INFO + '_value').val($(this).is(':checked')? 'Yes' : 'No').trigger('change');
    });

    $('input[name="pre-packages"]').on('change', function() {
        var parent = $(this).closest('.data-list-criteria');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
    });

    $('#pp-suppress-data').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
        $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_SUPPRESS + '_value').val($(this).is(':checked')? '1' : '').trigger('change');
    });

    $('#pp-generate-unique-id').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        $(this).is(':checked')? bgGrey(parent) : bgClear(parent);
        $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_GENERATE_UNIQUE_IDS + '_value').val($(this).is(':checked')? '1' : '').trigger('change');
    });

    $('#pp-custom-suppression-email').on('change', function() {
        var parent = $(this).closest('.accordion-section');
        $(this).val() != null && $(this).val().length > 0? bgGrey(parent) : bgClear(parent);
        if (isValidEmail($(this).val())) {
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL + '_value').val($(this).val());
        } else {
            $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL + '_value').val(null);
        }
    });
}

function bindTabChangedEvent() {
    $('#toggle-audience').on('click', function() {        
        $('#data-lists-form').show();
        $('#pre-packages-form').hide();
    });
    $('#toggle-packaged').on('click', function() {        
        $('#data-lists-form').hide();
        $('#pre-packages-form').show();
    });
}

function bindCountLogic() {
    $('#dl-refresh-count,a[href="#dl-refresh-count"]').on('click', function () {
        checkAvailableCount(false);
        return false;
    });

    $('#ipt_fsqm_form_' + DL_FORM_ID + '_design_' + DL_FIELD_ID_BTNS + ' a[href="#dl-submit"]').on('click', function () {
        checkAvailableCount(true);
        return false;
    });

    $('body').on('submit', '#ipt_fsqm_form_' + DL_FORM_ID, function(e, shouldSubmit) {
        if (shouldSubmit === true) {
            return true;
        } else {
            return checkAvailableCount(true);
        }
    });

    $('.ipt_uif_slider_box').on('change', function () { 
        hideValidationMessages();
    });

    $('#include-contact-info,input[name="occupancy"],input[name="prop-type"],input[name="motivator-operator"],input[name="motivator"],#distressed,#motivated-landlord,#min-sale-date,#max-sale-date,#min-sqft,#max-sqft,#min-year-built,#max-year-built,#min-market-value,#max-market-value,#min-owner-age,#max-owner-age,#min-market-ltv,#max-market-ltv,#suppress-data,#custom-suppression-email').on('change', function () {
        var sliderBox = $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider');
        var sliderMaxLabel = $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider-label:last');
        var newVal = sliderBox.slider('option', 'value') <= MAX_LEADS? sliderBox.slider('option', 'value') : MAX_LEADS;
        updateSlider(sliderBox, sliderMaxLabel, newVal, MAX_LEADS);
        updateStackedCountDisplay(null);
    });

    $('.data-list-location ul').on('DOMSubtreeModified', function() {
        var sliderBox = $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider');
        var sliderMaxLabel = $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider-label:last');
        var newVal = sliderBox.slider('option', 'value') <= MAX_LEADS? sliderBox.slider('option', 'value') : MAX_LEADS;
        updateSlider(sliderBox, sliderMaxLabel, newVal, MAX_LEADS);
        updateStackedCountDisplay(null);
    });

    $('#ipt_fsqm_form_' + DL_FORM_ID).on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    bindOccupancyFlagLogic('#owner-occupied', '#corporate-owned', '<span class="tooltip-no-transform"><strong>Owner Occupied</strong> and <strong>Absentee Corporate Owner</strong> flags cannot be checked at the same time</span>');
    bindOccupancyFlagLogic('#corporate-owned', '#owner-occupied', '<span class="tooltip-no-transform"><strong>Owner Occupied</strong> and <strong>Absentee Corporate Owner</strong> flags cannot be checked at the same time</span>');
}

function bindOccupancyFlagLogic(flag1Id, flag2Id, msg) {
    $(flag1Id).on('change', function () {
        var flag2 = $(flag2Id);
        var tooltip = tippy(flag2.parent().get())[0];
        if ($(this).is(':checked')) {
            flag2.attr('disabled', true);
            flag2.parent().css("cursor","not-allowed");
            tooltip.setProps({
                content: msg,
                trigger: 'click'
            });
        } else {
            flag2.attr('disabled', false);
            flag2.parent().css("cursor","pointer");
            tooltip.disable();
        }
    });
}

function bindPrepackagingLogic() {
    $('#pp-view-count,a[href="#pp-view-count"]').on('click', function () {
        checkPrepackagesCounts();
        return false;
    });

    $('#ipt_fsqm_form_' + PP_FORM_ID + '_design_' + PP_FIELD_ID_BTNS + ' a[href="#pp-submit"]').on('click', function () {
        if (canSubmitPrepackagesForm()) {
            $('#ipt_fsqm_form_' + PP_FORM_ID).trigger('submit');
        }
        return false;
    });

    $('body').on('submit', '#ipt_fsqm_form_' + PP_FORM_ID, function(e) {
        if (!canSubmitPrepackagesForm()) {
            e.preventDefault();
            return false;
        }
    });

    $('.ipt_uif_slider_box').on('change', function () { 
        hideValidationMessages();
    });

    $('#pp-include-contact-info,#pp-suppress-data,#pp-custom-suppression-email').on('change', function () {
        resetPrepackagesForm();
        resetPackages();
    });

    $('.data-list-location ul').on('DOMSubtreeModified', function() {
        resetPrepackagesForm();
        resetPackages();
    });

    $('#ipt_fsqm_form_' + PP_FORM_ID).on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    $('body').on('click', '.pp-error-retry', function(e) {        
        var affiliateConfig = JSON.parse($('#affiliate-config').val());
        for (var i=0; i < affiliateConfig['packageGroups'].length; i++) {
            var packageGroup = affiliateConfig['packageGroups'][i];
            var radio = $('input[name="pre-packages"][data-group="' + packageGroup['ref'] + '"]')
            var hasError = radio.closest('.pp-package').find('.pp-error').css('display') != 'none';
            
            if (hasError) {
                var groupPackagesDivs = radio.closest('.pp-package');
                groupPackagesDivs.find('.pp-leads-count').text('');
                groupPackagesDivs.find('.pp-error').hide();
                groupPackagesDivs.find('.pp-loading').css('display', 'inline');

                var requestId = radio.attr('data-request-id');
                if (requestId) {
                    sendPollPackagesRequest(packageGroup['ref'], requestId);
                } else {
                    sendPackagesRequest(packageGroup);
                }
            }
        }
    });
}

function bindPrepackageSelectedEvent() {
    $('body').on('change', 'input[name="pre-packages"]', function(e) {
        if ($(this).is(':checked')) {
            selectPackage($(this), true);
        }
    });
}

function bindRubberBandEffectFix() {
    $('body,html').bind('scroll mousedown wheel mousewheel keyup DOMMouseScroll touchmove', function(e){
        if ($('body').is(':animated')) {
            $("html,body").stop();
        }
    });
}

function bindForeclosureCheckedEvent() {
    $('#foreclosure-date').on('change', function() {
        if ($(this).is(':checked')) {
            $('#min-foreclosure-date').attr('disabled', false).css("cursor","default");
            $('#max-foreclosure-date').attr('disabled', false).css("cursor","default");
            $('#foreclosure-date-range').slideDown();
        } else {
            $('#min-foreclosure-date').attr('disabled', true).css("cursor","not-allowed");
            $('#max-foreclosure-date').attr('disabled', true).css("cursor","not-allowed");
            $('#foreclosure-date-range').slideUp();
        }
    });
}

function checkAvailableCount(submitOnSuccess) {
    
    hideValidationMessages();

    var counties = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_COUNTIES + '_value').val();
    var cities = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CITIES + '_value').val();
    var zipCodes = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_ZIP_CODES + '_value').val(); 
    if((counties == null || counties == 'N/A') && (cities == null || cities == 'N/A') && (zipCodes == null || zipCodes == 'N/A')) {
        showRequiredLocationErr();
        return;
    }

    var premiumFlags = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PREMIUM + '_value').val();
    var minForeclosureDate = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MIN_FORECLOSURE_DATE + '_value');
    var maxForeclosureDate = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MAX_FORECLOSURE_DATE + '_value');
    if (premiumFlags.indexOf('Foreclosure') !== -1) {
        if (minForeclosureDate.val() && !maxForeclosureDate.val()) {
            maxForeclosureDate.val((new Date()).toISOString().substring(0, 10)).trigger('change');
        }
        
        if (!minForeclosureDate.val() || !isValidDateRange(minForeclosureDate.val(), maxForeclosureDate.val())) {
            showRequiredForeclosureDatesErr();
            return;
        }
    }

    toggleLoadingOverlay(true);
    updateStackedFormSubmitBtnStatus(false, 'Checking vailable leads...');
    
    $.ajax({
        type: 'POST',
        url: config.DO_ROOT_URL + '/data-origination/count',
        data: buildCountRequestBody(),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            toggleLoadingOverlay(false);
            updateStackedFormSubmitBtnStatus(true, null);
            if (data.status && data.status.code == 0 && data.count != null) {
                var sliderBox = $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider');
                var sliderMaxLabel = $('#ipt_fsqm_form_' + DL_FORM_ID + '_mcq_' + DL_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider-label:last');
                var selectedLeadCount = sliderBox.slider('option', 'value');

                updateCountSuppressionFields(data.id);
                updateStackedCountDisplay(data.count);
                if (data.count < MIN_LEADS) {
                    updateSlider(sliderBox, sliderMaxLabel, DEFAULT_LEADS, MAX_LEADS);
                    showMinLeadsErrorMessage(data.count, MIN_LEADS);
                } else {
                    if (data.count > MAX_LEADS) {
                        scrollToElement($(".dataList-right"));
                        updateSlider(sliderBox, sliderMaxLabel, selectedLeadCount, MAX_LEADS);
                        submitDataListsForm(submitOnSuccess);
                    } else {
                        if (selectedLeadCount <= data.count) {
                            scrollToElement($(".dataList-right"));
                            updateSlider(sliderBox, sliderMaxLabel, selectedLeadCount, data.count);
                            submitDataListsForm(submitOnSuccess);
                        } else {
                            updateSlider(sliderBox, sliderMaxLabel, data.count, data.count);
                            showAvailableCountExceededErr();
                        }
                    }
                }
            } else {
                showGeneralErr();
                updateStackedCountDisplay(null);
            }
        },
        error: function(xhr, err) {
            toggleLoadingOverlay(false);
            showGeneralErr();
            updateStackedCountDisplay(null);
            updateStackedFormSubmitBtnStatus(true, null);
            return;
        }
    });
}

function submitDataListsForm(submit) {
    if (submit === true) {
        $('#ipt_fsqm_form_' + DL_FORM_ID).trigger('submit', [true]);
    }
}

function checkPrepackagesCounts() {

    resetPackages();
    resetPrepackagesForm();
    hideValidationMessages();

    var counties = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_COUNTIES + '_value').val();
    var cities = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CITIES + '_value').val();
    var zipCodes = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_ZIP_CODES + '_value').val(); 
    if((counties == null || counties == 'N/A') && (cities == null || cities == 'N/A') && (zipCodes == null || zipCodes == 'N/A')) {
        showRequiredLocationErr();
        return;
    }

    togglePackagesLoadingImages(true);
    updatePrepackagingFormSubmitBtnStatus(false, 'Checking vailable leads...');

    sendPackagesRequests();
}

function sendPackagesRequests() {
    var affiliateConfig = JSON.parse($('#affiliate-config').val());

    for (var i=0; i < affiliateConfig['packageGroups'].length; i++) {
        sendPackagesRequest(affiliateConfig['packageGroups'][i]);
    }
}

function sendPackagesRequest(packageGroup) {
    $.ajax({
        type: 'POST',
        url: config.DO_ROOT_URL + '/data-origination/packages',
        data: buildPackagesRequestBody(packageGroup),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            handlePackagesSuccess(packageGroup['ref'], data);
        },
        error: function(xhr, err) {
            updatePackagesFailure(packageGroup['ref'], null);
        }
    });
}

function sendPollPackagesRequest(groupRef, requestId) {
    $.ajax({
        type: 'GET',
        url: config.DO_ROOT_URL + '/data-origination/packages/' + requestId,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
            handlePackagesSuccess(groupRef, data);
        },
        error: function(xhr, err) {
            updatePackagesFailure(groupRef, null);
        }
    });
}

function handlePackagesSuccess(groupRef, data) {
    if (data.status && data.status.code == 0 && data.packages != null) {
        updatePackagesSuccess(groupRef, data.packages);
        updateSelectedPackage();
    } else if (data.status && data.status.code == 997) {
        updatePackagesFailure(groupRef, data.requestId);
    } else {
        updatePackagesFailure(groupRef, null);
    }
}

function buildCountRequestBody() {
    var body = {
        'type': 'STACKED',
        'criteria': {}
    };

    body['criteria']['contactInfo'] = ($('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CONTACT_INFO + '_value').val() == 'Yes');

    var counties = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_COUNTIES + '_value').val();
    if(counties != null && counties != 'N/A') body['criteria']['county'] = counties.split(',');

    var cities = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CITIES + '_value').val();
    if(cities != null && cities != 'N/A') body['criteria']['city'] = cities.split(',');

    var zipCodes = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_ZIP_CODES + '_value').val();
    if(zipCodes != null && zipCodes != 'N/A') body['criteria']['zip'] = zipCodes.split(',');

    var occupant = [];
    var occupantVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_OCCUPANT + '_value').val(); 
    if (occupantVal.indexOf('Absentee Owner') !== -1) occupant.push('AO');
    if (occupantVal.indexOf('Owner Occupied') !== -1) occupant.push('OO');
    if (occupantVal.indexOf('Corporate Owned') !== -1) occupant.push('CO');
    if (occupant.length > 0) body['criteria']['occupant'] = occupant;

    body['criteria']['motivatorOperator'] = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MOTIVATOR_OP + '_value').val() == 'ALL of the selected motivators'? 'AND' : 'OR';

    var motivator = [];
    var motivatorVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MOTIVATOR_FLAGS + '_value').val();
    if (motivatorVal.indexOf('High Equity') !== -1) motivator.push('HE');
    if (motivatorVal.indexOf('Vacant') !== -1) motivator.push('VAC');
    if (motivatorVal.indexOf('High Income') !== -1) motivator.push('HI');
    if (motivatorVal.indexOf('Low Income') !== -1) motivator.push('LI');
    if (motivatorVal.indexOf('High Credit') !== -1) motivator.push('HC');
    if (motivatorVal.indexOf('Low Credit') !== -1) motivator.push('LC');
    if (motivatorVal.indexOf('60+') !== -1) motivator.push('EL');
    if (motivatorVal.indexOf('Empty Nesters') !== -1) motivator.push('EN');
    if (motivatorVal.indexOf('Motivated Landlord') !== -1) motivator.push('MLL');
    if (motivatorVal.indexOf('Reverse Mortgage') !== -1) motivator.push('MGR');
    if (motivatorVal.indexOf('Zero Mortgage') !== -1) motivator.push('MG0');
    if (motivatorVal.indexOf('Two Mortgages') !== -1) motivator.push('MG2');
    if (motivatorVal.indexOf('Three+ Mortgages') !== -1) motivator.push('MG3');
    if (motivatorVal.indexOf('Multi-Property Landlord') !== -1) motivator.push('MPL');
    if (motivator.length > 0) body['criteria']['motivator'] = motivator;
    
    var propTypeVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PROP_TYPE + '_value').val();
    
    var propType = [];
    if (propTypeVal.indexOf('Single Family') !== -1) propType.push('SF');
    if (propTypeVal.indexOf('Condos') !== -1) propType.push('THC');
    if (propTypeVal.indexOf('2 - 4 Plex') !== -1) propType.push('TFP');
    if (propType.length > 0) body['criteria']['propertyType'] = propType;
    
    var story = [];
    if (propTypeVal.indexOf('1 Story Only') !== -1) story.push('OSO');
    if (propTypeVal.indexOf('2 Story Only') !== -1) story.push('TSO');
    if (story.length > 0) body['criteria']['story'] = story;

    var minDate = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MIN_SALE_DATE + '_value').val();
    var maxDate = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MAX_SALE_DATE + '_value').val();
    if (minDate || maxDate) {
        if(!minDate) minDate = MIN_SALE_DATE;
        if(!maxDate) maxDate = (new Date()).toISOString().substring(0, 10);
        body['criteria']['saleDate'] = [minDate + '|' +  maxDate];
    }

    var sqftVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_SQFT + '_value').val();
    if (sqftVal != null && sqftVal !== '0|10000') {
        body['criteria']['squareFeet'] = [sqftVal];
    }
    
    var yearBuiltVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_YEAR_BUILT + '_value').val();
    if (yearBuiltVal != null && yearBuiltVal !== (MIN_YEAR_BUILT + '|' + MAX_YEAR_BUILT)) {
        body['criteria']['yearBuilt'] = [yearBuiltVal];
    }

    var purchasePriceVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PURCHASE_PRICE + '_value').val();
    if (purchasePriceVal != null && purchasePriceVal !== '0|10000000') {
        body['criteria']['purchasePrice'] = [purchasePriceVal];
    }

    var marketValueVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MARKET_VALUE + '_value').val();
    if (marketValueVal != null && marketValueVal !== '0|10000000') {
        body['criteria']['marketValue'] = [marketValueVal];
    }

    var ownerAgeVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_OWNER_AGE + '_value').val();
    if (ownerAgeVal != null && ownerAgeVal !== '19|120') {
        body['criteria']['ownerAge'] = [ownerAgeVal];
    }

    var ltvVal = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_LTV + '_value').val();
    if (ltvVal != null && ltvVal !== '0|100') {
        var ltvMinMax = ltvVal.split('|');
        var reversedLtvMin = 100 - parseInt(ltvMinMax[0]);
        var reversedLtvMax = 100 - parseInt(ltvMinMax[1]);
        body['criteria']['highEquity'] = [reversedLtvMax + '|' + reversedLtvMin];
    }

    if ($('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PREMIUM + '_value').val().indexOf('Likely To Be Distressed') !== -1) {
        body['criteria']['debt'] = 'YES';
    }

    if ($('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PREMIUM + '_value').val().indexOf('Motivated Landlord') !== -1) {
        body['criteria']['motivatedLandlord'] = true;
    }

    if ($('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_PREMIUM + '_value').val().indexOf('Foreclosure') !== -1) {
        var minForeclosureDate = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MIN_FORECLOSURE_DATE + '_value').val();
        var maxForeclosureDate = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_MAX_FORECLOSURE_DATE + '_value').val();
        if (minForeclosureDate) {
            body['criteria']['foreclosureDate'] = minForeclosureDate + '|' +  maxForeclosureDate;
        }
    }

    if ($('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_SUPPRESS + '_value').val() =='1') {
        var accountEmail = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_USER_EMAIL + '_value').val();
        var customSuppressionEmail = $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL + '_value').val();
        if (customSuppressionEmail != null && customSuppressionEmail.length > 0) {
            body['email'] = customSuppressionEmail;
            body['suppress'] = true;
        } else if (accountEmail != null && accountEmail.length > 0) {
            body['email'] = accountEmail;
            body['suppress'] = true;
        }
    } else {
        body['suppress'] = false;
    }

    var countSuppressions = $('#do-count-suppressions').html();
    if (countSuppressions) {
        body['countSuppressions'] = JSON.parse(countSuppressions);
    }

    return JSON.stringify(body);
}

function buildPackagesRequestBody(packagesGroup) {
    var body = {
        'criteria': {}
    };

    body['criteria']['contactInfo'] = ($('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CONTACT_INFO + '_value').val() == 'Yes');

    var counties = $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_COUNTIES + '_value').val();
    if(counties != null && counties != 'N/A') body['criteria']['county'] = counties.split(',');

    var cities = $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CITIES + '_value').val();
    if(cities != null && cities != 'N/A') body['criteria']['city'] = cities.split(',');

    var zipCodes = $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_ZIP_CODES + '_value').val();
    if(zipCodes != null && zipCodes != 'N/A') body['criteria']['zip'] = zipCodes.split(',');

    if ($('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_SUPPRESS + '_value').val() =='1') {
        var accountEmail = $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_USER_EMAIL + '_value').val();
        var customSuppressionEmail = $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_CUSTOM_SUPPRESSION_EMAIL + '_value').val();
        if (customSuppressionEmail != null && customSuppressionEmail.length > 0) {
            body['email'] = customSuppressionEmail;
            body['suppress'] = true;
        } else if (accountEmail != null && accountEmail.length > 0) {
            body['email'] = accountEmail;
            body['suppress'] = true;
        }
    } else {
        body['suppress'] = false;
    }

    var occupant = [];
    var occupantVal = packagesGroup['occupant'];
    if (occupantVal) {
        if (occupantVal.indexOf('Absentee Owner') !== -1) occupant.push('AO');
        if (occupantVal.indexOf('Owner Occupied') !== -1) occupant.push('OO');
        if (occupantVal.indexOf('Corporate Owned') !== -1) occupant.push('CO');
    }
    if (occupant.length > 0) body['criteria']['occupant'] = occupant;
        
    var propTypeVal = packagesGroup['propType'];

    var propType = [];
    if (propTypeVal.indexOf('Single Family') !== -1) propType.push('SF');
    if (propTypeVal.indexOf('Condos') !== -1) propType.push('THC');
    if (propTypeVal.indexOf('2 - 4 Plex') !== -1) propType.push('TFP');
    if (propType.length > 0) body['criteria']['propertyType'] = propType;
    
    var story = [];
    if (propTypeVal.indexOf('1 Story Only') !== -1) story.push('OSO');
    if (propTypeVal.indexOf('2 Story Only') !== -1) story.push('TSO');
    if (story.length > 0) body['criteria']['story'] = story;

    var maxDate = packagesGroup['maxSaleDate'];
    if (maxDate) {
        var minDate = MIN_SALE_DATE;
        if(!maxDate) maxDate = (new Date()).toISOString().substring(0, 10);
        body['criteria']['saleDate'] = [minDate + '|' +  maxDate];
    }

    var purchasePriceVal = packagesGroup['purchasePrice'];
    if (purchasePriceVal != null && purchasePriceVal !== '0|10000000') {
        body['criteria']['purchasePrice'] = [purchasePriceVal];
    }

    var ltvVal = packagesGroup['ltv'];
    if (ltvVal != null && ltvVal !== '0|100') {
        var ltvMinMax = ltvVal.split('|');
        var reversedLtvMin = 100 - parseInt(ltvMinMax[0]);
        var reversedLtvMax = 100 - parseInt(ltvMinMax[1]);
        body['criteria']['highEquity'] = [reversedLtvMax + '|' + reversedLtvMin];
    }

    var ownerAgeVal = packagesGroup['ownerAge'];
    if (ownerAgeVal != null && ownerAgeVal !== '19|120') {
        body['criteria']['ownerAge'] = [ownerAgeVal];
    }

    var premiumFiltersVal = packagesGroup['premiumFilters'];
    if (premiumFiltersVal != null) {
        if (premiumFiltersVal.indexOf('Likely To Be Distressed') !== -1) {
            body['criteria']['debt'] = 'YES';
        }
        if (premiumFiltersVal.indexOf('Motivated Landlord') !== -1) {
            body['criteria']['motivatedLandlord'] = true;
        }
    }

    return JSON.stringify(body);
}

function canSubmitPrepackagesForm() {
    var selectedPackageRB = $('input[name="pre-packages"]:checked');
    if(selectedPackageRB.length != 0) {
        var packageCount = parseInt(selectedPackageRB.attr('data-count'));
        var selectedCount = parseInt($('#ipt_fsqm_form_' + PP_FORM_ID + '_mcq_' + PP_FIELD_ID_LEADS_COUNT_SLIDER + '_value').val());
    
        if (selectedCount <= packageCount) {
            return true;
        }
    }
    return false;
}

function resetPrepackagesForm() {
    var sliderBox = $('#ipt_fsqm_form_' + PP_FORM_ID + '_mcq_' + PP_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider');
    var sliderMaxLabel = $('#ipt_fsqm_form_' + PP_FORM_ID + '_mcq_' + PP_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider-label:last');
    
    updateSlider(sliderBox, sliderMaxLabel, DEFAULT_LEADS, MAX_LEADS);
    updatePrepackagingCountDisplay(null);
    updatePrepackagingFormSubmitBtnStatus(false, "Please choose the desired areas and click on 'View Counts' in order to proceed.");
    
    $('.eform-dl-preset-count-btn').attr('disabled', true).css("cursor","not-allowed").off();
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_MOTIVATOR_FLAGS + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_OCCUPANT + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_PROP_TYPE + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_MAX_SALE_DATE + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_PURCHASE_PRICE + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_OWNER_AGE + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_LTV + '_value').val(null);
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_PREMIUM + '_value').val(null).trigger('change');
}

function resetPackages() {
    $('input[name="pre-packages"]').each(function() {
        $(this).attr('data-count', 0);
        $(this).closest('.pp-package').find('.pp-leads-count').text('');
        $(this).closest('.pp-package').find('.pp-error').hide();
        $(this).closest('.pp-package').find('.pp-loading').hide();
    });
}

function updatePackagesSuccess(groupRef, packages) {
    $('input[name="pre-packages"]').each(function() {
        if (parseInt($(this).attr('data-group')) == groupRef) {
            var flags = $(this).attr('data-flags');   
            var count = countPackage(flags.split(','), packages);
            $(this).attr('data-count', count);
            $(this).attr('data-request-id', null);
            $(this).closest('.pp-package').find('.pp-leads-count').text('(' + count.toLocaleString('en-US') + ' leads)');
            $(this).closest('.pp-package').find('.pp-error').hide();
            $(this).closest('.pp-package').find('.pp-loading').hide();

            if (count > 0) {
                $(this).closest('.pp-package').show();
            }
        }
    });
}

function updatePackagesFailure(groupRef, requestId) {
    $('input[name="pre-packages"]').each(function() {
        if (parseInt($(this).attr('data-group')) == groupRef) {
            $(this).attr('data-count', 0);
            $(this).attr('data-request-id', requestId);
            $(this).closest('.pp-package').find('.pp-leads-count').text('');
            $(this).closest('.pp-package').find('.pp-error-message').text(requestId? 'Timed out' : 'Failed');
            $(this).closest('.pp-package').find('.pp-error').show();
            $(this).closest('.pp-package').find('.pp-loading').hide();
        }
    });
}

function updateSelectedPackage() {
    var selectedPackageRB = $('input[name="pre-packages"]:checked');
    if(selectedPackageRB.length != 0) {
        selectPackage(selectedPackageRB, false);
    }
}

function selectPackage(packageRB, scrollOnSuccess) {  
    var motivators = packageRB.attr('data-motivator');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_MOTIVATOR_FLAGS + '_value').val(motivators);
    
    var occupants = packageRB.attr('data-occupant');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_OCCUPANT + '_value').val(occupants);
    
    var propTypes = packageRB.attr('data-prop-type');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_PROP_TYPE + '_value').val(propTypes);

    var maxSaleDate = packageRB.attr('data-max-sale');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_MAX_SALE_DATE + '_value').val(maxSaleDate);
    
    var purchasePrice = packageRB.attr('data-purchase-price');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_PURCHASE_PRICE + '_value').val(purchasePrice);
    
    var ownerAge = packageRB.attr('data-owner-age');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_OWNER_AGE + '_value').val(ownerAge);

    var ltv = packageRB.attr('data-ltv');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_LTV + '_value').val(ltv);

    var premiumFlags = packageRB.attr('data-premium-filters');
    $('#ipt_fsqm_form_' + PP_FORM_ID + '_pinfo_' + PP_FIELD_ID_PREMIUM + '_value').val(premiumFlags).trigger('change');

    var count = parseInt(packageRB.attr('data-count'));
    var sliderBox = $('#ipt_fsqm_form_' + PP_FORM_ID + '_mcq_' + PP_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider');
    var sliderMaxLabel = $('#ipt_fsqm_form_' + PP_FORM_ID + '_mcq_' + PP_FIELD_ID_LEADS_COUNT_SLIDER + ' .ui-slider-label:last');
    
    updatePrepackagingCountDisplay(count);
    
    if (count > 0) {
        if (count < MIN_LEADS) {
            updateSlider(sliderBox, sliderMaxLabel, DEFAULT_LEADS, MAX_LEADS);
        } else if (count > MAX_LEADS) {
            updateSlider(sliderBox, sliderMaxLabel, MAX_LEADS, MAX_LEADS);
        } else {
            updateSlider(sliderBox, sliderMaxLabel, count, count);
        }
    } else {
        updateSlider(sliderBox, sliderMaxLabel, DEFAULT_LEADS, MAX_LEADS);
    }

    if (count < MIN_LEADS) {
        updatePrepackagingFormSubmitBtnStatus(false, 'Minimum order size is ' + MIN_LEADS + ' records. Please expand your geography.');
        showMinLeadsErrorMessage(count, MIN_LEADS);
        scrollToElement($("#validation-msgs"));
    } else {
        updatePrepackagingFormSubmitBtnStatus(true, null);
        if (scrollOnSuccess) scrollToElement($(".dataList-right"));
    }

    $('.eform-dl-preset-count-btn').each(function() {
        if (count >= parseInt($(this).attr('data-count'))) {
            $(this).attr('disabled', false).css("cursor","pointer");
            $(this).on('click', function () {
                updateSlider(sliderBox, sliderMaxLabel, $(this).attr('data-count'), count);
                return false;
            });
        } else {
            $(this).attr('disabled', true).css("cursor","not-allowed");
            $(this).off().on('click', function () {
                return false;
            });
        }
    });
}

function countPackage(tokens, packages) {
    var count = 0;
    for (var i=0; i < packages.length; i++) {
        var match = false;
        for (var j=0; j < tokens.length; j++) {
            if (packages[i].flags.indexOf(tokens[j]) !== -1) {
                match = true;
                break;
            }
        }
        if (match) {
            count += packages[i].count;
        }
    }
    return count;
}

function formatLocation (location) {
    if (!location.id) {
        return location.text;
    }
    var $location = $('<div class="location-container"><span class="location-text">' + location.text + '</span> <span class = "location-type">' + locationLabel(location.type) + '</span></div>');
    return $location;
};
  
function locationLabel(key) {
    if (key == 'CITY') {
        return 'CITY';
    } else if (key == 'COUNTY') {
        return 'COUNTY';
    } else if (key == 'ZIP_CODE') {
        return 'ZIP CODE';
    }
    return '';
}

function getUrlParameter(key) {
    var url = window.location.search.substring(1);
    var parts = url.split('&');
    
    var values = [];
    for (var i = 0; i < parts.length; i++) {
        var param = parts[i].split('=');
        if (param[0] === key) {
            if (param[1]) {
                values.push(decodeURIComponent(param[1]).replace(/\+/g, ' '));
            }
        }
    }
    return values;
}

function locationValfromKey(key) {
    var parts = key.split('|');
    if (parts.length < 2) {
        return null;
    }

    var type = parts[0].toUpperCase();
    if (type == 'CITY' || type == 'COUNTY') {
        return parts[2].toUpperCase() + ', ' + parts[1].toUpperCase();
    } else if (type == 'ZIP_CODE') {
        return parts[1].toUpperCase();
    } else {
        return null;
    }
}

function getLocationType(key) {
    var parts = key.split('|');
    if (parts.length < 2) {
        return null;
    }
    return parts[0].toUpperCase();
}

function bgGrey(element) {
    element.css('background-color', '#F4F4F4');
}

function bgClear(element) {
    element.css('background-color', '');
}

function removeLocationPreview(){
    var key = $(this).parent().attr('data-key');
    $("#locations option[value='" + key + "']").remove();
    $(this).parent().remove()
}

function toggleLoadingOverlay(visible) {
    if (visible) {
        $('.dl-loading-overlay').show();
    } else {
        $('.dl-loading-overlay').hide();
    }
}

function togglePackagesLoadingImages(visible) {
    if (visible) {
        $('.pp-loading').css('display', 'inline');
    } else {
        $('.pp-loading').css('display', 'none');
    }
}

function updateStackedFormSubmitBtnStatus(enabled, msg) {
    var btn = $('#ipt_fsqm_form_' + DL_FORM_ID + '_design_' + DL_FIELD_ID_BTNS + ' a[href="#dl-submit"]');
    if (enabled) {
        btn.css('cursor', 'pointer').attr('title', '');
        btn.attr('disabled', false);
    } else {
        btn.css('cursor','not-allowed').attr('title', msg);
        btn.attr('disabled', true);
    }
}

function updatePrepackagingFormSubmitBtnStatus(enabled, msg) {
    var btn = $('#ipt_fsqm_form_' + PP_FORM_ID + '_design_' + PP_FIELD_ID_BTNS + ' a[href="#pp-submit"]');
    if (enabled) {
        btn.css('cursor', 'pointer').attr('title', '');
        btn.attr('disabled', false);
    } else {
        btn.css('cursor','not-allowed').attr('title', msg);
        btn.attr('disabled', true);
    }
}

function scrollToElement(element) {
    $("body,html").animate({scrollTop: element.offset().top - 70}, 800);
}

function showAvailableCountExceededErr() {
    $('#available-count-exceeded-err').show();
    scrollToElement($("#validation-msgs"));
}

function showRequiredLocationErr() {
    $('#required-location-err').show();
    scrollToElement($("#validation-msgs"));
}

function showRequiredForeclosureDatesErr() {
    $('#required-foreclosure-dates-err').show();
    scrollToElement($("#validation-msgs"));
}

function showGeneralErr(prefix) {
    $('#general-err').show();
    scrollToElement($("#validation-msgs"));
}

function showMinLeadsErrorMessage(available, minimum) {
    $('#msg-available-leads').text(available);
    $('#msg-minimum-leads').text(minimum);
    $('#few-count-err').show();
    scrollToElement($("#validation-msgs"));
}

function hideValidationMessages() {
    $('#validation-msgs div').hide();
}

function updateStackedCountDisplay(count) {
    if (count == null) {
        $('#available-leads').text('0');
        $('#refresh-leads-msg').show();
        $('#available-leads-label').hide();
    } else {
        $('#available-leads').text(count.toLocaleString('en-US'));
        $('#refresh-leads-msg').hide();
        $('#available-leads-label').show();
    }
}

function updateSlider(slider, maxLabel, val, max) {
    if (val == null) {
        slider.slider('option', {max: max});
    } else {
        slider.slider('option', {value: val, max: max});
        slider.prev('input').val(val).trigger('change');
    }
    maxLabel.text(max.toLocaleString('en-US'));
}

function updatePrepackagingCountDisplay(count) {
    if (count == null) {
        $('#pp-available-leads').text('0');
        $('#pp-choose-package-msg').show();
        $('#pp-available-leads-label').hide();
    } else {
        $('#pp-available-leads').text(count.toLocaleString('en-US'));
        $('#pp-choose-package-msg').hide();
        $('#pp-available-leads-label').show();
    }
}

function isValidRange(from, to) {
    if (from && to) {
        return parseInt(from) <= parseInt(to);
    }
    return true;
}

function isValidNumericRange(from, to) {
    if (from && to) {
        return parseInt(from) <= parseInt(to);
    }
    return true;
}

function isValidDateRange(from, to) {
    if (from && to) {
        return new Date(from).getTime() <= new Date(to).getTime();
    }
    return true;
}

function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return email == null || email.length == 0 || regex.test(email);
}

function validateNumericRangeAndSet(from, to, val, validationMessage, hiddenField) {
    if (isValidNumericRange(from, to)) {
        validationMessage.hide();
        hiddenField.val(val);
    } else {
        validationMessage.show();
        hiddenField.val('');
    }
}

function validateDateRangeAndSet(from, to, validationMessage, fromHiddenField, toHiddenField) {
    if (isValidDateRange(from, to)) {
        validationMessage.hide();
        fromHiddenField.val(from).trigger('change');
        toHiddenField.val(to).trigger('change');
    } else {
        validationMessage.html('Invalid range');
        validationMessage.show();
        fromHiddenField.val('').trigger('change');
        toHiddenField.val('').trigger('change');
    }
}

function updateCountSuppressionFields(requestId) {
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_REQUEST_ID + '_value').val(requestId);
    $('#ipt_fsqm_form_' + DL_FORM_ID + '_pinfo_' + DL_FIELD_ID_SUPPRESSION_IDS + '_value').val($('#do-count-suppressions').html());
}