var salaSelecionada;

function sair(){

    // Box de mensagens
    var b = document.querySelector('.box-mensagens');

    // Limpa
    b.innerHTML = '';

    // Retira seleção da sala
    salaSelecionada = undefined;

    // Muda view
    var page_home = document.querySelector('#page-home');
    var page_sala = document.querySelector('#page-sala');

    page_home.style.display = 'block';
    page_sala.style.display = 'none';
}

function entrar(sala){
	salaSelecionada = sala;

	// Muda view
	var page_home = document.querySelector('#page-home');
	var page_sala = document.querySelector('#page-sala');

	page_home.style.display = 'none';
	page_sala.style.display = 'block';

	// Capturando os dados do Firebase conforme a sala
	firebase
	.database()
	.ref('salas/' + sala) //caminho base de dados
	.on('value', function(snapshot) {
		var salaRetorno = snapshot.val(); //snapshot = retorno - então se snapshot conter algum val = valor
		// Se retornou dados
		console.log(salaRetorno);
		if (salaRetorno) {
			var titulo = document.querySelector('#header-sala .title');
			// Atribui o título da sala
			titulo.innerText = salaRetorno.titulo;
			carregarMensagensSala(sala);
		} else {
			console.log("Sala não existe.");
		}
	});
}

function carregarMensagensSala(sala){
	firebase
    .database()
    .ref('mensagens/' + sala)
    .on('value', function(snapshot){
        var mensagens = snapshot.val();
        // Se retornou dados
        if (mensagens){
            // Box de mensagens
            var b = document.querySelector('.box-mensagens');
            // Limpa
            b.innerHTML = '';
            // Como o firebase retorna objetos, coleto as chaves em um array
            var chaves = Object.keys(mensagens);
            // Faço o loop com as chaves
            for (var i = 0; i < chaves.length; i++) {

                // Aqui eu crio um elemento div
                var e = document.createElement('div');
                var f = document.createElement('div');

                f.className = "row";

                // Atribuo as informações na div
                e.innerText = mensagens[chaves[i]].mensagem;
                e.className = "item bubble"

				// Adiciono como filho de uma div.row
                f.appendChild(e);

                // Adiciono ao box de mensagens
                b.appendChild(f);
            }

        }else{

            // Box de mensagens
            var b = document.querySelector('.box-mensagens');

            // Aqui eu crio um elemento div
            var e = document.createElement('div');

            // Atribuo as informações na div
            e.innerText = 'Nenhuma mensagem enviada.';
            e.className = "alerta card"

            // Adiciono ao box de mensagens
            b.appendChild(e);
        }
    });
}

function enviarMensagem(){
	    // Coleto a mensagem escrita
		var mensagem = document.querySelector('#mensagem');

		// Coleta os dados em um objeto
		var dados = {
			"mensagem" : mensagem.value
		}
	
		// Captura o caminho de mensagens da sala
		var url = 'mensagens/' + salaSelecionada + '/';
	
		// Cria uma chave nova no firebase
		var chaveIdentificacao = firebase.database().ref().child(url).push().key;
	
		// Seta os dados no caminho com a ID nova
		var novoConteudo = {};
		novoConteudo[url + chaveIdentificacao] = dados;
	
		// Captura a promessa do Firebase
		var promise = firebase.database().ref().update(novoConteudo);
	
		// Assim que concluida
		promise
		.then(function(){
	
			// Limpa mensagem no input
			mensagem.value = '';
		},
		function(error){
			console.error("Problemas ao enviar mensagem");
		});
}