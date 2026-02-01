const CategoriaCard = ({ categoria, onClick }) => {
    return (
        <div
            onClick={() => onClick(categoria.nombre)}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition active:scale-95 bg-white"
        >
            <img
                src={categoria.imagen}
                alt={categoria.nombre}
                className="w-full h-32 object-cover"
            />

            <div className="p-3 text-center font-semibold text-gray-800">
                {categoria.nombre}
            </div>
        </div>
    );
};

export default CategoriaCard;
