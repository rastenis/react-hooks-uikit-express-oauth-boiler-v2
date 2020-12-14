"use strict";

import app from "./server";
import config from "../../config/config.json";
import greenlock from "greenlock-express";
import greenlockStore from "greenlock-store-fs";

// TLS auto-setup if selfHosted is true in the config
if (config.selfHosted) {
  greenlock
    .create({
      email: config.tls.email,
      agreeTos: config.tls.tos,
      approveDomains: config.tls.domains,
      configDir: "~/.config/acme/",
      store: greenlockStore,
      app: app,
      //debug: true
    })
    .listen(80, 443);
  console.log(`Server listening on ports 80 and 443`);
} else {
  // http app listening
  let port = config.port || process.env.PORT || 7777;
  app.listen(port);
  console.log(`Server listening on port ${port}`);
}
