// mini-inventario — archivo con code smells a propósito

// ====== Estado global (configuración de la tabla) ======
// Usamos var a propósito (forma "vieja" de declarar variables)
var ESTADO_GLOBAL = {
  pagina: 1, // página actual
  porPagina: 7, // cuántos registros mostrar por página
  busqueda: "", // texto de búsqueda (filtro)
  orden: "createdAt-desc", // criterio de ordenamiento por defecto
};

var ULTIMA_EXPORTACION = null; // guarda la marca de tiempo del último export (casi no se usa)

// ====== Utilidades generales ======

// Genera un ID único "casero" usando tiempo actual y un número aleatorio
function generarIdUnico() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Formatea un número como dinero en USD usando configuración de Panamá
function formatearDinero1(numero) {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD",
  }).format(numero);
}

// Duplicado a propósito, hace exactamente lo mismo que formatearDinero1
function formatearDinero2(numero) {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD",
  }).format(numero);
}

// Suma todos los elementos de un arreglo (no se usa, pero la dejo comentada)
function sumar1(arreglo) {
  var total = 0;
  for (var i = 0; i < arreglo.length; i++) {
    total += arreglo[i];
  }
  return total;
}

// Otra función de suma, también redundante (no se usa)
function sumar2(arreglo) {
  var suma = 0;
  for (var j = 0; j < arreglo.length; j++) {
    suma += arreglo[j];
  }
  return suma;
}

// ====== Funciones de ordenamiento para la lista de productos ======

// Ordena por nombre A-Z
function ordenarNombreAsc(a, b) {
  return a.name.localeCompare(b.name);
}

// Ordena por nombre Z-A
function ordenarNombreDesc(a, b) {
  return -a.name.localeCompare(b.name);
}

// Ordena por precio de menor a mayor
function ordenarPrecioAsc(a, b) {
  return a.price - b.price;
}

// Ordena por precio de mayor a menor
function ordenarPrecioDesc(a, b) {
  return b.price - a.price;
}

// Ordena por fecha de creación de más antiguo a más reciente
function ordenarFechaCreacionAsc(a, b) {
  return a.createdAt - b.createdAt;
}

// Ordena por fecha de creación de más reciente a más antiguo
function ordenarFechaCreacionDesc(a, b) {
  return b.createdAt - a.createdAt;
}

// ====== Manejo de Storage (localStorage) ======
var CLAVE_STORAGE = "badls:products";

// Lee la lista de productos desde localStorage
function leerProductos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE) || "[]");
  } catch (error) {
    // Si hay algún problema con el JSON, devolvemos arreglo vacío
    return [];
  }
}

// Guarda la lista de productos en localStorage
function guardarProductos(listaProductos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaProductos));
}

// ====== Datos iniciales (seeds) ======
(function () {
  // Si no hay productos guardados, insertamos algunos por defecto
  if (leerProductos().length == 0) {
    // == a propósito
    guardarProductos([
      {
        id: generarIdUnico(),
        name: 'Laptop Pro 14"',
        category: "Tech",
        price: 1299.99,
        stock: 5,
        createdAt: Date.now() - 86000 * 24 * 7,
      },
      {
        id: generarIdUnico(),
        name: 'Laptop Pro 14"',
        category: "Tech",
        price: 1299.99,
        stock: 5,
        createdAt: Date.now() - 86000 * 24 * 6,
      }, // producto duplicado a propósito
      {
        id: generarIdUnico(),
        name: "Mouse inalámbrico",
        category: "Tech",
        price: 19.99,
        stock: 42,
        createdAt: Date.now() - 86000 * 24 * 5,
      },
      {
        id: generarIdUnico(),
        name: "Silla ergonómica",
        category: "Furniture",
        price: 159.9,
        stock: 12,
        createdAt: Date.now() - 86000 * 24 * 4,
      },
      {
        id: generarIdUnico(),
        name: "Escritorio de madera",
        category: "Furniture",
        price: 210,
        stock: 4,
        createdAt: Date.now() - 86000 * 24 * 3,
      },
    ]);
  }
})();

// ====== Helpers del DOM ======

// Versión corta de querySelector
function $(selector, contexto) {
  return (contexto || document).querySelector(selector);
}

// Versión que devuelve *todos* los elementos (convertidos a arreglo)
function $$$(selector, contexto) {
  return Array.from((contexto || document).querySelectorAll(selector));
}

