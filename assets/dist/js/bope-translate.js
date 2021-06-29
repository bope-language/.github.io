var lines = "";
var contadorNivel = 0;
var blocosVerificados = [];
var id = 0;

function chamacavera() 
{
	var song = new Audio();
	song.src = './assets/files/cavera.mp3';
	song.play();
}

var blocos = [];
	blocos.push({js:"var", blocoInicial: /(\s+|^)BOTA NA CONTA DO PAPA\s+\w+/, blocoFinal: /\s*;\s*/, erro: "Falha ao declarar a variavel!"});
	blocos.push({js:"if", blocoInicial: /(\s+|^)*EU NAO CAI PRA BAIXO\s+\(.*\)\s+\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "Falha ao declarar if"});
	blocos.push({js:"else if", blocoInicial: /(\s+|^)*PARCEIRO\s+\(.*\)\s+\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "Falha ao declarar else if"});
	blocos.push({js:"else", blocoInicial: /\s*EU CAI PRA CIMA\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "Falha ao declarar else"}); 
	blocos.push({js:"do", blocoInicial: /\s*TEM QUE FAZER RIR\s*/, blocoFinal:/\s*QUEM QUER RIR\s*\(.*\)\s*/, erro: "do"}); 
	blocos.push({js:"while", blocoInicial: /\s*QUEM QUER RIR\s*\(.*\)\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "while"});
	blocos.push({js:"for", blocoInicial: /\s*QUEM TAVA COM A CARGA\s*\(.*\)\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "for"});
	//blocos.push({js:"for in", blocoInicial: /\s*QUEM TAVA COM A CARGA\s*\(\w+\s+LEVA PRA DP\s+\w+\s*\)\s*/, erro: "for in"});
	blocos.push({js:"break", blocoInicial: /\s*PEDE PRA SAIR\s*/, blocoFinal: /\s*;\s*/, erro: "break"});
	blocos.push({js:"continue", blocoInicial: /\s*SABE VOAR ESTUDANTE\s*/, blocoFinal: /\s*;\s*/, erro: "continue"});
	blocos.push({js:"switch", blocoInicial: /\s*VCS ENGORDARAM O PORCO\s+\(\w+\)\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "switch"});
	blocos.push({js:"case", blocoInicial: /\s*AGORA A GENTE VAI ASSAR\s+\w+\s*:/, blocoFinal: /\s*PEDE PRA SAIR;\s*/, erro: "case"});
	blocos.push({js:"function", blocoInicial: /\s*MISSAO DADA\s+\w+\s+\(.*\)\s*/, blocoFinal: /\s*NUNCA SERAO\s*/, erro: "function"});
	blocos.push({js:"return", blocoInicial: /\s*EH MISSAO CUMPRIDA\s*\w*\s*;/, erro: "return"});
	blocos.push({js:"console.log", blocoInicial: /(\s+|^)*HOJE EH NO AMOR\(.*\)\s*/, blocoFinal: /\s*;\s*/,erro: "Falha ao declarar o console.log"});

