import {DataSource} from "typeorm"


import dotenv from "dotenv"
import { Product } from "./entities/Product"
import { User } from "./entities/User"
dotenv.config()

//const host = process.env.HOST
export default new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [Product, User],
    synchronize: true,
    //url: process.env.CONECTION_STRING
})