const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addresWarn = document.getElementById("address-warn")
const spanItem = document.getElementById("date-spam")

Toastify({
  text: "Este site foi desenvolvido apenas para fins de demonstração. Não realizamos vendas reais de produtos.",
  duration: 5000,
  close: true,
  gravity: "top",
  position: "center",
  stopOnFocus: true,
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  },

}).showToast();
let cart = [];
cartBtn.addEventListener("click", function() {
  upDateCartModal();
  cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event) {
  if(event.target === cartModal) {
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})

menu.addEventListener("click", function() {
  let parenButton = event.target.closest(".add-to-cart-btn")

  if(parenButton) {
    const name = parenButton.getAttribute("data-name");
    const price = parseFloat(parenButton.getAttribute("data-price"));

    addToCart(name, price)
  }
})


function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)
  
  if(existingItem) {
    existingItem.quantity += 1
  } else {
      cart.push({
        name,
        price,
        quantity: 1
    
      })
  }

  upDateCartModal()
}

function upDateCartModal() {

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

          <button class="remove-from-cart-btn" data-name="${item.name}">
            remover
          </button>

      </div>


    `
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCount.innerHTML = cart.length;

}

cartItemsContainer.addEventListener("click", function(event) {
  if(event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }

})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)

  if(index !== -1) {
    const item = cart[index];

    if(item.quantity > 1) {
      item.quantity -= 1

      upDateCartModal()
      return;
    }

    cart.splice(index, 1)
    upDateCartModal()
  }
}


addressInput.addEventListener("input", function(event) {
  let inputValue = event.target.value

  if(inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addresWarn.classList.add("hidden")
  }
})

checkoutBtn.addEventListener("click", function() {

  const isOpen = checkRestaurantOpen();

  if(!isOpen) {
    Toastify({
      text: "O RESTAURANTE ESTÁ FECHADO!!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    
    }).showToast();


    return;
  }


  if(cart.length === 0) return;
  if(addressInput.value === "") {
    addresWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  const cartItems = cart.map((item) => {
    return (
      `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
    )
  }).join("")

 const message = encodeURIComponent(cartItems)
 const phone = "87992092113"

 window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

 cart = []
 upDateCartModal()
})


function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours()

  return hora >= 1 && hora <= 24
}


const isOpen = checkRestaurantOpen();

if(isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
} else {
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}

