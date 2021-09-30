<?php

require('./common.php');

$user_id = $_SESSION['id'];

$sql = "SELECT id, username, email, bio, profile_pic FROM users WHERE id = '$user_id'";
$statement = $connect->prepare($sql);
$statement->execute();
$result = $statement->fetch();
exit(json_encode($result));