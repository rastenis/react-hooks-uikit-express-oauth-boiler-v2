import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/layout/Layout";

//import "uikit/dist/js/uikit-core.min.js";
import "uikit/dist/css/uikit.min.css";

import UIkit from "uikit";
import icons from "uikit/dist/js/uikit-icons";
window.UIkit = UIkit;
// loads the icon plugin
UIkit.use(icons);

ReactDOM.render(<Main />, document.getElementById("root"));
