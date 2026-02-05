import { db } from "./config";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    where,
    getDocs,
    serverTimestamp,
    getDoc,
    increment,
    writeBatch
} from "firebase/firestore";

const PEDIDOS_COLLECTION = "pedidos";

// =======================
// CREAR PEDIDO
// =======================
export const createOrder = async (order) => {
    return await addDoc(collection(db, PEDIDOS_COLLECTION), {
        ...order,
        createdAt: serverTimestamp(),
        status: "pendiente",
        archivado: false
    });
};

// =======================
// SUSCRIPCIÓN A PEDIDOS
// =======================
let firstLoad = true;

export const subscribeToOrders = (callback) => {
    const q = query(
        collection(db, PEDIDOS_COLLECTION),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        callback(orders);
    });
};



// =======================
// ACTUALIZAR ESTADO
// =======================
export const updateOrderStatus = async (id, status, total = 0) => {
    const orderRef = doc(db, PEDIDOS_COLLECTION, id);
    const configRef = doc(db, "config", "app");

    await updateDoc(orderRef, {
        status,
        ...(status === "entregado" && {
            entregadoEn: serverTimestamp(),
            archivado: false
        })
    });

    // Sumar a caja solo al entregar
    if (status === "entregado") {
        const configSnap = await getDoc(configRef);
        const config = configSnap.data();

        if (config?.cajaAbierta) {
            const monto = parseFloat(total);

            await updateDoc(configRef, {
                totalDia: increment(isNaN(monto) ? 0 : monto)
            });
        }
    }
};

// =======================
// ARCHIVAR PEDIDOS ENTREGADOS
// =======================
export const archivarPedidosEntregados = async () => {
    const q = query(
        collection(db, PEDIDOS_COLLECTION),
        where("status", "==", "entregado")
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach(docSnap => {
        batch.update(docSnap.ref, { archivado: true });
    });

    await batch.commit();
};


// =======================
// PEDIDOS POR PERÍODO
// =======================
export const getPedidosPorPeriodo = async (apertura, cierre) => {
    const q = query(
        collection(db, PEDIDOS_COLLECTION),
        where("createdAt", ">=", apertura),
        where("createdAt", "<=", cierre)
    );

    const snap = await getDocs(q);

    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// =======================
// RANKING DE PRODUCTOS POR DÍA
// =======================
export const calcularRankingProductos = async (inicioDia, finDia) => {
    const q = query(
        collection(db, PEDIDOS_COLLECTION),
        where("createdAt", ">=", inicioDia),
        where("createdAt", "<=", finDia),
        where("status", "==", "entregado")
    );

    const snapshot = await getDocs(q);

    const ranking = {};

    snapshot.docs.forEach(doc => {
        const pedido = doc.data();

        pedido.items.forEach(item => {
            if (!ranking[item.name]) {
                ranking[item.name] = {
                    nombre: item.name,
                    cantidad: 0,
                    total: 0
                };
            }

            ranking[item.name].cantidad += item.quantity;
            ranking[item.name].total += item.price * item.quantity;
        });
    });

    return Object.values(ranking).sort(
        (a, b) => b.cantidad - a.cantidad
    );
};









