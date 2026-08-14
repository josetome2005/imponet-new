
export function generateSlug(value) {
    return value
        .normalize("NFD")
        .trim()
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "_")
}
