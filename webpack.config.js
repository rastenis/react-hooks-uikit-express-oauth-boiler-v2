const path = require("path");
const config = require("./config/config.json");
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src", "client"),

  output: {
    path: path.resolve(__dirname, "dist/client"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx"],
  },
  devServer: {
    historyApiFallback: true,
    proxy:
      process.env.NODE_ENV == "production"
        ? null
        : {
            "/api": {
              target: `http://localhost:${config.port}`,
              secure: false,
            },
          },
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
};
