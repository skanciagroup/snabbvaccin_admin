import { toast } from 'react-hot-toast';

const defaultToastOptions = {
    className: 'toastBlock', // Default class for text size
    style: {
        fontSize: '14px', // Default font size
    },
};

export const errorToast = (message: string, options = {}) => {
    toast.error(message, { ...defaultToastOptions, ...options });
};

export const successToast = (message: string, options = {}) => {
    toast.success(message, { ...defaultToastOptions, ...options });
};


