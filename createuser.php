<?
/*
 * check.php
 * 
 * Version 0.1
 *
 * Date 01/Feb/2005
 * 
 * Copyright INB
 *
 * Created by: Ismael Navas
 *
 * PHP application to check user/password introduced by a web form
 *
 */
 
/* Header XML & Start Session */
Header ("Content-Type: text/xml");

/* Server Data */
include("./configuration/config.php");
	
function check($loginName,$email,$connection)
{
	$check = 0;														   	// OK 						= 0
																		// Login Exists				= 1
																		// Login and Email Exists	= 2
																		// Email Exists				= 3
	mysql_select_db("gestion", $connection);
	$query = "SELECT mail FROM users where Login='$loginName'";
	$result = mysql_query($query,$connection)or die("Error when recording a message: ".mysql_error());
	if ($row=@mysql_fetch_array($result))
	{
		$mail = (String)$row["mail"];
		if ($email == $mail)
		{
			$check = 2;
		}
		else
		{
			$check = 1;
		}
	}
	else
	{
		$query = "SELECT Login FROM users where mail='$email'";
		$result = mysql_query($query,$connection)or die("Error when recording a message: ".mysql_error());
		if ($row=@mysql_fetch_array($result))
		{
			$check = 3;
		}
	}
	return $check;
}

function createUser($firstName, $lastName, $institution, $department, $state, $country, $email, $loginName, $password, $id, $connection)
{
	$name = $lastName." ".$firstName;
	mysql_select_db("gestion", $connection);
	$query = "INSERT INTO users (Nombre, mail, Institution, Department, State, Country, Login, Password, Type, Id)";
	$query = $query." VALUES ('$name', '$email', '$institution', '$department', '$state', '$country', '$loginName', MD5('$password'), 'Usuario', '$id')";
	$result = mysql_query($query,$connection)or die("Error when recording a message: ".mysql_error());
}

function sendEMail($email, $firstName, $lastName, $loginName, $password)
{
	if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"),"unknown"))
	{
		$ip = getenv("HTTP_CLIENT_IP");
	}
   	else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
   	{
		$ip = getenv("HTTP_X_FORWARDED_FOR");
	}
   	else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
   	{
		$ip = getenv("REMOTE_ADDR");
	}
	else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
	{
		$ip = $_SERVER['REMOTE_ADDR'];
	}
	else
	{
		$ip = "unknown";
	}
	$subject = "INB have created a user for $lastName, $firstName in order to a request from the IP $ip\n";
	$subject .= "Your login name is $loginName\n";
	$subject .= "Your password is $password\n";
	$subject .= "\n\n National Institute for Bioinformatic\n";
	 
	mail($email, "User Creation Request", "Dear $lastName, \n\n$subject");
}	

/* Main */
$firstName = $_POST['firstname'];										// User first name typed in the form
$lastName  = $_POST['lastname'];										// User last name typed in the form
$institution = $_POST['institution'];									// Institution typed in the form
$department  = $_POST['department'];									// Department typed in the form
$state = $_POST['state'];												// State typed in the form
$country  = $_POST['country'];											// Country typed in the form
$email = $_POST['email'];												// Email typed in the form
$email2 = $_POST['email2'];												// Email (retyped) typed in the form
$loginName  = $_POST['loginname'];										// Login Name typed in the form
$passworduser = $_POST['password'];

if ($email != $email2)
{
	// Show Web Form for createuser with error message
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    echo "<?xml-stylesheet href=\"createuser.xsl\" type=\"text/xsl\"?>";
	echo "<messages message='The e-mails entered do not match!'>";
	echo "<user firstname='$firstName' lastname='$lastName' institution='$institution' department='$department' state='$state' country='$country' loginname='$loginName'/>";
	echo "</messages>";
}
else
{
	$connection = mysql_connect($host, $user, $password);					// Connection with the database
	$check = check($loginName, $email, $connection);
	if ($check == 0) 														// OK
	{
		// Generate the password
		//srand(time(NULL));
		//$password = (String)rand();
		//srand(time(NULL));
		//$id = crypt((String)rand());
		$id = (String)rand();
		// Create the user
		createUser($firstName, $lastName, $institution, $department, $state, $country, $email, $loginName, $passworduser, $id, $connection);
		// Send an email to the user
//		sendEMail($email, $firstName, $lastName, $loginName, $passworduser);
		// Redirect to User Logged Page
	    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	    echo "<?xml-stylesheet href=\"created.xsl\" type=\"text/xsl\"?>";
		echo "<messages message='User $loginName was assigned password \"$password\". Please take note!'/>";	
	}
	else if ($check == 1) 													// Login Exists
	{
		// Show Web Form for createuser with error message
	    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	    echo "<?xml-stylesheet href=\"createuser.xsl\" type=\"text/xsl\"?>";
		echo "<messages message='The Login Name ($loginName) Exists in the Database'>";
		echo "<user firstname='$firstName' lastname='$lastName' institution='$institution' department='$department' state='$state' 	country='$country' email='$email'/>";
		echo "</messages>";
	}
	else if ($check == 3) 													// EMail Exists
	{
		// Show Web Form for createuser with error message
	    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	    echo "<?xml-stylesheet href=\"createuser.xsl\" type=\"text/xsl\"?>";
		echo "<messages message='The E-Mail ($email) Exists in the Database'>";
		echo "<user firstname='$firstName' lastname='$lastName' institution='$institution' department='$department' state='$state' 	country='$country' loginname='$loginName'/>";
		echo "</messages>";
	}
	else 																	// Login and EMail exist
	{
		// Show Web Form for createuser with error message
	    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	    echo "<?xml-stylesheet href=\"createuser.xsl\" type=\"text/xsl\"?>";
		echo "<messages message='The Login Name ($loginName) and E-Mail ($email) Exist in the Database'>";
		echo "<user firstname='$firstName' lastname='$lastName' institution='$institution' department='$department' state='$state' 	country='$country'/>";
		echo "</messages>";
	}
	mysql_close($connection);
}
?>
