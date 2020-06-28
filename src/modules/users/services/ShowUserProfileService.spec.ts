import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfile: ShowUserProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfile = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show the user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userProfile = await showUserProfile.execute({
      user_id: user.id,
    });

    expect(userProfile.name).toBe('John Doe');
    expect(userProfile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show the user profile for non-existing user', async () => {
    expect.assertions(1);
    return showUserProfile
      .execute({
        user_id: 'non-existing user',
      })
      .catch(e => expect(e).toBeInstanceOf(AppError));
  });
});
