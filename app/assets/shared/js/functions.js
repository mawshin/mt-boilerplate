// --- functions.js v0.024 --- //
// --- CORE FUNCTIONS --- //
for (var key in config) {
    window[key] = config[key];
}

// --- NAVIGATION FLOW --- //
function getCurrentPage()
{
	var parser = document.createElement('a');
	parser.href = window.location.href.replace("/index.html", "");
	return new String(parser.pathname).substring(parser.pathname.lastIndexOf('/') + 1);
}

function getPreviousPage()
	{
		if(pagesAll.indexOf(getCurrentPage()) === 0) {
			return pagesAll[pagesAll.indexOf(getCurrentPage())];
		} else {	
			return pagesAll[pagesAll.indexOf(getCurrentPage())-1];
		}
	}
	
function getNextPage()
{
	if(pagesAll.indexOf(getCurrentPage())+1 === pagesAll.length) {
		return pagesAll[pagesAll.indexOf(getCurrentPage())];
	} else {
		return pagesAll[pagesAll.indexOf(getCurrentPage())+1];
	}
}

function getReferencesForPage()
{
	return pageReferencesAll[pagesAll.indexOf(getCurrentPage())];
}
// --- END NAVIGATION FLOW --- //

// --- DOUBLE TAP NAVIGATION --- //
function updatePage(navPopupPage,navPopupPres) {
	if(navPopupPage && navPopupPres) {
		if(!isiPad) {
			  document.location.href = '../../'+navPopupPres+'/'+navPopupPage+'/index'+myextension;
		} else if(isiPad) {
			  document.location.href = "veeva:gotoSlide("+navPopupPage+myextension+","+navPopupPres+")";
		}
	} else if (navPopupPage && !navPopupPres) {
		mtgsk_Left = navPopupPage;
		mtgsk_Right = navPopupPage;
	}
	if(!isiPad && mtgsk_Left && mtgsk_Right) {
		 if (veevaCall==='prev'){  
			  document.location.href = '../'+mtgsk_Left+'/index'+myextension;
		  } else if (veevaCall==='next'){
			  document.location.href = '../'+mtgsk_Right+'/index'+myextension;
		  }
	} else if(isiPad && mtgsk_Left && mtgsk_Right) {
		swipeLeftURL = (mtgsk_Left === currentpage) ? 'xxx' : "veeva:gotoSlide("+mtgsk_Left+myextension+")";
		swipeRightURL = (mtgsk_Right === currentpage) ? 'xxx' : "veeva:gotoSlide("+mtgsk_Right+myextension+")";
		if (veevaCall === "prev"){
			document.location.href = swipeLeftURL;
	    } else if (veevaCall === "next"){
			document.location.href = swipeRightURL;	
		}
	} else if(isiPad && !mtgsk_Left && !mtgsk_Right) {
		if (veevaCall==='prev') { com.veeva.clm.prevSlide();}
		if (veevaCall==='next') { com.veeva.clm.nextSlide();}
	}
}

function tap(navPopupPage,navPopupPres) {
	if (tapCount > 1) {
		tapCount = 0;
	}
	if (tapCount === 0) {
		startTime = new Date().getTime();
	}
	if (tapCount === 1) {
		endTime = new Date().getTime();
	}
	if (tapCount === 1 && endTime - startTime <= threshold) {
		updatePage(navPopupPage,navPopupPres);
	}
	tapCount++;
	clearTimeout(timer);
	timer = setTimeout(function() {// reset count on idle
		tapCount = 0;
	}, threshold);
}
// --- END DOUBLE TAP NAVIGATION --- //

// --- GSK MENU NAVIGATION --- //
function navHome() {
	if((!isiPad && homepage) && (homepage !== currentpage)) {
		document.location.href = '../../'+presentation+'/'+homepage+'/index'+myextension;
	} else if((isiPad && homepage) && (homepage !== currentpage)) {
		document.location.href = "veeva:gotoSlide("+homepage+myextension+","+presentation+")";
	}
}

function navMenu() {
	if(!$("#menu").hasClass("activeNav")) {
		if(!isiPad) {
			document.location.href = '../../'+menuPresentation+'/'+menu+'/index'+myextension;
		} else {
			document.location.href ="veeva:gotoSlide("+menu+myextension+", "+menuPresentation+")";
		}
	}
}

function navReferences() {
	if(!$("#references").hasClass("activeNav")) {
		if(!isiPad) {
			document.location.href = '../../'+referencesPresentation+'/'+references+'/index'+myextension;
		} else {
			document.location.href ="veeva:gotoSlide("+references+myextension+", "+referencesPresentation+")";
		}
	}
}

function navPi() {
	if(!$("#pi").hasClass("activeNav")) {
		if(!isiPad) {
			document.location.href = '../../'+piPresentation+'/'+pi+'/index'+myextension;
		} else {
			document.location.href ="veeva:gotoSlide("+pi+myextension+", "+piPresentation+")";
		}
	}	
}

