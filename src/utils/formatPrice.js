export const formatPrice = (price) => {
    const number = Number(price) || 0;
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0
    }).format(number);
};


