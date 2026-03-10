<?php require_once __DIR__ . "/../php/fonction/fonction.php"; ?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nos Produits</title>
    <link rel="stylesheet" href="../css/style.css">

</head>

<body>
    <nav class="navbar">
        <div class="logo">Mat'inf</div>
        <div class="menu-toggle" id="menu-toggle">&#9776;</div>
        <ul class="nav-links" id="nav-links">
            <li><a href="accueil.html">Accueil</a></li>
            <li><a href="histoire.html">Notre histoire</a></li>
            <li><a href="equipe.html">Notre équipe</a></li>
            <li><a href="produits.php">Nos Produits</a></li>
            <li><a href="contact.html">Nous contacter</a></li>
        </ul>
    </nav>
    <div>
        <table>
            <tr>
                <th>image</th>
                <th>nom</th>
                <th>prix</th>
                <th>action</th>
            </tr>
            <tr>
                <td>
                    <?php $images = getImage();
                    foreach($images as $image):?>
                           <td> <?=  $image ?></td>
                        <?php endforeach;
                    ?>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>