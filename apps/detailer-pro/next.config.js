/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@vector/db",
    "@vector/types",
    "@vector/auth",
    "@vector/utils",
    "@vector/email",
    "@vector/billing",
  ],
};

module.exports = nextConfig;
