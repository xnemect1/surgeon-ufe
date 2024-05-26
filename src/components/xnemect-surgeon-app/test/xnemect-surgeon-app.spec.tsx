import { newSpecPage } from '@stencil/core/testing';
import { XnemectSurgeonApp } from '../xnemect-surgeon-app';

describe('xnemect-surgeon-app', () => {
  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [XnemectSurgeonApp],
      html: `<xnemect-surgeon-app base-path="/"></xnemect-surgeon-app>`,
    });
    page.win.navigation = new EventTarget();
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual('xnemect-surgeon-list');
  });
});
