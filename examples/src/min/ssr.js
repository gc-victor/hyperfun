import { renderToString } from '@hyperfun/dom';
import { view } from './view';

module.exports = () => renderToString(view());
