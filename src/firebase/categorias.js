import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export const getCategorias = async () => {
    const categoriasRef = collection(db, "categorias");
    const snapshot = await getDocs(categoriasRef);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

