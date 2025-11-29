import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


// This configures your server to accept requests
app.use(
  cors({
    origin: [
      "https://medilocator-cqam.onrender.com",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

app.options("*", cors());


app.use(express.json({ limit: "16kb" })); // To accept JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // To accept form data
app.use(express.static("public")); // To serve static files (like images)
app.use(cookieParser()); // To read and write cookies

import storeRouter from "./routes/store.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import productCatalogRouter from "./routes/productCatalog.routes.js";
import productRequestRouter from "./routes/productRequest.routes.js";
import userRouter from "./routes/user.routes.js";
import billingRouter from "./routes/billing.routes.js";

import publicProductRouter from "./routes/products.public.routes.js";
import productsPublicRouter from "./routes/products.public.routes.js";


import customerRoutes from "./routes/customer.routes.js";

app.use("/api/v1/users", userRouter); // For customer login/register
app.use("/api/v1/products", publicProductRouter); // For PUBLIC browsing of products

// Store / Admin Routes
app.use("/api/v1/stores", storeRouter); // For store login/register
app.use("/api/v1/inventory", inventoryRouter); // Store's OWN inventory (auth required)
app.use("/api/v1/catalog", productCatalogRouter); // Store's MASTER catalog search (auth required)
app.use("/api/v1/requests", productRequestRouter); // Store's product requests (auth required)
app.use("/api/v1/billing", billingRouter);
app.use("/api/v1/products", productsPublicRouter);
app.use("/api/v1/customer", customerRoutes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});


export { app };
