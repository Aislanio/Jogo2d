// Alteraçoes basicas do canvas
let canvas = document.getElementById('canvas');//Pegando o elemento canvasl
let ctx = canvas.getContext("2d");

//seu contexto gráfico,Usaremos esse contexto para emitir comandos de desenho.
//Tamanho do canvas
//localStorage.clear();
let ol = document.querySelector("ol");
canvas.width = 512;
canvas.height = 480;


//Adicionando as img

//img de fundo
let fundo = new Image();
fundo.src = "imgs/background.png"

/* Bau */
let bau = new Image();
bau.src = "imgs/bau.png";

/* Monstro */
let  monstro = new Image();
monstro.src = "imgs/monster.png";

/* Heroi */
var heroi = new Image();
heroi.src = "imgs/hero.png";

var carregadas = 0;
var total = 4; // total de imagens do jogo

fundo.onload = carregando;

bau.onload = carregando;

monstro.onload = carregando;

heroi.onload = carregando;
// o que esta acotencendo é que o jogo estar caregando as img 
//de começar

function carregando(){
	carregadas++;
	if(carregadas == total){
 		reset();
 		main();
 		let mn = 0;

 		Object.keys(localStorage).forEach(function(key){

   		let li =  localStorage.getItem(key);
 		if (li != null && li != mn) {
 			ol.innerHTML += li;
 			console.log("mn"+mn);
 			console.log("li"+li);
 			
 		};
 		mn = li;
 	});
 		
 		
 	}
}

let hero = {
 speed: 256, // movimento em pixels por segundo
 x: 0,//poisiçao do elemento no canvas
 y: 0
};
let monster = {
speed: 100,
x: 0,
y: 0
};
let trunk = {
 x: 0,
 y: 0
};

/* contador de baús coletados */
let caught = 0;
let vida = 32;

/* Controle do teclado */
let keysDown = {}; // https://developer.mozilla.org/pt-BR/docs/Web/API/Document/keydown_event
document.addEventListener('keydown', keydownHandle, false);

function keydownHandle(evt){
 keysDown[evt.keyCode] = true;
};

document.addEventListener('keyup', keyupHandler, false);

function keyupHandler(evt){
 delete keysDown[evt.keyCode];
};
/*Quando uma tecla do teclado é pressionada ele armazenada o código da
tecla no array keysDown. Se um código de tecla está no array, o usuário está pressionando essa tecla.
Simples assim! Quando a tecla é liberada então seu código é retirado do array.  
*/

function reset(){
 /* Posiciona o jogador no centro da tela */
 hero.x = canvas.width/2;
 hero.y = canvas.height/2;

 /* Coloca o baú em posição aleatória */
 trunk.x = 32 + (Math.random()*(canvas.width - 100));
 trunk.y = 32 + (Math.random()*(canvas.height - 100));

 /* Coloca o monstro em posição aleatória */
 monster.x = 32 + (Math.random()*(canvas.width - 64));
 monster.y = 32 + (Math.random()*(canvas.height - 64));
};


// Atualizações dos objetos
function update(mod){
 if(87 in keysDown){ // Jogador vai para cima
 hero.y -= hero.speed * mod;
 }
 if(83 in keysDown){ // Jogador vai para baixo
 hero.y += hero.speed * mod;
 }
 if(65 in keysDown){ // Jogador vai para esquerda
 hero.x -= hero.speed * mod;
}
  if(68 in keysDown){ // Jogador vai para direita
 hero.x += hero.speed * mod;
 }


if(monster.y < hero.y -2){
 monster.y += monster.speed * mod;
 }else if(monster.y > hero.y+2){
 monster.y -= monster.speed * mod;
 }else{
 if(monster.x < hero.x)
 monster.x += monster.speed * mod;
 if(monster.x > hero.x)
 monster.x -= monster.speed * mod;
 } 
};

