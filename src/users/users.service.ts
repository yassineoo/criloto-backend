import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './types/userRole.enum';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AddAdminDto } from './dto/create-admin.dto';

@Injectable()
export class UsersService 
 {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  
  
    @InjectDataSource() private readonly dataSource: DataSource,
  
  ) {}
  async addAdmin({firstName,  password, email ,phoneNumber }: AddAdminDto) {
    // let type = role.toLowerCase()  =="admin" ?UserRole.ADMIN :UserRole.MODERATOR
    console.log(firstName, password, email);


    return await this.userRepository.save({
      phoneNumber,
      firstName,
      email,
      password: password,
      role: UserRole.ADMIN,
    });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }


  findAll() {
    return `This action returns all users`;
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: [],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  async updateRefreshToken(id: number, refreshToken: string) {
    return this.userRepository.update( id , { refreshToken });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
