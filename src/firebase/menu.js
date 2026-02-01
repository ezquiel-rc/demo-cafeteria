import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config";

const menuRef = collection(db, "menu");

// 🔹 Obtener productos
export const getMenu = async () => {
    const snapshot = await getDocs(menuRef);
    return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    }));
};

// 🔹 Agregar producto
export const addProduct = async (product) => {
    await addDoc(menuRef, product);
};

// 🔹 Actualizar producto
export const updateProduct = async (id, data) => {
    const productRef = doc(db, "menu", id);
    await updateDoc(productRef, data);
};

// 🔹 Eliminar producto
export const deleteProduct = async (id) => {
    const productRef = doc(db, "menu", id);
    await deleteDoc(productRef);
};


