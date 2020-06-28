import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123456',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create two appointments on the same date', async () => {
    const appointmentDate = new Date(2020, 1, 1, 0);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456',
    });

    expect.assertions(1);
    return createAppointment
      .execute({
        date: appointmentDate,
        provider_id: '123456',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });
});
