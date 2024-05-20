import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeonList } from '../xnemect-surgeon-list';

describe('xnemect-surgeon-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XnemectSurgeonList],
      html: `<xnemect-surgeon-list></xnemect-surgeon-list>`,
    });

    const wlList = page.rootInstance as XnemectSurgeonList;
    const expectedPatients = wlList?.waitingPatients?.length;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    expect(items.length).toEqual(expectedPatients);
  });
});