// ====== Render principal (pinta tabla, paginación, etc.) ======
function renderizar() {
  // 1. Obtenemos todos los productos
  var productos = leerProductos();

  // 2. Normalizamos la búsqueda: quitamos espacios y pasamos a minúscula
  var textoBusqueda = ESTADO_GLOBAL.busqueda
    ? ESTADO_GLOBAL.busqueda.trim().toLowerCase()
    : "";

  // 3. Criterio de orden actual
  var criterioOrden = ESTADO_GLOBAL.orden || "createdAt-desc";

  // 4. Filtrado manual de productos
  var productosFiltrados = [];
  for (var i = 0; i < productos.length; i++) {
    var producto = productos[i];
    var pasaFiltro = true;

    if (textoBusqueda) {
      // Convertimos nombre y categoría a minúscula para comparar
      var nombre = (producto.name || "").toLowerCase();
      var categoria = (producto.category || "").toLowerCase();

      // Si el texto no aparece ni en nombre ni en categoría, no pasa
      if (
        nombre.indexOf(textoBusqueda) == -1 &&
        categoria.indexOf(textoBusqueda) == -1
      ) {
        pasaFiltro = false;
      } else {
        pasaFiltro = true;
      }
    }

    // Si pasa el filtro, lo agregamos a la lista filtrada
    if (pasaFiltro) {
      productosFiltrados.push(producto);
    }
  }

  // 5. Ordenamos la lista filtrada según el criterio
  switch (criterioOrden) {
    case "name-asc":
      productosFiltrados.sort(ordenarNombreAsc);
      break;
    case "name-desc":
      productosFiltrados.sort(ordenarNombreDesc);
      break;
    case "price-asc":
      productosFiltrados.sort(ordenarPrecioAsc);
      break;
    case "price-desc":
      productosFiltrados.sort(ordenarPrecioDesc);
      break;
    case "createdAt-asc":
      productosFiltrados.sort(ordenarFechaCreacionAsc);
      break;
    default:
      productosFiltrados.sort(ordenarFechaCreacionDesc);
      break;
  }

  // 6. Paginación manual
  var totalRegistros = productosFiltrados.length;

  // Cálculo de total de páginas:
  // (total + porPagina - 1) / porPagina => redondeo hacia arriba
  var totalPaginas = Math.floor(
    (totalRegistros + ESTADO_GLOBAL.porPagina - 1) / ESTADO_GLOBAL.porPagina
  );

  // Si la página actual es mayor que el total de páginas, la ajustamos
  if (ESTADO_GLOBAL.pagina > totalPaginas)
    ESTADO_GLOBAL.pagina = totalPaginas || 1;

  // Índice inicial y final para el "slice" manual
  var inicio = (ESTADO_GLOBAL.pagina - 1) * ESTADO_GLOBAL.porPagina;
  var fin = inicio + ESTADO_GLOBAL.porPagina;

  // Subconjunto de productos que se mostrarán en la tabla
  var vistaProductos = [];
  for (
    var indiceVista = inicio;
    indiceVista < fin && indiceVista < productosFiltrados.length;
    indiceVista++
  ) {
    vistaProductos.push(productosFiltrados[indiceVista]);
  }

  // 7. Pintar filas en la tabla
  var plantillaFila = $("#row-tpl"); // <template> con la estructura de una fila
  var contenedorFilas = $("#rows"); // tbody donde se insertan las filas
  contenedorFilas.innerHTML = ""; // limpiamos el contenido anterior

  for (var r = 0; r < vistaProductos.length; r++) {
    var productoVista = vistaProductos[r];

    // Clonamos el contenido del template
    var nodoFila = plantillaFila.content.firstElementChild.cloneNode(true);

    // Mostramos solo los últimos 6 caracteres del ID
    $(".id", nodoFila).textContent = (productoVista.id || "").slice(-6);
    $(".name", nodoFila).textContent = productoVista.name;
    $(".category", nodoFila).textContent = productoVista.category;

    // Para demostrar duplicación usamos dos funciones de dinero
    $(".price", nodoFila).textContent =
      r % 2 == 0
        ? formatearDinero1(productoVista.price)
        : formatearDinero2(productoVista.price);

    $(".stock", nodoFila).textContent = productoVista.stock;

    // Guardamos el id real en data-id de la fila
    nodoFila.dataset.id = productoVista.id;

    // Agregamos la fila al tbody
    contenedorFilas.appendChild(nodoFila);
  }

  // 8. Paginador (botones de página)
  var contenedorPaginador = $("#pager");
  contenedorPaginador.innerHTML = "";

  // Función interna para crear un botón de paginación
  function crearBotonPagina(numeroPagina, etiqueta) {
    var boton = document.createElement("button");
    boton.textContent = etiqueta || numeroPagina;
    boton.dataset.page = numeroPagina;
    return boton;
  }

  // Solo mostramos paginador si hay más de una página
  if (totalPaginas > 1) {
    // Botón "anterior"
    contenedorPaginador.appendChild(
      crearBotonPagina(Math.max(1, ESTADO_GLOBAL.pagina - 1), "‹")
    );

    // Botones numerados
    for (var p = 1; p <= totalPaginas; p++) {
      var botonPagina = crearBotonPagina(p);
      if (p == ESTADO_GLOBAL.pagina) {
        botonPagina.className = "current"; // página actual
      }
      contenedorPaginador.appendChild(botonPagina);
    }

    // Botón "siguiente"
    contenedorPaginador.appendChild(
      crearBotonPagina(Math.min(totalPaginas, ESTADO_GLOBAL.pagina + 1), "›")
    );
  }
}