function navDisable() {
	if (menu === ''){
		$('#menu').css('display', 'none');
	} else if (menu === currentpage) {
		$("#menu").addClass("activeNav");
	}
	if (references === '' || referencesAll === '') {
		$('#references').css('display', 'none');
	} else if (references === currentpage) {
		$("#references").addClass("activeNav");
	}
	if (pi === ''){
		$('#pi').css('display', 'none');
	} else if (pi === currentpage) {
		$("#pi").addClass("activeNav");
	}
	if (homepage === ''){
		$('#home').css('display', 'none');
	} else if (homepage === currentpage) {
		$("#home").addClass("activeNav");
	}
		
}	
// --- END GSK MENU NAVIGATION --- //

// --- GSK NAVIGATION GOTOSLIDE --- //
function mtgskGoToSlide(navPopupPage,navPopupPres) {
	if(!isiPad && navPopupPres) {
		document.location.href = '../../'+navPopupPres+'/'+navPopupPage+'/index'+myextension;
	} else if(!isiPad && !navPopupPres) {
		document.location.href = '../'+navPopupPage+'/index'+myextension;
	} else if(isiPad && navPopupPres) {
		document.location.href ="veeva:gotoSlide("+navPopupPage+myextension+", "+navPopupPres+")";
	} else if(isiPad && !navPopupPres) {
		document.location.href ="veeva:gotoSlide("+navPopupPage+myextension+")";
	}
}
// --- END GSK NAVIGATION GOTOSLIDE --- //

// --- SWIPE NAVIGATION --- //
function navSwipes() {
	if(!isiPad && !mtgsk_Left && !mtgsk_Right) {
	} else if(!isiPad && mtgsk_Left && mtgsk_Right) {
		$("#container").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			  if (direction === 'right'){
				  document.location.href = '../'+mtgsk_Left+'/index'+myextension;
			  } else if (direction === 'left'){
				  document.location.href = '../'+mtgsk_Right+'/index'+myextension;
			  } 
			},
			threshold:100
		});
	} else if(isiPad && !mtgsk_Left && !mtgsk_Right) {
		$("#container").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			  if (direction === 'right') {
				  com.veeva.clm.prevSlide();
			  } else if (direction === 'left') {
				  com.veeva.clm.nextSlide();
			  } 
			},
			threshold:100,
			allowPageScroll: "vertical"
		});
	} else {
		$("#container").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			  swipeLeftURL = (mtgsk_Left === currentpage) ? 'xxx' : "veeva:gotoSlide("+mtgsk_Left+myextension+")";
			  swipeRightURL = (mtgsk_Right === currentpage) ? 'xxx' : "veeva:gotoSlide("+mtgsk_Right+myextension+")";
			  if (direction === 'right') {
				  document.location.href = swipeLeftURL;
			  } else if (direction === 'left') {
				  document.location.href = swipeRightURL;
			  }
			},
			threshold:100,
			allowPageScroll: "vertical"
		});
	}
}
// --- END SWIPE NAVIGATION --- //

