<?php

/*
This file is necessary only because /php/addtorrent.php provides  a 
JSON success message when posted directly. This JSON success message
can be confusing to users and doesn't show them their magnet is now 
downloading.

Torrents are added with default settings, similar to what the 
unmodified "Add Torrent" prompt does.
*/

function magnetic_error() {
	setcookie('magnetic_error', '1', 0, '/');
	header('Location: ../../');
	exit;
}


require_once( '../../php/rtorrent.php' );
set_time_limit(0);


// Guards
if (!isset($_REQUEST['uri'])) error();
if (!is_string($_REQUEST['uri'])) error();


$Parsed = parse_url($_REQUEST['uri']);


// Guards
if ($Parsed === false) magnetic_error();
if (!isset($Parsed['scheme'])) magnetic_error();
if ($Parsed['scheme'] !== 'magnet') magnetic_error();
if (!isset($Parsed['query'])) magnetic_error();


$Parameters = array();
parse_str($Parsed['query'], $Parameters);


if (rTorrent::sendMagnet($_REQUEST['uri'], true, true, false, false)) {
	if (isset($Parameters['dn'])) {
		setcookie('magnetic_name', $Parameters['dn'], 0, '/');
	} else {
		setcookie('magnetic_name', '1', 0, '/');
	}

	header('Location: ../../');
	exit;
}

else {
	magnetic_error();
}
