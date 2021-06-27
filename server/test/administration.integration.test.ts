import { req, apiConfig } from './config';

import { AdministrationApiAxiosParamCreator } from './api';

describe('Administration integration', () => {
  it('test route', async () => {
    const request = await AdministrationApiAxiosParamCreator(apiConfig).administrationControllerGetNumber();

    return req.get(request.url).expect(200);
  });
});
