import {Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MessageType} from '../enum/messageType.enum';
 @Injectable()
export class MessageService {
   constructor(private snackBar: MatSnackBar) {}
   showMessage(msg, msgType, action = null) {
    const config: any = {direction: 'rtl'};
    switch (msgType) {
      case MessageType.Information: {
        config.duration = 1800;
        config.panelClass = 'msg-info';
      }
        break;
      case MessageType.Warning: {
        config.duration = 2000;
        config.panelClass = 'msg-warning';
      }
        break;
      case MessageType.Error: {
        config.duration = 2400;
        config.panelClass = 'msg-error';
      }
        break;
    }
     this.snackBar.open(msg, action, config);
  }
}