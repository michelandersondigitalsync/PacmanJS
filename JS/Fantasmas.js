class Fantasmas {
    constructor(x, y, width, height, velocidade, cor, tipo) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocidade = velocidade;
        this.cor = cor;
        this.tipo = tipo;

        this.frame = 0;
        this.animacao = 0;

        this.direcao = "left"; // direção inicial
    }

    atualizar(pacman) {

        if (this.estaNoCentro()) {
            this.alinharGrid();
            this.escolherDirecao(pacman);
        }

        let nx = this.x;
        let ny = this.y;

        switch (this.direcao) {
            case "right": nx += this.velocidade; break;
            case "left": nx -= this.velocidade; break;
            case "up": ny -= this.velocidade; break;
            case "down": ny += this.velocidade; break;
        }

        if (this.podeMover(nx, ny)) {
            this.x = nx;
            this.y = ny;
        } else {
            // 🔥 tenta outra direção se travar
            this.escolherDirecao(pacman);
        }
    }

    alinharGrid() {
        this.x = Math.round(this.x / tamanhoParede) * tamanhoParede;
        this.y = Math.round(this.y / tamanhoParede) * tamanhoParede;
    }

    estaNoCentro() {
        return (
            this.x % tamanhoParede == 0 &&
            this.y % tamanhoParede == 0
        );
    }

    escolherDirecao(pacman) {

        let direcoes = [
            { nome: "right", x: this.velocidade, y: 0 },
            { nome: "left", x: -this.velocidade, y: 0 },
            { nome: "up", x: 0, y: -this.velocidade },
            { nome: "down", x: 0, y: this.velocidade }
        ];

        const oposto = {
            right: "left",
            left: "right",
            up: "down",
            down: "up"
        };

        let melhores = [];

        for (let d of direcoes) {

            // evita voltar pra trás
            if (d.nome == oposto[this.direcao]) continue;

            let nx = this.x + d.x;
            let ny = this.y + d.y;

            if (!this.podeMover(nx, ny)) continue;

            let alvoX = pacman.x;
            let alvoY = pacman.y;

            // comportamento diferente
            if (this.tipo == "previsor") {
                // tenta prever movimento do pacman
                switch (pacman.direcao) {
                    case "right": alvoX += tamanhoParede * 2; break;
                    case "left": alvoX -= tamanhoParede * 2; break;
                    case "up": alvoY -= tamanhoParede * 2; break;
                    case "down": alvoY += tamanhoParede * 2; break;
                }
            }

            if (this.tipo == "aleatorio") {
                // movimento meio caótico
                alvoX += (Math.random() - 0.5) * 200;
                alvoY += (Math.random() - 0.5) * 200;
            }

            let dx = alvoX - nx;
            let dy = alvoY - ny;

            let distancia = Math.abs(dx) + Math.abs(dy);

            melhores.push({
                direcao: d.nome,
                distancia
            });
        }

        melhores.sort((a, b) => a.distancia - b.distancia);

        if (melhores.length > 0) {
            this.direcao = melhores[0].direcao;
        }
    }

    podeMover(nx, ny) {

        let margem = 0; // evita “grudar” na parede

        let left = Math.floor((nx + margem) / tamanhoParede);
        let right = Math.floor((nx + this.width - margem) / tamanhoParede);
        let top = Math.floor((ny + margem) / tamanhoParede);
        let bottom = Math.floor((ny + this.height - margem) / tamanhoParede);

        return !(
            Mapa[top]?.[left] == 1 ||
            Mapa[top]?.[right] == 1 ||
            Mapa[bottom]?.[left] == 1 ||
            Mapa[bottom]?.[right] == 1
        );
    }

    desenhar(ctx) {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}