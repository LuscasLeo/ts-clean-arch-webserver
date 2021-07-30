import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export default class User {
    
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    name: string
    
    @Column()
    age: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}