var pattern = [];
	pattern.push({js:'var', pattern: /(\s+|^)BOTA NA CONTA DO PAPA\s+\w+/});
	pattern.push({js:'if (CONDICAO) {', pattern: /(\s+|^)*EU NAO CAI PRA BAIXO\s+\(.*\)\s+\s*/});
	pattern.push({js:'else if (CONDICAO) {', pattern: /(\s+|^)*PARCEIRO\s+\(.*\)\s+\s*/});
	pattern.push({js:'else {', pattern: /\s*EU CAI PRA CIMA\s*/});
	pattern.push({js:'do', pattern: /\s*TEM QUE FAZER RIR\s*/ });
	//pattern.push({pattern: /\s*QUEM QUER RIR\?\s*/}); 
	pattern.push({js:'while (CONDICAO)', pattern: /\s*QUEM QUER RIR\s*\(.*\)\s*/});
	pattern.push({js:'for (CONDICAO)', pattern: /\s*QUEM TAVA COM A CARGA\s*\(.*\)\s*/});
	//pattern.push({js:'for (CONDICAO in CONDICAO)', pattern: /\s*QUEM TAVA COM A CARGA\s*\(\w+\s+LEVA PRA DP\s+\w+\s*\)\s*/});
	pattern.push({js:'break', pattern: /\s*PEDE PRA SAIR\s*/});
	pattern.push({js:'continue', pattern: /\s*SABE VOAR ESTUDANTE\s*/});
	pattern.push({js:'switch (CONDICAO)', pattern: /\s*VCS ENGORDARAM O PORCO\s+\(\w+\)\s*/});
	pattern.push({js:'case (CONDICAO):', pattern: /\s*AGORA A GENTE VAI ASSAR\s+\w+\s*:/});
	pattern.push({js:'function NOME (CONDICAO) {', pattern: /\s*MISSAO DADA\s+\w+\s*\(.*\)\s*/});
	pattern.push({js:'return NOME;', pattern: /\s*EH MISSAO CUMPRIDA\s*\w*\s*/});
	pattern.push({js:'console.log (CONDICAO);', pattern: /(\s+|^)*HOJE EH NO AMOR\(.*\)\s*/});
	pattern.push({js:'}', pattern: /\s*NUNCA SERAO\s*/});
	pattern.push({pattern: /\s*\w+\s*(=|\+=|\-=)\s*.+;/});
	pattern.push({pattern: /\/\/\s*\w*|\/\*\s*\w*|\s*\w*\*\//});
	pattern.push({pattern: /\w+\s*\=+\s*\w+\s*(\+|\-)\s*\w+|\d+\s*(\+|\-)\s*\d+|\w+?(\+\+|\-\-)|(\+\+|\-\-)\w+|\w+\s*(\/|\*|\%)\s*\w+/});


var tokens = [];
	tokens.push({js:'var', rl:'BOTA NA CONTA DO PAPA', pattern: /(\s+|^)BOTA NA CONTA DO PAPA\s+\w+/});
	tokens.push({js:'if', rl:'EU NAO CAI PRA BAIXO',  pattern: /(\s+|^)*EU NAO CAI PRA BAIXO\s+\(.*\)\s+\s*/,});
	tokens.push({js:'else if', rl:'PARCEIRO', pattern: /(\s+|^)*PARCEIRO\s+\(.*\)\s+\s*/});
	tokens.push({js:'else', rl:'EU CAI PRA CIMA', pattern: /\s*EU CAI PRA CIMA\s*/});
	tokens.push({js:'do', rl:'TEM QUE FAZER RIR', pattern: /\s*TEM QUE FAZER RIR\s*/ });
	tokens.push({js:'while', rl:'QUEM QUER RIR', pattern: /\s*QUEM QUER RIR\s*\(.*\)\s*/});
	tokens.push({js:'for', rl:'QUEM TAVA COM A CARGA', pattern: /\s*QUEM TAVA COM A CARGA\s*\(.*\)\s*/});
	//tokens.push({comp:2, js1:'for', rl1:'QUEM TAVA COM A CARGA', js2:'in', rl2:'LEVA PRA DP', pattern: /\s*QUEM TAVA COM A CARGA\s*\(\w+\s+LEVA PRA DP\s+\w+\s*\)\s*/});
	tokens.push({js:'break', rl:'PEDE PRA SAIR', pattern: /\s*PEDE PRA SAIR\s*/});
	tokens.push({js:'continue', rl:'SABE VOAR ESTUDANTE', pattern: /\s*SABE VOAR ESTUDANTE\s*/});
	tokens.push({js:'switch', rl:'VCS ENGORDARAM O PORCO', pattern: /\s*VCS ENGORDARAM O PORCO\s+\(\w+\)\s*/});
	tokens.push({js:'case', rl:'AGORA A GENTE VAI ASSAR', pattern: /\s*AGORA A GENTE VAI ASSAR\s+\w+\s*:/});
	tokens.push({js:'function', rl:'MISSAO DADA', pattern: /\s*MISSAO DADA\s+\w+\s*\(.*\)\s*/});
	tokens.push({js:'return', rl:'EH MISSAO CUMPRIDA', pattern: /\s*EH MISSAO CUMPRIDA\s*\w*\s*;/});
	tokens.push({js:'console.log', rl:'HOJE EH NO AMOR', pattern: /(\s+|^)*HOJE EH NO AMOR\(.*\)\s*/});
	tokens.push({js:'}', rl:'NUNCA SERAO', pattern: /\s*NUNCA SERAO\s*/});

	
function funcaorotular() 
{
	chamacavera();
	var code = document.getElementById("codigo").value;
	lines = code.split("\n");
	var resultado = "";
	
	contadorNivel = 0;
	blocosVerificados = [];
	id = 0;
		
	for(var i=1; i<=lines.length; i++)
	{
		resultado += verificaBloco(lines[i-1], i);
	}
	
	if( blocosVerificados.length > 0 )
	{
		for(var g = 0; g < blocosVerificados.length; g++) 
			console.log(blocoToString(blocosVerificados[g]));
	
		var index = blocosVerificados.length - 1;
		resultado += 'O bloco da linha ' + blocosVerificados[index].linha + ' não está correto';
	}
	
	if(resultado == "")
	{	
		for(var i=1; i<=lines.length; i++)
		{
			resultado += traduzir(lines[i-1]) + "\n";
		}
	}
	
	document.getElementById("resultado").innerHTML = resultado;
}


function traduzir(codeLine)
{
	do {
		for(var j = 0; j < tokens.length; j++)
		{
			if( codeLine.trim().search(tokens[j].pattern) != -1)
			{
				var t = codeLine.replace(tokens[j].rl, tokens[j].js);
				return t;
			}
		}
	} while (j < tokens.length);
	return codeLine;
}

function verificaBloco(codeLine, line)
{

	var resultado = "";
		
	for(var j=0; j< blocos.length; j++)
	{
		if( codeLine.trim().search(blocos[j].blocoInicial) > -1 )
		{
			if(blocos[j].blocoFinal != null)
			{
				contadorNivel++;
				blocosVerificados.push({id:id, linha:line, nivel:contadorNivel, js:blocos[j].js, blocoInicial:blocos[j].blocoInicial.toString(), blocoFinal:blocos[j].blocoFinal });
				
				console.log('['+ id +'] Adicionando o item '+ blocos[j].js + ' da linha ' + line );
				
				id++;				
			}
			
		}
	

		if(blocos[j].blocoFinal != null)
		{	
			if( codeLine.trim().search(blocos[j].blocoFinal) > -1 )
			{
				for(var i=0; i < blocosVerificados.length; i++)
				{										
					if( blocosVerificados[i].js == blocos[j].js && blocosVerificados[i].nivel == contadorNivel)
					{						
						for(var g = 0; g < blocosVerificados.length; g++) 
						{	
							if(blocosVerificados[g].id == blocosVerificados[i].id) 
							{		
								console.log('['+ blocosVerificados[i].id +'] Removendo o item '+ blocosVerificados[i].js + ' da linha ' + blocosVerificados[i].linha);							
								blocosVerificados.splice(g, 1);	
							}
						}
						contadorNivel--;		
					}
				}
							
			}
		}
		
	}
	
	return resultado;
}

function verificaSintaxe(codeLine, line)
{
	var resultado = "";
	
	if(codeLine.trim().length > 0 )
	{	
		var ok = false;
		
		do {
			for(var j = 0; j < pattern.length; j++)
			{
				if(codeLine.trim().search(pattern[j].pattern) > -1 )
				{
					ok = true;
				}
				if(!ok)
				{
					resultado += "Erro de sintaxe na linha " + line + "\n";
				}
			}
		} while(j < tokens.length);
		
	}
	
	
	return resultado;
}
	
function blocoToString(bloco)
{
	return '[' + bloco.id + '] l/n('+ bloco.linha +'/' + bloco.nivel +') - JS ' + bloco.js + ' PATTERN ' + bloco.blocoInicial;
}
