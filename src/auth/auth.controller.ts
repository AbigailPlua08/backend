import { Controller, Post, Body, NotFoundException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { EmailService } from './email.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,

  ) { }


  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(201)
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const token = this.authService.generateResetToken(user.id);
    await this.emailService.sendResetPasswordEmail(user.email, token);
    return { message: 'Correo de recuperación enviado' };
  }

  @Post('reset-password')
  @HttpCode(201)
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const userId = this.authService.verifyResetToken(token);
    await this.userService.updatePassword(Number(userId), newPassword);
    return { message: 'Contraseña actualizada correctamente' };
  }



}