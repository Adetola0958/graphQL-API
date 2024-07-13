import argon2 from "argon2";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { User } from "../entities/User";
import { Context } from "../types/Context";
import * as jwt from "jsonwebtoken";

export const AuthType = objectType({
  name: "AuthType",
  definition(t) {
    t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const RegisterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthType",
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        const { firstName, lastName, email, password } = args;
        const hashedPass = await argon2.hash(password);
        let user, token;
        // let token;
        try {
          const newUser = await context.conn
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({ firstName, lastName, email, password: hashedPass })
            .returning("*")
            .execute();
          user = newUser.raw[0];
          token = jwt.sign(
            { userId: user.id },
            process.env.TOKEN_SECRET as jwt.Secret
          );
          
        } catch (error) {
          console.log(error);
        }

        return{
            message: "ok",
            user,
            token,
        }
      },
    });

    t.nonNull.field("login", {
        type: "AuthType",
        args: {
            email: nonNull(stringArg()),
            password: nonNull(stringArg())
        },
        async resolve(_parent, args, _context: Context, _info) {
            const { email, password } = args;
            let token;
            
            const user = await User.findOne({where: {email}})
            if(!user){
                throw new Error("User does not exist")
            }

            const verifyPass = await argon2.verify(user.password, password);
            if(!verifyPass){
                throw new Error("Invalid credentials")
            }
            token = jwt.sign(
                { userId: user.id },
                process.env.TOKEN_SECRET as jwt.Secret
            );
            return{
                user,
                token
            }
            
          },
    })
  },
});
