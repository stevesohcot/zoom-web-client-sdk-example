window.addEventListener('DOMContentLoaded', function(event) {
	console.log('DOM fully loaded and parsed');
	websdkready();
});

function websdkready() {

	ZoomMtg.preLoadWasm();
  	ZoomMtg.prepareJssdk();

	// click join meeting button
	document
		.getElementById("join_meeting")
		.addEventListener("click", function (e) {
			e.preventDefault();

			const meetConfig = {
				apiKey: 'my-api-key-here',
				signatureEndpoint: 'get-zoom-signature.php',
				meetingNumber: document.getElementById('meetingNumber').value.replace(/ /g, ''),
				leaveUrl: 'url-goes-here',
				userName: document.getElementById('userName').value,
				userEmail: document.getElementById('userEmail').value,
				passWord: document.getElementById('meetingPassword').value,
				role: document.getElementById('meetingRole').value // 1 for host; 0 for attendee
			};

			//console.log({meetConfig});

			if (!meetConfig.meetingNumber || !meetConfig.userName) {
				alert("Meeting number or username is empty");
				return false;
			}

			fetch( meetConfig.signatureEndpoint, {
				method: 'POST',
				body: JSON.stringify({ meetingData: meetConfig })
			})		 
			.then(result => result.text())
			.then(response => {
				
				ZoomMtg.init({
					leaveUrl: meetConfig.leaveUrl,
					isSupportAV: true,
					success: function (res) {
						ZoomMtg.join({
								signature: response,
								meetingNumber: meetConfig.meetingNumber,
								userName: meetConfig.userName,
								apiKey: meetConfig.apiKey,
								//userEmail: 'user@gmail.com',
								passWord: meetConfig.passWord,
								success: function(res){
									console.log('join meeting success');
									document.getElementById('nav-tool').style.display = 'none';									
									//var joinUrl = "meeting.html?" + testTool.serialize(meetConfig);
									//window.open(joinUrl, "_blank");
								},
								error: function(res) {
									console.log(res);
								}
						})
					}
				})
				
			})	

		});

}
