/* jshint strict: false */
/* global plugin, theUILang, noty */
(function (plugin, theUILang, noty) {
	// We can't use strict mode here because
	// noty() triggers an eval :(

	var cookies = document.cookie.split(": "),
		i;

	// Lazy polyfill for browsers that don't yet support API change yet
	if (typeof navigator.isProtocolHandlerRegistered === "undefined") {
		navigator.isProtocolHandlerRegistered = function(){
			return false;
		};
	}

	// Mark this plugin as disabled if there's no browser support
	// Purely cosmetic to help troubleshooting
	if (typeof navigator.registerProtocolHandler === "undefined") {
		plugin.disable();
		return;
	}

	// If we're not the protcol handler, present the user with the choice
	if (!navigator.isProtocolHandlerRegistered(
			"magnet",
			location.origin + location.pathname + "plugins/magnetic/adduri.php?uri=%s"
	)) {
		navigator.registerProtocolHandler(
			"magnet",
			location.origin + location.pathname + "plugins/magnetic/adduri.php?uri=%s",
			"ruTorrent (" + location.hostname + ")"
		);
	}

	// Show torrents added
	for (i = 0; i < cookies.length; i++) {
		if (cookies[i].indexOf("magnetic_error=1") === 0) {
			noty(theUILang.addTorrentFailed, "error");
			document.cookie = "magnetic_error=; expires=" + new Date(0).toGMTString() + "; path=/";
		}

		if (cookies[i].indexOf("magnetic_name=") === 0) {
			if (cookies[i] === "magnetic_name=1") {
				noty(theUILang.addTorrentSuccess, "success");
			} else {
				noty(decodeURIComponent(cookies[i].substring("magnetic_name=".length)) + " " + theUILang.addTorrentSuccess, "success");
			}
			document.cookie = "magnetic_name=; expires=" + new Date(0).toGMTString() + "; path=/";
		}
	}
})(plugin, theUILang, noty);
