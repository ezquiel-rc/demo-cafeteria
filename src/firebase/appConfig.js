import { db } from './config'
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    collection,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore'

const CONFIG_DOC_ID = 'app'

/* =========================
   CONFIG GENERAL
========================= */

// Obtener configuración
export const getAppConfig = async () => {
    const ref = doc(db, 'config', CONFIG_DOC_ID)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
        return {
            cajaAbierta: false,
            totalDia: 0
        }
    }

    return snap.data()
}

/* =========================
   CAJA
========================= */

// ABRIR CAJA
export const openCaja = async () => {
    const ref = doc(db, "config", "app");

    await setDoc(
        ref,
        {
            cajaAbierta: true,
            cajaAbiertaEn: serverTimestamp(),
            cierre: null,
            totalDia: 0
        },
        { merge: true }
    );
};


// CERRAR CAJA
export const closeCaja = async () => {
    const ref = doc(db, 'config', CONFIG_DOC_ID)

    await updateDoc(ref, {
        cajaAbierta: false,
        cierre: serverTimestamp()
    })
}

/* =========================
   REGISTROS DE CAJA
========================= */

export const getRegistrosCaja = async () => {
    const q = query(
        collection(db, 'registrosCaja'),
        orderBy('fecha', 'desc')
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}




