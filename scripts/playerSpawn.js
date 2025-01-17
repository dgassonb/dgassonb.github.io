let size_zone = player1.size_zone; // Paramètre qui sera déterminé dans une classe
size_zone = Math.floor(size_zone); // On est sûr que la taille est un entier

if (size_zone%2 == 0){ // On est sûr que la taille est impaire
    size_zone += 1;
};

if (size_zone < 2){ // On est sûr que la taille est assez grande
    size_zone = 3;
};



function CreateSafeTerritory (num_matrix, color, nb_player, i, j){
    V = Voisins(i,j);
    for (let k=0; k<size_zone*size_zone-1; k++){
        GridMatrix[V[k][0]][V[k][1]].style.backgroundColor = color;
        num_matrix[V[k][0]][V[k][1]] = nb_player;
    };
};



function SpawnPlayer (num_matrix, color, nb_player, i, j){
    GridMatrix[i][j].style.backgroundColor = color;
    num_matrix[i][j] = nb_player;
    CreateSafeTerritory(num_matrix, color,nb_player,i,j);
};



function FindSafeCase(nrow, ncol){
    let i = 0;
    let j = 0;
    let tried = new Array(); 
    let is_found = false;
    const padd = Math.floor(size_zone/2);
    
    while (is_found == false){
        // Génération d'entiers aléatoires entre min et max inclus
        // Math.floor(Math.random() * (max - min + 1)) + min;
        //    max = nrow(ncol)-padd-2; min = padd+2
        i = Math.floor(Math.random() * (nrow - 2*padd - 3)) + padd+2; 
        j = Math.floor(Math.random() * (ncol - 2*padd - 3)) + padd+2;

        if (!tried.includes(Array.of(i,j))){ // On évite d'appeler la fonction SafeZone si on a déjà vérifié une zone
            tried.push(Array.of(i,j));
            is_found = SafeZone(i,j);
        };
    };
    return Array.of(i,j);
};



function SafeZone (i, j){
    let is_safe = false;

    if (GridMatrix[i][j].style.backgroundColor == 'white'){
        let voisins = Voisins(i,j);
        let k = 0;
        is_safe = true;

        while (is_safe && k<size_zone*size_zone-1){
            if (GridMatrix[voisins[k][0]][voisins[k][1]].style.backgroundColor != 'white'){
                is_safe = false;
            };
            k++;
        };
    };

    return is_safe;
};



function Voisins (i, j){
    let voisins = new Array(size_zone*size_zone-1);
    const padd = Math.floor(size_zone/2);
    let m = 0;

    for (let k=i-padd; k<i+padd+1; k++){
        for (let l=j-padd; l<j+padd+1; l++){
            if (k!=i || l!=j){
                voisins[m] = [k,l];
                m++;
            };
        };
    };
    return voisins;
};


// Pour chacune de ces fonctions, la matrice à tester est la grid matrice,
//    la première fonction indique le nombre de case qui peuvent servir à faire spawn un joueur



// Définition & création des joueurs (2)
try{
    coordo_player1 = FindSafeCase(grid_row, grid_col);
    coordo_player2 = FindSafeCase(grid_row, grid_col);

    player1.current = coordo_player1;
    player2.current = coordo_player2;

    SpawnPlayer(NumMatrix1, player1.color1, player1.nb_player[0], coordo_player1[0], coordo_player1[1]);
    SpawnPlayer(NumMatrix2, player2.color1, player2.nb_player[0], coordo_player2[0], coordo_player2[1]);

}catch{
    alert("The page will refresh :/ \nIf the page continuously refresh, please leave the page");
    location.reload();
};
