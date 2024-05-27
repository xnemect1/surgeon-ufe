import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeryEditor } from '../xnemect-surgery-editor';

describe('xnemect-surgeon-wl-editor', () => {
  it('renders', async () => {
    await newSpecPage({
      components: [XnemectSurgeryEditor],
      html: `<xnemect-surgeon-wl-editor entry-id="@new"></xnemect-surgeon-wl-editor>`,
    });
  });
});
