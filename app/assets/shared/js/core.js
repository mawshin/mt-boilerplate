// --- core.js v0.006 --- //
// --- CORE JS --- //

// --- DEFAULT VARIABLES --- //
var tapCount = 0;
var threshold = 400;
var startTime = 0;
var endTime = 0;
var timer = 0;

// --- SETUP LOCAL VS IPAD CLICK TYPES --- //
var isiPad = navigator.userAgent.match(/iPad/i) !== null;
var myevent = 'click';
var myevent2 = 'click';
var myextension = '.html';
if (isiPad) myevent = 'touchstart';
if (isiPad) myevent2 = 'touchend';
if (isiPad) myextension = '.zip';

// --- SET NAVIGATION VARIABLES --- //
var currentpage = getCurrentPage();
if (veevaSwipe === '0'){
	if(pagesAll.indexOf(getCurrentPage()) != -1) {
		var mtgsk_Left = getPreviousPage();
		var mtgsk_Right = getNextPage();
		var page_references = getReferencesForPage();
		window.sessionStorage.setItem('previouspage', currentpage);
		window.sessionStorage.setItem('previouspres', presentation);
		window.sessionStorage.setItem('page_references', JSON.stringify(page_references));
	}
} else if (isiPad) {
	var mtgsk_Left = false;
	var mtgsk_Right = false;
}

// --- STOP RUBBER BANDING ON LANDSCAPE PAGES --- //
if (mtgskPortrait === '0'){
	document.addEventListener(
	'touchmove',
	function(e) {
	e.preventDefault();
	},
	false
	);
} 

$( document ).ready(function() {

	// --- DOUBLE TAP NAVIGATION --- //
	$("#doubleClickLeft").bind(myevent2, function() {
		veevaCall = "prev";
		tap($(this).attr('rel'),$(this).attr('relpres'));
	});
	$("#doubleClickRight").bind(myevent2, function() {
		veevaCall = "next";
		tap($(this).attr('rel'),$(this).attr('relpres'));
	});	
	
	$("#clickLeft").bind(myevent2, function() {
		veevaCall = "prev";
		updatePage();
	});
	$("#clickRight").bind(myevent2, function() {
		veevaCall = "next";
		updatePage();
	});	

	// --- SETUP NAVIGATION --- //	
	navSwipes(); 
	navDisable(); 
		
	// --- GSK NAVIGATION LINKS --- //
	$('#logo,#footerLogo,#home').bind(myevent, function() {
		navHome();
	});
	$('#menu').bind(myevent, function() {
		navMenu();
	});
	$('#references').bind(myevent, function() {
		navReferences();
	});
	$('#pi').bind(myevent, function() {
		navPi();
	});
	$('#mtgskClose').bind(myevent, function() {
		mtgskClose();
	});
		
	// --- PORTRAIT VIEW SIZING --- //	
	if (mtgskPortrait === "1") {
		resizePortrait();
	}	
	
	// --- CUSTOM ANIMATIONS ON OR OFF --- //	
	if (window.sessionStorage.getItem('mtgskAnimations') === null) {
		window.sessionStorage.setItem('mtgskAnimations', mtgskAnimations);
	}
		
	// --- GSK REFERENCES --- //
	if (page_references !== null) {
		mtgskReferences('page');
		$('#referencesAll').bind(myevent, function() {
			mtgskReferences('all');
		});
		$('#referencesPage').bind(myevent, function() {
			mtgskReferences('page');
		});
	}
	
	// --- GOTO LINKS --- //
	$('.gotoSlide').bind(myevent2, function() {
		mtgskGoToSlide($(this).attr('rel'),$(this).attr('relpres'));
	});
	
});