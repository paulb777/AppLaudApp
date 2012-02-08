AppLaud App
============================

**February 8, 2012** *Version 1.4 : Work in Progress*
 * Updating App: PhoneGap 1.4.1, jQuery Mobile 1.0.1, Resolving Issues
 * Use at your own risk
 * Android Market App is Version 1.3 (latest)

The AppLaud App version 1.3 is an Android App that works with [AppLaud Cloud](http://www.applaudcloud.com) 
to create a fast Android development environment.

The AppLaud App has two main functionalities - each represented by a navigation page.

* The My Apps Page works in conjunction with the AppLaud Cloud to run and
debug a developers project. It can run pure JavaScript Android
PhoneGap apps directly from the cloud. No download or install is
necessary. The Download APKs feature enables downloading and running any built
Android app in the developer's workspace on the device.
* The Demo Page will run or download several different apps that
illustrate PhoneGap and jQuery Mobile's capabilities.

More information about the app available [here](http://applaudcloud.com/applauddoc.html#app-overview)

Download a built version
--------

To download as an app (.apk file) to an Android 2.1+ device:

* [Android Market](https://market.android.com/details?id=com.mds.applaud)
* Or click [here](http://www.applaudcloud.com/app.apk) to download from http://www.applaudcloud.com.
* Or scan the QR code [here](http://applaudcloud.com/applauddoc.html#app-download)

Version 1.3
-------------------
* PhoneGap 1.3.0
* jQuery Mobile 1.0
* PhoneGap Child Browser Plugin
* Open ID Authentication
* Forms and Ajax

Building the app
--------------------

The app is buildable in any standard Android development environment. In addition to AppLaud Cloud, Eclipse ADT (New > Android Project) and the command line 
will work. See the next section for building on AppLaud Cloud.

Building and Bootstrapping a new version of AppLaud App with AppLaud Cloud and AppLaud App
--------------------

* Click the ZIP button above to download the zipfile
* Go to [AppLaud Cloud](http://www.applaudcloud.com) and log in
* Choose New -> Import Project
* Select the zipfile and give the project a name
* Click Import Project
* Customize the new version of the app:
    * AndroidManifest.xml: Change the package name at line 3 to com.mds.applaud2 (or anything you like)
    * /src/com/mds/applaud: Right click on applaud (directory) and select Rename. Change to applaud2
    * /src/com/mds/applaud2/AppLaudAppActivity.java: Change line 1 to com.mds.applaud2
    * /assets/www/index.html: Line 96: Modify form's action value as needed
    * /assets/www/main.js: Line 23: Modify serverUrl value as needed
    * /res/phonegap.xml: Add or modify origin urls as needed
* Build the .apk file: Package -> Basic Build
* From the original AppLaud App go to My Apps page
* When the build completes, select Refresh APK List to access .apk file
* Click on project name to start download; Check device notification (top bar) for download status and to install the new app

More Info
--------------------

* [AppLaud Cloud home page](http://www.applaudcloud.com)
* [Forum](https://groups.google.com/forum/#!forum/applaud-cloud)

