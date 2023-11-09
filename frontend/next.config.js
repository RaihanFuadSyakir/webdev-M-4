/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
});
const nextConfig = {
    ...withPWA
}

module.exports = nextConfig

// const withPWA  = require("next-pwa");
// module.exports = withPWA({
//  //...before
//   pwa: {
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//   },
//   //...after
// });