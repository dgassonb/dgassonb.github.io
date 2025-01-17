// La fonction "main1" permet de rendre toutes les variables créés ici locales à ce fichier
// En effet, afin de gérer les déplacement des joueurs, nous avons fait d'abord ceux du premier
//    ensuite est venue la problématique du nom des variables pour gérer les déplacements du second joueur




function main1 (){

    // Le joueur se deplace automatiquement vers une direction presque aléatoire
    let current = player1.current; // coordonnees actuelles (x:abscisse, y:ordonnee)
    const playerColor1 = player1.color1; // couleur du joueur1 // déjà chargée dans le programme PlayerSpawn
    const playerColor2 = player1.color2;



    // Gestion de la direction du deplacement du joueur


    if (current[1]<50){
        direction = [0,1]; // pour éviter que le joueur apparaîsse trop près d'un bord et meurent dès le début si la direction est mauvaise
    }else{
        direction = [0,-1];
    }



    let prev_coordo = new  Array(2); // dernière case par laquelle le joueur est passée
    // Cette variable permet une vérification de la direction permettant d'empêcher le demi-tour sur sois-même
    // Avant l'utilisation de cette variable, on vérifiait la direction précédente
    //    mais pendant le "await sleep(90)" il était possible de changer 2 fois la direction au moins
    //    donc notre ancienne vérification (case "ArrowUp": if(direction[0] != 1){direction = [-1,0]}) ne suffisait pas
    prev_coordo[0] = current[0] - direction[0];
    prev_coordo[1] = current[1] - direction[1];

    document.addEventListener("keyup", updateDir, true);
    // the last option dispatches the event to the listener first,
    //    then dispatches event to document

    function updateDir(k){
        if (k.defaultPrevented){
            return;
        }; // Do nothing if the event was already processed

        switch (k.key){
            case "ArrowUp":
                if (current[0] - 1 != prev_coordo[0]){ // On vérifie qu'il est impossible de faire un demi-tour sur sois-même
                    direction = [-1,0];
                }; 
                break;
            case "ArrowDown":
                if (current[0] + 1 != prev_coordo[0]){
                    direction = [1,0];
                }; 
                break;
            case "ArrowLeft":
                if (current[1] - 1 != prev_coordo[1]){
                    direction = [0,-1];
                }; 
                break;
            case "ArrowRight":
                if (current[1] + 1 != prev_coordo[1]){
                    direction = [0,1];
                }; 
                break;
            default:
                return;
        };

        k.preventDefault(); // Cancel the default action to avoid it being handled twice
    };



    // Création d'une fonction sleep() permettant de rendre l'affichage des déplacements
    //    non instantannes, à l'aide de Promise(), setTimeout() et await
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    let ColorTailPlayer2 = player2.color2;
    let ColorPlayer2 = player2.color1;

    async function Move (){                                             // fonction asynchrone qui gère entre autre le déplacement du joueur 1
        let next = new Array(2);                                        // prochaines coordonnées du joueur, facilite la compréhension du code 
        next[0] = current[0] + direction[0];
        next[1] = current[1] + direction[1];

        let is_in = true;                                               // variable permettant d'éviter de faire constamment la maj complète de la map

        let prevColor = playerColor1;                                   // couleur précédente, permet de gérer la coloration suite au passage du joueur
        GridMatrix[current[0]][current[1]].style.backgroundColor =  "black"; // tête du joueur

        while (next[0]<grid_row && next[0]>-1 && next[1]<grid_col && next[1]>-1){
            document.removeEventListener("keyup", updateDir, true);
            
            
            if (prevColor == ColorTailPlayer2){ // si on traverse le corp du joueur adverse, il meurt
                window.KillPlayer2=true 
                
                
            } 

            if (prevColor != playerColor1){
                GridMatrix[current[0]][current[1]].style.backgroundColor = playerColor2; // coloriage de la queue et enregistrement des cases parcouru dans la NumMatrix pour pouvoir éventuellement gérer l'expansion du territoire
                NumMatrix1[current[0]][current[1]] = player1.nb_player[1];
                is_in = false;
            }else{
                GridMatrix[current[0]][current[1]].style.backgroundColor = playerColor1; // effaçage de la tête
                NumMatrix1[current[0]][current[1]] = player1.nb_player[0];
               
                if (!is_in){
                    NumMatrix1 = Transform_all_0(NumMatrix1, player1.nb_player, grid_row, grid_col);

                    for (let i=0; i<grid_row; i++){ 
                        for (let j=0; j<grid_col; j++){ 
                            if (NumMatrix1[i][j]==1 && NumMatrix2[i][j]==3){ //on enlève la case à l'adversaire (sinon quand il va revenir dans sa zone il va reprendre les cases qu'on lui a prise) 
                                NumMatrix2[i][j]=0                           
                            }
                        }
                    }

                    Growth(NumMatrix1, player1.color1, player1.nb_player, grid_row, grid_col);

                    let Player2StillAlive = false

                    for (let i=0; i<grid_row; i++){
                        for (let j=0; j<grid_col; j++){ 
                            let m = player1.current;
                            m[0] = i;
                            m[1] = j;
                            if (GridMatrix[m[0]][m[1]].style.backgroundColor == ColorPlayer2){ 
                                Player2StillAlive=true                       
                            }
                        }

                        if (Player2StillAlive==true){
                            break                                           // pour éviter de faie le calcul précedent sur toute les case du jeu (il y en tout de même plus de 4200)
                        }

                    }

                    if (Player2StillAlive==false){
                        window.KillPlayer2=true // le jeu va immédiatement se stopper pour le joueur 2
                    }
                    

                    is_in = true;
                };
            };

            prev_coordo = current.slice(); // copie de l'array "current" sans utiliser de pointeur
            current[0] = next[0];
            current[1] = next[1];

            if (GridMatrix[current[0]][current[1]].style.backgroundColor == playerColor2){ 
                GridMatrix[current[0]][current[1]].style.backgroundColor =  "black"; //tête du joueur à l'endroit de sa mort
                break; // GAME OVER le joueur s'est mordu la queue
            };
            
            if (window.KillPlayer1==true){
                break // le joueur 1 s'est fait tuer
            }

            prevColor = GridMatrix[current[0]][current[1]].style.backgroundColor;
            GridMatrix[current[0]][current[1]].style.backgroundColor =  "black"; //tête du joueur
            
            document.addEventListener("keyup", updateDir, true);
            
            await sleep(90);  // rend le jeu jouable pour un humain (contrôle des vitesses de déplacement)

            next[0] = direction[0] + current[0];
            next[1] = direction[1] + current[1];
        };



        alert("GAME OVER!\nRed player died!");
        location.replace("gameOver.html");
    };

    Move();
};

main1();
