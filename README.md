# Social-Networking-App

A simple open source social networking app built in PHP, JavaScript, jQuery, and MySQL.

To do: add a commenting feature, add better security with a Unix encoded timestamp...

## Quickstart
Update your DB credentials in the common.php file.

## Table structure
dbname=social

[users]
id int PRIMARY_KEY AUTO_INCREMENT,
username varchar(35),
email varchar(255),
password varchar(255),
profile_pic varchar(255),
bio varchar(255)

[posts]
post_id int PRIMARY_KEY AUTO_INCREMENT,
text varchar(255),
image varchar(255),
user_id int,
timestamp CURRENT_TIMESTAMP DEFAULT_GENERATED

[loves]
love_id int PRIMARY_KEY AUTO_INCREMENT,
love_post_id int,
love_user_id int
