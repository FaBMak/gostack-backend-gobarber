import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

describe('CreateSession', () => {
  it('should be able to create a new session', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await createSession.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to create a new session to a non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect.assertions(1);
    return createSession
      .execute({
        email: 'johndoe@example.com',
        password: '123456',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });

  it('should be not able to create a new session with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect.assertions(1);
    return createSession
      .execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });
});
