<?php

require('common.php');

if (isset($_POST['hash'])){
    $post_id = $_POST['hash'];
    $user_id = $_SESSION['id'];

    $sql = "SELECT COUNT(*) AS num FROM loves WHERE love_post_id = $post_id AND love_user_id = $user_id";
    $statement = $connect->prepare($sql);
    $statement->execute();
    $rows = $statement->fetch();
    if (intval($rows['num']) < 1){
        $sql = "INSERT INTO loves (love_post_id, love_user_id) VALUES ($post_id, $user_id)";
        $statement = $connect->prepare($sql);
        $result = $statement->execute();
    } else {
        $sql = "DELETE FROM loves WHERE love_post_id = $post_id AND love_user_id = $user_id";
        $statement = $connect->prepare($sql);
        $statement->execute();     
    }
    // User loves
    $sql = "SELECT COUNT(*) AS num FROM loves WHERE love_post_id = $post_id";
    $statement = $connect->prepare($sql);
    $statement->execute();
    $rows = $statement->fetch();
    exit(strval($rows['num']));
}