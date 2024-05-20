import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeonList } from '../xnemect-surgeon-list';

describe('xnemect-surgeon-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XnemectSurgeonList],
      html: `<xnemect-surgeon-list></xnemect-surgeon-list>`,
    });
    expect(page.root).toEqualHtml(`
      <xnemect-surgeon-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </xnemect-surgeon-list>
    `);
  });
});
