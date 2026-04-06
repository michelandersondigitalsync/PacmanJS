class Pacman {
    constructor(x, y, width, height, velocidade) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocidade = velocidade;

        this.frame = 0;
        this.animacao = 0;

        this.direcao = null;
        this.proximaDirecao = null;
    }

    comer() {
        let coluna = Math.floor((this.x + this.width / 2) / tamanhoParede);
        let linha = Math.floor((this.y + this.height / 2) / tamanhoParede);

        if (Mapa[linha][coluna] == 2) {
            Mapa[linha][coluna] = 0; // remove o ponto
            pontuacao++;
        }
    }

    atualizar() {
        this.tentarVirar();
        this.comer();

        let nx = this.x;
        let ny = this.y;

        switch (this.direcao) {
            case "right": {

                nx += this.velocidade;
                break;
            }
            case "left": {
                nx -= this.velocidade;
                break;
            }
            case "up": {
                ny -= this.velocidade;
                break;
            }
            case "down": {
                ny += this.velocidade;
                break;
            }
        }

        // verifica colisão considerando o tamanho do personagem
        if (this.podeMover(nx, this.y)) {
            this.x = nx;
        }

        if (this.podeMover(this.x, ny)) {
            this.y = ny;
        }
    }

    podeMover(nx, ny) {
        let left = Math.floor(nx / tamanhoParede);
        let right = Math.floor((nx + this.width - 1) / tamanhoParede);
        let top = Math.floor(ny / tamanhoParede);
        let bottom = Math.floor((ny + this.height - 1) / tamanhoParede);

        return !(
            Mapa[top][left] == 1 ||
            Mapa[top][right] == 1 ||
            Mapa[bottom][left] == 1 ||
            Mapa[bottom][right] == 1
        );
    }

    tentarVirar() {
        if (!this.proximaDirecao) return;

        let nx = this.x;
        let ny = this.y;

        switch (this.proximaDirecao) {
            case "right": nx += this.velocidade; break;
            case "left": nx -= this.velocidade; break;
            case "up": ny -= this.velocidade; break;
            case "down": ny += this.velocidade; break;
        }

        if (this.podeMover(nx, ny)) {
            this.direcao = this.proximaDirecao;
            this.proximaDirecao = null;
        }
    }

    desenhar(ctx, imagem) {

        // animação
        this.animacao++;
        if (this.animacao > 10) {
            this.frame = (this.frame + 1) % 5;
            this.animacao = 0;
        }

        // define ângulo baseado na direção
        let angulo = 0;

        switch (this.direcao) {
            case "right": angulo = 0; break;
            case "down": angulo = Math.PI / 2; break;
            case "left": angulo = Math.PI; break;
            case "up": angulo = -Math.PI / 2; break;
        }

        ctx.save();

        // move o centro para o meio do Pac-Man
        ctx.translate(
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        // rotaciona
        ctx.rotate(angulo);

        // desenha centralizado
        ctx.drawImage(imagem, this.frame * 20, 0, 20, 20, -this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }
}