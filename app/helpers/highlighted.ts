import { helper } from '@ember/component/helper';

/**
 * When we actually always want to render the full text, but we can't configure
 * mu-search to allow the highlight to be so big (yet).
 * So we replace the highlighted parts in the original text.
 */
export default helper(([text, highlights]: [string, string[]]) => {
  if (highlights) {
    let highlighted = text;
    highlights
      .map((hl) => [hl, hl.replaceAll('<em>', '')])
      .map(([og, hl]) => [og, hl.replaceAll('</em>', '')])
      .forEach(([og, hl]) => {
        highlighted = highlighted.replace(hl, og);
      });
    return highlighted;
  } else {
    return undefined;
  }
});
