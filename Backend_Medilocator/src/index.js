import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
 path: './src/.env'
});


connectDB()
.then(() => {
    app.listen(process.env.PORT , () => {
        console.log(`Server is listening on Port: ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.log("MONGODB CONNETION FAILED" , error);
})
