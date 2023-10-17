import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './types/userRole.enum';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AddAdminDto } from './dto/create-admin.dto';
//import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async addAdmin({ firstName, password, email, phoneNumber }: AddAdminDto) {
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

  async create({ password, ...data }: CreateUserDto) {
    // const passwordHash = await this.authService.hashpassword(password);
    let pass = password ? await bcrypt.hash(password, 12) : '';
    return await this.userRepository.save({ password: pass, ...data });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: [],
    });
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: [],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let pass = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 12)
      : '';
    return await this.userRepository.update(id, {
      ...updateUserDto,
      password: pass,
    });
  }
  async updateRefreshToken(id: number, refreshToken: string) {
    return this.userRepository.update(id, { refreshToken });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
