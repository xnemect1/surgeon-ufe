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

    // Define a function to convert a full path to a path relative to the baseUri
    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      // Attempt to intercept the navigation if it's possible, which prevents the default navigation behavior
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }

      let path = new URL((ev as any).destination.url).pathname;

      toRelative(path);

      console.log('Updated relative path:', this.relativePath);
    });

    // Convert the current location's pathname to a relative path as initial setup
    toRelative(location.pathname);
  }

  render() {
    let element = 'list';
    let surgeonId = '@new';
    let surgeryId = '@new';

    if (this.relativePath.startsWith('surgeries/') && this.relativePath.split('/').length === 2) {
      element = 'surgeries';
      surgeonId = this.relativePath.split('/')[1];
      console.log('Current element:', element, 'Surgeon ID:', surgeonId);
    } else if (this.relativePath.startsWith('surgeries/') && this.relativePath.split('/').length === 4 && this.relativePath.includes('/entry/')) {
      element = 'editor';
      surgeonId = this.relativePath.split('/')[1];
      surgeryId = this.relativePath.split('/')[3]; // Assuming the surgery ID is the fourth segment
      console.log('Current element:', element, 'Surgeon ID:', surgeonId, 'Surgery ID:', surgeryId);
    }

    const navigate = (path: string) => {
      console.log('Navigating to:', path);

      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;

      window.navigation.navigate(absolute);
    };

    return (
      <Host>
        {element === 'list' ? (
          <xnemect-surgeon-list api-base={this.apiBase} onentry-clicked={(ev: CustomEvent<string>) => navigate('./surgeries/' + ev.detail)}></xnemect-surgeon-list>
        ) : element === 'surgeries' ? (
          <xnemect-surgeries-list
            api-base={this.apiBase}
            surgeonId={surgeonId}
            onentry-clicked={(ev: CustomEvent<string>) => navigate('./surgeries/' + surgeonId + '/entry/' + ev.detail)}
            surgeries-closed={() => navigate('./list')}
          ></xnemect-surgeries-list>
        ) : element === 'editor' ? (
          <xnemect-surgery-editor entryId={surgeryId} surgeonId={surgeonId} api-base={this.apiBase} oneditor-closed={() => navigate('./list')}></xnemect-surgery-editor>
        ) : (
          <p>No component selected</p>
        )}
      </Host>
    );
  }
}
