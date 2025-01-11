import { BadRequestException, Controller, Get, Query, Param } from '@nestjs/common';
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

  @Get('seasonal')
  async getSeasonalAnime(@Query('season') season: string, @Query('year') year: string) {
    const yearNum = parseInt(year);
    if (!season || isNaN(yearNum)) {
      throw new BadRequestException('Both "season" and "year" query parameters are required and must be valid');
    }
    return this.myAnimeService.getSeasonalAnime(season, yearNum);
  }

  // Search anime by name (using Jikan API)
  @Get('search')
  async searchAnime(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Query parameter "q" is required');
    }
    return this.myAnimeService.searchAnime(query);
  }

  // Search anime by ID (using Jikan API)
  @Get(':id')
  async getAnimeDetails(@Param('id') id: string) {
    const animeId = parseInt(id);
    if (isNaN(animeId)) {
      throw new BadRequestException('Invalid anime ID');
    }
    return this.myAnimeService.getAnimeDetails(animeId);
  }

  
}