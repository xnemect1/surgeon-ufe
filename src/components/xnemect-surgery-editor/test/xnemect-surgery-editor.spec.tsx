import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeryEditor } from '../xnemect-surgery-editor';

describe('xnemect-surgeon-editor', () => {
  it('renders', async () => {
    await newSpecPage({
      components: [XnemectSurgeryEditor],
      html: `<xnemect-surgeon-editor entry-id="@new"></xnemect-surgeon-editor>`,
    });
  });
});