//https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/in
/*A função update será chamada diversas vezes no jogo. A primeira coisa que ela faz é verificar
se alguma das teclas UP, DOWN, LEFT ou RIGHT do seu teclado está sendo pressionada. E se assim for, o
herói é movido na direção correspondente.
 O que pode parecer estranho é o argumento mod passado para função update. O mod
(modificador) é um número baseado no tempo. Se exatamente um segundo se passou desde a última
chamada da função update, então o valor que será passado a ela é igual a 1 e a velocidade do herói será
multiplicado por 1. O que fará com que o jogador se mova 256 pixels. Assim, se se passou a metade de
um segundo, o valor será de 0.5 e o herói vai se mover apenas a metade de sua velocidade e assim por
diante. Esse controle é necessário pois a função update será chamada rapidamente em intervalos de
tempos pouco precisos. O que faria o nosso herói andar ora muito rapidamente ora muito devagar.
Usando esse padrão garantiremos que o herói se mova sempre na mesma velocidade, não importa o quão
rápido (ou lentamente) o script está sendo executado. Mais tarde voltaremos a mexer na função update
para implementar o movimento do monstro. */

function render(){
 // Desenha o fundo
 ctx.drawImage(fundo, 0, 0);
 //Desenha o herói
 ctx.drawImage(heroi, hero.x, hero.y);
 // Desenha o baú
 ctx.drawImage(bau, trunk.x, trunk.y);
 // Desenha o monstro
 ctx.drawImage(monstro, monster.x, monster.y);

 // Desenha o placar
 ctx.fillStyle = "rgb(250, 250, 250)";
 ctx.font = "24px Helvetica";
 ctx.textAlign = "left";
 ctx.textBaseline = "top";
 ctx.fillText("Baus coletados: " + caught, 32, 32 );

 ctx.fillText("Vida:" + vida, 255, 32  );
  	
  
};

/*A função render terá a finalidade de desenhar nosso herói, baú, monstro e imagem de fundo
na tela. Essa função também escreve na tela o número de baús já coletados através da variável caught e
do método fillText. */

var then = Date.now();
// A função Game loop
function main(){
 var now = Date.now();
 var delta = now - then;
 // Limpa o canvas
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 update(delta/1000);
 render();
 colisao();
 then = now;
 requestAnimationFrame(main);
 coliderMonstro() 
 
};

/*O loop principal do jogo é o que controla o fluxo do jogo. Primeiro queremos checar a hora
atual para que possamos calcular o delta (quantos milissegundos se passaram desde o último intervalo).
O valor de delta divido por 1000 (quantidade de milissegundos num segundo) será o valor passado para
a função update. Em seguida capturamos novamente a data atual.*/
//A função requestAnimationFrame é uma função específica para animação. Ela é quem coloca
//a função game em loop


function colisao(){
 if(
 hero.x <= (trunk.x + 32)
 && trunk.x <= (hero.x + 32)
 && hero.y <= (trunk.y + 32)
 && trunk.y <= (hero.y + 32)
 ){
 ++caught;
 reset();
 }
};
/*Quando o herói colide com o baú então o contador caught sofre um incremento em uma unidade,
indicando que o baú foi coletado.*/


function coliderMonstro(){
if(
 hero.x <= (monster.x + 32)
 && monster.x <= (hero.x + 32)
 && hero.y <= (monster.y + 32)
 && monster.y <= (hero.y + 32)
 ){
 if (vida === 0) {
 	ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
 ctx.fillRect(75, 105, 362, 245);
 ctx.fillStyle = "white";
 ctx.font = "24px Helvetica";
 ctx.fillText("Perdeu!", 210, 220);
  score();
 }
 if (vida > 0) {
 	--vida;
 };
 
 }
};

	function score(){
	let scor = ol.childElementCount +1;	
	let caught_clone = 0;
	if (caught => 0 ) {
		localStorage.setItem("score"+scor, "<li>"+caught+"</li>");
		console.log("foi")
		document.location.reload(true);
	};

	
	
   
	
};