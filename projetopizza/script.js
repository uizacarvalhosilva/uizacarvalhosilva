//variável para mudar a quantidade seleiconada detnro do modal de escolha da pizza
let modalQt = 1;

let cart = [];
let modalKey = 0;


//função pra não precisar ficar solcitando o query selector toda vez o c exibe o úbnio e o call exibe todos que achar 
const c = (elem) =>  document.querySelector(elem);
const call = (elem) =>  document.querySelectorAll(elem);

//-----------------------Listagem das Pizzas------------------------

// a função recebe o próprio item e recebe o index que é o numero do array e clona os moldelos, preenche e exibe na tela, o clone pega bnão só o próprio item mas tudo que estiver dentro dele 
pizzaJson.map((item,index)=>{
    console.log(item)
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // preenche os dados em pizzaItem
    pizzaItem.setAttribute('data-key',index); // a index é a chave da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // formatado o preço fixado com duas casas após a virgula

    //seleicona o modal a mas cancelar o evento padrão que seria abrir outra página
    pizzaItem.querySelector('a').addEventListener('click', (elem)=>{
        elem.preventDefault();
        //console.log("Clicou na pizza!!");

        let key = elem.target.closest('.pizza-item').getAttribute('data-key');//ele vai procurar o elementor mais proximo do pizzaitem
        //console.log("Clicou na pizza nº"+key);
        //console.log(pizzaJson[key]);
        modalQt = 1;
        modalKey = key;

        // preenche os dados 
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        // ele vai pegar o item selecionado,acessar a lsita de clases e remover a classe de seleção, para que sempre que abrir um novo modal o tamnaho padr~çao seleiconado mude para o maior 
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //entrar dentro do pizza info size e dentro dele epagar o span para preencher e aqui ele reseta o modal toda vez que abrir ele
        call('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex === 2){ 
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaInfo--qt').innerHTML = modalQt; // altera/reseta o modal quantidade para 1
        c('.pizzaWindowArea').style.opacity = '0'; //melhorar aparencia transição do modal e junto com o transition em meio segundo vai ficar opaco
        c('.pizzaWindowArea').style.display = 'flex'; // por padrão ele está none que é desativado, vamos exibir ele 
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = '1';
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
    //ele pega o conteudo que já tem em pizzaarea e vai add mais um conteuúdo 

});

//----------------- Eventos do Modal-----------------------

//Função Fechar o modal após meio segundo 
function closeModal(){
    c('.pizzaWindowArea').style.opacity = '0'; 
                setTimeout(()=>{
            c('.pizzaWindowArea').style.display = 'none';
        }, 500);
}
call('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Botão diminuir quantidade 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//Botão aumentar quantidade 
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt; 
});

// Botões tamanhos
call('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (elem)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });        
});

//Botão adicionar item carrinho 
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    /* Qual a pizza ?
    console.log("Minha pizza é : "+modalKey);
    // Qual o tamanho?
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
    console.log("Tamanho : "+size);
    //Quantas pizzas?
    console.log("Quantidade: "+modalQt); */
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
  });

  //mostrar o aside no mobile se tiver item no carrinho
    c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0'; // move o aside para ser exibido na tela
        }
    });
    //fechar o aside no mobile
    c('.menu-closer').addEventListener('click', ()=>{
        if(cart.length > 0){
            c('aside').style.left = '100vw'; // move o aside para ser exibido na tela
            }
    });

  //atualiza o carrinho
  function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;//atualizar carrinho no mobile


    if(cart.length > 0){
        c('aside').classList.add('show'); // exibe o carrinho 
        c('.cart').innerHTML = ''; // ele vai zerar e listar para dar o append do começo

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //procurar o id dentro da pizza
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id); // ele vai buscar sem alterar
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);
            let $pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                break;
                case 1:
                    pizzaSizeName = 'M';
                break;
                    case 2:
                    pizzaSizeName = 'G';
                break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;


            //add e preencher no carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            //vamos colocar o nome e concatenar com o tamanho
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            // incrementadno um item no item atual mas é necessario atualizar a tela 
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            // diminuir um item no item atual mas é necessario atualizar a tela e se remover todos tem que tirar o item do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });

            c('.cart').append(cartItem);                   
           // console.log(pizzaItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else{
        c('aside').classList.remove('show'); // fecha o carrinho
        c('aside').style.left = '100vw';// fecha o carrinho no mobile
    }

  }