// ====== CRUD (Crear, Leer, Actualizar, Eliminar) ======

// Inserta un producto nuevo o actualiza uno existente
function guardarOActualizarProducto(producto) {
  var listaProductos = leerProductos();
  var indiceEncontrado = -1;

  // Buscamos si ya existe un producto con ese id
  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id == producto.id) {
      indiceEncontrado = i;
      break;
    }
  }

  // Si existe, lo reemplazamos
  if (indiceEncontrado > -1) {
    listaProductos[indiceEncontrado] = producto;
  } else {
    // Si no existe, lo agregamos al inicio del arreglo
    listaProductos.unshift(producto);
  }

  // Guardamos y volvemos a pintar todo
  guardarProductos(listaProductos);
  renderizar();
}

// Elimina un producto por su ID
function eliminarPorId(id) {
  var listaProductos = leerProductos();
  var listaFiltrada = [];

  // Creamos una nueva lista sin el producto cuyo id coincida
  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id != id) {
      listaFiltrada.push(listaProductos[i]);
    }
  }

  guardarProductos(listaFiltrada);
  renderizar();
}

// Devuelve un producto por ID o null si no existe
function obtenerPorId(id) {
  var listaProductos = leerProductos();
  for (var i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id == id) {
      return listaProductos[i];
    }
  }
  return null;
}

// Búsqueda redundante de producto por ID (similar a obtenerPorId)
function buscarProducto(id) {
  var lista = leerProductos();
  var encontrado = null;
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id == id) {
      encontrado = lista[i];
      break;
    }
  }
  return encontrado;
}

// ====== Manejo de Modal ======
var modalDialogo = document.getElementById("modal"); // <dialog> del formulario
var formulario = document.getElementById("form"); // formulario dentro del modal

// Abre el modal en modo "nuevo" o "editar"
function abrirModal(productoEditar) {
  // Limpiamos el formulario
  formulario.reset();

  // Cambiamos el título del modal según si estamos editando o creando
  document.getElementById("modalTitle").textContent = productoEditar
    ? "Editar producto"
    : "Nuevo producto";

  // Si tenemos un producto para editar, cargamos sus datos en el formulario
  if (productoEditar) {
    formulario.name.value = productoEditar.name;
    formulario.category.value = productoEditar.category;
    formulario.price.value = productoEditar.price;
    formulario.stock.value = productoEditar.stock;
    formulario.id.value = productoEditar.id;
  }

  // Mostramos el diálogo
  modalDialogo.showModal();
}

