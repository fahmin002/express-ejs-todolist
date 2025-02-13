/* index.ts */
import express from "express"
import path from 'path'
import session from 'express-session'
import authRouter from "./src/routers/authRouter"
import todosRouter from "./src/routers/todosRouter"
const app = express()
const port = 8080


app.use(
  session({
    secret: 'VKN.ctwyOaIMWfMm', // Ganti dengan kunci rahasia yang aman
    resave: false, // Hindari menyimpan ulang sesi jika tidak ada perubahan
    saveUninitialized: false, // Hanya simpan sesi jika ada data
    cookie: {
      secure: false, // Ubah menjadi true jika menggunakan HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Waktu kedaluwarsa sesi (1 hari)
    },
  })
);



// For parsing application/json
app.use(express.json());
app.use((req: Request, res: Response, next: Function) => {
  res.locals.message = req.session.message || null;
  delete req.session.message;
  next();
});
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(authRouter)
app.use(todosRouter)

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}...`)
})
/* end of index.ts */