import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm"
import { Product } from "./Product"

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column({unique: true})
    email!: string

    @Column()
    password!: string

    @OneToMany(() => Product, (product) => product.createdBy)
    products: Product[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}