//    Copyright (C) 2011 by Mobile Developer Solutions http://www.mobiledevelopersolutions.com
//    
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//    
//    The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
//    
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//    THE SOFTWARE.


//var serverUrl = 'http://applaudcloud.com'; // :80';
var serverUrl = 'http://192.168.0.104:8027';

function showMenu() {
    $.mobile.changePage($('#dialog-devmenu'), { role: 'dialog' });
}

function fadingMsg (locMsg) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-c ui-corner-all' id='fading_msg'><h1>" + locMsg + "</h1></div>")
        .css({ "display": "block", "opacity": 0.9, "z-index" : 9999, "top": $(window).scrollTop() + 150 })
        .appendTo( $.mobile.pageContainer )
        .delay( 3400 )
        .fadeOut( 1800, function(){
            $(this).remove();
        });
}

function setUser(user) {
    $('.username').html(' : ' + user); 
}

function go() {
    console.log("AppLaudLog: go"); // and userAgent: " + navigator.userAgent);

    document.addEventListener("menubutton", showMenu, false);
    
    if (typeof window.plugins.childBrowser.onLocationChange !== "function") {
        window.plugins.childBrowser.onLocationChange = function(loc){
            console.log("AppLaudLog: onLocationChange : " + loc);
            
            if (/\/loginresult.html$/.test(loc) ) {
                window.plugins.childBrowser.close();
                console.log('before $.get');

                $.get(serverUrl + "/getConnection", { }, function(r) {
                    if (r.user && r.session && r.user !== 'Guest') {
                        setUser(r.user);
                        $('#guest-user').hide();
                        $('#new-user').addClass('hidden');
                        $('#get_project_list').removeClass('hidden');
                        $('#get_apk_list').removeClass('hidden');
                        $.mobile.changePage($("#page-home"));
                        console.log("AppLaudLog: setting username: " + r.user);
                        localStorage.applaud_username = r.user;
                        localStorage.applaud_session = r.session;
                    } else {   // Probably never get here
                        $('#guest-user').html('<p><h4>Oops!</h4>Network failure during login process.</p>');
                        $('#guest-user').append('<p>Please try again later</p>');
                        $('#guest-user').show();
                        $.mobile.changePage($("#page-home")); 
                    }
                });
           
            } else if (loc.indexOf('/loginresult.html?email') > 0) {
                window.plugins.childBrowser.close();
                $('#guest-user').html('<p><h4>Oops!</h4>You are not registered with AppLaud for that OpenID Provider.</p>');
                $('#guest-user').append('<p>Visit <a href="http://www.applaudcloud.com">http://www.applaudcloud.com</a> from your desktop to register, then use that OpenID provider in this app.</p>');
                $('#guest-user').append('<p>No login is needed to use the Demo Apps page.</p>');
                $('#guest-user').show();
                // Remove saved openid provider from locstore and $('span#useropenid').html();
                $('#project_list_container').addClass('hidden');
                $('#apk_list_container').addClass('hidden');
                $.mobile.changePage($("#page-home"));
//            } else {
                // The other loc changes are part of openid.. or are they?
//                console.log("AppLaudLog: Changed to unknown location.")
//                console.log("AppLaudLog: " + loc);
            }
            $('#fading_msg').remove();
        };
    }
    // see if user has run this app before and has an active session
    var locStoreProvider = localStorage.applaud_openid;
    var locStoreHome = localStorage.applaud_homepage;
    var locStoreUsername = localStorage.applaud_username;
    var locStoreSession = localStorage.applaud_session;
    
    if (locStoreHome) {
        if (locStoreHome === 'page-guest') {
            var myselect = $("select#select-home-page");
            myselect.selectmenu();
            myselect[0].selectedIndex = 1;
            myselect.selectmenu("refresh");
            $.mobile.changePage($('#' + locStoreHome ));
        }
        $('#fading_msg').remove();
    } else {
        localStorage.applaud_homepage = 'page-home';
        $('#fading_msg').remove();
        $('#new-user').removeClass('hidden');
        $('a#get_project_list').addClass('hidden');
        $('a#get_apk_list').addClass('hidden');
    }
     
    if (locStoreUsername && locStoreSession) { 
        $.post(serverUrl + "/setSession", { user : locStoreUsername, session : locStoreSession }, function(r) {
            if (r.loggedOut) {
                delete localStorage.applaud_username;
                delete localStorage.applaud_session;
                $.mobile.changePage($('#page-login'), { changeHash : false });
            } else {
                if (r.newSession) {
                    localStorage.applaud_session = r.newSession;
                }
                setUser(locStoreUsername);
                
                if (locStoreProvider) {
                    //$('#project_list, #apk_list').removeClass('hidden');
                    //$('#project_list').removeClass('hidden');
                    //$('#apk_list').removeClass('hidden');
                    $('span#useropenid').html(locStoreProvider);
                }
            }
        });
    } else {
        delete localStorage.applaud_username;
        delete localStorage.applaud_session;
 //       $.mobile.changePage($('#page-login'), { changeHash : false });
    }

    // Populate the project list from localStorage and expand list
    var length, listLocal = []; 
    listLocal = JSON.parse(localStorage.applaud_project_list);
    length = listLocal.length;
    if (length > 0) {
        var i;
        //console.log("Project list length: " + listLocal.length);
        for (i = 0 ; i < length ; i++) {            
            $('<li class="project_item"><a href="#" class="projects"><h3>' +
                    listLocal[i].project +
                    '</h3></a><a href="#" id="weinre_btn_' +
                    listLocal[i].project.replace(' ','') + '"></a></li>').appendTo('ul#project_list');            
            $('a#weinre_btn_' + listLocal[i].project.replace(' ','')).toggle(function() {        
                $(this).find('.ui-icon-weinre').css('background-image', 'url(images/weinreblue18x18.png)');                
              }, function() {
                  $(this).find('.ui-icon-weinre').css('background-image', 'url(images/weinregrey18x18.png)');
              });
        }
        $('span#my_project_cnt').html(i + " Project" + ((i>1)? "s" : ""));
        $('div#project_list_container').removeClass('hidden');
        $('div#project_list_container').trigger('expand');
        $("ul#project_list").listview('refresh');
    } else {
        $('div#project_list_container').addClass('hidden');
    }
    
    if (device.name === "GT-P7510") {
            var getScreenHeightx = function() {
                var orientation     = $.event.special.orientationchange.orientation(),
                    port            = orientation === "landscape", // "portrait",
                    winMin          = port ? 480 : 320,
                    screenHeight    = port ? screen.availHeight : screen.availWidth,
                    winHeight       = Math.max( winMin, $( window ).height() ),
                    pageMin         = Math.min( screenHeight, winHeight );
                    //console.log("*** orientation: " + orientation + " *** pageMin: " + 
                    //pageMin + " *** screen.availHeight: " + screen.availHeight + " port: " + port);
                return pageMin;
            };
            var resetActivePageHeightx = function(){
                // Don't apply this height in touch overflow enabled mode
                if( $.support.touchOverflow && $.mobile.touchOverflowEnabled ){
                    return;
                }
                $( "." + $.mobile.activePageClass ).css( "min-height", getScreenHeightx() );
            };
            //set page min-heights to be device specific
            $( document ).bind( "pageshow", resetActivePageHeightx );
            $( window ).bind( "throttledresize", resetActivePageHeightx );
    } 
}


function init() {
    document.addEventListener("deviceready", go, true);
}
