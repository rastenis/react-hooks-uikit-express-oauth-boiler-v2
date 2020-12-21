import React from "react";
import ReactDOM from "react-dom";
import Layout from "./components/layout/Layout";

//import "uikit/dist/js/uikit-core.min.js";
import "uikit/dist/css/uikit.min.css";

import UIkit from "uikit";
import icons from "uikit/dist/js/uikit-icons";
(window as any).UIkit = UIkit;
// loads the icon plugin
UIkit.use(icons);

ReactDOM.render(<Layout />, document.getElementById("root"));
