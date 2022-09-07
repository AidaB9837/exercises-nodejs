import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //GET route that send a JSON response
  @Get()
  getHello(): object {
    return JSON.parse(JSON.stringify({ data: this.appService.getHello() }));
  }
}
