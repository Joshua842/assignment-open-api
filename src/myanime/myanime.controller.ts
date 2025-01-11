import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MyAnimeService } from './myanime.service';

@Controller('anime')
export class MyAnimeController {
  constructor(private readonly myAnimeService: MyAnimeService) {}

  // Search anime by top (using Jikan API)
  @Get('top')
  async getTopAnime() {
    return this.myAnimeService.getTopAnime();
  }

  // Search anime by genre name (using Jikan API)
  @Get('genre')
  async searchAnimeByGenre(
    @Query('q') genreName: string, // Accept genre name as a query parameter
    @Query('page') page: number = 1
  ) {
    if (!genreName) {
      throw new BadRequestException('The "genreName" query parameter is required');
    }

    try {
      // Fetch anime based on genre name using Jikan API
      return await this.myAnimeService.searchAnimeByGenre(genreName, page);
    } catch (error) {
      throw new BadRequestException(`Error searching for anime by genre: ${error.message}`);
    }
  }

}