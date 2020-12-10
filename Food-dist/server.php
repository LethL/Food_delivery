<?php
$_POST = json_decode(file_get_contents("php://input"), true);   // метод для преобразования формата JSON
echo var_dump($_POST);