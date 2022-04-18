const query = (el) => {
    return document.querySelector(el);
    // funçao que substitui o document queryselector 
  };
  const queryAll = (el) => document.querySelectorAll(el);  // funçao que substitui o document queryselector 
  let cart = []; // variavel global do carrinho
  let modalKey = 0; // varivael que ira armazenar a key do item clicado
  let modalQtd = 1;
  // faz um map em um array de objetos 
  pizzaJson.map((item, index) => {
    //clona a div model
    let pizzaItem = query(".models .pizza-item").cloneNode(true);
  
    //seta um atributo na pizza-item e coloca um index para saber o que esta sendo clicado
    pizzaItem.setAttribute("data-key", index);
  
    //inseri a img no item
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  
    //inseri o preço no item
    pizzaItem.querySelector(
      ".pizza-item--price"
    ).innerHTML = `R$ ${item.price.toFixed(2)}`;
    //inserio o nome no item
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    //inseri o descrição no item
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  
    //funçao que faz o click para abrir modal e adiconar os itens da pizza
    pizzaItem.querySelector("a").addEventListener("click", (e) => {
      modalQtd = 1;
      // para o efeito refresh padra da tag A
      e.preventDefault();
      // seleciona o item que esta sendo clicado
      let key = e.target.closest(".pizza-item").getAttribute("data-key");
      modalKey = key;
  
      // config para abrir o modal suavemente
      query(".pizzaWindowArea").style.opacity = 0;
      query(".pizzaWindowArea").style.display = "flex";
      setTimeout(() => {
        query(".pizzaWindowArea").style.opacity = 1;
      }, 300);
      //inseri a img no modal
      query(".pizzaBig img").src = pizzaJson[key].img;
  
      //inseri o noma da pizza no modal
      query(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
      
      //inseri a descrição no modal
      query(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
  
      //inseri o preço no modal
      query(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
        key
      ].price.toFixed(2)}`;
  
      //remove a class selected do elemento
      query(".pizzaInfo--size.selected").classList.remove("selected");
      // adiciona a class selected ao item clicado
      queryAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
        if (sizeIndex === 2) {
          size.classList.add("selected");
        }
        size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
      });
      query(".pizzaInfo--qt").innerHTML = modalQtd;
    });
  //Adiciona os itens na tela
    query(".pizza-area").append(pizzaItem);
  });
  // fecha o modal suavemente
  function closeModal() {
    query(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      query(".pizzaWindowArea").style.display = "none";
    }, 300);
  }
  
  // fecha o modal mobile
  let closeModaMobile = queryAll(
    ".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton"
  );
  closeModaMobile.forEach((item) => {
    item.addEventListener("click", closeModal);
  });
  
  // adiciona  mais pizza
  query(".pizzaInfo--qtmais").addEventListener("click", () => {
    query(".pizzaInfo--qt").innerHTML = modalQtd += 1;
  });
  
  //  reduz os pedidos das pizzas limitando ao 0
  query(".pizzaInfo--qtmenos").addEventListener("click", () => {
    let qtdMenos = query(".pizzaInfo--qt");
    if (modalQtd > 1) {
      qtdMenos.innerHTML = modalQtd -= 1;
    }
  });
  // remova a classe no elemento anterior e coloca no atual
  queryAll(".pizzaInfo--size").forEach((divSize, indexItem) => {
    divSize.addEventListener("click", (e) => {
      query(".pizzaInfo--size.selected").classList.remove("selected");
      divSize.classList.add("selected");
    });
  });
  
  // transforma a data-key em  number e adiciona os item no carrinho
  query(".pizzaInfo--addButton").addEventListener("click", () => {
    let sizePizza = Number(
      query(".pizzaInfo--size.selected").getAttribute("data-key")
    );
    let identificador = pizzaJson[modalKey].id + "@" + sizePizza;
    let key = cart.findIndex((item) => item.identificador == identificador);
    if (key > -1) {
      cart[key].qtd += modalQtd;
    } else {
      cart.push({
        identificador,
        id: pizzaJson[modalKey].id,
        sizePizza,
        qtd: modalQtd,
      });
    }
    
    updateCart();
    closeModal();
  });
  
  //atualiza dos dados do carrinho
  function updateCart() {
    // menu-mobile show
    //adiciona o numero de itens no carrinho
    query('.menu-openner span').innerHTML = cart.length;
    // o menu do carrinho
    
    if(cart.length > 0){
      //zera o carrinho quando abrir novamente
      query('.cart').innerHTML = ''
      
      let subTotal = 0; 
      let desc = 0;
      let total = 0;
       //faz um for no carinho pegando ,indice, id, qtd,img,sizes
      for(let id in cart){
       let pizzaItem = pizzaJson.find((item)=>item.id == cart[id].id)
       subTotal+= pizzaItem.price * cart[id].qtd
       
       let cartItem= query('.models .cart--item').cloneNode(true)
       query('.cart').append(cartItem)
  
       cartItem.querySelector('img').src = pizzaItem.img
        let pizzaItemSize;   
        // pega o indice do array cart e adiciona tamanho e quantidade de peso no carrinho 
        switch(cart[id].sizePizza){
          case 0:
          pizzaItemSize = 'P 360g'
          break;
          case 1:
            pizzaItemSize = 'M 530g'
            break;
          case 2:
            pizzaItemSize = 'G 860g'
            break;
        }
        // concatena o nome da pizza e o peso dela e adicona no carrinho
        let pizzaName = `${pizzaItem.name} ${pizzaItemSize}`
        //adiciona o nome  e peso da pizza no carrinho
       cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
        //adiciona a quantidade selecionada ao carrinho
       cartItem.querySelector('.cart--item--qt').innerHTML = cart[id].qtd
        
      //adiciona +1 na aba do carrinho
       cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
         cart[id].qtd++;
         updateCart();
       })
  
       //remova -1 e quando chega no 1 remove o item no carrinho
       cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
        
         if(cart[id].qtd > 1){
           cart[id].qtd --;
         }
         else{
           cart.splice(id, 1)
         }
        updateCart();
      })
      }
      // mostra o menu carrinho
      query('aside').classList.add('show')
  
      desc = subTotal * 0.1
      total = subTotal - desc
      //valor subtotal
      query('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`
      //valor desconto
      query('.desconto span:last-child').innerHTML = `R$ ${desc.toFixed(2)}`
      //valor total com desconto
      query('.total span:last-child').innerHTML = `R$${total.toFixed('2')}`
    }else{
      //remove o menu carrinho caso nao tenha item adicionado
      query('aside').classList.remove('show')
      query('aside').style.left = '100vh'
    }
   
  }
  
  // abrir meniu mobile
  query('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
      query('aside').style.left = '0'
    }
  })
  //fecha menu mobile
  query('.menu-closer').addEventListener('click', ()=>{
    query('aside').style.left = '100vh'
  })