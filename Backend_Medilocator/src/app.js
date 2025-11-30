import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ---------------------- CORS SETUP ----------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://medilocator-complete.onrender.com',
  'https://medilocator-cqam.onrender.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// ---------------------------------------------------------

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ---------------------- ROUTES --------------------------
import storeRouter from "./routes/store.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import productCatalogRouter from "./routes/productCatalog.routes.js";
import productRequestRouter from "./routes/productRequest.routes.js";
import userRouter from "./routes/user.routes.js";
import billingRouter from "./routes/billing.routes.js";
import publicProductRouter from "./routes/products.public.routes.js";
import productsPublicRouter from "./routes/products.public.routes.js";
import customerRoutes from "./routes/customer.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", publicProductRouter);

app.use("/api/v1/stores", storeRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/catalog", productCatalogRouter);
app.use("/api/v1/requests", productRequestRouter);
app.use("/api/v1/billing", billingRouter);

app.use("/api/v1/products", productsPublicRouter);
app.use("/api/v1/customer", customerRoutes);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// --------------------- EXPORT ---------------------------
export { app };