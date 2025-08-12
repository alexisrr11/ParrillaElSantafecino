// Elementos del DOM (modal carrito)
const btnCart = document.getElementById("btn-cart");
const modalCart = document.getElementById("modal-cart");
const closeModalCart = document.getElementById("closeModalCart");
const modalCartClose2 = document.getElementById("modalCartClose2");

// Abrir modal del carrito
btnCart.addEventListener("click", () => {
  modalCart.classList.remove("hidden");
  modalCart.classList.add("flex");
});

// Cerrar modal con la X
closeModalCart.addEventListener("click", () => {
  modalCart.classList.add("hidden");
  modalCart.classList.remove("flex");
});

// Cerrar modal con el botón "Cerrar"
modalCartClose2.addEventListener("click", () => {
  modalCart.classList.add("hidden");
  modalCart.classList.remove("flex");
});

// Opcional: cerrar modal al hacer clic fuera del contenido
modalCart.addEventListener("click", (e) => {
  if (e.target === modalCart) {
    modalCart.classList.add("hidden");
    modalCart.classList.remove("flex");
  }
});

// --- Carrito ---
// Intentamos cargar el carrito desde localStorage, o lo inicializamos vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const cartItemsContainer = document.getElementById("cartItems");

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para renderizar el carrito en el modal, con cantidad y botones +/-
function renderCarrito() {
  cartItemsContainer.innerHTML = '';

  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-500">Tu carrito está vacío</p>';
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = "flex items-center justify-between border-b py-2 gap-4";

    // Calculamos el subtotal para mostrar
    const subtotal = item.precio * item.cantidad;

    div.innerHTML = `
      <div>
        <p class="font-semibold">${item.nombre}</p>
        <p class="text-sm text-gray-500">Subtotal: $${subtotal.toLocaleString()}</p>
      </div>
      <div class="flex items-center gap-2">
        <button data-index="${index}" class="btn-restar bg-gray-200 px-2 rounded">-</button>
        <span>${item.cantidad}</span>
        <button data-index="${index}" class="btn-sumar bg-gray-200 px-2 rounded">+</button>
      </div>
      <button data-index="${index}" class="text-red-500 hover:text-red-700">✕</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  // Botones para eliminar producto del carrito
  cartItemsContainer.querySelectorAll("button.text-red-500").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      carrito.splice(idx, 1);
      guardarCarrito();
      renderCarrito();
    });
  });

  // Botones para restar cantidad
  cartItemsContainer.querySelectorAll("button.btn-restar").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      if (carrito[idx].cantidad > 1) {
        carrito[idx].cantidad--;
      }
      guardarCarrito();
      renderCarrito();
    });
  });

  // Botones para sumar cantidad
  cartItemsContainer.querySelectorAll("button.btn-sumar").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      carrito[idx].cantidad++;
      guardarCarrito();
      renderCarrito();
    });
  });
}

// --- Integración con botones "Agregar" ---
export function activarBotonesAgregar() {
  document.querySelectorAll(".card").forEach(card => {
    const btnAgregar = card.querySelector("#add-to-cart");
    btnAgregar.addEventListener("click", () => {
      const nombre = card.querySelector("h3").innerText;
      const precio = parseFloat(card.querySelector(".text-2xl").innerText.replace("$", "").replace(".", ""));

      // Verificar si el producto ya está en el carrito
      const productoExistente = carrito.find(item => item.nombre === nombre);

      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      guardarCarrito();
      renderCarrito();

      alert(`Agregaste ${nombre} al carrito`); // alerta al agregar producto
    });
  });
}

// Renderizamos el carrito al cargar la página (para mostrar los datos guardados)
renderCarrito();

const btnEnviarWhatsApp = document.getElementById("btnEnviarWhatsApp");

btnEnviarWhatsApp.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío, agrega productos antes de enviar.");
    return;
  }

  // Armamos el mensaje con lista de productos, cantidades y subtotales
  let mensaje = "Mi pedido:"; // %0A es salto de línea en URL encoding

  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} `;
  });

  // Número de WhatsApp al que se enviará (ejemplo de Argentina, sin signos ni espacios)
  const numeroWhatsApp = "5491137659081";

  // URL para abrir WhatsApp Web con mensaje prellenado
  const urlWhatsapp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

  // Abrir WhatsApp en una nueva pestaña
  window.open(urlWhatsapp, "_blank");
});
