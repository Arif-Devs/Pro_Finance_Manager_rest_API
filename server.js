import connectMongoDB from './src/config/db.js';
import app from './src/app.js';
const PORT = process.env.PORT || 5000;

//Server Listening and connect Database

connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT} Successfully!`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
