import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MyAnimeService {

  // Get top anime (using Jikan API)
  async getTopAnime(): Promise<any> {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/top/anime', {
        params: { limit: 10 },
      });

      const topAnime = response.data.data.map((anime: any) => ({
        Title: anime.title,
        Rating: anime.score,
        Genres: anime.genres.map((genre: any) => genre.name).join(', '),
        ImageUrl: anime.images.jpg.image_url,
      }));

      return {
        Message: '🏆 Here are the top-rated anime, as chosen by the community. You can’t go wrong with these!',
        Recommendations: topAnime,
      };
    } catch (error) {
      console.error('Error fetching top anime:', error);
      throw new InternalServerErrorException('Failed to fetch top anime');
    }
  }
}