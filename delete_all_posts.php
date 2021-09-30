<?php

require('common.php');

$sql = "TRUNCATE posts; TRUNCATE loves";
$statement = $connect->prepare($sql);
$statement->execute();