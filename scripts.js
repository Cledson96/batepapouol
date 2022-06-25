let data_name = "";
let mensagem_data = "";
let usuario = { name: "" };
function colocar_nome() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    usuario = {
        name: document.querySelector(".entrada").value
    }
    console.log(usuario)
    promessa.then(entrarsala);
    promessa.catch(erro);
}
function entrarsala(resposta) {
    data_name = resposta.data;
    if (usuario.name == "") {
        alert("É obrigatório colocar um nome!")
        return;
    } else {
        const enviar = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario)
        console.log("entrei");
        console.log(data_name);
        console.log(usuario);
        enviar.then(entrou_ok);
        enviar.catch(erro_mensagem);
        puxarmensagem_teste();
    }
}
function erro(erro) {
    alert("Estamos com problema no servidor,favor tentar mais tarde!")
}
function erro_mensagem(ref) {
    let status = ref.response.status;

    if (status === 400) {
        alert("Já existe um usuario com este nome,favor escolher outro!")
        return;
    } else {
        alert(`Erro ${status}`);
    }

}
function entrou_ok(ref) {
    console.log("Deu boa")
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    data_name = promessa.data;
    console.log(data_name);
    document.querySelector(".tela_inicial").classList.add("desativa");
    document.querySelector(".sala").classList.remove("desativa");
}
setInterval(online, 5000);
function online() {
    if (usuario.name != "") {
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
        console.log(`onlinezinho ${usuario.name}`);
    }
}
function puxarmensagem_teste() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(puxarmensagem);
    promessa.catch(erro);

}
function puxarmensagem(ref) {
    mensagem_data = ref.data;
    console.log(mensagem_data);
    console.log(mensagem_data.length)
    for (let i = 0; i < mensagem_data.length; i++) {
        let tipo = mensagem_data[i].type
        let texto = mensagem_data[i].text
        let para = mensagem_data[i].to
        let hora = mensagem_data[i].time
        if (tipo == "status") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> entra na sala ... </li>`
        }else if (tipo == "message") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><div class="quebra"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> <h1>para</h1> <span></span> <span>Todos: </span> <h1>${texto}</h1></div> </li>`
        }else if (tipo == "private_message") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><div class="quebra"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> <h1>para</h1> <span></span> <span>${para}: </span> <h1>${texto}</h1></div> </li>`
        }
    }

}

