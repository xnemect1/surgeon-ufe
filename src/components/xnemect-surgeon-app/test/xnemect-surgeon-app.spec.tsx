import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeonApp } from '../xnemect-surgeon-app';

describe('xnemect-surgeon-app', () => {
  it('renders editor', async () => {
    await newSpecPage({
      components: [XnemectSurgeonApp],
      html: `<xnemect-surgeon-app base-path="/"></xnemect-surgeon-app>`,
    });
  });
});
