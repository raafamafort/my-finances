// utils/toastUtils.ts
import { toast, ToastOptions  } from 'react-toastify';

const toastConfig: ToastOptions  = {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
};

export const showErrorToast = (message: string) => {
    toast.error(message, toastConfig);
};

export const showSuccessToast = (message: string) => {
    toast.success(message, toastConfig);
};
