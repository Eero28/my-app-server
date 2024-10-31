import { Review } from "src/review/entities/review.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column()
    password: string;
    
    @Column({unique: true})
    email: string;

    @Column({default: "user"})
    role: string;

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}
