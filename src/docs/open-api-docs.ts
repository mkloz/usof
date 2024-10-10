import { Router } from 'express';
import { cs } from '../config/api-config.service';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

export default class OpenApiDocs {
  public static setup(app: Router, path: string = '/api/docs') {
    const swaggerDocument = YAML.load('docs/open-api.yaml');
    if (!cs.isProduction()) {
      app.use(path, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  }
}
