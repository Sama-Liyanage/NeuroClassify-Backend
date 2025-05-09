import { IsArray, IsBoolean, IsString ,IsOptional} from '@nestjs/class-validator';

export class CreateReportDto {
    @IsString()
    patient_email?: string;

    @IsArray()
    recommendation?: string[];

    @IsArray()
    patient_name?: string;
    
    @IsArray()
    patient_gender?: string;

    @IsString()
    image_url?: string;

    @IsBoolean()
    diagnosis?: string;

    @IsOptional()
    @IsString()
    tumor_size?: string; 

    @IsOptional()
    @IsString()
    tumor_location?: string; 
}
