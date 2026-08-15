export function calculateOverdueDays(endDate) {

    if(!endDate) return 0

    const normalizedDate = normalizeDateToISO(endDate)

    const today = new Date()
    const end = new Date(normalizedDate)

    // Diferencia en milisegundos
    const diffMs = today - end

    // Pasar a días
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    return diffDays
}

export function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
}

export function formatDateRange(startDate, endDate) {
    
    const start = parseLocalDate(startDate)
    const end = parseLocalDate(endDate)

    const dayMonthFormatter = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short"
    })

    const yearFormatter = new Intl.DateTimeFormat("es-ES", {
        year: "numeric"
    })

    const startFormatted = dayMonthFormatter.format(start)
    const endFormatted = dayMonthFormatter.format(end)
    const yearFormatted = yearFormatter.format(end)

    return `${startFormatted} - ${endFormatted} ${yearFormatted}`
}

export function formatDateForInput(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

export function normalizeDateToISO(dateString) {
    if (!dateString) return dateString
    
    const str = String(dateString)

    // Si ya está en formato YYYY-MM-DD, devolverlo
    if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString
    }
    
    // Si está en formato DD/MM/YYYY, convertirlo
    if (str.includes('/')) {
        const [day, month, year] = str.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    
    return str
}


/*------------- OBTIENE EL DÍA DE COMIENZO Y FINAL DEL RANGO DEL PERIODO INDICADO POR EL PARÁMETRO TYPE */
/* 
"type": 
"weekly"       // semanal
"biweekly"     // quincenal
"monthly"      // mensual
"bimonthly"    // bimestral
"quarterly"    // trimestral
"semiannual"   // semestral
"annual"       // anual
*/

export function getPeriodRange(type, baseDate = new Date()) {
    const year = baseDate.getFullYear()
    const month = baseDate.getMonth()
    const day = baseDate.getDate()

    const start = new Date(baseDate)
    const end = new Date(baseDate)

    switch (type) {

        case "daily": {
            // start y end son el mismo día
            start.setHours(0, 0, 0, 0)
            end.setHours(23, 59, 59, 999)
            break
        }

        case "weekly": {
            const weekDay = baseDate.getDay() || 7 // domingo = 7
            start.setDate(day - weekDay + 1)
            end.setDate(start.getDate() + 6)
            break
        }

        case "biweekly": {
            const isFirstHalf = day <= 15
            start.setDate(isFirstHalf ? 1 : 16)
            end.setDate(isFirstHalf ? 15 : new Date(year, month + 1, 0).getDate())
            break
        }

        case "monthly": {
            start.setDate(1)
            end.setMonth(month + 1, 0)
            break
        }

        case "bimonthly": {
            const startMonth = month % 2 === 0 ? month : month - 1
            start.setMonth(startMonth, 1)
            end.setMonth(startMonth + 2, 0)
            break
        }

        case "quarterly": {
            const quarterStart = Math.floor(month / 3) * 3
            start.setMonth(quarterStart, 1)
            end.setMonth(quarterStart + 3, 0)
            break
        }

        case "semiannual": {
            const semesterStart = month < 6 ? 0 : 6
            start.setMonth(semesterStart, 1)
            end.setMonth(semesterStart + 6, 0)
            break
        }

        case "annual": {
            start.setMonth(0, 1)
            end.setMonth(11, 31)
            break
        }

        default:
            throw new Error(`Periodo no soportado: ${type}`)
    }

    const startFormated = formatDateForInput(start)
    const endFormated = formatDateForInput(end) 

    return { start: startFormated, end: endFormated }
}


export function isWithinLast30Days(dateString) {
    if (!dateString) return false

    const normalized = normalizeDateToISO(dateString)
    const saleDate = new Date(normalized)

    const today = new Date(normalizeDateToISO(new Date()))
    const limitDate = new Date(normalizeDateToISO(new Date()))
    limitDate.setDate(today.getDate() - 30)

    return saleDate >= limitDate && saleDate <= today
}

export function isToday(dateString) {
    if (!dateString) return false

    const normalized = normalizeDateToISO(dateString)

    const [year, month, day] = normalized.split("-").map(Number)

    const today = new Date()

    return (
        year === today.getFullYear() &&
        month - 1 === today.getMonth() &&
        day === today.getDate()
    )
}


export function isYesterday(dateString) {
    if (!dateString) return false

    const normalized = normalizeDateToISO(dateString)

    const [year, month, day] = normalized.split("-").map(Number)

    const date = new Date(year, month - 1, day)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
    )
}

/*//////////////////////////////////////////////////////////////////////////////////*/

export function formatFecha(fechaISO) {
    if (!fechaISO) return ""

    const date = new Date(fechaISO)

    const fecha_completa = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date)

    const fecha = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date)

    const hora = new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date)

    return {
        fecha_completa, 
        fecha, 
        hora
    }
}

export function isCurrentCalendarMonth(dateString) {
    if (!dateString) return false

    const date = new Date(dateString)
    const today = new Date()

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth()
    )
}