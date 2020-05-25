/* eslint-disable class-methods-use-this */
import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appoinment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

class CreateAppoinmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appoinment> {
    const appoinmentDate = startOfHour(date);

    const findAppoinmentInSameDate = await this.appointmentsRepository.findByDate(
      appoinmentDate,
    );

    if (findAppoinmentInSameDate) {
      throw new AppError('This appoinment is already booked');
    }

    const appoinment = await this.appointmentsRepository.create({
      provider_id,
      date: appoinmentDate,
    });

    return appoinment;
  }
}

export default CreateAppoinmentService;
