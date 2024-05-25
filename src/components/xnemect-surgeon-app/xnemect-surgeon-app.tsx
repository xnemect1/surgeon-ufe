import { Component, Host, Prop, State, h } from '@stencil/core';
declare global {
  interface Window {
    navigation: any;
  }
}

@Component({
  tag: 'xnemect-surgeon-app',
  styleUrl: 'xnemect-surgeon-app.css',
  shadow: true,
})
export class XnemectSurgeonApp {
  @State() private relativePath = '';

  @Prop() basePath: string = '';
  @Prop() apiBase: string;
  @Prop() surgeonId: string;

  componentWillLoad() {
    console.log('APP has loaded');
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
      console.log('Updated relative path:', this.relativePath); // Debug log
    });

    toRelative(location.pathname);
  }

  render() {
    let element = 'list';
    let entryId = '@new';

    if (this.relativePath.startsWith('entry/')) {
      element = 'editor';
      entryId = this.relativePath.split('/')[1];
      console.log('Current element:', element, 'Entry ID:', entryId); // Debug log
    }

    const navigate = (path: string) => {
      console.log('Navigating to:', path); // Debug log
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute);
    };

    return (
      <Host>
        {element === 'editor' ? (
          <xnemect-surgery-editor entry-id={entryId} surgeon-id={this.surgeonId} api-base={this.apiBase} oneditor-closed={() => navigate('./list')}></xnemect-surgery-editor>
        ) : (
          <xnemect-surgeries-list
            surgeon-id={this.surgeonId}
            api-base={this.apiBase}
            onentry-clicked={(ev: CustomEvent<string>) => navigate('./entry/' + ev.detail)}
          ></xnemect-surgeries-list>
        )}
      </Host>
    );
  }
}
