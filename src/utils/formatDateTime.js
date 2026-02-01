export const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleString();
};
