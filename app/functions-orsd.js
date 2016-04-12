//uptime = window.setInterval(function(){status("uptime")}, 60000);
 function pageLoad(page){
 	document.title = "Loading..."
 	document.getElementById("pageContent").innerHTML = "<p>Loading " + page + ", Please wait...</p>";
 	load(true);
 	$.ajax({
		method:'post',
		url:'./page.php',
		data:{
			page:page
		},
		success:function(result) {
			document.getElementById("pageContent").innerHTML = result;
			document.title = capitalizeFirstLetter(page);
			load(false);
		}
		}).fail(function(e) {
			document.getElementById("pageContent").innerHTML = "Loading the page failed. Please try again.";
			genModal("Error", "Loading the page failed. Please try again.");
			load(false);
		});
		
		status('uptime');
    }
function changePwd(username){
	document.getElementById("changeUserPasswd").innerHTML = username;
	document.getElementById("changePwdModalFooter").innerHTML = '<button type="button" class="btn btn-raised btn-danger" data-dismiss="modal">Cancel</button> <button type="button" class="btn btn-raised btn-primary" id="changePasswdModalBtn" onClick="changePasswd();">Change Password</button>';
	$("#changePwdModal").modal('show');
}
function delUser(username){
    			document.getElementById("delUserModalBody").innerHTML = "Are you sure you want to delete " + username + "?";
    			document.getElementById("delUserModalFooter").innerHTML = '<button type="button" class="btn btn-raised btn-danger" data-dismiss="modal">Cancel</button> <button type="button" class="btn btn-raised btn-primary" id="delUserModalBtn" onClick="deleteUser(\'' + username + '\');">Delete User</button>';
    			$("#delUserModal").modal('show');
}
function addUser(){
	load(true);
	var username = document.getElementById("newUser1").value;
	var password = document.getElementById("newPasswd1").value;
	var password2 = document.getElementById("newPasswd2").value;
	if(password == password2){
		$.ajax({
			method:'post',
			url:'./app/users.php',
			data:{
				type:'add',
				username:username,
				password:password
			},
			success:function(result) {
				genModal("Results", "<pre>" + result + "</pre>");
				load(false);
				$("#newUserModal").modal('hide');
				pageLoad('users');
			}
			}).fail(function(e) {
				document.getElementById("pageContent").innerHTML = "Loading the page failed. Please try again.";
				load(false);
			});
	} else {
		genModal("Error", "Passwords do not match, try again!");
		load(false);
	}
	
}
function deleteUser(username){
	$("#delUserModal").modal('hide');
		load(true);
		$.ajax({
			method:'post',
			url:'./app/users.php',
			data:{
				type:'del',
				username:username
			},
			success:function(result) {
				genModal("Results", "<pre>" + result + "</pre>");
				load(false);
				pageLoad('users');
			}
			}).fail(function(e) {
				document.getElementById("pageContent").innerHTML = "Loading the page failed. Please try again.";
				load(false);
			});
}
function changePasswd(){
	load(true);
	var username = document.getElementById("changeUserPasswd").innerHTML;
	var password = document.getElementById("newPasswd3").value;
	var password2 = document.getElementById("newPasswd4").value;
	if(password == password2){
		$("#changePwdModal").modal('hide');
		$.ajax({
			method:'post',
			url:'./app/users.php',
			data:{
				type:'change',
				username:username,
				password:password
			},
			success:function(result) {
				genModal("Results", "<pre>" + result + "</pre>");
				load(false);
				pageLoad('users');
			}
			}).fail(function(e) {
				document.getElementById("pageContent").innerHTML = "Loading the page failed. Please try again.";
				load(false);
			});
	} else {
		genModal("Error", "Passwords do not match, try again!");
		load(false);
	}


}
function genModal(head, body){
	document.getElementById("genModalHeader").innerHTML = head;
	document.getElementById("genModalBody").innerHTML = body;
	$("#genModal").modal('show');
}
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function apt_update(){
	load(true);
	document.getElementById("pageContent").innerHTML = "Fetching updates, this may take some time, please wait....";
	$.ajax({
		method:'post',
		url:'./app/packages.php',
		data:{
			type:'update'
		},
		success:function(result) {
			document.getElementById("pageContent").innerHTML = result;
			load(false);
		}
		}).fail(function(e) {
			document.getElementById("pageContent").innerHTML = "Loading the page failed. Please try again.";
			load(false);
		});
}
   		
