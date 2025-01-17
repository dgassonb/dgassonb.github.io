class Player {
    constructor(current, color1, color2, nb_player) {
        this.size_zone = 3;
        this.current = Array.of(current[0],current[1]);
        this.color1 = color1;
        this.color2 = color2;
        this.nb_player = Array.of(nb_player[0],nb_player[1]);
    };
};
