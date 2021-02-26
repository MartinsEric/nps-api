import { SurveyUser } from "../models/SurveyUser";

interface NpsAnswer {
  detractors: number
  passives: number
  promotors: number
  totalAnswers: number
  nps: string
}

class NpsService {
  calculateNps(surveysUsers: SurveyUser[]): NpsAnswer {
    const detractors = surveysUsers.filter(s => s.value >= 0 && s.value <= 6).length
    const passives = surveysUsers.filter(s => s.value >= 7 && s.value <= 8).length
    const promotors = surveysUsers.filter(s => s.value >= 9 && s.value <= 10).length

    const totalAnswers = surveysUsers.length

    const nps = Number(((promotors - detractors) / totalAnswers * 100).toFixed(2))
  
    return {
      detractors,
      passives,
      promotors,
      totalAnswers,
      nps: `${nps}%`
    }
  }
}

export default new NpsService()