import nextPwa from 'next-pwa';
import runtimeCaching from './src/cache.js';

/** @type {import('next-pwa').PWAConfig} */
const withPWA = nextPwa({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	register: true,
	scope: '/',
	sw: 'notes-worker.js',
	skipWaiting: false,
	cacheOnFrontEndNav: true,
	runtimeCaching: runtimeCaching,
	buildExcludes: [/app-build-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: process.env.NODE_ENV === 'production',
	reactStrictMode: false,
	swcMinify: process.env.NODE_ENV === 'production' ? true : false,
	compiler: {
		removeConsole:
			process.env.NODE_ENV === 'production'
				? {
						exclude: ['error'],
				  }
				: {},
	},
};

export default withPWA(nextConfig);
