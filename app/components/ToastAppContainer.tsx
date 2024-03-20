import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '@/redux/hooks';
import { tajwalFont } from '@/constants/*';

const ToastAppContainer = () => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  return (
    <ToastContainer
      position={isRTL ? `top-left` : 'top-right'}
      className={`${tajwalFont} opacity-80`}
      autoClose={8000}
      limit={1}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={isRTL}
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
    />
  );
};

export default ToastAppContainer;
