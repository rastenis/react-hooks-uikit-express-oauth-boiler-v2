"use strict";

import app from "./server";
import config from "../../config/config.json";

// http app listening
let port = config.port || process.env.PORT || 7777;
app.listen(port);
console.log(`Server listening on port ${port}`);
