<?php


	
	require 'email.php';
	$_POST = json_decode(file_get_contents('php://input'), true);
		var_dump($_POST);	

	extract($_POST);


	//$action = 'jobAccepted';
	
	if ($action == 'jobAccepted') {
		$subject = 'Trabajo Aceptado!';
		$body = "
			Se ha aceptado el siguiente trabajo
		   <br>
           <br>
           Job N°: $job
           <br>
           Schedule: $schedule
           <br>
           Location: $location 
           <br>
           Appliance: $appliance 
           <br>
           Payment Method: $paymentMethod 
           <br>
           Symptoms: $symptoms

		";
		$res =  sendMail('r.gilcamejo@gmail.com', $subject, $body);

		echo !!$res;

	}

