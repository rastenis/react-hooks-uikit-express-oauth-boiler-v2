"use strict";

import app from "./server";
import { config } from "./config";

// http app listening
let port = config.port || process.env.PORT || 80;
app.listen(port);
console.log(`Server listening on port ${port}`);
