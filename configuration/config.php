<?

$pathway = $_SERVER["SCRIPT_FILENAME"];
$pathway = substr($pathway,0,strpos($pathway, "createuser.php"));
$pathway = $pathway. "configuration/";
 

$Descriptor = fopen($pathway."variables.cfg","r"); 


if ($Descriptor) 
{
while(!feof($Descriptor)){ 

     $buffer = fgets($Descriptor,4096); 
     $ini = 0;
     $buffer = trim($buffer);
     $end = strlen($buffer); 
      
     $len = strpos($buffer,"=");
     $variable = substr($buffer,0,$len);
     $valor = substr($buffer,$len+1,$end); 
 
    if (!$variable == ''){
        eval("$".$variable ."= \"$valor\";");
         
     }
 } 
} else {
 error_log("error reading var file", 3, '/tmp/variables.log');
}

fclose($Descriptor); 

?>