function apt_upgrade(){
	load(true);
	document.getElementById("pageContent").innerHTML = "Installing upgrades... Any errors will be output to the page. This will take some time, please wait...";
	$.ajax({
		method:'post',
		url:'./app/packages.php',
		data:{
			type:'upgrade'
		},
		success:function(result) {
			document.getElementById("pageContent").innerHTML = result;
			load(false);
		}
		}).fail(function(e) {
			document.getElementById("pageContent").innerHTML = "Due to the timeout configured on the server, or your browser, this request timed out. The upgrade is still running on the server though. SSH to check upgrade status is recommended.";
			genModal("Error", "Due to the timeout configured on the server, or your browser, this request timed out. The upgrade is still running on the server though. SSH to check upgrade status is recommended.");
			load(false);		
		});
}
function serviceAction(name, type){
	load(true);
	$.ajax({
		method:'post',
		url:'./app/services.php',
		data:{
			service:name,
			type:type
		},
		success:function(result) {
			genModal("Results:", result);
			load(false);
			pageLoad("services");
		}
		}).fail(function(e) {
			genModal("Error", "Due to the timeout configured on the server, or your browser, this request timed out. The command is still running on the server though. SSH to check upgrade status is recommended.");
			load(false);		
		});
}
function configSave(){
	load(true);
	$.ajax({
		method:'post',
		url:'./app/rpiconfig.php',
		data:{
			content:document.getElementById("rpiConfigFile").value
		},
		success:function(result) {
			genModal("Results:", result);
			load(false);
			pageLoad("rpiconfig");
		}
		}).fail(function(e) {
			genModal("Error?", "Seems I cannot contact the RPi - It may be shutdown, rebooting, or halted.");
			load(false);
		});
}
function power(type){
	$.ajax({
		method:'post',
		url:'./app/power.php',
		data:{
			power:type
		},
		success:function(result) {
			document.getElementById("pageContent").innerHTML = result;
		}
		}).fail(function(e) {
			document.getElementById("pageContent").innerHTML = "Seems I cannot contact the RPi - It may be shutdown, rebooting, or halted.";
			genModal("Error?", "Seems I cannot contact the RPi - It may be shutdown, rebooting, or halted.");
		});
}
function status(pageStatus){
	//document.getElementById(pageStatus).innerHTML = "Loading...";
	$.post("./app/post.php", {div: pageStatus}, function(result){
		document.getElementById(pageStatus).innerHTML = result;
	});
}
function startUpload(){
	document.getElementById('uploadProcess').style.visibility = 'visible';
	document.getElementById('uploadForm').style.visibility = 'hidden';
	return true;
}
function stopUpload(success,uploadedFile){
	var result = '';
	if (success == 1){
		result = '<span class="sucess-msg">The file was uploaded successfully!<\/span><br/><br/>';
	} else {
		result = '<span class="error-msg">There was an error during file upload!<\/span><br/><br/>';
    }
	document.getElementById('uploadProcess').style.visibility = 'hidden';
	document.getElementById('uploadForm').innerHTML = result + '<label>File: <input name="myfile" type="file" size="30" /><\/label><br /><label><input type="submit" name="submitBtn" class="btn btn-raised btn-primary" value="Upload" /><\/label>';
	document.getElementById('uploadForm').style.visibility = 'visible';
	window.setTimeout(function(){pageLoad('apps')}, 2000);
		return true;   
}
function load(type){
	if(type === true){
		$("#coverlay").show();
		document.getElementById("loadAnim").style.display = '';
	} else {
		$("#coverlay").hide();
		document.getElementById("loadAnim").style.display = 'none';
	}
}
function runScript(filename){
	load(true)
	$.ajax({
		method:'post',
		url:'./app/apps.php',
		data:{
			script:filename
		},
		success:function(result) {
			load(false);
			genModal("Script \"" + filename + "\" run results:", "<pre>" + result + "</pre>");
			
		}
		}).fail(function(e) {
			load(false);
			genModal("Error", e);
		});
	
	
}