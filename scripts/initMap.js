const grid_row = 100;
const grid_col = 100;

// Création et mise en forme de la grille <=> Map
const grid = document.getElementById("grid");
/*grid.style.width = grid_col*15 + "px";
grid.style.height = grid_row*15 + "px";*/
grid.style.gridTemplateColumns = "repeat(" + String(grid_col) + ", 1fr)";
grid.style.gridTemplateRows = "repeat(" + String(grid_row) + ", 1fr)";

window.KillPlayer2 = false // variable globale pour annoncer quand le joueur 1 tue le 2
window.KillPlayer1 = false // variable globale pour annoncer quand le joueur 2 tue le 1


// Création de matrices à part correspondantes à la map
let GridMatrix = new Array(grid_row);
let NumMatrix1 = new Array(grid_row);
let NumMatrix2 = new Array(grid_row);

for (let i=0; i<grid_row; i++){
    GridMatrix[i] = new Array(grid_col);
    NumMatrix1[i] = new Array(grid_col);
    NumMatrix2[i] = new Array(grid_col);
};

// Création d'une pseudo matrice avec le format d'un repère donné par les indices d'une matrice
//    en (i,j) avec 0 <= j/i < grid_col/grid_row (i désigne tjr l'indice des lignes et j celui des colonnes)
// On crée des <div> de classe "bg" avec pour id les coordonnées du repère (i,j)
for (let i = 0; i < grid_row; i++) {
    for (let j = 0; j < grid_col; j++) {

        const cell = document.createElement('div');
        //const bg = document.createElement('div');
        cell.classList.add('cell'); // Ajoute la classe "cell" à la cellule
        //bg.classList.add('bg');
        //bg.id = String(i + ',' + j);
        cell.id = String(i + ',' + j);
        grid.appendChild(cell);
        //cell.appendChild(bg);
        cell.style.backgroundColor = "white";
        GridMatrix[i][j] = cell;
        NumMatrix1[i][j] = 0;
        NumMatrix2[i][j] = 0;
    };
};
