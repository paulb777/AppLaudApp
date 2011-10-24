AppLaud App
============================

The AppLaud App is an Android App that works with [AppLaud Cloud](http://www.applaudcloud.com) 
to create a fast Android development environment.

The AppLaud App has two main functionalities - each represented by a navigation page.

* The My Apps Page works in conjunction with the AppLaud Cloud to run and
debug a developers project. It can run pure JavaScript Android
PhoneGap apps directly from the cloud. No download or install is
necessary. The Download APKs feature enables downloading and running any built
Android app in the developer's workspace on the device.
* The Demo Page will run or download several different apps that
illustrate PhoneGap and jQuery Mobile's capabilities.

More information about the app available [here](http://applaudcloud.com/applauddoc.html#app-download)

Download a built version
--------

If you want to download an already built Android .apk file, it is available for download

* Click [here](http://www.applaudcloud.com/app.apk) to download from http://www.applaudcloud.com.
* Scan the QR code [here](http://applaudcloud.com/applauddoc.html#app-download)
* Android Market (coming soon)

Building the app
--------------------

The app is buildable in any standard Android development environment. Eclipse ADT and the command line 
have been tested. Alternatively, see the next section ...

Building and Bootstrapping a new version of AppLaud App with AppLaud Cloud and AppLaud App
--------------------

* Click the ZIP button above
* Go to [AppLaud Cloud](http://www.applaudcloud.com) and login
* Choose New -> Import Project
* Select the zipfile you just created and give the project a name.
* Click Import Project
* Now the package needs to be changed so the new app doesn't conflict with the original
* Open AndroidManifest.xml and change the package name at line 3 to com.mds.applaud2 (or anything you like)
* Navigate to src/com/mds/applaud. Right click on applaud and select Rename. Change to applaud2
* Open applaud2/AppLaudAppActivity.java and change line 1 to com.mds.applaud2;
* Select Package -> Basic Build
* Wait a few minutes for a pop-up indicating the build is done.
* In the meantime, navigate the original AppLaud App to the My Apps page
* After the build completes, select Refresh APK List on the App
* Click your project name and install and run the new app

More Info
--------------------

* [AppLaud Cloud home page](http://www.applaudcloud.com)
* [Forum](https://groups.google.com/forum/#!forum/applaud-cloud)

