import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];

  public usuario: any = {};

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    /* obtenemos la informacion de usuario que se autentico */
    this.auth.authState.subscribe((user) => {
      console.log('Estado del usuario:', user);
      if (!user) return;

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    switch (proveedor) {
      case 'google':
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        break;
      case 'twitter':
        this.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
        break;
      case 'facebook':
        this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
        break;

      default:
        break;
    }
  }

  logout() {
    this.usuario = {};
    this.auth.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', (ref) =>
      ref.orderBy('fecha', 'desc').limit(5)
    );
    /* mandamos un query a firebase para que nos ordene los mensajes por fecha y orden ascendiente */
    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        /* cambiamos el orden en como nos apareceran los mensajes sino aparecen al revez */
        this.chats = [];

        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;

        // this.chats = mensajes;
      })
    );
  }

  //TODO falta el UID del usuario
  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
    };

    return this.itemsCollection.add(mensaje);
  }
}
