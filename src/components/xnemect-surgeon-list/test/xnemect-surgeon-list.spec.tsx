import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeonList } from '../xnemect-surgeon-list';

describe('xnemect-surgeon-list', () => {
  it('renders', async () => {
    await newSpecPage({
      components: [XnemectSurgeonList],
      html: `<xnemect-surgeon-list></xnemect-surgeon-list>`,
    });
  });
});
