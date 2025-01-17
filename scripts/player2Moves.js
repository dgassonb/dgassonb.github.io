//<!> VOIR PlayerMoves2.0 POUR AVOIR L'INTEGRALITE DES COMMENTAIRES <!>

function main2 (){

    // Le joueur se deplace automatiquement vers une direction presque aléatoire
    let current = player2.current; // coordonnees actuelles (x:abscisse, y:ordonnee)
    const playerColor1 = player2.color1; // couleur du joueur // déjà chargée dans le programme PlayerSpawn
    const playerColor2 = player2.color2;



    // Gestion de la direction du deplacement du joueur
    // Le joueur se déplace vers une direction aléatoire afin de réduire le risque de "spawn" proche d'un mur
    //   et qu'il soit emener contre ce mur (car mur = GAME OVER)

    if (current[1]<50){
        direction2 = [0,1];
    }else{
        direction2 = [0,-1]; //en aléatoire on risquait parfois de se prendre un mur en sapwnant comme ça pas de risque
    }
        

    let prev_coordo = new  Array(2); // dernière case par laquelle le joueur est passée
    // Cette variable permet une vérification de la direction permettant d'empêcher le demi-tour sur sois-même
    // Avant l'utilisation de cette variable, on vérifiait la direction précédente
    //    mais pendant le "await sleep(90)" il était possible de changer 2 fois la direction au moins
    //    donc notre ancienne vérification (case "ArrowUp": if(direction[0] != 1){direction = [-1,0]}) ne suffisait pas
    prev_coordo[0] = current[0] - direction2[0];
    prev_coordo[1] = current[1] - direction2[1];

    document.addEventListener("keydown", updateDir2, true);
    // the last option dispatches the event to the listener first,
    //    then dispatches event to document

    function updateDir2(l){
        if (l.defaultPrevented){
            return;
        }; // Do nothing if the event was already processed
        switch (l.key){
            case "z":
                if (current[0] - 1 != prev_coordo[0]){ // On vérifie qu'il est impossible de faire un demi-tour sur sois-même
                    direction2 = [-1,0];
                }; 
                break;
            case "s":
                if (current[0] + 1 != prev_coordo[0]){
                    direction2 = [1,0];
                }; 
                break;
            case "q":
                if (current[1] - 1 != prev_coordo[1]){
                    direction2 = [0,-1];
                }; 
                break;
            case "d":
                if (current[1] + 1 != prev_coordo[1]){
                    direction2 = [0,1];
                }; 
                break;
            default:
                return;
        };

        l.preventDefault(); // Cancel the default action to avoid it being handled twice
    };


    let ColorTailPlayer1 = player1.color2;
    let ColorPlayer1 = player1.color1;
    // Création d'une fonction sleep() permettant de rendre l'affichage des déplacements
    //    non instantannes, à l'aide de Promise(), setTimeout() et await
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    async function Move (){
        let next = new Array(2); // prochaines coordonnées du joueur, facilite la compréhension du code
        next[0] = current[0] + direction2[0];
        next[1] = current[1] + direction2[1];

        let is_in = true;

        let prevColor = playerColor1; // couleur précédente, permet de gérer la coloration suite au passage du joueur
        GridMatrix[current[0]][current[1]].style.backgroundColor =  "black"; // tête du joueur

        while (next[0]<grid_row && next[0]>-1 && next[1]<grid_col && next[1]>-1){
            document.removeEventListener("keydown", updateDir2, true);

            if (prevColor == ColorTailPlayer1){
                window.KillPlayer1=true //on tue le joueur 1
            } 

            if (prevColor != playerColor1){
                GridMatrix[current[0]][current[1]].style.backgroundColor = playerColor2; // coloriage de la queue
                NumMatrix2[current[0]][current[1]] = player2.nb_player[1];
                is_in = false;

            }else{
                GridMatrix[current[0]][current[1]].style.backgroundColor = playerColor1; // effaçage de la tête
                NumMatrix2[current[0]][current[1]] = player2.nb_player[0];
                

                if (!is_in){
                    NumMatrix2 = Transform_all_0(NumMatrix2, player2.nb_player, grid_row, grid_col);

                    for (let i=0; i<grid_row; i++){
                        for (let j=0; j<grid_col; j++){ 
                            
                            if (NumMatrix1[i][j]==1 && NumMatrix2[i][j]==3){ //on enlève la case à l'adversaire (sinon quand il va revenir dans sa zone il va reprendre les cases qu'on lui a prise) c'est
                                NumMatrix1[i][j]=0                           //ghetto mais je pense que compliqué de faire autrement vu que Growth est séparée du fichier ou alors on peut faire Growth 1 et Growth 2
                            }
                        }
                    }

                    Growth(NumMatrix2, player2.color1, player2.nb_player, grid_row, grid_col);

                    let Player1StillAlive = false

                    for (let i=0; i<grid_row; i++){
                        for (let j=0; j<grid_col; j++){ 
                            let m = player2.current;
                            m[0] = i;
                            m[1] = j;
                            if (GridMatrix[m[0]][m[1]].style.backgroundColor == ColorPlayer1){ 
                                Player1StillAlive=true                       
                            }
                        }

                        if (Player1StillAlive==true){
                            break // pour pas trop consommer de ressources non plus 
                        }

                    }

                    if (Player1StillAlive==false){
                        window.KillPlayer1=true
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

            
            if (window.KillPlayer2==true){
                break // le joueur 2 s'est fait tuer
            }
            
            prevColor = GridMatrix[current[0]][current[1]].style.backgroundColor;
            GridMatrix[current[0]][current[1]].style.backgroundColor =  "black"; //tête du joueur
            
            document.addEventListener("keydown", updateDir2, true);
            
            await sleep(90);

            next[0] = direction2[0] + current[0];
            next[1] = direction2[1] + current[1];
        };
        alert("GAME OVER!\nBlue player died!");
        location.replace("gameOver.html");
    };

    Move();
};

main2();
