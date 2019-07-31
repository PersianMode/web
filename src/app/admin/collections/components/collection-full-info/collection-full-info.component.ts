import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-collection-full-info',
  templateUrl: './collection-full-info.component.html',
  styleUrls: ['./collection-full-info.component.css']
})
export class CollectionFullInfoComponent implements OnInit, OnDestroy {
  collectionId: string;
  tagArray: any = null;
  typeArray: any = null;

  constructor(private route: ActivatedRoute) {
  }

  setCollectionId($event) {
    this.collectionId = $event;
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.collectionId = params['id'];
      });
  }

  showFilterOptionTab(typeArr, tagArr) {
    if (typeArr)
      this.typeArray = typeArr;
    if (tagArr)
      this.tagArray = tagArr;
  }

  ngOnDestroy() {
  }


}
