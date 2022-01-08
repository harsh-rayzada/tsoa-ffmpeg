import { app } from "./app";

const port = process.env.PORT || 8070;

app.listen(port, () =>
  console.log(`App started on http://localhost:${port}`)
);