<?php

require('common.php');

if (isset($_POST['hash'])){
    $hash = $_POST['hash'];
    $sql = "DELETE FROM posts WHERE post_id = '$hash'; DELETE FROM loves WHERE love_post_id = '$hash';";
    $statement = $connect->prepare($sql);
    $statement->execute();
}