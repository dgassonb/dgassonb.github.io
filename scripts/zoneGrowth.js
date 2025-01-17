// Etape 1 : on cherche le premier "0" sur un des bords de la matrice
function Find_0 (num_matrix, nb_player, nrow, ncol, visited, index){
    let is_found = false;
    let i = 0;
    let j = 0;
    // Incrémentations de i et j très spécifique pour parcourir uniquement les bords et tjr >0
    // Il y a différentes manières de faire mais cette méthode permet d'éviter de 
    //    parcourir toute la map à chaque appel de la fonction
    let up_i = 0;
    let up_j = 1;

    while (is_found == false && i<nrow && j<ncol){

        if (num_matrix[i][j] != nb_player[0] && num_matrix[i][j] != nb_player[1]){
            let k = 0;
            let same = false;

            // Vérification que le "0" n'a pas déjà été trouvé à l'appel précédent de Find_0
            // En effet, on n'a pas encore modifié la matrice de la map aka "num_matrix"
            while (same == false && k < index+1){ 
                same = (visited[k][0] == i && visited[k][1] == j);
                k++;
            };
            
            is_found = !same;
        };

        if (is_found == false){ // le if permet d'éviter une incrémentation inutile

            // On traite les cas où l'on se trouve au bout d'un des bords
            if (i == 0 && j == ncol-1){
                i = nrow-1;
                j = -1;
                up_i = 0;
                up_j = 1;

            }else if (i == nrow-1 && j == ncol-1){
                i = 0;
                j = 0;
                up_i = 1;
                up_j = 0;

            }else if (i == nrow-2 && j == 0){
                i = 0;
                j = ncol-1;
                up_i = 1;
                up_j = 0;

            }else if (i == nrow-2 && j == ncol-1){
                return [i, j, is_found]; // fin de la vérification de "0" sur les bords
            };

            i += up_i;
            j += up_j;
        }; 
    };
   
    return [i, j, is_found];
};



function Search_0_further (num_matrix, matrix, nb_player, nrow, ncol){
    let is_found = false;
    let i = 0;
    let j = -1;

    while (!is_found && i<nrow && j<ncol){
        j++;
        if (j == ncol){
            i++;
            j = 0;
        };
        
        if (i<nrow && matrix[i][j] == nb_player[0] && num_matrix[i][j] == 0){
            
            if (i-1>0 && matrix[i-1][j] == nb_player[0]-10){
                is_found = true;
                dir = [1,0];

            }else if (i+1<nrow && matrix[i+1][j] == nb_player[0]-10){
                is_found = true;
                dir = [-1,0];

            }else if (j-1>0 && matrix[i][j-1] == nb_player[0]-10){
                is_found = true;
                dir = [0,1];

            }else if (j+1<ncol && matrix[i][j+1] == nb_player[0]-10){
                is_found = true;
                dir = [0,-1];
            };

        };        
    };

    if (is_found){
        Transform_0_1dir([i,j], num_matrix, matrix, nb_player, nrow, ncol, dir);
    };
};



function Transform_0_1dir (coordo, num_matrix, matrix, nb_player, nrow, ncol, dir){
    let k = coordo[0];
    let l = coordo[1];
    // On tranforme tous les "0" en "-..." et on les envoie dans une matrice à part
    while (k>-1 && k<nrow && l>-1 && l<ncol && num_matrix[k][l] != nb_player[0] && num_matrix[k][l] != nb_player[1]){
        matrix[k][l] = nb_player[0] - 10;
        k += dir[0];
        l += dir[1];
    };
};



// WARNING WARNING WARNING 
// Cas particulier à traiter <=> que des "1" et "2" sur les bords => le joueur a gagné
// FIN WARNING WARNING WARNING 

// Etape 2 : transformer tous les "0" qui se suivent en "-..."
function Transform_all_0 (num_matrix, nb_player, nrow, ncol){
    let coordo = new Array(3); // résultat de la fonction Find_0
    let stock = new Array(); // liste pour stocker les points déjà visités

    // Création d'une nouvelle matrice à part correspondante à la zone finale conquise par le joueur
    let new_matrix = new Array(nrow);
    for (let row=0; row<nrow; row++){
        new_matrix[row] = new Array(ncol);
    };
    for (let row=0; row<nrow; row++){
        for (let col=0; col<ncol; col++){
            new_matrix[row][col] = nb_player[0];
        };
    };

    // Obligé de créer un indice "index" car la longueur du stockage est "undefine" 
    //    <= retour de la fonction Find_0 ajouté dans la liste non considéré comme élément mais comme "undefine"
    // Je suppose donc que js ne peut pas interpréter la longueur d'une liste de plusieurs "undefine" 
    let index = -1; 
    do{ 
        coordo = Find_0(num_matrix, nb_player, nrow, ncol, stock, index); // change de "0" sur un des bords de la matrice à chaque itération
        index++; 
        stock.push(coordo); // stockage des points déjà visités
        let dir_remove = Array.of(0,0);

        // On vérifie sur quel bord on se trouve pour transformer les "0" de la même ligne/colonne
        // L'objectif est de s'orienter vers le centre en ligne droite jusqu'à ne plus rencontrer de "0"
        if (coordo[0] == 0){
            dir_remove = [1,0];

        }else if (coordo[1] == 0){
            dir_remove = [0,1];

        }else if (coordo[0] == nrow-1){
            dir_remove = [-1,0];

        }else if (coordo[1] == ncol-1){
            dir_remove = [0,-1];
        };
        
        Transform_0_1dir(coordo, num_matrix, new_matrix, nb_player, nrow, ncol, dir_remove);
        Search_0_further(num_matrix, new_matrix, nb_player, nrow, ncol);

    }while (coordo[2]); // dernier cas possible de la fonction Find_0 <=> is_found = false

    return new_matrix;
};



// Etape 3 : on tranforme la matrice de la map en faisant la maj de la zone du joueur
function Growth(num_matrix, color, nb_player, grid_row, grid_col){
    for (let i=0; i<grid_row; i++){
        for (let j=0; j<grid_col; j++){ 

            if (num_matrix[i][j] != nb_player[0] - 10){
                GridMatrix[i][j].style.backgroundColor = color; 
                num_matrix[i][j] = nb_player[0];

            }else{
                num_matrix[i][j] = 0;
            };

        };
    };
};
