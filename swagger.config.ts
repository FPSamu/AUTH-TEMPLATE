import { version } from "os";
import { SwaggerOptions } from "swagger-ui-express";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Atomic Habit Tracker',
            description: 'Habit Tracker backend',
            version: '0.0.1'
        },
        servers: [
            { url:"https://localhost/" + process.env.PORT || 3000 }
        ]
    },
    apis: [
        './src/**/*.ts'
    ]
}

export default swaggerOptions;