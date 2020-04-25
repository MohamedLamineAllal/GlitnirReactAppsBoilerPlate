module.exports = {
	// webpack: {
	//     configure: {
	//         target: 'electron-renderer'
	//     }
	// }
	webpack: {
		module: {
			rules: [
				{
					test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
					loader: require.resolve("url-loader"),
					options: {
						limit: 100000000,
						name: "static/media/[name].[hash:8].[ext]"
					}
				}
			]
		}
	}
};
