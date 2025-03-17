const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.ts", // Entry point of your TypeScript application
    devtool: "inline-source-map", // Enable source maps for debugging
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js", // Output bundle file name
        path: path.resolve(__dirname, "dist"), // Output directory
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", // Path to your HTML template
        }),
    ],
    devServer: {
        static: "./dist", // Serve files from the dist directory
        hot: true, // Enable hot reloading
    },
};
