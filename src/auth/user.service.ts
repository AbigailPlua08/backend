import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                email: email
            }
        });
    }

    async updatePassword(userId: number, newPassword: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;

        await this.userRepository.save(user);
    }
}
