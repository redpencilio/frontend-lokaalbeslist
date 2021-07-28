// Types for compiled templates
declare module 'frontend-lokaalbeslist/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
