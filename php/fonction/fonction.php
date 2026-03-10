<?php

require_once __DIR__ ."/../db/connexion.php";

function getImage():array{
    $connexion=getConnexion();
    $sql= "SELECT image from bdd ";
    $requete = $connexion->prepare($sql);
    $requete->execute();
    $requete->setFetchMode(PDO::FETCH_COLUMN);
    $result = $requete->fetchAll();
    return $result;
    }