// --- CUSTOM SWIPE  --- //
function navCustomSwipe(mtgsk_Left,mtgsk_CustomLeftPres,mtgsk_Right,mtgsk_CustomRightPres,mtgsk_Up,mtgsk_CustomUpPres,mtgsk_Down,mtgsk_CustomDownPres) {
	if(!isiPad) {
		$("#containerCustomSwipe").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			  if (direction === 'right' && (mtgsk_Left != '') && (mtgsk_CustomLeftPres == '')){
				  document.location.href = '../'+mtgsk_Left+'/index'+myextension;
			  } else if (direction === 'right' && (mtgsk_Left != '') && (mtgsk_CustomLeftPres != '')){
				  document.location.href = '../../'+mtgsk_CustomLeftPres+'/'+mtgsk_Left+'/index'+myextension;
			  } else if (direction === 'left' && (mtgsk_Right != '') && (mtgsk_CustomRightPres == '')){
				  document.location.href = '../'+mtgsk_Right+'/index'+myextension;
			  } else if (direction === 'left' && (mtgsk_Right != '') && (mtgsk_CustomRightPres != '')){
				  document.location.href = '../../'+mtgsk_CustomRightPres+'/'+mtgsk_Right+'/index'+myextension;
			  } else if (direction === 'up' && (mtgsk_Up != '') && (mtgsk_CustomUpPres == '')){
				  document.location.href = '../'+mtgsk_Up+'/index'+myextension;
			  } else if (direction === 'up' && (mtgsk_Up != '') && (mtgsk_CustomUpPres != '')){
				  document.location.href = '../../'+mtgsk_CustomUpPres+'/'+mtgsk_Up+'/index'+myextension;
			  } else if (direction === 'down' && (mtgsk_Down != '') && (mtgsk_CustomDownPres == '')){
				  document.location.href = '../'+mtgsk_Down+'/index'+myextension;
			  } else if (direction === 'down' && (mtgsk_Down != '') && (mtgsk_CustomDownPres != '')){
				  document.location.href = '../../'+mtgsk_CustomDownPres+'/'+mtgsk_Down+'/index'+myextension;
			  }
			  
			},
			threshold:100
		});
	} else {
		$("#containerCustomSwipe").swipe( {
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			  if (direction === 'right' && (mtgsk_Left != '') && (mtgsk_CustomLeftPres == '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Left+myextension+")";
			  } else if (direction === 'right' && (mtgsk_Left != '') && (mtgsk_CustomLeftPres != '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Left+myextension+","+mtgsk_CustomLeftPres+")";
			  } else if (direction === 'left' && (mtgsk_Right != '') && (mtgsk_CustomRightPres == '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Right+myextension+")";
			  } else if (direction === 'left' && (mtgsk_Right != '') && (mtgsk_CustomRightPres != '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Right+myextension+","+mtgsk_CustomRightPres+")";
			  } else if (direction === 'up' && (mtgsk_Up != '') && (mtgsk_CustomUpPres == '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Up+myextension+")";
			  } else if (direction === 'up' && (mtgsk_Up != '') && (mtgsk_CustomUpPres != '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Down+myextension+","+mtgsk_CustomDownPres+")";
			  } else if (direction === 'down' && (mtgsk_Down != '') && (mtgsk_CustomDownPres == '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Down+myextension+")";
			  } else if (direction === 'down' && (mtgsk_Down != '') && (mtgsk_CustomDownPres != '')){
				  document.location.href = "veeva:gotoSlide("+mtgsk_Up+myextension+","+mtgsk_CustomDownPres+")";
			  }
			},
			threshold:100
		});
	}
}

// --- END CUSTOM SWIPE  --- //

// --- SETUP PORTRAIT MODE --- //
function resizePortrait() {
	 $('#bg img').css('width', 'auto');
	 $('#bg img').css('height', '100%');
	 $("#doubleClickCentre").css('display', 'block');
	 
	 $("#doubleClickCentre").doubletap(function() {
		$("#doubleClickCentre").unbind();
		$('.bg').css('overflow-y', 'scroll');
		$('#bg img').css('height', 'auto');
		$('#bg img').css('width', '100%');			
		$("#container").css('z-index', -10);

		$('#bg').doubletap(function() {
			$('#bg').unbind();
			$('.bg').css('overflow-y', 'initial');
			$("#container").css('z-index', 10);
			resizePortrait();
		}, 400);
	}, 400);
}
// --- END SETUP PORTRAIT MODE --- //

// --- DISPLAY REFERENCES --- //
function mtgskReferences(type) {
	if (pageReferencesAll !== "") {
		page_references = JSON.parse(window.sessionStorage.getItem('page_references'));
	}
	if (page_references===null) {
		$('#referenceList').empty();
		for(i=0;i<referencesAll.length;i++) {
			$('#referenceList').append('<li id="referenceActive">'+referencesAll[i]+'</li>');
		}
	} else {
		$('#referenceList').empty();
		for(i=0;i<referencesAll.length;i++) {
			if($.inArray(i + 1, page_references) === -1 && type === 'all') {
				$('#referenceList').append('<li id="referenceActive">'+referencesAll[i]+'</li>');
			} else if($.inArray(i + 1, page_references) === -1) {
				$('#referenceList').append('<li id="referenceInactive">'+referencesAll[i]+'</li>');
			} else {				
				$('#referenceList').append('<li id="referenceActive">'+referencesAll[i]+'</li>');
			}
		}
	}
}

function mtgskClose() {
	previouspage = window.sessionStorage.getItem('previouspage');
	previouspres = window.sessionStorage.getItem('previouspres');
	if(!isiPad) {
		document.location.href = '../../'+previouspres+'/'+previouspage+'/index'+myextension;
	} else {
		document.location.href = "veeva:gotoSlide("+previouspage+myextension+", "+previouspres+")";
	}
}
// --- END DISPLAY REFERENCES --- //

// --- DOUBLE TAP CENTRAL ZOOM --- //
(function($){
    // Determine if we on iPhone or iPad
    var isiOS = false;
    var agent = navigator.userAgent.toLowerCase();
    if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
           isiOS = true;
    }
 
    $.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay){
        var eventName, action;
        delay = delay == null? 500 : delay;
        eventName = isiOS == true? 'touchend' : 'click';
 
        $(this).bind(eventName, function(event){
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */;
            var delta = now - lastTouch;
            clearTimeout(action);
            if(delta<500 && delta>0){
                if(onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function'){
                    onDoubleTapCallback(event);
                }
            }else{
                $(this).data('lastTouch', now);
                action = setTimeout(function(evt){
                    if(onTapCallback != null && typeof onTapCallback == 'function'){
                        onTapCallback(evt);
                    }
                    clearTimeout(action);   // clear the timeout
                }, delay, [event]);
            }
            $(this).data('lastTouch', now);
        });
    };
})(jQuery);
// --- END DOUBLE TAP CENTRAL ZOOM --- //