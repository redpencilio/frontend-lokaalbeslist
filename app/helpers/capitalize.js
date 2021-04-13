import { helper } from '@ember/component/helper';
import { capitalize } from '@ember/string';

export default helper((param) => capitalize(param.toString()));
