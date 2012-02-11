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
// 

// Manage the My Apps page

$('#page-home').live('pageinit', function(event){

    $('#page-home').live("swipeleft", function () {
        $.mobile.changePage($("#page-guest"), {transition: 'slide', changeHash: false});
    });
   
    $('a.projects').live('click', function() {
        var proj_name = $(this).text();
        var useWeinre = ($('a#weinre_btn_' + proj_name).find('.ui-icon-weinre').css('background-image').indexOf('grey') > 0) ? false : true;
        var link = serverUrl + (useWeinre ? "/runWeinre/" : "/runProject/") + proj_name;
        console.log("AppLaudLog: run project : " + link);
        navigator.app.loadUrl(link + "/assets/www/index.html");
        return false;
    });
        
    var saveLocalProjectList = function (list) {
        localStorage.applaud_project_list = JSON.stringify(list);               
    };

    var buildProjectList = function(list) {        
        var i;
        for(i = 0 ; i < list.length; i++) {
            $('<li class="project_item"><a href="#" class="projects"><h3>' 
                    + list[i].project
                    + '</h3></a><a href="#" id="weinre_btn_'
                    + list[i].project.replace(' ','') + '"></a></li>').appendTo('ul#project_list');            
            $('a#weinre_btn_' + list[i].project.replace(' ','')).toggle(function() {        
                $(this).find('.ui-icon-weinre').css('background-image', 'url(images/weinreblue18x18.png)');                
              }, function() {
                  $(this).find('.ui-icon-weinre').css('background-image', 'url(images/weinregrey18x18.png)');
              });
        }
        $('span#my_project_cnt').html(i + " Project" + ((i>1)? "s" : ""));
        $('div#project_list_container').removeClass('hidden');
        $('div#project_list_container').trigger('expand');
        $("ul#project_list").listview('refresh');
    };

    $('div#project_list_container').live('expand',function(){
        $('span#project_hint').html("Tap to Run; Toggle Weinre");
    });
    $('div#project_list_container').live('collapse',function(){
        $('span#project_hint').html("Expand to See Projects");
    });
    
    $('a#get_project_list').live('click', function() {
        var showedError = false;
        console.log("AppLaudLog: get_project_list click");
        $.ajax({ url : serverUrl + "/getProjects", data : {}, cache : false, 
            beforeSend : function(jqXHR, settings) {
                    fadingMsg('Getting Project List..');
                    $('ul#project_list').empty();
            },            
            success : function(r, textStatus) {
                if (r.success) {
                    // Always means list has at least 1 item
                    buildProjectList(r.list);
                    saveLocalProjectList(r.list);
                } else {
                    $('div#project_list_container').addClass('hidden');
                    saveLocalProjectList({});
                    if (r.error === 'Authentication failed. Please re-login.') {
                        navigator.notification.confirm(
                            r.error, 
                            onLogin,  
                            'Project List Refresh',
                            'Login,Close' 
                        );
                    } else {
                        navigator.notification.alert(
                            r.error + " Create a project with New->Project in AppLaud Cloud.",
                            null, 
                            'Project List Refresh',           
                            'Close'                  
                        );
                    }
                }
            }, 
            error : function(jqXHR, textStatus, errorThrown) {
                $('div#project_list_container').addClass('hidden');
                saveLocalProjectList({});
                if (!showedError) {
                    var errormsg;
                    showedError = true;
                    if (errorThrown === '') {
                        errormsg = 'Check network connection.';
                    } else {
                        errormsg = errorThrown;
                    }
                    navigator.notification.alert(
                            'Error: ' + errormsg,
                            null, 
                            'Project List Refresh', 
                            'Close' 
                          );
                    console.log('AppLaudLog: Get Projects returned with Error: ' + errormsg);
                    // no connection: error / blank                    
                }
            },
            complete : function(jqXHR, textStatus) {
                $('#fading_msg').remove();
                if ((!showedError) && textStatus === 'error') {
                    console.log('AppLaudLog: Get Projects completed with Error.');
                }
            }
        });
    });
    
    var apkUser, apkSession, apkMap;

    var buildApkList = function(apkList) {
        var i;
        apkMap = {};
        for(i = 0 ; i < apkList.length; i++) {
            var appName = apkList[i].appName;
            var fullPath = apkList[i].link;
            var buildType = 
                fullPath.indexOf('-basic.apk') > 0 ? '[basic]' : fullPath.indexOf('-weinre.apk') > 0 ? '[weinre]' : '[release]';            
            var id = appName + buildType;
            apkMap[id] = fullPath;
            $('<li class="apk_item" data-icon="false"><a href="#" class="apks" id="' + id + '"><h3>' 
                    + appName + '<span class="grey"> ' + buildType 
                    + '</span></h3></a></li>').appendTo('ul#apk_list');
        }       
        $('span#my_apk_cnt').html(i + " APK" + ((i>1)? "s" : ""));
        $('div#apk_list_container').removeClass('hidden');
        $('div#apk_list_container').trigger('expand');
        $("ul#apk_list").listview('refresh');
    };    
    
    $('a.apks').live('click', function() {
        var id = $(this).attr('id');
        window.plugins.childBrowser.openExternal(serverUrl + '/downloadApk' + '?file=' + apkMap[id] + '&user=' + apkUser + '&session=' + apkSession);
    });
 
    $('div#apk_list_container').live('expand',function(){
        $('#apk_hint').html("Tap to Download &#40;Install, Run&#41;");
    });
    $('div#apk_list_container').live('collapse',function(){
        $('#apk_hint').html("Expand to See APKs");
    });

    $('a#get_apk_list').click(function() {
        var showedError = false;
        console.log("AppLaudLog: get_apk_list");
        $.ajax({ url : serverUrl + "/getApks", data : {}, cache : false, 
            beforeSend : function(jqXHR, settings) {
                fadingMsg('Getting APK List..');
                $('ul#apk_list').empty();
            },
            success : function(r, textStatus) {
                if (r.success) {
                    // Always means list has at least 1 item
                    buildApkList(r.list);
                    apkUser = r.user;
                    apkSession = r.session;
                } else {
                    $('div#apk_list_container').addClass('hidden');
                    if (r.error === 'Authentication failed. Please re-login.') {
                        navigator.notification.confirm(
                                r.error, 
                                onLogin,  
                                'APK List Refresh',
                                'Login,Close' 
                        );
                    } else {
                        navigator.notification.alert(
                                'No APKs found. To build a project run Package->Build in AppLaud Cloud.',  
                                null,         
                                'APK List Refresh',          
                                'Close'       
                        );
                    }
                }
            }, 
            error : function(jqXHR, textStatus, errorThrown) {
                $('div#apk_list_container').addClass('hidden');
                if (!showedError) {
                    var errormsg;
                    if (errorThrown === '') { errormsg = 'Check network connection.'; }
                    else { errormsg =  errorThrown; }
                    alert('Get Apks Request returned with Error: ' + errormsg);
                    console.log('AppLaudLog: Get Apks returned with Error: ' + errormsg);
                    // no connection: error / blank                    
                    showedError = true;
                }
            },
            complete : function(jqXHR, textStatus) {
                $('#fading_msg').remove();
                if ((!showedError) && textStatus === 'error') {
                    console.log('AppLaudLog: Get Apks completed with Error.');
                }
            }
        });
    });
});