import '../styles/globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles//galenderStyle.css';
import '@/styles/TabOrderHistory.css';
import type { NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux//store';
import MainLayout from '../app/components/layouts/MainLayout';
import 'app/i18n/config';
import { AppProps } from 'next/app';
import { FC, Suspense } from 'react';
import NextNProgress from 'nextjs-progressbar';
import ErrorHandler from '@/components/ErrorBoundary';
import { ErrorBoundary } from 'react-error-boundary';

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Suspense>
      <NextNProgress
        color="#189EC9"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
      <Provider store={store}>
        <ErrorBoundary FallbackComponent={ErrorHandler}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ErrorBoundary>
      </Provider>
    </Suspense>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {}

export default App;
