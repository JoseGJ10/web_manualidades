
    /**
     * Variable global para controlar el orden de clasificación (ascendente/descendente)
     * @var {boolean}
     */
    let sortOrder = true; // true = ascendente, false = descendente

    /**
     * Variable global para rastrear la columna actualmente ordenada.
     * @var {integer}
     */
    let currentSortedColumn = null; 

    /**
     * URL del endpoint para obtener las estadísticas.
     * @constant {string}
     */
    const STATS_URL = '/api/stats/visits';

    /**
     * Elemento de la tabla donde se mostrarán las estadísticas.
     * @type {HTMLTableElement}
     */
    const tableBody = document.querySelector('#stats-table tbody');

    /**
     * Elemento menu lateral del CMS
     * @type {HTMLAsideMenuElement}
     */
    const menu = document.getElementById('menu-lateral');

    /**
     * Elemento boton para mostrar ocultar menú
     * @type {HTMLButtonElement}
     */
    const toogleMenuLateral = document.getElementById('toggle-menu')

    /**
     * Elemento contentpara mostrar el contenido.
     * @type {HTMLDivElement}
     */
    const content = document.getElementById('content');

/**
 * Inicializa las funciones de la aplicación al cargar el DOM.
 * @function init
 * @returns {void}
 */
function init(){
    getStats();
    aplyMediaQueryVisible(); 
}


/**
 * Aplica las reglas de visibilidad basadas en media queries.
 * @function applyMediaQueryVisible
 * @returns {void}
 */
function aplyMediaQueryVisible() {

    var width = window.innerWidth;

    if ( width < 950 && menu.classList.contains('visible')){
        menu.classList.toggle('visible');
    }

    if ( width >= 950 && !menu.classList.contains('visible')){
        menu.classList.toggle('visible');
    }

}

/**
 * Obtiene las estadísticas de visitas desde el servidor y las muestra en la tabla.
 * @async
 * @function getStats
 * @returns {Promise<void>} Una promesa que se resuelve cuando las estadísticas se han mostrado en la tabla.
 */
async function getStats() {
    try {
        const response = await fetch(STATS_URL);
        const data = await response.json();
        const stats = data.data

        stats.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stat.page}</td>
            <td>${stat.visits}</td>
            <td>${new Date(stat.last_visit).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
    
}

/**
 * Muestra y oculta el menu lateral y desplaza el contenido de la pagina
 * @function toggleLateralMenu
 * @returns {void}
 */
function toggleLateralMenu() {
    menu.classList.toggle('visible');
    content.classList.toggle('shifted');
    //toogleMenuLateral.classList.toggle('shifted');
}

/**
 * Ordena la tabla por la columna marcada.
 * @function sortTable
 * @param {number} columnIndex - Índice de la columna a ordenar
 * @returns {void}
 */
function sortTable(columnIndex) {

    let table = document.getElementById('stats-table');
    let rows = Array.from(table.rows).slice(1);
    rows.sort((a, b) => {
        let aText = a.cells[columnIndex].innerText;
        let bText = b.cells[columnIndex].innerText;
        
        if (!isNaN(aText) && !isNaN(bText)) { // Si los valores son numéricos
            aText = parseFloat(aText);
            bText = parseFloat(bText);
        }
        
        if (aText < bText) return sortOrder ? -1 : 1;
        if (aText > bText) return sortOrder ? 1 : -1;
        return 0;
    });
    
    sortOrder = !sortOrder; // Cambiar el orden para la próxima vez
    tableBody.innerHTML = "";
    
    rows.forEach(row => tableBody.appendChild(row));

    // Actualizar iconos de ordenación
    updateSortIcons(columnIndex);

}

/**
 * Función para actualizar los iconos de ordenación
 * @param {number} columnIndex - Índice de la columna actualmente ordenada
 */
function updateSortIcons(columnIndex) {
    if (currentSortedColumn !== null) {
        // Limpiar icono de la columna previamente ordenada
        document.getElementById(`icon-${currentSortedColumn}`).classList.remove('sort-asc', 'sort-desc');
    }
    
    // Añadir el icono apropiado a la columna actualmente ordenada
    const icon = document.getElementById(`icon-${columnIndex}`);
    if (sortOrder) {
        icon.classList.add('sort-desc');
        icon.classList.remove('sort-asc');
    } else {
        icon.classList.add('sort-asc');
        icon.classList.remove('sort-desc');
    }
    
    // Actualizar la columna actualmente ordenada
    currentSortedColumn = columnIndex;
}

window.addEventListener('resize',aplyMediaQueryVisible);
window.addEventListener('DOMContentLoaded',init);
toogleMenuLateral.addEventListener('click',toggleLateralMenu);