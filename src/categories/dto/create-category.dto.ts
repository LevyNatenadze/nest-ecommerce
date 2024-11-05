import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({message: 'title is required'})
    @IsString({message: 'title must be a string'})
    title: string;

    @IsNotEmpty({message: 'description is required'})
    @IsString({message: 'description must be a string'})
    description: string;
}
