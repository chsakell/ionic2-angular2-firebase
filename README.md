<h2>Building hybrid mobile applications using Ionic 2 and Firebase</h2>

Blog post: <a href="http://wp.me/p3mRWu-19N" target="_blank">Building hybrid mobile apps using Ionic 2 and Firebase</a>

<a href="http://wp.me/p3mRWu-19N" rel="attachment wp-att-3961" target="_blank"><img src="https://chsakell.files.wordpress.com/2016/08/ionic2-angular2-firebase-36.png" alt="aspnet5-agnular2-03" class="alignnone size-full wp-image-3961"></a>

<h3>Frameworks - Tools - Libraries</h3>
<ul>
<li>Ionic 2</li>
<li>Angular 2</li>
<li>Firebase</li>
<li>TypeScript</li>
</ul>

<h3>Forum app's features</h3>
<ul>
<li>Image capture / upload from Camera and Photo album</li>
<li>Network detection</li>
<li>Open in app browser</li>
<li>SQLite support and offline operation</li>
<li>Lot's of Ionic's 2 components (cards, lists, action sheets, modals, toast, etc..)</li>
</ul>

<h3>Installation instructions - Part 1 (Firebase)</h3>

1. Login in <a href="https://firebase.google.com/" target="_blank">Firebase</a> with your Google account.
2. Click the Go to console button and press <b>CREATE NEW PROJECT</b>.
3. Name the project ForumApp and choose your country.
4. While in the ForumApp console, click the Auth button and select the <b>SIGN-IN METHOD</b> tab. Enable the <b>Email/Password</b> provider and click SAVE.
5. Click <i>Database</i> from the left menu and select the <i>RULES</i> tab. Set the JSON object as follow:

    ```javascript
{
"rules": {
".read": "auth != null",
".write": "auth != null",
    "statistics" : {
    "threads": {
    // /statistics/threads is readable by the world
    ".read": true,
    // /statistics/threads is writable by the world
    ".write": true
      }
    },
    "threads" : {
        // /threads is readable by the world
    ".read": true,
    // /threads is writable by the world
    ".write": true
    }  
  }
}
    ```

6. Click <b>Storage</b> from the left menu and select the <i>RULES</i> tab. Set the JSON object as follow:

    ```javascript
function() {
service firebase.storage {
  match /b/forumapp-your_id.appspot.com/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
    ```
Make sure to replace the your_id with your's.  
7. In the Storage, create a folder named images and a subfolder named default.
8. In the default folder, click UPLOAD FILE and select <a href="https://github.com/chsakell/ionic2-angular2-firebase/blob/master/www/images/profile.png">this</a> file or another one of your choise but make sure you name it <i>profile.png</i>.


<h3>Installation instructions - Part 2 (Ionic 2 Forum app)</h3>
1. Clone or download the source code of this repository.
2. Open the forum app in your IDE of your preference.
3. Run the following commands in the exact order.

    ```
npm install -g ionic@beta
npm install -g cordova
npm install
ionic plugin add com-sarriaroman-photoviewer
ionic plugin add cordova-plugin-camera
ionic plugin add cordova-plugin-inappbrowser
ionic plugin add cordova-sqlite-storage
ionic plugin add cordova-plugin-network-information
ionic plugin add cordova-plugin-splashscreen
    ```

<h3>Running the app</h3>
<ul>
	<li>In Firebase ForumApp project console, click the Add Firebase to your web app button.</li>
	<li>Copy the contents and paste them in the www/index.html file (you will find a <b>Paste your settings here</b> section)</li>
	<li>If you want to run the app in browser simply run the following command.
		<ul>
			<li>ionic serve --lab</li>
		</ul>
	</li>
	<li> If you want to build and run the app on your device, first you need to add the respective platform.
		<ol>
			<li>ionic platform add android</li>
			<li>ionic platform add ios</li>
		</ol>
	</li>
	<li> Next you need to install some prerequisites depending on the type of your device.
		<ol>
			<li><a href="https://cordova.apache.org/docs/en/latest/guide/platforms/android/" target="_blank">Android Platform Guide</a></li>
			<li><a href="https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html" target="_blank">iOS Platform Guide</a></li>
			<li><a href="https://cordova.apache.org/docs/en/latest/guide/platforms/win8/index.html" target="_blank">Windows Platform Guide</a></li>
		</ol>
	</li>
	<li>Set your device properly, for example <a href="https://developer.android.com/training/basics/firstapp/running-app.html" target="_blank">here's</a> what you need to do first for running the app in an Android device</li>
	<li>
		Connect your device to your computer
	</li>
	<li>
		Run the following command depending on your device type.
		<ul>
			<li>ionic run android</li>
			<li>ionic run ios</li>
		</ul>
	</li>
</ul>

<h3 style="font-weight:normal;">Forum app preview</h3>
<img src="https://chsakell.files.wordpress.com/2016/08/ionic2-angular2-firebase-00.gif"/>
<img src="https://chsakell.files.wordpress.com/2016/08/ionic2-angular2-firebase-23.gif"/>
<h3 style="font-weight:normal;">Follow chsakell's Blog</h3>
<table id="gradient-style" style="box-shadow:3px -2px 10px #1F394C;font-size:12px;margin:15px;width:290px;text-align:left;border-collapse:collapse;" summary="">
<thead>
<tr>
<th style="width:130px;font-size:13px;font-weight:bold;padding:8px;background:#1F1F1F repeat-x;border-top:2px solid #d3ddff;border-bottom:1px solid #fff;color:#E0E0E0;" align="center" scope="col">Facebook</th>
<th style="font-size:13px;font-weight:bold;padding:8px;background:#1F1F1F repeat-x;border-top:2px solid #d3ddff;border-bottom:1px solid #fff;color:#E0E0E0;" align="center" scope="col">Twitter</th>
</tr>
</thead>
<tfoot>
<tr>
<td colspan="4" style="text-align:center;">Microsoft Web Application Development</td>
</tr>
</tfoot>
<tbody>
<tr>
<td style="padding:8px;border-bottom:1px solid #fff;color:#FFA500;border-top:1px solid #fff;background:#1F394C repeat-x;">
<a href="https://www.facebook.com/chsakells.blog" target="_blank"><img src="https://chsakell.files.wordpress.com/2015/08/facebook.png?w=120&amp;h=120&amp;crop=1" alt="facebook" width="120" height="120" class="alignnone size-opti-archive wp-image-3578"></a>
</td>
<td style="padding:8px;border-bottom:1px solid #fff;color:#FFA500;border-top:1px solid #fff;background:#1F394C repeat-x;">
<a href="https://twitter.com/chsakellsBlog" target="_blank"><img src="https://chsakell.files.wordpress.com/2015/08/twitter-small.png?w=120&amp;h=120&amp;crop=1" alt="twitter-small" width="120" height="120" class="alignnone size-opti-archive wp-image-3583"></a>
</td>
</tr>
</tbody>
</table>

