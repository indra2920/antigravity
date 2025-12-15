export const serializeData = (data: any): any => {
    if (!data) return null;
    if (typeof data !== 'object') return data;

    // Handle Timestamp
    if (data.toDate && typeof data.toDate === 'function') {
        return data.toDate().toISOString();
    }

    // Handle Array
    if (Array.isArray(data)) {
        return data.map(item => serializeData(item));
    }

    // Handle Object
    const newData: any = {};
    for (const key in data) {
        newData[key] = serializeData(data[key]);
    }
    return newData;
};
