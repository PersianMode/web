import {HttpService} from '../services/http.service';
import {ElementSchemaRegistry} from '@angular/compiler';

export function imagePathFixer(imgSrc, productId, colorId) {
  if (imgSrc)
    return imgSrc.includes(HttpService.Host) ? imgSrc :
      [HttpService.Host, HttpService.PRODUCT_IMAGE_PATH, productId, colorId, imgSrc].join('/');
  else
    return '';
};

