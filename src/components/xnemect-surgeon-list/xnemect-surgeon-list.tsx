import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Surgeon, SurgeonsApiFactory } from '../../api/surgeon-wl';

@Component({
  tag: 'xnemect-surgeon-list',
  styleUrl: 'xnemect-surgeon-list.css',
  shadow: true,
})
export class XnemectSurgeonList {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @State() errorMessage: string;

  currentSurgeons: Surgeon[];

  private async getSurgeonsAsync() {
    try {
      const response = await SurgeonsApiFactory(undefined, this.apiBase).getAllSurgeons();
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of surgeons: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of surgeons: ${err.message || 'unknown'}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.currentSurgeons = await this.getSurgeonsAsync();
  }

  render() {
    return (
      <Host>
        <h2>Chirurgovia:</h2>
        <md-list className="list">
          {this.currentSurgeons.map((surgeon, index) => (
            <md-list-item
              key={index}
              className="list-item"
              onClick={() => {
                console.log('Emitting surgeon ID:', surgeon.id); // Debug log
                this.entryClicked.emit(surgeon.id);
              }}
            >
              <md-icon slot="start">person</md-icon>
              <div slot="headline">{surgeon.name}</div>
              <div slot="supporting-text">{'ID: ' + surgeon.id}</div>
            </md-list-item>
          ))}
        </md-list>
      </Host>
    );
  }
}
