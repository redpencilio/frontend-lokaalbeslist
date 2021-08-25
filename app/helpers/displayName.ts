import { helper } from '@ember/component/helper';

export default helper(
    ([persoon]) => {
        return persoon ? `${persoon.get('gebruikteVoornaam') || ''} ${persoon.get('achternaam') || ''}` : 'Naam onbekend'
    }
)
