import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { SurgeryEntry, SurgeriesListApiFactory } from '../../api/surgeon-wl';

@Component({
  tag: 'xnemect-surgeries-list',
  styleUrl: 'xnemect-surgeries-list.css',
  shadow: true,
})
export class XnemectSurgeriesList {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() surgeonId: string;
  @Prop() surgeonName: string;
  @State() errorMessage: string;

  @Event({ eventName: 'editor-closed' }) surgeriesClosed: EventEmitter<string>;

  surgeries: SurgeryEntry[];

  private async getSurgeonSurgeriesAsync(): Promise<SurgeryEntry[]> {
    try {
      console.log('SURGERIES COMPONENT');
      const response = await SurgeriesListApiFactory(undefined, this.apiBase).getSurgeryEntries(this.surgeonId);
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
                    console.log('Emitting event for surgery id:', surgery.id);
                    this.entryClicked.emit(surgery.id);
                  }}
                >
                  <div slot="headline">{'ID: ' + surgery.id}</div>
                  <div slot="supporting-text">{'Dátum operácie: ' + surgery.date}</div>
                  <div slot="supporting-text">{'Operovaná končatina: ' + surgery.operatedLimb.value}</div>
                  <md-icon slot="start">local_hospital</md-icon>
                </md-list-item>
              ))}
            </md-list>
          </div>
        )}
        <div class="buttons-space">
          <md-outlined-button class="buttons" id="cancel" onClick={() => this.surgeriesClosed.emit('cancel')}>
            Zrušiť
          </md-outlined-button>
          <md-outlined-button class="buttons" onclick={() => this.entryClicked.emit('@new')}>
            Pridať novú operáciu
          </md-outlined-button>
        </div>
      </Host>
    );
  }
}
