import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const useToast = () => {
  const showToast = (message,type, options = {}) => {
    toast(message, {
      theme: "auto",
      type: type,
      position: "bottom-left",
      pauseOnFocusLoss: false,
      dangerouslyHTMLString: true,
      autoClose : 3000,
    });
  };

  return { showToast };
};

export default useToast