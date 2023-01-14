let seuVotoPara = document.querySelector('.d1-1 span');
let cargo = document.querySelector('.d1-2 span');
let descricao = document.querySelector('.d1-4');
let aviso = document.querySelector('.d2');
let lateral = document.querySelector('.d1-right');
let numeros = document.querySelector('.d1-3');

let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = [];

function comecarEtapa(){
    let etapa = etapas[etapaAtual];

    let numeroHtml = '';
    numero = '';
    votoBranco = false;

    for(let i=0; i<etapa.numeros; i++){
        if(i === 0){
            numeroHtml += '<div class="numero pisca"></div>';
        }else{
            numeroHtml += '<div class="numero"></div>';
        }
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHtml;


}
function atualizaInterface(){
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item)=>{
        if(item.numero === numero){
            return true;
        } else {
            return false;
        }
    });
    if(candidato.length > 0){
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`;

        let fotosHtml = '';
        for(let i in candidato.fotos){
            if(candidato.fotos[i].url.small){
                fotosHtml += `<div class="d1-image small"><img src="images/${candidato.fotos[i].url}" alt=""/> ${candidato.fotos[i].legenda} </div>`;
            }else{
                fotosHtml += `<div class="d1-image"><img src="images/${candidato.fotos[i].url}" alt=""/> ${candidato.fotos[i].legenda} </div>`;
            }            
        }

        lateral.innerHTML = fotosHtml;
    }else{
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca"> VOTO NULO </div>';
    }    
}
function clicou(n){
    let eleNumero = document.querySelector('.numero.pisca');
    if(eleNumero !== null){
        eleNumero.innerHTML = n;
        numero = `${numero}${n}`;

        eleNumero.classList.remove('pisca');
        if(eleNumero.nextElementSibling !== null){
            eleNumero.nextElementSibling.classList.add('pisca');
        }else{
            atualizaInterface();
        }
    }
}
function branco(){
    if(numero === ''){
       votoBranco = true;
       seuVotoPara.style.display = 'block';
       aviso.style.display = 'block';
       numeros.innerHTML =  '';
       descricao.innerHTML = '<div class="aviso--grande pisca"> VOTOU EM BRANCO !</div>';
       lateral.innerHTML = '';
    } else{
        alert("Para votar em BRANCO não pode ter digitado nenhum número!");
        corrige();
    }
}
function corrige(){
    comecarEtapa();
}
function confirma(){
    let etapa = etapas[etapaAtual];

    let votoConfirmado = false;

    if(votoBranco === true){
        votoConfirmado = true;
        console.log("Confirmado como VOTO EM BRANCO!");
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if(numero.length === etapa.numeros){
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'numero'
        });

    }

    if(votoConfirmado){
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined){
            comecarEtapa();
        }else{
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca"> FIM !</div>';
            //console.log(votos);
        }
    }
}
comecarEtapa();