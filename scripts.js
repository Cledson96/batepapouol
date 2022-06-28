let data_name = "";
let mensagem_data = "";
let usuario = { name: "" };
let usuario_msg = "Todos";
let toon = [];
let modo = "Público";
let procu = document.querySelector(".onlines");
let procurar = procu.querySelector(`.${usuario_msg}`);

document.addEventListener('keyup',function(apertou){if (apertou.key === 'Enter') {enviarMensagem()}})
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
function inicio() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promessa.then(puxarmensagem);

}
function onlinep() {
    let pessoinhas = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    pessoinhas.then(online1);

}
function online1(ref) {

    toon = ref.data;
    console.log(toon);
    document.querySelector(".onlines").innerHTML = `<div onclick="seleciona(this)" class="fiz"> <div><img src="/imagens/sem.png" > <span class="guri Todos">Todos</span></div><span class="seleceionei"> <img src="/imagens/selecionado.png" ></span></div>`;
    for (let i = 0; i < toon.length; i++) {
        let gurii = toon[i].name;
        document.querySelector(".onlines").innerHTML += `<div onclick="seleciona(this)" class="fiz"> <div> <img src="/imagens/pessoa.png" > <span class="guri ${gurii}">${gurii}</span></div><span class="seleceionei"> <img src="/imagens/selecionado.png" ></span></div>`
    }

}

function puxarmensagem(ref) {
    mensagem_data = ref.data;
    document.querySelector("ul").innerHTML = ""
    for (let i = 0; i < mensagem_data.length; i++) {
        let tipo = mensagem_data[i].type
        let texto = mensagem_data[i].text
        let para = mensagem_data[i].to
        let hora = mensagem_data[i].time


        if (tipo == "status") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> entra na sala ... </li>`

        } else if (tipo == "message") {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><div class="quebra"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> <h1>para</h1> <span></span> <span>Todos: </span> <h1>${texto}</h1></div> </li>`

        } else if (tipo == "private_message" && para == usuario.name) {
            document.querySelector("ul").innerHTML += ` <li class="${tipo}"><div class="quebra"><span class="hora">(${hora})</span><span>${mensagem_data[i].from}</span> <h1>para</h1> <span></span> <span>${para}: </span> <h1>${texto}</h1></div> </li>`
        }
    }
    console.log(mensagem_data);
    ultima()
}

function atualizar() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(verifica);
    promessa.catch(erro);
   
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

setInterval( onlinep, 10000);

setInterval(atualizar, 3000);

function enviarMensagem() {
    let arruma = document.querySelector(".enviarMensagem").value
    let froma = usuario.name
    let envia = "";
    procu = document.querySelector(".onlines");
    procurar = procu.querySelector(`.${usuario_msg}`);
    if (procurar != null)  {
        if (usuario_msg === "Todos"){
            envia = {
            from: `${froma}`,
            to: `${usuario_msg}`,
            text: `${arruma}`,
            type: "message"
        }
    } else if (modo == "Público") {
            envia = {
            from: `${froma}`,
            to: `${usuario_msg}`,
            text: `${arruma}`,
            type: "message"
        } 
    }else {
            envia = {
                from: `${froma}`,
                to: `${usuario_msg}`,
                text: `${arruma}`,
                type: "private_message"
        }
    }
   
    
    } else {
        window.location.reload()
    }
    
    const manda = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', envia);
    document.querySelector(".enviarMensagem").value = "";
    atualizar();
}
function ativaonline() {
    document.querySelector(".participantes").classList.toggle("desativa");
    document.querySelector(".participantes").classList.toggle("ativa");
    document.querySelector(".sala").classList.toggle("fundo");
}
function mode(ref){
    let referencia = document.querySelector(".addum");
    if (referencia !== null) {
        referencia.classList.remove("addum");
    }
    ref.querySelector(".seleceionei").classList.add("addum");
    modo = ref.querySelector("span").innerHTML;
    console.log(modo);

}
function seleciona(ref) {
    document.querySelector(".caixa_mensagem").innerHTML = `<div class="primeiro">
                                                                <input class="enviarMensagem" type="text" placeholder="Escreva aqui...">
                                                                <img onclick="enviarMensagem()" src="/imagens/enviar.png"> </div>
                                                                <h5>Enviando para ${ref.querySelector(".guri").innerHTML}(${modo})</h5>`;
    let referencia = document.querySelector(".add");
    console.log(referencia);
    if (referencia !== null) {
        referencia.classList.remove("add");
    }

    ref.querySelector(".seleceionei").classList.add("add");
    usuario_msg = ref.querySelector(".guri").innerHTML;
    console.log(usuario_msg);

}