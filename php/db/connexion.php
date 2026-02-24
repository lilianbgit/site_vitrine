<?php

//Définir une fonction qui retourne une connextion avec le serveur de base de données
//2. Créer la connexion
require_once __DIR__ ."/../config/database.php";

function getConnexion() : PDO{
    try{
        $dsn = "pgsql:host=".DB_HOST.";port=".DB_PORT.";dbname=".DB_NAME;
        $connexion = new PDO($dsn,DB_USER,DB_PASSWORD);
        return $connexion;    
    } catch(PDOException $erreur){
        //Afficher le message 
        echo "Erreur : ".$erreur -> getMessage();
        exit;
    }
}