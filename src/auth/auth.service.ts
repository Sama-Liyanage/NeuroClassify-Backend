import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin } from 'src/features/admins/entities/admin.entity';
import { Doctor } from 'src/features/doctors/entities/doctor.entity';
import { Patient } from 'src/features/patients/entities/patient.entity';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

async validateUser(email: string, password: string) {
    let user: Admin | Doctor | Patient = await this.adminModel.findOne({ email });
    if (!user) user = await this.doctorModel.findOne({ email });
    if (!user) user = await this.patientModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user._id, email: user.email, role: (user instanceof Admin) ? 'admin' : (user instanceof Doctor) ? 'doctor' : 'patient' };
}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
