import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateUserProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update a user profile with name and email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Fulano da Silva',
      email: 'fulano@exemplo.com',
    });
    expect(updatedUser.name).toBe('Fulano da Silva');
    expect(updatedUser.email).toBe('fulano@exemplo.com');
  });

  it('should not be able to update a user profile of an inexistent user', async () => {
    expect.assertions(1);
    return updateUserProfile
      .execute({
        user_id: 'non-existing-id',
        name: 'Another John Doe',
        email: 'johndoe@example.com',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Another John Doe',
      email: 'anotherjohndoe@example.com',
      password: '123456',
    });

    expect.assertions(1);
    return updateUserProfile
      .execute({
        user_id: user.id,
        name: 'Another John Doe',
        email: 'johndoe@example.com',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });

  it('should be able to update a user profile password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Fulano da Silva',
      email: 'fulano@exemplo.com',
      old_password: '123456',
      password: '123123',
    });
    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update a user profile password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect.assertions(1);
    return updateUserProfile
      .execute({
        user_id: user.id,
        name: 'Another John Doe',
        email: 'johndoe@example.com',
        password: '123123',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });

  it('should not be able to update a user profile with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect.assertions(1);
    return updateUserProfile
      .execute({
        user_id: user.id,
        name: 'Another John Doe',
        email: 'johndoe@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });
});
