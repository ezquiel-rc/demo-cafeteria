import { db } from './config';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

const CIERRES_COLLECTION = 'cierresCaja';

// Guardar cierre de caja
export const guardarCierreCaja = async (data) => {
    return await addDoc(collection(db, CIERRES_COLLECTION), {
        ...data,
        cierre: serverTimestamp()
    });
};

// Escuchar historial de caja
export const subscribeToHistorialCaja = (callback) => {
    const q = query(
        collection(db, CIERRES_COLLECTION),
        orderBy('cierre', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const historial = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(historial);
    });
};




