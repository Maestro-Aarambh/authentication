import app from './src/app.js';
import connectDB from './src/config/database.js';

connectDB();

const Port = 3000;

app.listen(Port, () => {
    console.log(`Server is running at http://localhost:${Port}`);
});