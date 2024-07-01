const muebles = [
    { nombre: "Sillón", tipo: "Sala", precio: 300, enStock: true },
    { nombre: "Mesa", tipo: "Comedor", precio: 200, enStock: true },
    { nombre: "Cama", tipo: "Dormitorio", precio: 400, enStock: true },
    { nombre: "Silla", tipo: "Sala", precio: 100, enStock: true },
    { nombre: "Estantería", tipo: "Oficina", precio: 150, enStock: true },
    { nombre: "Escritorio", tipo: "Oficina", precio: 150, enStock: true },
];

const filtrarEnStock = () => muebles.filter(mueble => mueble.enStock);

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// mostrar Productos
const mostrarProductos = () => {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';
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
            <button class = "agregar" onclick="agregarAlCarrito(${index})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productoDiv);
    });
};

const cambiarCantidad = (index, i) => {
    const cantidadSpan = document.getElementById(`cantidad-${index}`);
    let cantidad = parseInt(cantidadSpan.textContent) + i;
    if (cantidad < 1) cantidad = 1;
    cantidadSpan.textContent = cantidad;
};

// agregar 0roducto al carrito
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

// guardar carrito en localStorage
const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

// mostrar carrito
const mostrarCarrito = () => {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = '';
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

// eliminar producto
const eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
};

// finalizar Compra
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

    // limpiar carrito
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});

mostrarProductos();
mostrarCarrito();
