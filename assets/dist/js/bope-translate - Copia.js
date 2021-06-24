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
	blocos.push({js:"var", blocoInicial: /(\s+|^)LEI DO JEITAO\s+\w+/, erro: "Falha ao declarar variavel"});
	blocos.push({js:"if", blocoInicial: /(\s+|^)*QUEM ESTUDA\s+\(.*\)\s+PASSA\s*/, blocoFinal: /\s*ARRUMA A CALÇA\s*/, erro: "Falha ao declarar if"});
	blocos.push({js:"else if", blocoInicial: /(\s+|^)*QUEM NAO ESTUDA \(.*\)\s*/, blocoFinal: /\s*ARRUMA A CALÇA\s*/, erro: "Falha ao declarar else if"});
	blocos.push({js:"else", blocoInicial: /\s*NAO PASSA\s*/, blocoFinal: /\s*ARRUMA A CALÇA\s*/, erro: "Falha ao declarar else"}); //precisa ver as outras linhas
	blocos.push({js:"do", blocoInicial: /\s*VO CONTA UMA HISTORIA\s*/, blocoFinal:/\s*JA CONTEI ESSA HISTORIA\?\s*\(.*\)\s*/, erro: "do"}); //precisa ver as outras linhas
	blocos.push({js:"while", blocoInicial: /\s*JA CONTEI ESSA HISTORIA\?\s*\(.*\)\s*/, blocoFinal: /\s*ARRUMA A CALÇA\s*/, erro: "while"});
	blocos.push({js:"for", blocoInicial: /\s*SE EU GANHAR NA MEGA SENA\s*\(.*\)\s*/, erro: "for"});
	blocos.push({js:"for in", blocoInicial: /\s*SE EU GANHAR NA MEGA SENA\s*\(\w+\s+VENHO DE MERCEDES\s+\w+\s*\)\s*/, erro: "for in"});
	blocos.push({js:"break", blocoInicial: /\s*PULO DO GATO;\s*/, erro: "break"});
	blocos.push({js:"continue", blocoInicial: /\s*CQD;\s*/, erro: "continue"});
	blocos.push({js:"switch", blocoInicial: /\s*METODO DO JACK\s+\(\w+\)\s*/, blocoFinal: /\s*ARRUMA A CALÇA\s*/, erro: "switch"});
	blocos.push({js:"case", blocoInicial: /\s*POR PARTE\s+\w+\s*:/, blocoFinal: /\s*PULO DO GATO;\s*/, erro: "case"});
	blocos.push({js:"function", blocoInicial: /\s*COMEÇA A SONHAR\s+\w+\s+\(.*\)\s*/, blocoFinal: /\s*ARRUMA A CALÇA\s*/, erro: "function"});
	blocos.push({js:"return", blocoInicial: /\s*SEGUE O BAILE\s*\w*\s*;/, erro: "return"});

