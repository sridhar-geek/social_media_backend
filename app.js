
     /** Imports */
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import 'express-async-errors'
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";

import path from "path";
import { fileURLToPath } from "url";      // allows us to propely set the path


    /* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// these two are needed to use dirname, beacuse we are using es6 module 
const app = express();
dotenv.config();

    /* Importing modules from another files */
import { connectToDb } from "./connect.js";
import notFound from "./Middleware/notFound.js";
import errorHandlerMiddleware from "./Middleware/errorHandler.js";
import router from './Routes/userAuth.js'
import authorization from "./Middleware/authorization.js";


app.use(express.json());        //  helps to access req.body elements
// body parsers used to extract data from req.body 
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(morgan("common"));
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));    // this is used to specify the path of the assests folder, providing static files to middleware

            /* File storage */
// const storage = multer.diskStorage( {
//     destination: function (req, file, cb){
//          cb(null, 'public/assets')
//     },
//     filename: function (req, file, cb){
//         cb(null, file.originalname)
//     }
// })

// const upload = multer ( {storage})         // whenever we need to upload a file, we use this 

// app.post('/auth/register', upload.single('picture'), register)    
        /* Routes */

    app.get('/',  ( req, res )=> {
        res.send('This is homePage')
    })

    app.use('/server/api', router)
    app.use( notFound )
    app.use( errorHandlerMiddleware )




const PORT = process.env.PORT || 4000

const start = async() => {
    try {
        await connectToDb( process.env.MONGO_CONNECTION_URL)
        app.listen(PORT, ()=> console.log(`Our Server is running on Port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start ()
