import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeryEditor } from '../xnemect-surgery-editor';

describe('xnemect-surgeon-wl-editor', () => {
  it('buttons shall be of different type', async () => {
    const page = await newSpecPage({
      components: [XnemectSurgeryEditor],
      html: `<xnemect-surgeon-wl-editor entry-id="@new"></xnemect-surgeon-wl-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);

    items = await page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });
});
