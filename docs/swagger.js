const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expense Tracker API',
            version: '1.0.0',
            description: 'API documentation for Expense Tracker application',
        },
        servers: [
            {
                url: `https://expensetracker-b267.onrender.com`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./router/*.js', './model/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
