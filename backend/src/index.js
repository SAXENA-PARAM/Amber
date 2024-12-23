import dotenv from "dotenv"
import {amber ,connectDB,redisClient,connectRedis} from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})


const startServer = async () => {
    try {
      await Promise.all([
        connectDB(), 
        connectRedis()
      ]);
  
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
      });
    } catch (err) {
      console.error("Connection failed!!!", err);
    }
  };
  
  startServer();


// connectDB()
// .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`Server is running on http://localhost:${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("Connection failed !!! ", err);
// })

// process.on('SIGINT', async () => {
//     await amber.$disconnect();
//     console.log('\n PostgreSQL connection closed.');
//     process.exit(0);
//   });

const gracefulShutdown = async () => {
    try {
      await Promise.all([
        amber.$disconnect(),
        redisClient.disconnect()
      ]);
      console.log('\nAll database connections closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };
  
  // Handle different shutdown signals
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);