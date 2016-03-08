<?php
define("UPLOAD_DIR", "/usr/local/apache-tomcat-6.0.16-devel/webapps/ApiWs/WEB-INF/files/_guest/Bitlab [chirimoyo.ac.uma.es]/");

    echo '<pre>';
    print_r (array_values($_FILES));
    echo '</pre>';
 
    $myFile = $_FILES["file"];

    echo '<pre>';
    print_r ($myFile);
    echo '</pre>';
 
/*    if ($myFile["error"] !== UPLOAD_ERR_OK) {
        echo "<p>An error occurred.</p>";
        exit;
    } */
 
 	echo "<p>T1</p>";
    // ensure a safe filename

    echo "<p>Name:</p>";
    print $myFile["name"];

    $name = preg_replace('/[^A-Za-z0-9\.]/', '', mb_convert_encoding($myFile["name"], 'UTF-8', 'HTML-ENTITIES'));

    echo "<p>Name replaced:</p>";
    print $name;
 
 	echo "<p>T2</p>"; 
    // don't overwrite an existing file
    $i = 0;
    $parts = pathinfo($name);
    while (file_exists(UPLOAD_DIR . $name)) {
        $i++;
        $name = $parts["filename"] . "-" . $i . "." . $parts["extension"];
    }
 
 	echo "<p>T3</p>";
    echo "<p>Name: "+$myFile["tmp_name"]+"</p>";

    // preserve file from temporary directory
    $success = move_uploaded_file($myFile["tmp_name"],
        UPLOAD_DIR . $name);
    if (!$success) { 
        echo "<p>Unable to save file.</p>";
        exit;
    }
 
 	echo "<p>T4</p>";
    // set proper permissions on the new file
    chmod(UPLOAD_DIR . $name, 0644);
?>
<html>
<head>
<title>Uploading Complete</title>
</head>
<body>
<h2>Uploaded File Info:</h2>
<ul>
<li>Sent file: <?php echo $_FILES['file']['name'];  ?>
<li>File size: <?php echo $_FILES['file']['size'];  ?> bytes
<li>File type: <?php echo $_FILES['file']['type'];  ?>
</ul>
</body>
</html>