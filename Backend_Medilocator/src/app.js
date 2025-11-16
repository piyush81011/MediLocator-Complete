// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // Import routes
// import storeRoutes from "./routes/store.routes.js";
// import inventoryRoutes from "./routes/inventory.routes.js";
// import productRequestRoutes from "./routes/productRequest.routes.js";
// import productCatalogRoutes from "./routes/productCatalog.routes.js";

// const app = express();

// // Middlewares
// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }));
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());

// // Routes
// app.use("/api/v1/store", storeRoutes);
// app.use("/api/v1/inventory", inventoryRoutes);
// app.use("/api/v1/product-requests", productRequestRoutes);
// app.use("/api/v1/products", productCatalogRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
  
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//     errors: err.errors || []
//   });
// });

// export default app;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- Middleware Setup ---
// This configures your server to accept requests
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Your React app's URL
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // To accept JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // To accept form data
app.use(express.static("public")); // To serve static files (like images)
app.use(cookieParser()); // To read and write cookies

// --- Route Imports ---
// Importing all the route files you have created
import storeRouter from "./routes/store.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import productCatalogRouter from "./routes/productCatalog.routes.js";
import productRequestRouter from "./routes/productRequest.routes.js";
import userRouter from "./routes/user.routes.js";
import billingRouter from "./routes/billing.routes.js";

// This is the new public route we created in the previous step.
// It is CRITICAL for your customer-facing pages.
import publicProductRouter from "./routes/products.public.routes.js";

// --- Route Mounting ---
// This tells Express to use your route files at specific URLs

// Public Routes
app.use("/api/v1/users", userRouter); // For customer login/register
app.use("/api/v1/products", publicProductRouter); // For PUBLIC browsing of products

// Store / Admin Routes
app.use("/api/v1/stores", storeRouter); // For store login/register
app.use("/api/v1/inventory", inventoryRouter); // Store's OWN inventory (auth required)
app.use("/api/v1/catalog", productCatalogRouter); // Store's MASTER catalog search (auth required)
app.use("/api/v1/requests", productRequestRouter); // Store's product requests (auth required)
app.use("/api/v1/billing", billingRouter);

// --- Basic Test Route ---
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});


export { app };
