import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { SurgeriesListEntry, SurgeriesListApiFactory } from '../../api/surgeon-wl';

@Component({
  tag: 'xnemect-surgeries-list',
  styleUrl: 'xnemect-surgeries-list.css',
  shadow: true,
})
export class XnemectSurgeriesList {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() surgeonId: string;
  @State() errorMessage: string;

  surgeries: SurgeriesListEntry[];

  private async getWaitingPatientsAsync(): Promise<SurgeriesListEntry[]> {
    try {
      const response = await SurgeriesListApiFactory(undefined, this.apiBase).getSurgeonSurgeries(this.surgeonId);
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of waiting patients: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of waiting patients: ${err.message || 'unknown'}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.surgeries = await this.getWaitingPatientsAsync();
  }

  render() {
    return (
      <Host>
        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : (
          <md-list>
            {this.surgeries.map((patient, index) => (
              <md-list-item onClick={() => this.entryClicked.emit(index.toString())}>
                <div slot="headline">{patient.id}</div>
                <div slot="supporting-text">{'Predpokladaný vstup: ' + this.isoDateToLocale(patient.surgeryDetail.date)}</div>
                <md-icon slot="start">person</md-icon>
              </md-list-item>
            ))}
          </md-list>
        )}
      </Host>
    );
  }

  private isoDateToLocale(iso: string) {
    if (!iso) return '';
    return new Date(Date.parse(iso)).toLocaleTimeString();
  }
}
