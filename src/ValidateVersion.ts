import { string } from 'yup';
import { ErrorValidate } from './Errors';

function validate(version: string) {
    try {
        string().equals(['01'], 'Version not supported').validateSync(version);
    } catch (error) {
        throw new ErrorValidate('ERROR_VALIDATE_NAME', error.message);
    }
}

export default {
    validate,
};
