import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body

    const usersRepository = getCustomRepository(UserRepository)
    const surveysRepository = getCustomRepository(SurveyRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const user = await usersRepository.findOne({ email })

    if (!user) {
      throw new AppError('User not found!')
    }

    const survey = await surveysRepository.findOne({ id: survey_id })

    if (!survey) {
      throw new AppError('Survey not found!')
    }

    let surveyUser = await surveysUsersRepository.findOne({
      where: { userId: user.id, surveyId: survey.id, value: null },
      relations: ['user', 'survey']
    })

    if (!surveyUser) {
      surveyUser = await surveysUsersRepository.create({
        userId: user.id,
        surveyId: survey.id
      })

      await surveysUsersRepository.save(surveyUser)
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: surveyUser.id,
      link: process.env.URL_MAIL
    }

    await SendMailService.execute(user.email, survey.title, variables, npsPath)

    return response.json(surveyUser)
  }
}

export { SendMailController };
