import { Component, OnInit } from '@angular/core';
import { __classPrivateFieldGet } from 'tslib';
import { ChatService } from '../../providers/chat.service';

/* para mejor entendimiento leer la documentacion angularfire, se usaron tambien la arryCollection de esta libreria */

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [],
})
export class ChatComponent implements OnInit {
  mensaje: string = '';
  elemento: any;
  public usuario: string;

  constructor(public _cs: ChatService) {
    this._cs.cargarMensajes().subscribe(() => {
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 200);
    });
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje() {
    console.log(this.mensaje);

    if (this.mensaje.length === 0) {
      return;
    }

    this._cs
      .agregarMensaje(this.mensaje)
      .then(() => (this.mensaje = ''))
      .catch((err) => console.log('Error al enviar', err));
  }
}
