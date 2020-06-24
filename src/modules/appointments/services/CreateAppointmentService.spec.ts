import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123456',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });
});

describe('CreateAppointment', () => {
  it('should not be able to create two appointments on the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 1, 1, 0);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456',
    });
    // expect(
    //   await createAppointment.execute({
    //     date: appointmentDate,
    //     provider_id: '123456',
    //   }),
    // ).rejects.toBeInstanceOf(AppError);
    expect.assertions(1);
    return createAppointment
      .execute({
        date: appointmentDate,
        provider_id: '123456',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });
});
