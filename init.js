/* global plugin, theUILang, noty */

/*
Check for browser support and disable the plugin visibly if 
the browser is unable to utilize this functionality.

Prefix everything since we"re not able to use proper javascript
scope due to poor design decisions in rutorrent.
*/

var magnetic_cookies = document.cookie.split(": "),
	i;


if (typeof navigator.registerProtocolHandler === "undefined") {
	plugin.disable();
}


else {
	navigator.registerProtocolHandler(
		"magnet",
		location.origin + location.pathname + "plugins/magnetic/adduri.php?uri=%s",
		"ruTorrent (" + location.hostname + ")"
	);
}

for (i = 0; i < magnetic_cookies.length; i++) {
	if (magnetic_cookies[i].indexOf("magnetic_error=1") === 0) {
		noty(theUILang.addTorrentFailed, "error");
		document.cookie = "magnetic_error=; expires=" + new Date(0).toGMTString() + "; path=/";
	}

	if (magnetic_cookies[i].indexOf("magnetic_name=") === 0) {
		if (magnetic_cookies[i] === "magnetic_name=1") {
			noty(theUILang.addTorrentSuccess, "success");
		} else {
			noty(decodeURIComponent(magnetic_cookies[i].substring("magnetic_name=".length)) + " " + theUILang.addTorrentSuccess, "success");
		}
		document.cookie = "magnetic_name=; expires=" + new Date(0).toGMTString() + "; path=/";
	}
}