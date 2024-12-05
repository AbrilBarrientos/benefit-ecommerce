
let productos = [
    { nombre: "Brocha de blush", descripcion: "Brocha de tamaño medio y redonda, pelo suave y largo para difuminar bien el polvo.", precio: 400, imagen: "img/productos/producto-brocha1.png", categoria: "Brochas",imagenesSecundarias: "" },
    { nombre: "Brocha en punta", descripcion: "Permite atrapar menos producto y aplicarlo de forma más precisa.", precio: 400, imagen: "img/productos/producto-brocha2.png", categoria: "Brochas",imagenesSecundarias: "" },
    { nombre: "Brocha plana", descripcion: "Para aplicar polvos y bases en todo el rostro.", precio: 400, imagen: "img/productos/producto-brocha3.png", categoria: "Brochas",imagenesSecundarias: "" },
    { nombre: "Benetint", descripcion: "Tinta para labios color rosa", precio: 150, imagen: "img/productos/benetint.png", categoria: "Labios",imagenesSecundarias: "" },
    { nombre: "Splashtint", descripcion: "Tinta labial hidratante", precio: 200, imagen: "img/productos/splashtint.png", categoria: "Labios",imagenesSecundarias: "" },
    { nombre: "GoGotint", descripcion: "Tinta de labios brillante color cereza", precio: 150, imagen: "img/productos/gogotint.png", categoria: "Labios",imagenesSecundarias: "" },
    { nombre: "Roller Liner", descripcion: "Delineador líquido mate", precio: 250, imagen: "img/productos/delineador.png", categoria: "Ojos",imagenesSecundarias: "" },
    { nombre: "BADgal BANG!", descripcion: "Máscara voluminizadora", precio: 300, imagen: "img/productos/mascaradpestañas.png", categoria: "Ojos",imagenesSecundarias: "" },
    { nombre: "Treat Yourself, Gorgeous!", descripcion: "Paleta de sombras de ojos de edición limitada y trío de mini rubores", precio: 500, imagen: "img/productos/sombras.png", categoria: "Ojos",imagenesSecundarias: "" },
];



// Carrito de compras
let carrito = [];

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoUI();
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar oferta especial
function mostrarOfertaEspecial(categoria) {
    const ofertaElement = document.getElementById('ofertaEspecial');
    const categoriaElement = document.getElementById('ofertaCategoria');
    
    categoriaElement.textContent = categoria;
    ofertaElement.classList.add('show');
    
    setTimeout(() => {
        ofertaElement.classList.remove('show');
    }, 5000);
}

// Mostrar productos
function mostrarProductos(categoria = 'todos') {
    const productosGrid = document.getElementById('productosGrid');
    productosGrid.innerHTML = '';
    
    const productosFiltrados = categoria === 'todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoria);
    
    productosFiltrados.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class= producto-detalle>
                
                <h3>${producto.nombre}</h3>
                <p><em>${producto.descripcion}</em></p>
                <p><strong>Precio:</strong> $${producto.precio}</p>
                <p><strong>Categoría:</strong> ${producto.categoria}</p>
                <button class="btn-primary">Ver detalles</button>
            </div>
            
        `;
        
        productoElement.addEventListener('click', () => mostrarModal(producto));
        productosGrid.appendChild(productoElement);
    });
}

// Modal de producto
function mostrarModal(producto) {
    const modal = document.getElementById('productoModal');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <h2>${producto.nombre}</h2>
        <div class="producto-galeria">
            <div class="galeria-imagenes">
                <!-- Imagen principal -->
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-principal">

                <!-- Imágenes secundarias -->
                <div class="imagenes-secundarias">
                    ${producto.imagenesSecundarias ? producto.imagenesSecundarias.map(imagen => 
                        `<img src="${imagen}" alt="${producto.nombre}" class="imagen-secundaria">`).join('') : ''}
                </div>
            </div>
        </div>
        <p>${producto.descripcion}</p>
        <p>Precio: $${producto.precio}</p>
        <p>Categoría: ${producto.categoria}</p>
        <button onclick="agregarAlCarrito(${productos.indexOf(producto)})" class="btn-primary">
            Agregar al Carrito
        </button>
    `;

    modal.style.display = 'block';
}


// Carrito
function agregarAlCarrito(productoIndex) {
    const producto = productos[productoIndex];
    const itemExistente = carrito.find(item => item.producto === producto);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ producto, cantidad: 1 });
    }
    
    actualizarCarritoUI();
    guardarCarrito();
    
    // Mostrar la notificación
    mostrarNotificacion(`${producto.nombre} ha sido agregado al carrito`);
}

// Función para mostrar la notificación
function mostrarNotificacion(mensaje) {
    // Crear un nuevo div para la notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;

    // Agregarla al body
    document.body.appendChild(notificacion);

    // Mostrarla por 5 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0'; // Desaparecer la notificación
        setTimeout(() => notificacion.remove(), 500); // Eliminarla del DOM después de la animación
    }, 3000);
}




function actualizarCarritoUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrecio}`;
}

function mostrarCarrito() {
    const modal = document.getElementById('carritoModal');
    const carritoContent = document.getElementById('carritoContent');
    const totalAmount = document.getElementById('cartTotalAmount');
    
    carritoContent.innerHTML = '';
    
    carrito.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <h3>${item.producto.nombre}</h3>
            <p>Precio: $${item.producto.precio}</p>
            <div class="cantidad-controls">
                <button onclick="actualizarCantidad(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="actualizarCantidad(${index}, 1)">+</button>
            </div>
            <p>Subtotal: $${item.producto.precio * item.cantidad}</p>
        `;
        carritoContent.appendChild(itemElement);
    });
    
    const total = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
    totalAmount.textContent = total;
    
    modal.style.display = 'block';
}

function actualizarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    actualizarCarritoUI();
    guardarCarrito();
    mostrarCarrito();
}

// Checkout
function mostrarCheckout() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
}

function procesarCheckout(event) {
    event.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        fechaEntrega: document.getElementById('fechaEntrega').value,
        metodoPago: document.getElementById('metodoPago').value,
        cuotas: document.getElementById('cuotas').value
    };
    
    if (validarFormulario(formData)) {
        // Procesar la compra
        alert('¡Compra realizada con éxito!');
        carrito = [];
        guardarCarrito();
        actualizarCarritoUI();
        cerrarModales();
    }
}

function validarFormulario(data) {
    for (let key in data) {
        if (!data[key]) {
            alert(`Por favor complete el campo ${key}`);
            return false;
        }
    }
    return true;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    mostrarProductos();
    
    // Navegación de categorías
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = e.target.dataset.category;
            mostrarProductos(categoria);
            if (categoria !== 'todos' && categoria !== 'Ojos') {
                mostrarOfertaEspecial(categoria);
            }
        });
    });
    
    // Botones de carrito y checkout
    document.getElementById('btnShowCart').addEventListener('click', mostrarCarrito);
    document.getElementById('btnCheckout').addEventListener('click', mostrarCheckout);
    document.getElementById('checkoutForm').addEventListener('submit', procesarCheckout);
    document.getElementById('btnCancelCheckout').addEventListener('click', cerrarModales);
    
    // Cerrar modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            cerrarModales();
        });
    });
    
    // Mostrar/ocultar cuotas
    document.getElementById('metodoPago').addEventListener('change', (e) => {
        const cuotasContainer = document.getElementById('cuotasContainer');
        cuotasContainer.classList.toggle('hidden', e.target.value !== 'credit');
    });
});

function cerrarModales() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}