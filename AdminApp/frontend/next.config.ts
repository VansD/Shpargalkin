/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://localhost:44380/api/:path*", // твой ASP.NET Core
      },
    ];
  },
};

module.exports = nextConfig;
