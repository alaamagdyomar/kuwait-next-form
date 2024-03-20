/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: process.env.NODE_ENV !== 'production',
  reactStrictMode: false,
  swcMinify: true,
  // experimental: {
  //   webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB', 'LCP'],
  // },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/country/:country/category/:category_name/4',
        destination: '/country/:country/stores',
      },
      {
        source: '/forgetpassword',
        destination: '/register/forgetpassword',
      },
      {
        source: '/about-us',

        destination: '/about',
      },
      {
        source: '/aboutus',
        destination: '/about',
      },
      {
        source: '/home/:path*',
        destination: '/',
      },
      {
        source: '/home',
        destination: '/',
      },
    ];
  },
  env: {
    SECRET_APP_KEY: '@#8!U.S.A.M.A.!@)8231',
    NEXT_PUBLIC_URL: '/',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'mybusiness.letsform.app',
      'pages-dash.testbedbynd.com',
      'form.testbedbynd.com',
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60 * 60 * 24,
  },
  //runtime: 'edge', // for Edge API Routes only
  // unstable_allowDynamic: [
  //   '/lib/utilities.js', // allows a single file
  //   '/node_modules/function-bind/**', // use a glob to allow anything in the function-bind 3rd party module
  // ],
  staticPageGenerationTimeout: 60,
};

module.exports = nextConfig;
