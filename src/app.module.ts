import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyAnimeService } from './myanime/myanime.service';
import { MyAnimeController } from './myanime/myanime.controller';

@Module({
  imports: [],
  controllers: [AppController, MyAnimeController],
  providers: [AppService, MyAnimeService],
})
export class AppModule {}
