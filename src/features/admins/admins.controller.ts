import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Headers,
  Put,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  // Get all Admins
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  // Delete an Admin by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }

  // Signup (for un-authenticated access)
  // @ExcludeAuth()
  // @Post('signup')
  // async signUp(
  //   @Body() signupData: any,
  //   @Headers() headers: Record<string, string>,
  // ) {
  //   const authorization = headers['authorization'];
  //   return this.adminsService.signup(signupData, authorization);
  // }

  // // Login (for un-authenticated access)
  // @ExcludeAuth()
  // @Post('login')
  // async login(@Body() credentials: any) {
  //   return this.adminsService.login(credentials);
  // }

  // // Refresh Token (for un-authenticated access)
  // @ExcludeAuth()
  // @Post('refresh')
  // async refreshToken(@Body() refreshTokenDto: any) {
  //   return this.adminsService.refreshToken(refreshTokenDto);
  // }

  // // Change Password
  // @Put('change-password')
  // async changePassword(@Body() changePasswordDto: any, @Req() req) {
  //   return this.adminsService.changePassword(
  //     req.userId,
  //     changePasswordDto,
  //   );
  // }

  // // Forgot Password (for un-authenticated access)
  // @ExcludeAuth()
  // @Post('forgot-password')
  // async forgotPassword(@Body() forgotPasswordDto: any) {
  //   return this.adminsService.forgotPassword(forgotPasswordDto);
  // }

  // // Reset Password (for un-authenticated access)
  // @ExcludeAuth()
  // @Put('reset-password')
  // async resetPassword(@Body() resetPasswordDto: any) {
  //   return this.adminsService.resetPassword(resetPasswordDto);
  // }
}
