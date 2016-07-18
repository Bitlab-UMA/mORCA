<?php
$opts = array('http'=>array('header' => "User-Agent:MyAgent/1.0\r\n"));
$context = stream_context_create($opts);
$header = file_get_contents('https://www.biocatalogue.org/search.json?q=ebi',false,$context);
echo $header;
?>