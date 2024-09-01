const isEmptyOrFalsy = (value) => {
    return value === undefined || value === null || value === "";
};

export const isObjectEmptyOrFalsy = (obj) => {
    if (obj === null || obj === undefined) {
        return true;
    }

    if (typeof obj !== "object") {
        return true;
    }

    const keys = Object.keys(obj);
    if (keys.length === 0) {
        return true;
    }

    const allEmpty = Object.values(obj).every(isEmptyOrFalsy);
    return allEmpty;
};

export function displayValue(value) {
    if (value === undefined || value === null) {
        return '-';
    } else if (Array.isArray(value) && value.length > 1) {
        return (
            <div style={{ overflowY: 'auto', maxHeight: '100px', listStyle: 'none' }}>
                <ul>
                    {value.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    } else if (typeof value === 'object') {
        return Object.values(value).join(', ');
    } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
        const date = new Date(value);
        return date.toLocaleDateString();
    } else {
        return value;
    }
}
