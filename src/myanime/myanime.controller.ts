import { BadRequestException, Controller, Get } from '@nestjs/common';
import { MyAnimeService } from './myanime.service';

@Controller('anime')
export class MyAnimeController {
  constructor(private readonly myAnimeService: MyAnimeService) {}

  // Search anime by top (using Jikan API)
  @Get('top')
  async getTopAnime() {
    return this.myAnimeService.getTopAnime();
  }
 
}