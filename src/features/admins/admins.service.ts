import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcryptjs';
import { HttpRepository } from 'src/shared/repositories/http.repository';
import { Admin } from './entities/admin.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private readonly DoctorModel: Model<Doctor>,
    private readonly httpRepository: HttpRepository,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { email, password, name } = createAdminDto;
    
    const existingAdmin = await this.adminModel.findOne({ email });
    const existingPatient = await this.patientModel.findOne({ email });
    const existingDoctor = await this.DoctorModel.findOne({ email });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    if (existingPatient) {
      throw new ConflictException('Patient with this email already exists');
    }

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email already exists');
    }

    const newAdmin = new this.adminModel({
      name,
      email,
      password
    });

    return await newAdmin.save();
  }

  // Get all admins
  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  // Get admin by ID
  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  // Update an Admin
  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Only hash password if it has been updated
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    return await this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true });
  }

  // Delete an Admin
  async remove(id: string): Promise<void> {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    await this.adminModel.findByIdAndDelete(id);
  }
}
