<?php

header("Access-Control-Allow-Origin: *");
date_default_timezone_set('America/Los_Angeles');

if (session_status() === PHP_SESSION_NONE) session_start();

// Local
$host = "localhost";
$user = "root";
$pw   = "";
$db   = "social";

$charset = "utf8mb4";

$connect = new PDO("mysql:dbname=$db;host=$host;charset=$charset", $user, $pw) or die("Unable to connect to DB");
