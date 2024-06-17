import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { SurgeryEntry, SurgeriesApiFactory } from '../../api/surgeon-wl';

@Component({
  tag: 'xnemect-surgeries-list',
  styleUrl: 'xnemect-surgeries-list.css',
  shadow: true,
})
export class XnemectSurgeriesList {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Event({ eventName: 'surgeries-closed' }) surgeriesClosed: EventEmitter<void>;

  @Prop() apiBase: string;
  @Prop() surgeonId: string;
  @Prop() surgeonName: string;
  @State() errorMessage: string;

  surgeries: SurgeryEntry[];

  private async getSurgeonSurgeriesAsync(): Promise<SurgeryEntry[]> {
    try {
      const response = await SurgeriesApiFactory(undefined, this.apiBase).getSurgeryEntries(this.surgeonId);
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of surgeries of surgeon ${this.surgeonId}: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of surgeries of surgeon ${this.surgeonId}: ${err.message || 'unknown'}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.surgeries = await this.getSurgeonSurgeriesAsync();
  }

  render() {
    return (
      <Host>
        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : (
          // Begin your conditional rendering here
          <div>
            <h2>Operácie vykonané chirurgom s identifikačným číslom {this.surgeonId}</h2>
            <md-list>
              {this.surgeries.map(surgery => (
                <md-list-item
                  onClick={() => {
                    this.entryClicked.emit(surgery.id);
                  }}
                >
                  <div slot="headline">{'ID: ' + surgery.id}</div>
                  <div slot="supporting-text">{'Dátum operácie: ' + this.isoDateToLocale(surgery.date)}</div>
                  <div slot="supporting-text">{'Operovaná končatina: ' + surgery.operatedLimb.value}</div>
                  <md-icon slot="start">local_hospital</md-icon>
                </md-list-item>
              ))}
            </md-list>
          </div>
        )}
        <div class="buttons-space">
          <md-outlined-button class="buttons" onclick={() => this.entryClicked.emit('@new')}>
            Pridať novú operáciu
          </md-outlined-button>
          <md-outlined-button
            class="buttons"
            onClick={() => {
              this.surgeriesClosed.emit();
            }}
          >
            Späť
          </md-outlined-button>
        </div>
      </Host>
    );
  }

  private isoDateToLocale(iso: string) {
    if (!iso) return '';
    return new Date(Date.parse(iso)).toLocaleDateString();
  }
}
