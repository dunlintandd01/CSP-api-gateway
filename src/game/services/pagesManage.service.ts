import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as R from 'ramda'

import { SaveLandingPage, SaveResultPageModule } from '../dtos'
import { LandingPage, ResultPageModule, GamePage } from '../entities'

@Injectable()
export class PagesManageService {
  constructor(
    @InjectRepository(LandingPage)
    private landingPageRepository: Repository<LandingPage>,
    @InjectRepository(LandingPage)
    private resultPageModuleRepository: Repository<ResultPageModule>,
  ) {}

  async saveLandingPage(
    page: GamePage,
    data: SaveLandingPage,
  ): Promise<LandingPage> {
    let landingPage = new LandingPage()
    landingPage.page = page
    landingPage = R.merge(data, landingPage)
    return await this.landingPageRepository.save(landingPage)
  }

  async saveResultPageModules(
    page: GamePage,
    data: SaveResultPageModule[],
  ): Promise<ResultPageModule[]> {
    const result: ResultPageModule[] = []
    for (const resultModule of data) {
      let pageModule = new ResultPageModule()
      pageModule.page = page
      pageModule = R.merge(resultModule, pageModule)
      const record = await this.resultPageModuleRepository.save(pageModule)
      result.push(record)
    }
    return result
  }
}
