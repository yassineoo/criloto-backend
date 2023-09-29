import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity } from "typeorm";
import { UserRole } from "../types/userRole.enum";

@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
    @Column()
    firstName : string ;

    @Column()
    familyName : string ;

    @Column()
    email : string ;

    @Column()
    password : string ;

    @Column()
    phoneNumber : string ;

    @Column()
    birthday : Date ;

    @Column({ default: UserRole.CLIENT, type: 'enum', enum: UserRole })
    type: UserRole;

    @Column()
    imageName : string ;


    @Column({ nullable: true })
    refreshToken: string;


}
