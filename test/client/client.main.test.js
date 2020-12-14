import Main from "../../src/client/components/layout/Layout";
import React from "react";
import ReactDOM from "react-dom";

import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import icons from "uikit/dist/js/uikit-icons";

it("Renders layout", () => {
  window.UIkit = UIkit;
  // loads the icon plugin
  UIkit.use(icons);

  ReactDOM.render(
    <Main />,
    document.getElementById("root") || document.createElement("div") // for testing
  );
});
