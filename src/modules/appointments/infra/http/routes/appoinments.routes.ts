import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppoinmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppoinmentService from '@modules/appointments/services/CreateAppoinmentService';
import ensureIsAuthenticated from '@modules/users/infra/http/middlewares/ensureIsAuthenticated';

const appoinmentsRepository = new AppoinmentsRepository();

const appointmentsRouter = Router();
appointmentsRouter.use(ensureIsAuthenticated);

// appoinmentsRouter.get('/', async (request, response) => {
//   const appoinments = await appoinmentsRepository.find();
//   return response.json(appoinments);
// });

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const adjustedDate = parseISO(date);
  const createAppointment = new CreateAppoinmentService(appoinmentsRepository);
  const appointment = await createAppointment.execute({
    provider_id,
    date: adjustedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
