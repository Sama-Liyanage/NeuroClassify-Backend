import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { HttpRepository } from 'src/shared/repositories/http.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './entities/doctor.entity';
import { Patient, PatientSchema } from '../patients/entities/patient.entity';
import { Admin, AdminSchema } from '../admins/entities/admin.entity';

@Module({
  imports: [HttpModule,MongooseModule.forFeature([
    { name: Admin.name, schema: AdminSchema },
    { name: Patient.name, schema: PatientSchema },
    { name: Doctor.name, schema: DoctorSchema }
  ]),],
  controllers: [DoctorController],
  providers: [DoctorService, HttpRepository],
})
export class DoctorModule {}
