import { useEffect, useState } from "react";
import { getCategorias } from "../firebase/categorias";
import CategoriaCard from "./CategoriaCard";

const Categorias = ({ onSelectCategoria }) => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            const data = await getCategorias();
            setCategorias(data);
        };

        fetchCategorias();
    }, []);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {categorias.map((cat) => (
                <CategoriaCard
                    key={cat.id}
                    categoria={cat}
                    onClick={onSelectCategoria}
                />
            ))}
        </div>
    );
};

export default Categorias;
