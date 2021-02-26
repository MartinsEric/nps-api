import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Survey } from "./Survey";
import { User } from "./User";

@Entity('surveys_users')
class SurveyUser {
  @PrimaryColumn()
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'survey_id' })
  surveyId: string

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey

  @Column()
  value: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}

export { SurveyUser }