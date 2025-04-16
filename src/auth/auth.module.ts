import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/features/admins/entities/admin.entity';
import { Doctor, DoctorSchema } from 'src/features/doctors/entities/doctor.entity';
import { Patient, PatientSchema } from 'src/features/patients/entities/patient.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sedhfwioeufh9w477346iufhkdsc',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
  ],
  providers: [JwtStrategy,AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
