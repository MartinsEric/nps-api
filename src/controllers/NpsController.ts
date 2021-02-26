import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import NpsService from "../services/NpsService";

class NpsController {
  async execute(request: Request, response: Response) {
    const { surveyId } = request.params

    const surveyUserRepository = await getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveyUserRepository.find({
      surveyId,
      value: Not(IsNull())
    })

    if (!surveysUsers) {
      throw new AppError('Survey does not exists or survey has no answers!')
    }

    const nps = NpsService.calculateNps(surveysUsers)

    response.json(nps)
  }
}

export { NpsController }
