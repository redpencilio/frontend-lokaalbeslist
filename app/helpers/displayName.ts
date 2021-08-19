import { helper } from '@ember/component/helper';

export default helper(
    ([persoon]) => {
        return `${persoon.get('gebruikteVoornaam')} ${persoon.get('achternaam')}`
    }
)
