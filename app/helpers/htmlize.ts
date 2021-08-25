import { helper } from '@ember/component/helper';

export default helper((params: [string]) => {
    const [text] = params;
    if (!text) {
        return "";
    }
    return text.trim().replace("\n", "<br />")
})
