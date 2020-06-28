/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showUserProfile = container.resolve(ShowUserProfileService);

    const user = await showUserProfile.execute({
      user_id,
    });

    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateUserProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    delete user.password;

    return response.json(user);
  }
}
