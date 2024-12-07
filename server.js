const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');
const userRoutes = require('./router/userRoutes');
const familyRoutes = require('./router/familyRoutes');
const app = express();
const connectDB = require('./config/database');
connectDB();

app.use(express.json());
app.use(cors());
const port = process.env.PORT;

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/family', familyRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});