  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import * as bcrypt from 'bcryptjs';
  import { Document } from 'mongoose';

  @Schema()
  export class Patient extends Document {
    @Prop({ required: false })
    fullName?: string;

    @Prop({ required: false })
    dateOfBirth?: string;

    @Prop({ required: false })
    gender?: string;

    @Prop({ required: false })
    symptoms?: string;

    @Prop({ required: false })
    medicalHistory?: string;

    @Prop({ unique: true, required: false })
    email?: string;

    @Prop({ required: false })
    password: string;

  }

  export const PatientSchema = SchemaFactory.createForClass(Patient);

  PatientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