// ====== Eventos iniciales ======
window.addEventListener("DOMContentLoaded", function () {
  // Cuando la página termina de cargar, pintamos la tabla
  renderizar();

  // Botón "Nuevo producto"
  document.getElementById("btnNew").addEventListener("click", function () {
    abrirModal(); // sin parámetros => modo "nuevo"
  });

  // Campo de búsqueda por texto
  document.getElementById("q").addEventListener("input", function (evento) {
    ESTADO_GLOBAL.busqueda = evento.target.value; // guardamos texto
    ESTADO_GLOBAL.pagina = 1; // volvemos a la página 1
    renderizar();
  });

  // Select de orden (name-asc, price-desc, etc.)
  document.getElementById("sort").addEventListener("change", function (evento) {
    ESTADO_GLOBAL.orden = evento.target.value;
    renderizar();
  });

  // Manejo de clicks en los botones de editar / eliminar dentro de las filas
  document.getElementById("rows").addEventListener("click", function (evento) {
    // Buscamos el botón más cercano al objetivo del click
    var boton = evento.target.closest("button");
    if (!boton) return;

    // Buscamos el elemento con clase .tr para obtener el data-id
    var id = evento.target.closest(".tr").dataset.id;

    // Acción de editar
    if (boton.dataset.action == "edit" || boton.dataset.action == "edit2") {
      // Buscamos el producto por id (funciones redundantes)
      var producto = obtenerPorId(id) || buscarProducto(id);
      abrirModal(producto);
    }
    // Acción de eliminar
    else if (boton.dataset.action == "del") {
      if (confirm("¿Eliminar este producto?")) {
        eliminarPorId(id);
      }
    }
  });

  // Manejo de la paginación (click en botones del pager)
  document.getElementById("pager").addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;

    var numeroPagina = Number(boton.dataset.page) || 1;
    ESTADO_GLOBAL.pagina = numeroPagina;
    renderizar();
  });

  // Manejo de botones dentro del formulario (Guardar / Cancelar)
  // Importante: escuchamos el click en el formulario y detectamos data-role
  formulario.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button");
    if (!boton) return;

    var rol = boton.dataset.role;

    // Guardar producto
    if (rol === "save") {
      // Si hay id en el formulario, es edición; si no, generamos uno nuevo
      var idProducto = formulario.id.value || generarIdUnico();

      // Construimos el objeto producto
      var producto = {
        id: idProducto,
        name: formulario.name.value.trim(),
        category: formulario.category.value.trim(),
        price: Number(formulario.price.value),
        stock: Number(formulario.stock.value),
        // Si es edición, mantenemos la fecha original; si no, usamos Date.now()
        createdAt: formulario.id.value
          ? (obtenerPorId(idProducto) || {}).createdAt
          : Date.now(),
      };

      // Validaciones básicas
      if (producto.name == "") {
        alert("Nombre requerido");
        return;
      }
      if (producto.category == "") {
        alert("Categoría requerida");
        return;
      }
      if (!(producto.price >= 0)) {
        alert("Precio inválido");
        return;
      }
      if (!(producto.stock >= 0)) {
        alert("Stock inválido");
        return;
      }

      // Insertar o actualizar y cerrar modal
      guardarOActualizarProducto(producto);
      modalDialogo.close();
    }

    // Cancelar
    if (rol === "cancel") {
      modalDialogo.close();
    }
  });

  // ====== Exportar productos a JSON ======
  document.getElementById("btnExport").addEventListener("click", function () {
    var datos = leerProductos();

    // Creamos un Blob con el contenido de los productos
    var blob = new Blob([JSON.stringify(datos, null, 2)], {
      type: "application/json",
    });

    // Creamos un enlace temporal para forzar la descarga
    var enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = "productos.json";
    enlaceDescarga.click();

    // Guardamos la hora de la exportación
    ULTIMA_EXPORTACION = Date.now();

    // Liberamos el objeto URL después de unos segundos
    setTimeout(function () {
      URL.revokeObjectURL(enlaceDescarga.href);
    }, 5000);
  });

  // ====== Importar productos desde un archivo JSON ======
  document
    .getElementById("fileImport")
    .addEventListener("change", async function (evento) {
      var archivo = evento.target.files && evento.target.files[0];

      if (!archivo) {
        alert("Sin archivo");
        return;
      }

      // Leemos el contenido del archivo como texto
      var texto = await archivo.text();

      try {
        var listaImportada = JSON.parse(texto);

        // Verificamos que sea un arreglo
        if (Array.isArray(listaImportada)) {
          guardarProductos(listaImportada);
          renderizar();
          alert("Importado");
        } else {
          alert("Formato inválido");
        }
      } catch (errorParseo) {
        alert("Archivo inválido");
      }

      // Limpiamos el input file para permitir importar nuevamente
      evento.target.value = "";
    });
});
