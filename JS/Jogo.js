
const canvas = document.getElementById("Canva");
const ctx = canvas.getContext("2d");
const pacman = document.getElementById("pacman");


const musica = new Audio("./Musicas/Fundo.wav");
musica.loop = true;

document.addEventListener("click", () => {
    musica.play();
});

const tamanhoParede = 25;
const jogador = new Pacman(30, 30, 20, 20, 1.1);

const fantasmas = [
    new Fantasmas(229, 275, 20, 20, 1, "red", "perseguidor"),
    new Fantasmas(229, 275, 20, 20, 1, "orange", "aleatorio"),
    new Fantasmas(229, 275, 20, 20, 1, "pink", "previsor"),
    new Fantasmas(229, 275, 20, 20, 1, "blue", "aleatorio")
];

let pontuacao = 0;
let vidas = 3;

// mapa do jogo, onde 1 é parede e 0 é caminho
const Mapa = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function desenharPontos() {
    for (let linha = 0; linha < Mapa.length; linha++) {
        for (let coluna = 0; coluna < Mapa[linha].length; coluna++) {
            if (Mapa[linha][coluna] == 2) {
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.arc(
                    coluna * tamanhoParede + tamanhoParede / 2,
                    linha * tamanhoParede + tamanhoParede / 2,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
}

function desenharMapa() {
    for (let linha = 0; linha < Mapa.length; linha++) {
        for (let coluna = 0; coluna < Mapa[linha].length; coluna++) {

            let parede = Mapa[linha][coluna];

            if (parede == 1) {

                ctx.strokeStyle = "blue";
                ctx.lineWidth = 2; // Grossura borda parede 
                ctx.strokeRect(
                    coluna * tamanhoParede,
                    linha * tamanhoParede,
                    tamanhoParede,
                    tamanhoParede
                );
            }

        }
    }

}

function colidiu(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function perderVida() {
    vidas--;

    // reset posição do jogador
    jogador.x = 30;
    jogador.y = 30;

    // opcional: reset fantasmas também
    fantasmas.forEach(f => {
        f.x = 229;
        f.y = 275;
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharMapa();
    desenharPontos();

    jogador.atualizar();
    jogador.desenhar(ctx, pacman);

    fantasmas.forEach((fantasma) => {
        fantasma.atualizar(jogador);
        fantasma.desenhar(ctx);

        if (colidiu(jogador, fantasma)) {
            perderVida();
        }
    });


    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";

    ctx.fillText("Pontuação: " + pontuacao, 2, 600);
    ctx.fillText("Vidas: " + vidas, 150, 600);

    if (pontuacao >= 218) {
        ctx.font = "50px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Você venceu!", 110, 300);
        return;
    }

    if (vidas <= 0) {

        document.addEventListener("click", () => {
            musica.stop();
        });

        ctx.font = "50px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Game Over!", 110, 300);
        return;
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight" || e.key == "d") jogador.proximaDirecao = "right";
    if (e.key == "ArrowLeft" || e.key == "a") jogador.proximaDirecao = "left";
    if (e.key == "ArrowUp" || e.key == "w") jogador.proximaDirecao = "up";
    if (e.key == "ArrowDown" || e.key == "s") jogador.proximaDirecao = "down";
});

gameLoop();