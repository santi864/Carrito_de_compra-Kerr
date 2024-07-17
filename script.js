document.addEventListener('DOMContentLoaded', () => {
    // Cargar los datos de muebles desde el archivo JSON
    fetchMuebles('muebles.json')
        .then(data => {
            inicializarMuebles(data);
            mostrarProductos();
            mostrarCarrito();
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});

// Función para cargar muebles usando fetch con promesas
const fetchMuebles = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error al hacer fetch:', error);
            throw error;
        });
};

// Array para almacenar los muebles cargados desde el JSON
let muebles = [];

// Inicializar los muebles
const inicializarMuebles = (data) => {
    muebles = data;
};

// Filtrar Muebles en Stock
const filtrarEnStock = () => muebles.filter(mueble => mueble.enStock);

// Almacenar el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar Productos
const mostrarProductos = () => {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = ''; // Limpiar contenido previo
    filtrarEnStock().forEach((mueble, index) => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
            <h3>${mueble.nombre}</h3>
            <p>Tipo: ${mueble.tipo}</p>
            <p>Precio: $${mueble.precio}</p>
            <div class="cantidad">
                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                <span id="cantidad-${index}">1</span>
                <button onclick="cambiarCantidad(${index}, 1)">+</button>
            </div>
            <button class="agregar" onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
};

// Cambiar Cantidad
const cambiarCantidad = (index, delta) => {
    const cantidadSpan = document.getElementById(`cantidad-${index}`);
    let cantidad = parseInt(cantidadSpan.textContent) + delta;
    if (cantidad < 1) cantidad = 1;
    cantidadSpan.textContent = cantidad;
};

// Agregar Producto al Carrito
const agregarAlCarrito = (index) => {
    const cantidad = parseInt(document.getElementById(`cantidad-${index}`).textContent);
    const productoEnCarrito = carrito.find(item => item.nombre === muebles[index].nombre);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...muebles[index], cantidad });
    }
    guardarCarrito();
    mostrarCarrito();
};

// Guardar Carrito en localStorage
const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Mostrar Carrito
const mostrarCarrito = () => {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = ''; // Limpiar contenido previo
    carrito.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-carrito';
        itemDiv.innerHTML = `
            <p>${item.cantidad}x ${item.nombre} - $${item.precio} cada uno</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoDiv.appendChild(itemDiv);
    });
    const total = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    document.getElementById('total').textContent = `Total: $${total}`;
};

// Eliminar Producto del Carrito
const eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
};

// Finalizar Compra
document.getElementById('comprar').addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tu carrito esta vacio'
        });
        return;
    }
    let resumen = 'Resumen de tu compra:\n';
    carrito.forEach(item => {
        resumen += `${item.cantidad}x ${item.nombre} - $${item.precio} cada uno\n`;
    });
    const total = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    resumen += `\nTotal: $${total}`;

    Swal.fire({
        icon: 'success',
        title: '¡Tu compra fue exitosa!',
        text: resumen
    });

    // Limpiar carrito después de la compra
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});
