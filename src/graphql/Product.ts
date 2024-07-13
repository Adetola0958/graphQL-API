import {extendType, nonNull, objectType, floatArg, stringArg} from "nexus" 
import { Context } from "../types/Context"
import { Product } from "../entities/Product"
import { User } from "../entities/User"
// import {NexusGenObjects} from "../../nexus-typegen"

export const productType = objectType({
    name: "Product",
    definition(t) {
        t.nonNull.int("id"),
        t.nonNull.string("name"),
        t.nonNull.float("price"),
        t.nonNull.int("createdById"),
        t.field("createdBy", {
            type: "User",
            resolve(parent, _args, _context, _info): Promise<User | null>{
                return User.findOne({where: {id: parent.createdById}})
            }
        })
    },
})

// let products: NexusGenObjects["Product"][] = [
//     {
//         id: 1,
//         name: "Product 1",
//         price: 15.90
//     },
//     {
//         id: 2,
//         name: "Product 2",
//         price: 10.90
//     }
// ];

export const ProductQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("getProducts", {
            type: "Product",
            resolve(_parent, _args, _context, _info): Promise<Product[]> {
                return Product.find()
            }
        })
    },
})

export const createProductMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createProduct", {
            type: "Product", 
            args: {
                name: nonNull(stringArg()),
                price: nonNull(floatArg())
            },
            resolve(_parent, args, context: Context, _info): Promise<Product> {
                const {name, price} = args
                const {userId} = context

                if(!userId){
                    throw new Error("User does not exist")
                }
                return Product.create({name, price, createdById: userId}).save()
            }
        }) 
    },
})