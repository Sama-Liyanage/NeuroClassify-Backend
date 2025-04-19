import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
    @Prop({ required: false })
    patient_email?: string;

    @Prop({ required: false })
    patient_name?: string;

    @Prop({ required: false })
    patient_gender?: string;

    @Prop({ required: false })
    recommendation?: string[];

    @Prop({ required: false })
    image_url?: string;

    @Prop({ required: false })
    diagnosis?: string;

    @Prop({ required: false })
    tumor_size?: string;  

    @Prop({ required: false })
    tumor_location?: string; 
}

export const ReportSchema = SchemaFactory.createForClass(Report);
