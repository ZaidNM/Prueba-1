// Columnas y mapeo compartidos por las consultas de coches
export const SELECT_COCHE = `
    SELECT c.id, c.marca_id, c.modelo, c.anio, c.precio, c.color, c.puertas,
           c.combustible, c.imagen, m.id AS marca_ref, m.nombre AS marca_nombre
    FROM coches c
    JOIN marcas m ON m.id = c.marca_id
`

export const aCoche = (fila) => ({
    id: fila.id,
    marcaId: fila.marca_id,
    modelo: fila.modelo,
    anio: fila.anio,
    precio: fila.precio,
    color: fila.color,
    puertas: fila.puertas,
    combustible: fila.combustible,
    imagen: fila.imagen,
    marca: { id: fila.marca_ref, nombre: fila.marca_nombre }
})
