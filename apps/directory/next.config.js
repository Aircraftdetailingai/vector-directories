/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@vector/db",
    "@vector/types",
    "@vector/auth",
    "@vector/billing",
    "@vector/email",
    "@vector/ui-primitives",
    "@vector/utils",
  ],
};

module.exports = nextConfig;
