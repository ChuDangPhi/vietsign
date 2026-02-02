export const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateRequireInput = (value: string) => {
    return value.trim().length > 0;
};
