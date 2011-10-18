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

// Manage the Demos page

$('#page-guest').live('pageinit', function(event){
    
    $('.demoprojects').live('click', function() {
        var proj_name = $(this).text();
        var link = serverUrl + "/runDemoProject/" + proj_name;
        console.log("AppLaudLog: run demo project : " + link);
        navigator.app.loadUrl(link + "/assets/www/index.html");
        return false;
    });
    
    var buildDemoList = function(list) {
        var i;
        for(i = 0 ; i < list.length; i++) {
            $('<li class="demo_project_item" data-icon="false"><a href="#" class="demoprojects"><h3>' 
                    + list[i].project
                    + '</h3></a></li>').appendTo('ul#demo_project_list');
        }
    };

    var getDemoProjects = function() {
        var showedError = false;
        console.log("AppLaudLog: get_demo_list click");
        $.ajax({ url : serverUrl + "/getDemoProjects", data : {}, cache : false, 
            beforeSend : function(jqXHR, settings) {
                    fadingMsg('Getting Demo Project List..');
            },            
            success : function(r, textStatus) {
                $('li.demo_project_item').remove();
                if (r.success) {
                    $('#li-placeholder3').css('display', 'none');
                    buildDemoList(r.list);
                } else {
                    $('#li-placeholder3').css('display', 'block');
                        navigator.notification.alert(
                            r.error,
                            null, 
                            'Demo Project List Refresh',           
                            'Close'                  
                        );
                }
            }, 
            error : function(jqXHR, textStatus, errorThrown) {
                if (!showedError) {
                    var errormsg;
                    showedError = true;
                    if (errorThrown === '') errormsg = 'Check network connection.';
                    else errormsg = errorThrown;
                    navigator.notification.alert(
                            'Error: ' + errormsg,
                            null, 
                            'Demo Project List Refresh', 
                            'Close' 
                          );
                    console.log('AppLaudLog: Get Demo Projects returned with Error: ' + errormsg);
                    // no connection: error / blank                    
                }
            },
            complete : function(jqXHR, textStatus) {
                $('#fading_msg').remove();
                $("ul#demo_project_list").listview('refresh');
                if ((!showedError) && textStatus === 'error') {
                    console.log('AppLaudLog: Get Demo Projects completed with Error.');
                }
            }
        });

        var apkMap;
        var buildDemoApkList = function(apkList) {
            var i;
            apkMap = {};
            for(i = 0 ; i < apkList.length; i++) {
                var appName = apkList[i].appName;
                var fullPath = apkList[i].link;
                var buildType = 
                    fullPath.indexOf('-basic.apk') > 0 ? '[basic]' : fullPath.indexOf('-weinre.apk') > 0 ? '[weinre]' : '[release]';            
                var id = appName + buildType;
                apkMap[id] = fullPath;
                $('<li class="demo_apk_item" data-icon="false"><a href="#" class="demoapks" id="' + id + '"><h3>' 
                        + appName + '<span class="grey"> ' + buildType 
                        + '</span></h3></a></li>').appendTo('ul#demo_apk_list');
            }       
        };    
        
        $('.demoapks').live('click', function() {
            var id = $(this).attr('id');
            window.open(serverUrl + '/downloadDemoApk' + '?file=' + apkMap[id]);
        });

        var showedApkError = false;
        console.log("AppLaudLog: get_demo_apk_list");
        $.ajax({ url : serverUrl + "/getDemoApks", data : {}, cache : false, 
            beforeSend : function(jqXHR, settings) {
                fadingMsg('Getting Demo APK List..');
            },
            success : function(r, textStatus) {
                $('li.demo_apk_item').remove();
                if (r.success) {
                    $('#li-placeholder4').css('display', 'none');
                    buildDemoApkList(r.list);
                    apkUser = r.user;
                    apkSession = r.session;
                } else {
                    $('#li-placeholder4').css('display', 'block');
                    // r.error,  // message
                    navigator.notification.alert(
                            'No Demo APKs found.',
                            null,
                            'Demo APK List Refresh',
                            'Close'
                          );
               }
            }, 
            error : function(jqXHR, textStatus, errorThrown) {
                if (!showedApkError) {
                    var errormsg;
                    if (errorThrown === '') errormsg = 'Check network connection.';
                    else errormsg = errorThrown;
                    navigator.notification.alert(
                            'Error: ' + errormsg,
                            null,
                            'Demo APK List Refresh',
                            'Close'
                          );
                    console.log('AppLaudLog: Get Demo APKs returned with Error: ' + errormsg);
                    // no connection: error / blank                    
                    showedApkError = true;
                }
            },
            complete : function(jqXHR, textStatus) {
                $('#fading_msg').remove();
                $("ul#demo_apk_list").listview('refresh');
                if ((!showedApkError) && textStatus === 'error') {
                    console.log('AppLaudLog: Get Demo APKs completed with Error.');
                }
            }
        });
     };
     getDemoProjects();
     
     $('#refresh_demos').click(function() {
         getDemoProjects();
     });
});
