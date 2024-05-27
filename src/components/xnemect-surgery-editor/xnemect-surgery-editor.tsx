import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { SurgeryEntry, SurgeriesListApiFactory, OperatedLimb, SurgeryOperatedLimbApiFactory } from '../../api/surgeon-wl';
@Component({
  tag: 'xnemect-surgery-editor',
  styleUrl: 'xnemect-surgery-editor.css',
  shadow: true,
})
export class XnemectSurgeryEditor {
  @Prop() entryId: string;
  @Prop() surgeonId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;

  @State() entry: SurgeryEntry;
  @State() operatedLimbs: OperatedLimb[];
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  private async getSurgeryEntryAsync(): Promise<SurgeryEntry> {
    if (this.entryId === '@new') {
      this.isValid = false;
      this.entry = {
        id: '@new',
        patientId: '',
        date: '',
        successful: true,
        surgeryNote: '',
        operatedLimb: {
          value: 'Hlava',
        },
      };
      return this.entry;
    }

    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const response = await SurgeriesListApiFactory(undefined, this.apiBase).getSurgeryEntry(this.surgeonId, this.entryId);

      if (response.status < 299) {
        this.entry = response.data;
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve list of surgeries: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of surgeries: ${err.message || 'unknown'}`;
    }
    return undefined;
  }

  private async getOperatedLimbs(): Promise<OperatedLimb[]> {
    try {
      const response = await SurgeryOperatedLimbApiFactory(undefined, this.apiBase).getOperatedLimbList();
      if (response.status < 299) {
        this.operatedLimbs = response.data;
      }
    } catch (err: any) {
      // no strong dependency on conditions
    }
    // always have some fallback condition
    return (
      this.operatedLimbs || [
        {
          code: 'fallback',
          value: 'Neurčena pozicia',
        },
      ]
    );
  }

  async componentWillLoad() {
    this.getSurgeryEntryAsync();
    this.getOperatedLimbs();
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }
    return (
      <Host>
        <div>
          <h2>{this.entryId === '@new' ? 'Pridaj novú operáciu' : 'Uprav existujúcu operáciu'}</h2>
        </div>

        <form ref={el => (this.formElement = el)}>
          <md-filled-text-field
            type="date"
            label="Dátum"
            required
            valueAsDate={new Date(this.entry?.date)}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.date = this.isoDateToLocale(this.handleInputEvent(ev));
              }
            }}
          ></md-filled-text-field>

          <div class="in-row">
            <md-checkbox
              id="successfulCheckbox" // Unique ID for the checkbox
              checked={this.entry?.successful}
              onInput={(ev: InputEvent) => {
                const checkbox = ev.target as HTMLInputElement;
                if (this.entry) {
                  this.entry.successful = checkbox.checked; // Directly use the 'checked' property
                }
              }}
            ></md-checkbox>
            <label class="label1" htmlFor="successfulCheckbox">
              Operácia prebehla úspešne
            </label>
          </div>

          {this.renderConditions()}
          <md-filled-text-field
            label="Popis operácie"
            value={this.entry?.surgeryNote}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.surgeryNote = this.handleInputEvent(ev);
              }
            }}
          ></md-filled-text-field>
        </form>

        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={!this.entry || this.entry?.id === '@new'} onClick={() => this.deleteEntry()}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel" onClick={() => this.editorClosed.emit('cancel')}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm" disabled={!this.isValid} onClick={() => this.updateEntry()}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }

  private isoDateToLocale(iso: string) {
    if (!iso) return '';
    return new Date(Date.parse(iso)).toLocaleDateString();
  }

  private renderConditions() {
    let limbs = this.operatedLimbs || [];
    // we want to have this.entry`s condition in the selection list
    if (this.entry?.operatedLimb) {
      const index = limbs.findIndex(condition => condition.code === this.entry.operatedLimb.code);
      if (index < 0) {
        limbs = [this.entry.operatedLimb, ...limbs];
      }
    }
    return (
      <md-filled-select label="Operovaná končatina" display-text={this.entry?.operatedLimb?.value} oninput={(ev: InputEvent) => this.handleCondition(ev)}>
        {limbs.map(condition => {
          return (
            <md-select-option value={condition.code} selected={condition.code === this.entry?.operatedLimb?.code}>
              <div slot="headline">{condition.value}</div>
            </md-select-option>
          );
        })}
      </md-filled-select>
    );
  }
  private handleCondition(ev: InputEvent) {
    if (this.entry) {
      const code = this.handleInputEvent(ev);
      const limb = this.operatedLimbs.find(limb => limb.code === code);
      this.entry.operatedLimb = Object.assign({}, limb);
    }
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    // check validity of elements
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
      const element = this.formElement.children[i];
      if ('reportValidity' in element) {
        const valid = (element as HTMLInputElement).reportValidity();
        this.isValid &&= valid;
      }
    }
    return target.value;
  }

  private async updateEntry() {
    try {
      // store or update
      const api = SurgeriesListApiFactory(undefined, this.apiBase);
      const response = this.entryId === '@new' ? await api.createSurgeryEntry(this.surgeonId, this.entry) : await api.updateSurgeryEntry(this.surgeonId, this.entryId, this.entry);
      if (response.status < 299) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Cannot store entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || 'unknown'}`;
    }
  }

  private async deleteEntry() {
    try {
      const response = await SurgeriesListApiFactory(undefined, this.apiBase).deleteSurgeryEntry(this.surgeonId, this.entryId);
      if (response.status < 299) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Cannot delete entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || 'unknown'}`;
    }
  }
}
