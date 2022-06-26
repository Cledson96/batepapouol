let data_name = "";
let mensagem_data = "";
let usuario = { name: "" };
//let toon = { name: "" };

function colocar_nome() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    usuario = {
        name: document.querySelector(".entrada").value
    }
    onlinep();
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
        enviar.then(entrou_ok);
        enviar.catch(erro_mensagem);
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
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    data_name = promessa.data;
    document.querySelector(".tela_inicial").classList.add("desativa");
    document.querySelector(".sala").classList.add("ativa");
    document.querySelector(".sala").classList.remove("desativa");
    inicio();
}

setInterval(online, 5000);
function online() {
    if (usuario.name != "") {
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
        console.log(`onlinezinho ${usuario.name}`);
    }
}
function inicio(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promessa.then(puxarmensagem);

}
function onlinep(){
    let pessoinhas = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    pessoinhas.then(online1);
    
}
function online1(ref){
    
    let toon = ref.data;
    console.log(toon);
    document.querySelector(".onlines").innerHTML = "";
    for (let i = 0; i < toon.length ;i++) {
        let gurii = toon[i].name;
        document.querySelector(".onlines").innerHTML += `<div class="fiz"> <img src="/imagens/pessoa.png" > <span class="guri">${gurii}</span></div>` 
    }
    
}
function puxarmensagem(ref) {
    mensagem_data = ref.data;
    for (let i = 0; i < mensagem_data.length; i++) {
        let tipo = mensagem_data[i].type
        let texto = mensagem_data[i].text
        let para = mensagem_data[i].to
        let hora = mensagem_data[i].time
    
        if (tipo == "status") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> entra na sala ... </li>`

        } else if (tipo == "message") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><div class="quebra"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> <h1>para</h1> <span></span> <span>Todos: </span> <h1>${texto}</h1></div> </li>`

        } else if (tipo == "private_message") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><div class="quebra"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> <h1>para</h1> <span></span> <span>${para}: </span> <h1>${texto}</h1></div> </li>`
        }
    }
    ultima()
}

function atualizar() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(verifica);
    promessa.catch(erro);
    onlinep();

}
function verifica(ref) {
    let compara = ref.data;
    if (mensagem_data != compara) {
        puxarmensagem(ref);
    }
}

function ultima() {
    let apareca = document.querySelector("ul").lastChild
    apareca.scrollIntoView();
}


//setInterval(atualizar, 3000)

function enviarMensagem(){
  let arruma = document.querySelector(".enviarMensagem").value
  let froma = usuario.name
  let envia = {from: `${froma}`,
  to: "Todos",
  text: `${arruma}`,
  type: "message" 
}
 const manda = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', envia);
 document.querySelector(".enviarMensagem").value = "";
}
function ativaonline(){
    document.querySelector(".participantes").classList.toggle("desativa");
    document.querySelector(".participantes").classList.toggle("ativa");
    document.querySelector(".sala").classList.toggle("fundo");
}
