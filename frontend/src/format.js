const moneda = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0
})

export const precio = (valor) => moneda.format(valor)

export const COMBUSTIBLES = {
    gasolina: 'Gasolina',
    diesel: 'Diésel',
    electrico: 'Eléctrico',
    hibrido: 'Híbrido',
    gas: 'GLP / GNV'
}

export const combustible = (valor) => COMBUSTIBLES[valor] ?? valor
