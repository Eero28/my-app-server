import { IsNotEmpty, IsString, IsNumber, IsUrl, Min, Max } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    reviewname: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    reviewRating: number;

    imageUrl: string;

    id_user: number;  // Assuming you want to pass the user's ID when creating a review
}