var pattern = [];
	pattern.push({js:'var', pattern: /(\s+|^)LEI DO JEITAO\s+\w+/});
	pattern.push({js:'if (CONDICAO) {', pattern: /(\s+|^)*QUEM ESTUDA\s+\(.*\)\s+PASSA\s*/,});
	pattern.push({js:'else if (CONDICAO) {', pattern: /(\s+|^)*QUEM NAO ESTUDA \(.*\)\s*/});
	pattern.push({js:'else', pattern: /\s*NAO PASSA\s*/});
	pattern.push({js:'do', pattern: /\s*VO CONTA UMA HISTORIA\s*/ });
	pattern.push({pattern: /\s*JA CONTEI ESSA HISTORIA\?\s*/}); 
	pattern.push({js:'while (CONDICAO)', pattern: /\s*JA CONTEI ESSA HISTORIA\?\s*\(.*\)\s*/});
	pattern.push({js:'for (CONDICAO)', pattern: /\s*SE EU GANHAR NA MEGA SENA\s*\(.*\)\s*/});
	pattern.push({js:'for (CONDICAO in CONDICAO)', pattern: /\s*SE EU GANHAR NA MEGA SENA\s*\(\w+\s+VENHO DE MERCEDES\s+\w+\s*\)\s*/});
	pattern.push({js:'break;', pattern: /\s*PULO DO GATO;\s*/});
	pattern.push({js:'continue;', pattern: /\s*CQD;\s*/});
	pattern.push({js:'switch (CONDICAO)', pattern: /\s*METODO DO JACK\s+\(\w+\)\s*/});
	pattern.push({js:'case (CONDICAO):', pattern: /\s*POR PARTE\s+\w+\s*:/});
	pattern.push({js:'break;', pattern:  /\s*PULO DO GATO;\s*/});
	pattern.push({js:'function NOME (CONDICAO)', pattern: /\s*COMEÇA A SONHAR\s+\w+\s*\(.*\)\s*/});
	pattern.push({js:'return NOME;', pattern: /\s*SEGUE O BAILE\s*\w*\s*;/});
	pattern.push({js:'}', pattern: /\s*ARRUMA A CALÇA\s*/});
	pattern.push({pattern: /\s*\w+\s*(=|\+=|\-=)\s*.+;/}); //atribuicao
	pattern.push({pattern: /\/\/\s*\w*|\/\*\s*\w*|\s*\w*\*\//}); //comentario
	pattern.push({pattern: /\w+\s*\=+\s*\w+\s*(\+|\-)\s*\w+|\d+\s*(\+|\-)\s*\d+|\w+?(\+\+|\-\-)|(\+\+|\-\-)\w+|\w+\s*(\/|\*|\%)\s*\w+/}); //operacao matematica


var tokens = [];
	tokens.push({js:'var', rl:'LEI DO JEITAO', pattern: /(\s+|^)LEI DO JEITAO\s+\w+/});
	tokens.push({js:'if', rl:'QUEM ESTUDA',  pattern: /(\s+|^)*QUEM ESTUDA\s+\(.*\)\s+PASSA\s*/,});
	tokens.push({js:'else if', rl:'QUEM NAO ESTUDA', pattern: /(\s+|^)*QUEM NAO ESTUDA \(.*\)\s*/});
	tokens.push({js:'else', rl:'NAO PASSA', pattern: /\s*NAO PASSA\s*/});
	tokens.push({js:'do', rl:'VO CONTA UMA HISTORIA', pattern: /\s*VO CONTA UMA HISTORIA\s*/ });
	tokens.push({js:'while', rl:'JA CONTEI ESSA HISTORIA', pattern: /\s*JA CONTEI ESSA HISTORIA\?\s*\(.*\)\s*/});
	tokens.push({js:'for', rl:'SE EU GANHAR NA MEGA SENA', pattern: /\s*SE EU GANHAR NA MEGA SENA\s*\(.*\)\s*/});
	tokens.push({comp:2, js1:'for', rl1:'SE EU GANHAR NA MEGA SENA', js2:'in', rl2:'VENHO DE MERCEDES', pattern: /\s*SE EU GANHAR NA MEGA SENA\s*\(\w+\s+VENHO DE MERCEDES\s+\w+\s*\)\s*/});
	tokens.push({js:'break;', rl:'PULO DO GATO;', pattern: /\s*PULO DO GATO;\s*/});
	tokens.push({js:'continue;', rl:'CQD;', pattern: /\s*CQD;\s*/});
	tokens.push({js:'switch', rl:'METODO DO JACK', pattern: /\s*METODO DO JACK\s+\(\w+\)\s*/});
	tokens.push({js:'case', rl:'POR PARTE', pattern: /\s*POR PARTE\s+\w+\s*:/});
	tokens.push({js:'break;', rl:'PULO DO GATO;', pattern: /\s*PULO DO GATO;\s*/});
	tokens.push({js:'function', rl:'COMEÇA A SONHAR', pattern: /\s*COMEÇA A SONHAR\s+\w+\s*\(.*\)\s*/});
	tokens.push({js:'return', rl:'SEGUE O BAILE', pattern: /\s*SEGUE O BAILE\s*\w*\s*;/});
	tokens.push({js:'}', rl:'ARRUMA A CALÇA', pattern: /\s*ARRUMA A CALÇA\s*/});

	
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
	
	//se não trazer crítica entao se faz a tradução
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
	//inicial
		//teste
		//teste
	//final
	
	//pegar a linha do inicial
	//percorrer todas as linhas ate achar o primeiro bloco final
	//salvar se o bloco final ja foi usado para fechar um bloco final, para saber se nao vai reutilizar

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
			//buscar o blocofinal
			if( codeLine.trim().search(blocos[j].blocoFinal) > -1 )
			{
				//percorre todos os blocos ja verificados para ver se o final tem o mesmo padrao de um inicial já verificado
				for(var i=0; i < blocosVerificados.length; i++)
				{					
					//valida se o bloco inicial de todos os patterns trata o mesmo lexema e tambem se está no mesmo escopo do contador					
					if( blocosVerificados[i].js == blocos[j].js && blocosVerificados[i].nivel == contadorNivel)
					{						
						//remover o item
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
					else
					{
						//bloco que nao tem inicio mas tem um fim
						
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
	
	//valida se a linha é em branco
	if(codeLine.trim().length > 0 )
	{	
		var ok = false;
		
		for(var j=0; j< pattern.length; j++)
		{
			if( codeLine.trim().search(pattern[j].pattern) > -1 )
			{
				
				ok = true;
			}
		}
		
		if(!ok)
		{
			resultado += "Erro de sintaxe na linha " + line + "\n";
		}
	}
	
	
	return resultado;
}
	
function blocoToString(bloco)
{
	return '[' + bloco.id + '] l/n('+ bloco.linha +'/' + bloco.nivel +') - JS ' + bloco.js + ' PATTERN ' + bloco.blocoInicial;
}
