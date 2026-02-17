/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@vector/db",
    "@vector/types",
    "@vector/auth",
    "@vector/email",
    "@vector/utils",
    "@vector/billing",
  ],
};

module.exports = nextConfig;
