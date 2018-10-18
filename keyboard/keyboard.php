<!DOCTYPE html>
<html>
	<head>
		<title>Virtual Keyboard Test</title>
		<script src="js/virtualkeyboard-test.js"></script>
		<script>
		window.onload = function() {
			virtualKeyboard.init('inverse');
		};
		</script>
		<link rel="stylesheet" type="text/css" href="css/virtualkeyboard.css" />
		<style>
		body {
			margin: 0;
			padding: 20px;
			font-family: Arial;
			background: #EAF3F7;
		}

		form,
		div#editable {
			float: left;
		}

		div#editable {
			padding: 5px;
			width: 55%;
			height: 350px;
			margin-left: 1%;
		}

		h3, input, form {
			margin: 0;
			padding: 0;
		}

		form {
			width: 40%;
			background: #EAF4F8;
			border: 1px solid #D0E5EE;
			border-radius: 3px;
			padding: 10px;
			box-shadow: inset 0 1px 0 #FBFDFE;
			box-sizing: border-box;
		}

		form > div {
			margin-top: 12px;
		}

		form > div label {
			font-size: 13px;;
		}

		form > div input {
			margin-top: 1px;
			font-size: 16px;
			width: 100%;
			font-family: Arial;
			font-weight: bold;
		}

		form > div input,
		div#editable {
			border: 1px solid #C6D3D9;
			border-radius: 3px;
			padding: 5px;
			background: #F4F8FA;
			outline: none;
			box-shadow: inset 0 1px 0 #ffffff;
			box-sizing: border-box;
		}

		form > div input:focus,
		div#editable:focus {
			background: #F9FCFD;
			border-color: #EDBE64;
		}

		@media screen and (max-width:600px) {
			form,
			div#editable {
				float: none;
			}

			form {
				width: 100%;
			}

			div#editable {
				margin-left: 0;
				margin-top: 20px;
				width: 100%;
			}

			form > div input {
				width: 100%;
			}
		}
		</style>
	</head>
	<body>
		<form action="#" method="post">
			<h3>Pay via Visacard</h3>
			<div>
				<label>Card Number</label><br/>
				<input type="text" name="card_number" class="vk-output disable-keyboard">
			</div>
			<div>
				<label>Card Name</label><br/>
				<input type="text" name="card_name" class="vk-output disable-keyboard">
			</div>
			<div>
				<label>CCV</label><br/>
				<input type="text" name="ccv" class="vk-output disable-keyboard">
			</div>
		</form>
		<div id="editable" class="vk-output" contenteditable="true"></div>
	</body>
</html>
