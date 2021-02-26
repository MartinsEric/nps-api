import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params
    const { u } = request.query

    const surveyUserRepository = await getCustomRepository(SurveysUsersRepository)

    const surveyUser = await surveyUserRepository.findOne({ id: String(u) })

    if (!surveyUser) {
      throw new AppError('Survey user not found!')
    }

    surveyUser.value = Number(value)

    await surveyUserRepository.save(surveyUser)

    response.json(surveyUser)
  }
}

export { AnswerController };
