let listProductHTML = document.querySelector('.listProduct'); 
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let tot = document.getElementById("totale");
var first_button = document.getElementById("first_button");
var sec_button = document.getElementById("sec_button");
var form = document.getElementById("form");
var arrow = document.getElementById("arrow");
let products = [];
let cart = [];



    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img id="img-prod" src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}da</div>

                <button class="btn41-43 btn-41" class="addCart" onclick="addCartToHTML(this)"data-ido="product.id" data-name="product.name" data-price="${product.price}" data-image="${product.image}" >Order</button>`;
                 listProductHTML.appendChild(newProduct);
            });
        }
    }
  
   
    //------------------

   



function addCartToMemory(){
    localStorage.setItem('cart', JSON.stringify(cart)); 
}




function addCartToHTML(){
    let totalQuantity = 0; 
    let totale = 0;
    if(cart.length > 0){
        cart.forEach(item => {  console.log(cart);
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            totale = totale +  info.price * item.qnt;
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">${info.price * item.qnt}DA</div>
                <div class="quantity">
                    <span class="plus"><</span>
                    <span>${item.qnt}</span>
                    <span class="minus">></span>
                </div>
            `;
        })
    }
   
     tot.innerText = "Totale: "+totale+" DA";
    iconCartSpan.innerText = totalQuantity;
    
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].qnt = cart[positionItemInCart].qnt + 5;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].qnt - 5;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].qnt = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}




const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();


        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
              console.log("cartyyy",cart);
              addCartToHTML();      
          
        }
    })  
   
 
}



initApp();





function next(){
   
    arrow.style.display="block";
    listCartHTML.style.display="none";
    form.style.display="grid";
    sec_button.style.display="grid";
    first_button.style.display="none";
}

function arow(){
    arrow.style.display="none";
    listCartHTML.style.display="block";
    form.style.display="none";
    sec_button.style.display="none";
    first_button.style.display="grid";
}

const radios = document.getElementsByName('livraison');

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      const value = parseInt(radio.value);
      if (value === "bureau") {
        tot.textContent = parseInt(totale) + 400;
      } else if (value === "maison") {
        tot.innerText = totale + 600;
      }
    }
    addCartToHTML();
    addCartToMemory();
  });
});

function order(){
    const nameField = form.elements["client"];
    const client = nameField.value;
  
    const numField = form.elements["numero"];
    const num = numField.value;
  
    const addreField = form.elements["addr"];
    const addr = addreField.value;
    
    const colorField = form.elements["livraison"];
    const livra = colorField.value;

    if(livra="Maison"){
        totale=totale+600;
        tot.innerText = "Totale: "+totale+" DA";
    }else{
        totale=totale+400;
        tot.innerText = "Totale: "+totale+" DA"; 
    }
    

    const user ={ client,num,addr,livra};
    cart.push(user);

    $.ajax({
        type:'POST',
        url:'index.php',
        data: {array: JSON.stringify(cart)},
        success: function(data){
          console.log("Data inserted successfully"); 
      
        }
      });
    


}




/* function addCartToMemory(){
    cart.push(cart);
  
    console.log("cart:", cart);
}




function addCartToHTML(){
    let totalQuantity = 0;
  
    if(cart.length > 0){
        cart.forEach(item => {  console.log(cart);
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}*/