<?php

// fill in your API Secret (probably from the JWT, not the SDK!)
$apiSecret 		= 'my-api-secret-here';

// if you're passing in a JSON object, decode it first
$meetingData 	= json_decode(file_get_contents('php://input'), true);

// Make sure your variable names match; ex. "mn" and not "meetingNumber"
$apiKey 		= isset( $meetingData['meetingData']['apiKey'] ) 		? $meetingData['meetingData']['apiKey'] 		: '';
$meetingNumber 	= isset( $meetingData['meetingData']['meetingNumber'] ) ? $meetingData['meetingData']['meetingNumber'] 	: '';
$role 			= isset( $meetingData['meetingData']['role'] ) 			? $meetingData['meetingData']['role'] 			: '';

print generate_signature( $apiKey, $apiSecret, $meetingNumber, $role);

// this function is right from the Zoom documentation
// https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/signature
function generate_signature ( $api_key, $api_secret, $meeting_number, $role){

  //Set the timezone to UTC
  date_default_timezone_set("UTC");

	$time = time() * 1000 - 30000;//time in milliseconds (or close enough)
	
	$data = base64_encode($api_key . $meeting_number . $time . $role);
	
	$hash = hash_hmac('sha256', $data, $api_secret, true);
	
	$_sig = $api_key . "." . $meeting_number . "." . $time . "." . $role . "." . base64_encode($hash);
	
	//return signature, url safe base64 encoded
	return rtrim(strtr(base64_encode($_sig), '+/', '-_'), '=');
}

?>