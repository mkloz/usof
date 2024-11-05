import { Router } from 'express';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { cs } from '../config/api-config.service';

export default class OpenApiDocs {
  public static setup(app: Router, path: string = '/api/docs') {
    const swaggerDocument = YAML.parse(
      readFileSync('./docs/open-api.yaml', 'utf8'),
    );
    if (!cs.isProduction()) {
      app.use(path, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  }
}
