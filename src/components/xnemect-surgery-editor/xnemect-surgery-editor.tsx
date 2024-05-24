import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
@Component({
  tag: 'xnemect-surgery-editor',
  styleUrl: 'xnemect-surgery-editor.css',
  shadow: true,
})
export class XnemectSurgeryEditor {
  @Prop() entryId: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;

  @State() private duration = 15;

  private handleSliderInput(event: Event) {
    this.duration = +(event.target as HTMLInputElement).value;
  }

  render() {
    return (
      <Host>
        <md-filled-text-field label="Meno a Priezvisko">
          <md-icon slot="leading-icon">person</md-icon>
        </md-filled-text-field>

        <md-filled-text-field label="Registračné číslo pacienta">
          <md-icon slot="leading-icon">fingerprint</md-icon>
        </md-filled-text-field>

        <md-filled-text-field label="Dátum operácie" disabled>
          <md-icon slot="leading-icon">watch_later</md-icon>
        </md-filled-text-field>

        <md-filled-select label="Operovaná časť">
          <md-icon slot="leading-icon">sick</md-icon>
          <md-select-option value="folowup">
            <div slot="headline">Pravá ruka</div>
          </md-select-option>
          <md-select-option value="nausea">
            <div slot="headline">Ľavá ruka</div>
          </md-select-option>
          <md-select-option value="fever">
            <div slot="headline">Pravá noha</div>
          </md-select-option>
          <md-select-option value="ache-in-throat">
            <div slot="headline">Ľavá noha</div>
          </md-select-option>
          <md-select-option value="ache-in-throat">
            <div slot="headline">Hlava</div>
          </md-select-option>
          <md-select-option value="ache-in-throat">
            <div slot="headline">Brucho</div>
          </md-select-option>
        </md-filled-select>

        <div class="duration-slider">
          <span class="label">Predpokladaná doba trvania:&nbsp; </span>
          <span class="label">{this.duration}</span>
          <span class="label">&nbsp;minút</span>
          <md-slider min="2" max="45" value={this.duration} ticks labeled oninput={this.handleSliderInput.bind(this)}></md-slider>
        </div>

        <md-divider></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete" onClick={() => this.editorClosed.emit('delete')}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel" onClick={() => this.editorClosed.emit('cancel')}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm" onClick={() => this.editorClosed.emit('store')}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }
}
