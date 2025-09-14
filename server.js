// Load biến môi trường từ .env
require('dotenv').config(); // phải đặt ở dòng đầu tiên để process.env được load trước khi sử dụng

// Import các package cần thiết
const express = require('express');
const bodyParser = require('body-parser'); // parse x-www-form-urlencoded
const morgan = require('morgan');           // HTTP request logger
const connectMongo = require('./server/database/connect'); // kết nối MongoDB

const app = express();
const PORT = process.env.PORT || 3100;     // port từ .env hoặc mặc định 3100





// ---- View Engine ----
app.set('view engine', 'ejs');             // cho phép sử dụng EJS trong views

// ---- Middleware ----
app.use(bodyParser.urlencoded({ extended: true })); // parse x-www-form-urlencoded
app.use(express.json());                            // parse JSON body cho API
app.use(express.static('assets'));                 // phục vụ static file từ folder assets
app.use(morgan('tiny'));                           // log http requests

// ---- Connect Database ----
connectMongo(); // đảm bảo .env đã có MONGO_STR


const methodOverride = require('method-override');
app.use(methodOverride('_method')); // đọc query ?_method=PUT

// ---- Load Routes ----
app.use('/', require('./server/routes/routes')); // routes web + API

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  const status = err.status || 500;

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(status).json({
      error: err.message || "Internal Server Error",
    });
  }

  res.status(status).render("error", {
    message: err.message || "Internal Server Error",
    status,
  });
});


// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Welcome to the Drug Monitor App at http://localhost:${PORT}`);
});
