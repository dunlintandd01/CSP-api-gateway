import * as path from 'path';

import * as convict from 'convict';
import * as dotenv from 'dotenv';
import * as yaml from 'js-yaml';

dotenv.config();

convict.addParser({
  extension: 'yml',
  parse: yaml.safeLoad,
}); // 默认配置

const config = convict(path.join(__dirname, '../config/configSchema.yml'));
const fileName = `${config.get('env')}-config.yml`;

config.loadFile([path.join(__dirname, '../config/', fileName)]);
config.validate({ allowed: 'warn' });

export default config;
