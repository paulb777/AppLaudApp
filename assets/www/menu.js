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

$('#dialog-devmenu').live('pageinit', function(event){
    $('#close-new-user').click(function() {
        $('div#new-user').addClass('hidden');
        $('a#get_project_list').removeClass('hidden');
        $('a#get_apk_list').removeClass('hidden');
    });
    
    $('#dialog-devmenu').live('pagehide',function(event, ui){
        $('.allcollapse').trigger('collapse');
    });
    
    $('.show-help').click(function() {
       $('#devmenu-help').trigger('expand');
    });
    
    $('select#select-home-page').change( function() {
        // page-home or page-guest
        localStorage.applaud_homepage = $('select#select-home-page').val();
    });
    
    $('#go_to_homepage').click(function() {
        var home = $('select#select-home-page').val();
        $.mobile.changePage($("#" + home));
    });
    
    $('.goto_login').click(function() {
        $.mobile.changePage($('#page-login'), { changeHash : false });
        console.log("AppLaudLog: using changePage to go to login");
        return false;
    });
    
/*    function clearLocalStorage() {
        delete localStorage.applaud_openid;
        delete localStorage.applaud_homepage;
        delete localStorage.applaud_username;
        delete localStorage.applaud_session;        
    }
    
    $('#clear_dev_data').click(function() {
        clearLocalStorage();   
    });
*/    
    $('#logout').click(function() {
        $.post(serverUrl + "/logout");
        delete localStorage.applaud_username;
        delete localStorage.applaud_session;
        $.mobile.changePage($('#page-login'), { changeHash : false });
        setUser('Logged Out');
    });
});
