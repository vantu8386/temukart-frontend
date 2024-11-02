/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/en/theme/paris",
        permanent: true,
      },
    ];
  },
  env: {
    API_PROD_URL: "http://127.0.0.1:8000/api/",
    // API_PROD_URL: "http://localhost:8000/api/",
    PAYMENT_RETURN_URL: "http://localhost:8000/api/",
    PAYMENT_CANCEL_URL: "http://localhost:8000/api/",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost:8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1:8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  }
};

module.exports = nextConfig;
