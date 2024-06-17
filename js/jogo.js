function start() {
	//Area Divs
	$('#start').hide();
	$('#gameover').hide();
	$('#vitoria').hide();
	$('#area_jogo').append("<div id='insectoide' class='insectoide'></div>");
	$('#area_jogo').append("<div id='bot2' class='bot2'></div>");
	$('#area_jogo').append("<div id='bot1' class='bot1'></div>");
	$('#area_jogo').append("<div id='omnitrix' class='omnitrix'></div>");
	$('#area_jogo').append("<div id='vida_insectoide' class='vida'></div>");
	$('#area_jogo').append("<div id='pontuacao' class='pontos'>Pontos: </div>");
	
	//Variaveis globais
	var insectoide_local = 0;
	var tecla = {
		C:38,
		B:40,
		E:37,
		D:39,
		T:32
	}
	var jogo = {}
	jogo.pressionou = [];
	var vida = 4;
	var pontos = 0;
	var countTiro = 0;
	var ultimoTiro = 0;
	var tempoEntreTiros = 300;
	var invencivel = false;
	var insectoide_morta = false;
	var omnitrix_morto = false;
	var ultimoMultiploVerificado = 0;
	var velocidade = 1;

	nasce_bot2();
    nasce_bot1();
    nasce_omnitrix();
    
	
	//Teclas pressionadas
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
	});


	$(document).keyup(function(e){
	   jogo.pressionou[e.which] = false;
	});	

	//Sons
	var somjogo=document.getElementById("somjogo");		
	var laserbot2=document.getElementById("laserbot2");		
	var laserbot1=document.getElementById("laserbot1");	
	var tiroinsectoide=document.getElementById("tiroinsectoide");		
	var salva=document.getElementById("salva");		
	var explode=document.getElementById("explode");		
	var explodeinsectoide=document.getElementById("explodeinsectoide");		
	var grito=document.getElementById("grito");		
	
	//Motor do jogo
	setInterval(loop,30);

	function loop() {
		somjogo.addEventListener("ended", function(){ somjogo.currentTime = 0; somjogo.play(); }, false);
		somjogo.play();
		movimentacenario();
		movimentainsectoide();
		movimentabot2();
		movimentabot1();
		verificaPontuacao();
		movimentaomnitrix();
		movimenta_bot2tiro();
		movimenta_bot1tiro();
		movetiro();
		mostrapontos();
		colisao();
	}
	
	function movimentacenario() {
		var posicao = parseInt($('.area_jogo').css("background-position"));
		$('.area_jogo').css("background-position",posicao-1);
	} //Fim movimentacenario

	function movimentainsectoide() {
		if ($('#gameover').is(':visible')) {
			return;
		}
		if(jogo.pressionou[tecla.C]){
			var topo = parseInt($('#insectoide').css("top"));
			$('#insectoide').css("top", topo-8);
			if(topo<=10)
				$('#insectoide').css("top", 10);
		}

		if(jogo.pressionou[tecla.B]){
			var down = parseInt($('#insectoide').css("top"));
			$('#insectoide').css("top", down+8);
			if(down>=256)
				$('#insectoide').css("top", 256);
		}

		if(jogo.pressionou[tecla.D]){
			var left = parseInt($('#insectoide').css("left"));
			$('#insectoide').css("left", left+8);
			if(left>=660)
				$('#insectoide').css("left", 660);
		}

		if(jogo.pressionou[tecla.E]){
			var left = parseInt($('#insectoide').css("left"));
			$('#insectoide').css("left", left-10);
			if(left<=0)
				$('#insectoide').css("left", 0);
		}
		
		if (jogo.pressionou[tecla.T]) {
			var now = performance.now();
			if (now - ultimoTiro > tempoEntreTiros) {
				ultimoTiro = now;
				if ($('#tiro').length == 0) {
					if (insectoide_morta == true){
						return;
					}
					countTiro++;
					var pos_y = parseFloat($('#insectoide').css("top"));
					var pos_x = parseFloat($('#insectoide').css("left"));
					var newDivId = 'tiro' + countTiro;
					console.log('tiro' + countTiro);
					$('#area_jogo').append("<div id='" + newDivId + "' class='tiro'></div>");
					$('#' + newDivId).css("left", pos_x + 20);
					$('#' + newDivId).css("top", pos_y + 45);
				}
			} 
		}
	} //Movimenta insectoide

	function verificaPontuacao() {
		if (pontos >= ultimoMultiploVerificado + 1000) {
			velocidade += 1;
			ultimoMultiploVerificado += 1000;
		}
		
		if (pontos >= 10000) {
			mostrarTelaDeVitoria();
		}
	}

	function movimentabot2() {
		var left = parseInt($('#bot2').css("left"));
    	$('#bot2').css("left", left - (5 + velocidade));
		if(left<=-10) {
			nasce_bot2();
		}
		
		if((left<=810) && (left>=800) && ($('#bot2_tiro').length==0)){
			insectoide_local = parseInt($('#insectoide').css('top'));

			var topo = parseInt($('#bot2').css("top"));
			$('#area_jogo').append("<div id='bot2_tiro' class='tiro_bot2'></div>");		
			$('.tiro_bot2').css("top", topo);			
		}
		
	} //movimenta bot2
	
	function nasce_bot2() {
		var local = parseInt(Math.random() * 300);
		$('#bot2').css("top", local);
		$('#bot2').css("left", 800);
	}
	
	function movimenta_bot2tiro() {
		if($('#bot2_tiro').length>0) {
			laserbot2.play();
			var left = parseInt($('#bot2_tiro').css("left"));
        	$('#bot2_tiro').css("left", left - (10 + velocidade));
			
			if(left <=0) {
				$('#bot2_tiro').remove();
			}
		}
	} //fim movimenta_bot2tiro

	function movimentabot1() {
		if ($('#gameover').is(':visible')) {
			return;
		}
		var left = parseInt($('#bot1').css("left"));
    	$('#bot1').css("left", left - (3 + velocidade));
		if(left<=-10) {
			nasce_bot1();
		}
		
		if((left<=810) && (left>=800) && ($('#bot1_tiro').length==0)){
			insectoide_local = parseInt($('#insectoide').css('top'));

			var topo = parseInt($('#bot1').css("top"));
			$('#area_jogo').append("<div id='bot1_tiro' class='tiro_bot1'></div>");		
			$('.tiro_bot1').css("top", topo);			
		}
		
	} //movimenta bot1
	
	function nasce_bot1() {
		var local = parseInt(Math.random() * 300);
		$('#bot1').css("top", local);
		$('#bot1').css("left", 800);
	}
	
	function movimenta_bot1tiro() {
		if ($('#bot1_tiro').length > 0) {
			laserbot1.play();
			var left = parseInt($('#bot1_tiro').css("left"));
			$('#bot1_tiro').css("left", left - (5 + velocidade));
			
			if(left <=0) {
				$('#bot1_tiro').remove();
			}
		}
	} //fim movimenta_bot1tiro
	
	function movetiro() {
		$('.tiro').each(function () {
			var tiro = $(this);
			var left = parseInt(tiro.css("left"));
			tiro.css("left", left + 20);
			if (left >= 810 || left <= 0) {
				tiro.remove();
			}
		});
	}
	
	
	function movimentaomnitrix() {
		if ($('#gameover').is(':visible')) {
			return;
		}
		var left = parseInt($('#omnitrix').css("left"));
		$('#omnitrix').css("left", left + 5);
		if (left >= 640) {
			nasce_omnitrix();
		}
	}
	
	function nasce_omnitrix() {
		if (omnitrix_morto == true){
			return;
		}
		var local = Math.random() * 250;
		$('#omnitrix').css("top", local);
		$('#omnitrix').css("left", -30);
	}
	
	function colisao() {

		$('.tiro').each(function () {
			var tiro = $(this);
			var colisaoTirobot2 = tiro.collision($("#bot2"));
			if (colisaoTirobot2.length > 0) {
				explode.play();
				var posicaoX = $('#bot2').css("left");
				var posicaoY = $('#bot2').css("top");
				tiro.remove();
				$('#bot2').remove();
				$('#area_jogo').append("<div id='bot2_exp' class='bot2_explode'></div>");
				$('#bot2_exp').css('top', posicaoY);
				$('#bot2_exp').css('left', posicaoX);
				setTimeout(function () {
					$('#area_jogo').append("<div id='bot2' class='bot2'></div>");
					$('#bot2_exp').remove();
					nasce_bot2(); 
				}, 400);
				pontos = pontos + 100;
			}
		});
		
		// Verifica colisão entre cada tiro e o supremo
		$('.tiro').each(function () {
			var tiro = $(this);
			var colisaoTirobot1 = tiro.collision($("#bot1"));
			if (colisaoTirobot1.length > 0) {
				explode.play();
				var posicaoX = $('#bot1').css("left");
				var posicaoY = $('#bot1').css("top");
				tiro.remove();
				$('#bot1').remove();
				$('#area_jogo').append("<div id='bot1_exp' class='bot1_explode'></div>");
				$('#bot1_exp').css('top', posicaoY);
				$('#bot1_exp').css('left', posicaoX);
				setTimeout(function () {
					$('#area_jogo').append("<div id='bot1' class='bot1'></div>");
					$('#bot1_exp').remove();
					nasce_bot1();
				}, 400);
				pontos = pontos + 100;
			}
		});

		var colisao_insectoide_omnitrix =  ($("#insectoide").collision($("#omnitrix")));
		var colisao_bot2_tiro_omnitrix =  ($("#bot2_tiro").collision($("#omnitrix")));
		var colisao_bot1_tiro_omnitrix =  ($("#bot1_tiro").collision($("#omnitrix")));
		var colisaoinsectoidebot2 = $("#insectoide").collision($("#bot2"));
        var colisaoinsectoidebot1 = $("#insectoide").collision($("#bot1"));
        var colisaoinsectoidebot2Tiro = $("#insectoide").collision($("#bot2_tiro"));
        var colisaoinsectoidebot1Tiro = $("#insectoide").collision($("#bot1_tiro"));
	
		if(colisao_insectoide_omnitrix.length > 0) {
			omnitrix_morto = true;
			salva.play();
			$('#omnitrix').remove();
			setTimeout(function() {
				omnitrix_morto = false;
				$('#area_jogo').append("<div id='omnitrix' class='omnitrix'></div>");
				nasce_omnitrix();
			},2000);
			pontos = pontos + 200;
		}
	
		if(colisao_bot2_tiro_omnitrix.length > 0) {
			omnitrix_morto = true;
			grito.play();
			$('#omnitrix').remove();
			$('#bot2_tiro').remove();
			setTimeout(function(){
				omnitrix_morto = false;
				$('#area_jogo').append("<div id='omnitrix' class='omnitrix'></div>");
				nasce_omnitrix();
			},5000);
			pontos = pontos - 500;
		}
	
		if(colisao_bot1_tiro_omnitrix.length > 0) {
			omnitrix_morto = true;
			grito.play();
			$('#omnitrix').remove();
			$('#bot1_tiro').remove();
			setTimeout(function(){
				omnitrix_morto = false;
				$('#area_jogo').append("<div id='omnitrix' class='omnitrix'></div>");
				nasce_omnitrix();
			},10000);
			pontos = pontos - 500;
		}

		if (invencivel) return;

		if ((colisaoinsectoidebot2.length > 0 || colisaoinsectoidebot1.length > 0 ||
			colisaoinsectoidebot2Tiro.length > 0 || colisaoinsectoidebot1Tiro.length > 0) && !invencivel) {
			insectoide_morta = true;
			explodeinsectoide.play();
			removevida();
			if (vida == 0) {
				$('#insectoide').remove();
				return;
			}
			var posicao_x = $('#insectoide').css("left");
			var posicao_y = $('#insectoide').css("top");
			$('#insectoide').remove();
			$('#area_jogo').append("<div id='insectoide_exp' class='insectoide_explode'></div>");
			$('#insectoide_exp').css('top', posicao_y);
			$('#insectoide_exp').css('left', posicao_x);
			setTimeout(function() {
				$('#insectoide_exp').remove();
				$('#area_jogo').append("<div id='insectoide' class='insectoide invencivel'></div>");
				invencivel = true;
				insectoide_morta = false;
				setTimeout(function() {
					invencivel = false;
					$('#insectoide').removeClass('invencivel');
				}, 3000);
			}, 1000);
			pontos -= 100;
		}
		
	}
	
	function mostrapontos() {
		$('#pontuacao').text("Pontos: " + pontos);
	}
	
	function removevida() {
		switch(vida) {
			case 4: {
				$('#vida_insectoide').css("background-position","-90px 92px");
				vida--;
				break;
			}
			case 3:{
				$('#vida_insectoide').css("background-position","-180px 92px");
				vida--;
				break;
			}
			case 2:{
				$('#vida_insectoide').css("background-position","-270px 92px");
				vida--;
				break;
			}
			default: {
				$('#insectoide').remove();
				$('#insectoide_exp').remove();
				$('#bot2').remove();
				$('#bot2_exp').remove();
				$('#bot2_tiro').remove();
				$('#bot1').remove();
				$('#bot1_exp').remove();
				$('#bot1_tiro').remove();
				$('#omnitrix').remove();
				$('#vida_insectoide').remove();
				$('#gameover').show();
				return false;
			}
		}
	}

	function mostrarTelaDeVitoria() {
		$('#insectoide').remove();
		$('#insectoide_exp').remove();
		$('#bot2').remove();
		$('#bot2_exp').remove();
		$('#bot2_tiro').remove();
		$('#bot1').remove();
		$('#bot1_exp').remove();
		$('#bot1_tiro').remove();
		$('#omnitrix').remove();
		$('#vida_insectoide').remove();
		$('#vitoria').show();
		$('#gameover').hide();
	}
}
function reiniciar() {
location.reload();
}