import { FC, ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const BackBtn = dynamic(() => import(`@/components/BackBtn`), {
  ssr: false,
});
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import OffLineWidget from '@/widgets/OffLineWidget';
import NoInternet from '@/appImages/no_internet.png';

type Props = {
  children: ReactNode | undefined;
  backHome?: boolean;
  hideBack?: boolean;
  showMotion?: boolean;
  backRoute?: string | null;
};

const MainContentLayout: FC<Props> = ({
  children,
  backHome = false,
  hideBack = false,
  backRoute = null,
  showMotion = true,
}): JSX.Element => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);

  return (
    <motion.div
      className="z-10 w-full sm:w-4/5 md:w-3/5 xl:w-2/5 p-4"
      // animate={{ x: [isRTL ? -1000 : 1000, 0, 0] }}
      // transition={{
      //   type: 'spring',
      //   bounce: 5,
      //   duration: showMotion ? 0.2 : 0,
      // }}
      // viewport={{ once: true }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!hideBack && <BackBtn backHome={backHome} backRoute={backRoute} />}
      {isOnline ? (
        children
      ) : (
        <OffLineWidget
          message={`network_is_not_available_please_check_your_internet`}
          img={`${NoInternet.src}`}
        />
      )}
    </motion.div>
  );
};

export default MainContentLayout;
