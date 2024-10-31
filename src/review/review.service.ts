import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        // Find the user by ID
        const user = await this.userRepository.findOne({
            where: { id_user: createReviewDto.id_user }
        });
        
        // Throw an error if the user is not found
        if (!user) {
            throw new NotFoundException(`User with ID ${createReviewDto.id_user} not found`);
        }
    
        // Create a new review with the user associated
        const review = this.reviewRepository.create({
            ...createReviewDto,
            user, // Associate the user
        });
    
        // Save and return the review
        return this.reviewRepository.save(review);
    }

    async findAll(): Promise<Review[]> {
        return await this.reviewRepository.find({ relations: ['user'] });
    }

    async findAllByUserId(id_user: number): Promise<Review[]> {
        const userReviews = await this.reviewRepository.find({
            where: { user: { id_user } }, // Adjust based on your User entity relationship
            relations: ['user'], // Include user data in the response
        });
    
        if (userReviews.length === 0) {
            throw new NotFoundException(`No reviews found for user with ID ${id_user}`);
        }
    
        return userReviews;
    }
    
    
    

    async findOne(id_review: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id_review },
            relations: ['user'],
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }

        return review;
    }

    async update(id_review: number, updateReviewDto: UpdateReviewDto): Promise<Review>{
        const review = await this.reviewRepository.findOne({ where: { id_review } });
        if (!review) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }
        Object.assign(review, updateReviewDto);

        return this.reviewRepository.save(review);
    }

    async remove(id_review: number): Promise<void> {
        const result = await this.reviewRepository.delete(id_review);
        if (result.affected === 0) {
            throw new NotFoundException(`Review with ID ${id_review} not found`);
        }
    }
}
