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

  // Genre mapping
  private genreMapping = {
    Action: 1,
    Adventure: 2,
    Racing: 3,
    Comedy: 4,
    Avant_Garde: 5,
    Mythology: 6,
    Mystery: 7,
    Drama: 8,
    Romance: 9,
    Fantasy: 10,
    Strategy: 11,
    Hentai: 12,
    Horror: 14,
    Shounen: 27,
    Yaoi: 28,
    Space: 29,
    Sports: 30,
    Super_Power: 31,
    Vampire: 32,
    Harem: 35,
    Slice_of_Life: 36,
    Supernatural: 37,
    Military: 38,
    Detective: 39,
    Psychological: 40,
    Suspense: 41,
    Seinen: 42,
    Josei: 43,
    Award_Winning: 46,
    Gourmet: 47,
    Workplace: 48,
    Ecchi: 49,
    Adult: 50,
    Isekai: 62,
  };

  // Helper function to get the genre ID by case-insensitive name
  private getGenreIdByName(genreName: string): number | undefined {
    const genreNameLower = genreName.toLowerCase();
    const matchingGenre = Object.keys(this.genreMapping).find(
      (key) => key.toLowerCase() === genreNameLower
    );

    return matchingGenre ? this.genreMapping[matchingGenre] : undefined;
  }

  // Get genre ID by name
  private async getGenreId(genreName: string): Promise<number> {
    const genreId = this.getGenreIdByName(genreName);
    return genreId || 0; // Return 0 for unknown genres
  }

  // Search anime by genre name
  async searchAnimeByGenre(genreName: string, page: number = 1, limit: number = 10) {
    try {
      const genreId = await this.getGenreId(genreName);
      if (genreId === 0) {
        throw new Error('Invalid genre name');
      }

      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: {
          genres: genreId,
          page: page,
          limit: limit,
          order_by: 'score',
          sort: 'desc',
        },
      });

      const recommendations = response.data.data.map((anime: any) => ({
        Title: anime.title,
        Synopsis: anime.synopsis,
        Rating: anime.score,
        ImageUrl: anime.images.jpg.image_url,
      }));

      return {
        Message: `🎉 Explore some awesome anime from the "${genreName}" genre. Here are the top-rated picks for you!`,
        Recommendations: recommendations,
      };
    } catch (error) {
      console.error('Error fetching anime by genre:', error);
      throw new InternalServerErrorException('Error fetching anime by genre');
    }
  }

  // Get seasonal anime (using Jikan API) and sort by score
  async getSeasonalAnime(season: string, year: number): Promise<any> {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/seasons/${year}/${season}`);

      // Sort by rating in descending order (highest rating first)
      const seasonalAnime = response.data.data
        .map((anime: any) => ({
          Title: anime.title,
          Season: `${season} ${year}`,
          Rating: anime.score || 0, // Default to 0 if no rating
          ImageUrl: anime.images.jpg.image_url,
        }))
        .sort((a: any, b: any) => b.Rating - a.Rating); // Sort in descending order

      return {
        Message: `🌸 Dive into the anime world of the ${season} ${year} season! Here are some fan favorites based on ratings and popularity:`,
        Anime_List: seasonalAnime,
      };
    } catch (error) {
      console.error('Error fetching seasonal anime:', error);
      throw new InternalServerErrorException(`Failed to fetch seasonal anime for ${season} ${year}`);
    }
  }

  // Search anime by name (using Jikan API)
  async searchAnime(query: string): Promise<any> {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: { q: query, limit: 10 },
      });

      const searchResults = response.data.data.map((anime: any) => ({
        Official_Title: anime.title,
        Rating: anime.score,
        ImageUrl: anime.images.jpg.image_url,
        Genres: anime.genres.map((genre: any) => genre.name).join(', '),
      }));

      return {
        Message: `🔍 Searching for anime with the title "${query}"? Here are the results that match your query!`,
        Recommendations: searchResults,
      };
    } catch (error) {
      console.error('Error searching for anime:', error);
      throw new InternalServerErrorException(`Failed to search for anime with query: ${query}`);
    }
  }

  // Get anime details by anime ID (using Jikan API)
  async getAnimeDetails(animeId: number): Promise<any> {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);

      const anime = response.data.data;
      return {
        Message: `🔎 Here’s everything you need to know about "${anime.title}". Dive deeper into this anime’s world!`,
        details: {
          Official_Title: anime.title,
          Synopsis: anime.synopsis,
          Episodes: anime.episodes,
          Rating: anime.score,
          ImageUrl: anime.images.jpg.image_url,
          Genres: anime.genres.map((genre: any) => genre.name).join(', '),
        },
      };
    } catch (error) {
      console.error('Error fetching anime details:', error);
      throw new InternalServerErrorException('Failed to fetch anime details');
    }
  }

}