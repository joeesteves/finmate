/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, _options) => {
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
    })

    return config
  },
}

export default nextConfig
