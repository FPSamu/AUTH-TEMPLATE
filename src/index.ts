import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./services/database.service";
import swaggerJSDoc from "swagger-jsdoc";
import { setup, serve } from "swagger-ui-express";
import swaggerOptions from "../swagger.config";
import router from "./routes";

const port = process.env.PORT || 3000;
const app = express();


app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    res.send('api working!');
});

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/swagger', serve, setup(swaggerDocs));

(async () => {
    connectDB();

    app.listen(port, () => {
        console.log(`server running in port ${port}`);
    })
})();