<?php

// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require 'vendor/autoload.php';

// Instantiation and passing `true` enables exceptions
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}


function sendMail($mailto = 'r.gilcamejo@gmail.com', $subject, $body) {
	try {
	$mail = new PHPMailer(true);

    //Server settings
    //$mail->SMTPDebug = 3;                                       // Enable verbose debug output
 
   /* Tells PHPMailer to use SMTP. */
   $mail->isSMTP();
       $mail->Host       = 'smtp.gmail.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'sanji@unerg.edu.ve';                     // SMTP username
    $mail->Password   = '3Z9KnWum!!';                               // SMTP password
    $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
    $mail->Port       = '587';                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('sanji@unerg.edu.ve', 'Scraper');
    $mail->addAddress($mailto ?? 'r.gilcamejo@gmail.com' , 'Guillermo');     // Add a recipient
    
    
    

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $body;
    

    $mail->send();
    return true;
} catch (Exception $e) {
	echo $e->getMessage();
    return false;
}

}
?>