/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/mirror/front/index.html" },
        { source: "/book", destination: "/mirror/front/index.html" },
        { source: "/sign-in", destination: "/mirror/front/index.html" },
        { source: "/sign-up", destination: "/mirror/front/index.html" },
        { source: "/check-out", destination: "/mirror/front/index.html" },
        { source: "/about", destination: "/mirror/front/index.html" },
        { source: "/success", destination: "/mirror/front/index.html" },
        { source: "/profile", destination: "/mirror/front/index.html" },
        { source: "/customer", destination: "/mirror/front/index.html" },
        { source: "/customer/:path*", destination: "/mirror/front/index.html" },

        { source: "/dashboard", destination: "/mirror/admin/index.html" },
        { source: "/users", destination: "/mirror/admin/index.html" },
        { source: "/vendors", destination: "/mirror/admin/index.html" },

        { source: "/vendor", destination: "/vendor/index.html" },
        { source: "/vendor/login", destination: "/vendor/login/index.html" },
        { source: "/vendor/tickets", destination: "/vendor/tickets/index.html" },
        { source: "/vendor/manage-bookings", destination: "/vendor/manage-bookings/index.html" },
        { source: "/vendor/transfers", destination: "/vendor/transfers/index.html" },
        { source: "/vendor/vehicles", destination: "/vendor/vehicles/index.html" },
        { source: "/vendor/settings", destination: "/vendor/settings/index.html" },
      ],
    };
  },
};

export default nextConfig;
