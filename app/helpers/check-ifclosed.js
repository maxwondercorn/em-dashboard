import { helper as buildHelper } from '@ember/component/helper';

export function checkIfclosed(isOpen, hash) {
  if (isOpen[0] === true) {
    return 'N/A';
  } else {
    return hash.date;
  }
}

export default buildHelper(checkIfclosed);
