import env from "./config/env";
import { MongoHelper } from "../infra/criptography/db/mongodb/helpers/mongo-helper";

MongoHelper.connect(env.mongoUrl).then(async () => {
    const app = (await import("./config/app")).default
    app.listen(env.port, () => console.log(`server running at ${env.port}`));
}).catch(console.error)
