import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
 path: './src/.env'
});
// console.log("🔑 MONGO_URI:", process.env.MONGOdb_URI);


console.log(process.env.MONGODB_URI);


connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is listening on Port: ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.log("MONGODB CONNETION FAILED" , error);
})

