import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {DragulaService} from 'ng2-dragula';
import {ProgressService} from '../../../../shared/services/progress.service';
import {FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {RemovingConfirmComponent} from '../../../../shared/components/removing-confirm/removing-confirm.component';
import {PlacementModifyEnum} from '../../enum/placement.modify.type.enum';

@Component({
  selector: 'app-footer-placement',
  templateUrl: './footer-placement.component.html',
  styleUrls: ['./footer-placement.component.css']
})
export class FooterPlacementComponent implements OnInit {
  @Input() pageId = null;
  @Input()
  set placements(value: IPlacement[]) {
    if (value.length) {
      this.arrangeTextLinkItems(value.filter(el => el.variable_name.toLowerCase() === 'site_link'));

      this.socialLinkItems = [];
      this.socialLinkItems = value.filter(el => el.variable_name.toLowerCase() === 'social_link');
    }
  }

  @Output() modifyPlacement = new EventEmitter();

  siteLinkItems = {};
  socialLinkItems = [];
  socialBag = 'social-bag';
  textBag = 'text-bag';
  socialNetworks = [
    {
      value: 'facebook',
      name: 'Facebook',
      text: 'fa fa-facebook-square',
    },
    {
      value: 'instagram',
      name: 'Instagram',
      text: 'fa fa-instagram',
    },
    {
      value: 'twitter',
      name: 'Twitter',
      text: 'fa fa-twitter-square',
    },
    {
      value: 'linkedin',
      name: 'Linkedin',
      text: 'fa fa-linkedin-square',
    },
    {
      value: 'google_plus',
      name: 'Google Plus',
      text: 'fa fa-google-plus-square',
    },
    {
      value: 'telegram',
      name: 'Telegram',
      text: 'fa fa-telegram',
    },
    {
      value: 'pinterest',
      name: 'Pinterest',
      text: 'fa fa-pinterest-square',
    }
  ];
  selectedSocialNetwork = {
    _id: null,
    href: null,
    text: null,
    column: null,
  };
  selectedTextLink = {
    _id: null,
    text: null,
    href: null,
    column: null,
    row: null,
    is_header: false,
  };
  socialAnyChanges = false;
  textAnyChanges = false;
  hasNewColumn = false;
  newEmptyColumn = [];

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
    private progressService: ProgressService, private dialog: MatDialog) {}


  ngOnInit() {
    if (!this.dragulaService.find(this.socialBag))
      this.dragulaService.setOptions(this.socialBag, {
        direction: 'horizontal',
      });

    if (!this.dragulaService.find(this.textBag))
      this.dragulaService.setOptions(this.textBag, {

      });

    this.dragulaService.dropModel.subscribe(value => {
      if (this.socialBag === value[0])
        this.changeSocialIconOrder();
      else if (this.textBag === value[0])
        this.changeTextLinkOrder();
    });
  }

  changeSocialIconOrder() {
    let columnCounter = 1;
    this.socialLinkItems.forEach(el => {
      el.info.column = columnCounter;
      columnCounter++;
    });

    this.progressService.enable();
    this.httpService.post('placement', {
      page_id: this.pageId,
      placements: this.socialLinkItems,
    }).subscribe(
      (data) => {
        this.modifyPlacement.emit({
          type: PlacementModifyEnum.Modify,
          placements: this.socialLinkItems,
        });
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot update order of social icon in footer: ', err);
        this.progressService.disable();
      }
    );
  }

  changeTextLinkOrder() {
    let placementList = [];

    Object.keys(this.siteLinkItems).forEach(column => {
      let rowCounter = 1;
      let orderIsChanged = false;
      this.siteLinkItems[column].forEach(placement => {
        if (placement.info.column !== +column || placement.info.row !== rowCounter)
          orderIsChanged = true;

        placement.info.column = +column;
        placement.info.row = (rowCounter++);
      });

      if (orderIsChanged)
        placementList = placementList.concat(this.siteLinkItems[column]);
    });

    // Check newEmptyColumn
    const virtualColumn = Math.max(...Object.keys(this.siteLinkItems).map(el => parseInt(el, 10))) + 1;
    let rowCounter = 1;
    this.newEmptyColumn.forEach(placement => {
      placement.info.column = virtualColumn;
      placement.info.row = (rowCounter++);
    });

    placementList = placementList.concat(this.newEmptyColumn);
    this.newEmptyColumn = [];
    this.hasNewColumn = false;

    if (placementList.length > 0) {
      this.progressService.enable();
      this.httpService.post('placement', {
        page_id: this.pageId,
        placements: placementList,
      }).subscribe(
        (data) => {
          this.modifyPlacement.emit({
            type: PlacementModifyEnum.Modify,
            placements: placementList,
          });
          this.progressService.disable();
        },
        (err) => {
          console.error('Cannot update the order of footer text links: ', err);
          this.progressService.disable();
        }
      );
    }
  }

  getNotSelectedIcons() {
    return this.socialNetworks.filter(el => !this.socialLinkItems.find(i => i.info.text.toLowerCase() === el.text.toLowerCase()));
  }

  selectIcon(icon) {
    if (icon.info && this.socialLinkItems.find(el => el.info.href === icon.info.href))
      this.selectedSocialNetwork = {
        _id: icon._id,
        href: icon.info.href,
        text: icon.info.text,
        column: icon.info.column,
      };
    else
      this.selectedSocialNetwork = {
        _id: null,
        href: null,
        text: icon.text,
        column: null,
      };
  }

  selectTextItem(item) {
    this.selectedTextLink = {
      _id: item._id,
      href: item.info.href,
      text: item.info.text,
      column: item.info.column,
      row: item.info.row,
      is_header: item.info.hasOwnProperty('is_header') ? item.info.is_header : false,
    };
  }

  modifyTextLink() {
    this.progressService.enable();
    (this.selectedTextLink._id ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.selectedTextLink._id,
          info: this.getTextLinkItemInfo(false)
        }
      ]
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'footer',
        variable_name: 'site_link',
        info: this.getTextLinkItemInfo(true)
      }
    })).subscribe(
      (data: any) => {
        const tempInfo = Object.assign({}, this.selectedTextLink);
        delete tempInfo._id;
        this.modifyPlacement.emit({
          type: this.selectedTextLink._id ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data.placement_id,
          placements: [{
            _id: this.selectedTextLink._id,
            info: tempInfo,
          }],
          placement: data.new_placement,
        });

        // Maybe we can remove the bellow code
        if (this.selectedTextLink._id) {
          const changedObj = Object.keys(this.siteLinkItems)
            .map(el => this.siteLinkItems[el])
            .reduce((a, b) => (a || []).concat(b || []))
            .find(el => el._id === this.selectedTextLink._id);
          changedObj.info.text = this.selectedTextLink.text;
          changedObj.info.href = this.selectedTextLink.href;
          changedObj.info.is_header = this.selectedTextLink.is_header;
        } else {
          this.selectedTextLink._id = data.placement_id;
        }

        this.textAnyChanges = false;
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot modify text link item in footer placement: ', err);
        this.progressService.disable();
      }
    );
  }

  getTextLinkItemInfo(isNewItem = false) {
    const res = {
      text: (this.selectedTextLink.text ? this.selectedTextLink.text : '').trim(),
      href: (this.selectedTextLink.href ? this.selectedTextLink.href : '').trim(),
      is_header: this.selectedTextLink.is_header,
    };

    if (isNewItem) {
      const tempColumns = Object.keys(this.siteLinkItems);
      res['column'] = tempColumns.length && this.siteLinkItems[0].length ? Math.max(...tempColumns
        .map(el => this.siteLinkItems[el])
        .reduce((a, b) => (a || []).concat(b || []))
        .map(el => el.info.column)) : 1;
      res['row'] = (tempColumns.length && this.siteLinkItems[0].length ? Math.max(...tempColumns
        .map(el => this.siteLinkItems[el])
        .reduce((a, b) => (a || []).concat(b || []))
        .map(el => el.info.row)) : 0) + 1;
    } else {
      res['column'] = this.selectedTextLink.column;
      res['row'] = this.selectedTextLink.row;
    }

    return res;
  }

  removeTextLink() {
    if (!this.selectedTextLink._id)
      return;

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      'width': '400px',
    });

    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('placement/delete', {
            page_id: this.pageId,
            placement_id: this.selectedTextLink._id,
          }).subscribe(
            (data) => {
              this.modifyPlacement.emit({
                type: PlacementModifyEnum.Delete,
                placement_id: this.selectedTextLink._id,
              });

              this.selectedTextLink = {
                _id: null,
                href: null,
                text: null,
                is_header: false,
                column: null,
                row: null,
              };
              this.textAnyChanges = false;
              this.progressService.disable();
            },
            (err) => {
              console.error('Cannot remove a text link item from footer placement: ', err);
              this.progressService.disable();
            }
          );
        }
      }
    )
  }

  modifySocialNetwork() {
    this.progressService.enable();
    (this.selectedSocialNetwork._id ? this.httpService.post('placement', {
      page_id: this.pageId,
      placements: [
        {
          _id: this.selectedSocialNetwork._id,
          info: {
            text: this.selectedSocialNetwork.text,
            href: this.selectedSocialNetwork.href,
            column: this.selectedSocialNetwork.column,
          }
        }
      ]
    }) : this.httpService.put('placement', {
      page_id: this.pageId,
      placement: {
        component_name: 'footer',
        variable_name: 'social_link',
        info: {
          text: this.selectedSocialNetwork.text,
          href: this.selectedSocialNetwork.href,
          column: Math.max(...this.socialLinkItems.map(el => el.info.column)) + 1,
        }
      }
    })).subscribe(
      (data: any) => {
        const tempInfo = Object.assign({}, this.selectedSocialNetwork);
        delete tempInfo._id;
        this.modifyPlacement.emit({
          type: this.selectedSocialNetwork._id ? PlacementModifyEnum.Modify : PlacementModifyEnum.Add,
          placement_id: data.placement_id,
          placements: [{
            _id: this.selectedSocialNetwork._id,
            info: tempInfo,
          }],
          placement: data.new_placement,
        });

        // Maybe we can remove the bellow code
        if (this.selectedSocialNetwork._id) {
          const changedObj = this.socialLinkItems.find(el => el._id === this.selectedSocialNetwork._id);
          changedObj.info.text = this.selectedSocialNetwork.text;
          changedObj.info.href = this.selectedSocialNetwork.href;
        } else {
          this.selectedSocialNetwork._id = data.placement_id;
        }

        this.socialAnyChanges = false;
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot modify icon item in footer placement: ', err);
        this.progressService.disable();
      }
    );
  }

  removeSocialNetwork() {
    if (!this.selectedSocialNetwork._id)
      return;

    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      'width': '400px',
    });

    rmDialog.afterClosed().subscribe(
      (status) => {
        if (status) {
          this.progressService.enable();
          this.httpService.post('placement/delete', {
            page_id: this.pageId,
            placement_id: this.selectedSocialNetwork._id,
          }).subscribe(
            (data) => {
              this.modifyPlacement.emit({
                type: PlacementModifyEnum.Delete,
                placement_id: this.selectedSocialNetwork._id,
              });
              this.selectedSocialNetwork = {
                _id: null,
                href: null,
                text: null,
                column: null,
              };
              this.socialAnyChanges = false;
              this.progressService.disable();
            },
            (err) => {
              console.error('Cannot remove a placement item form footer: ', err);
              this.progressService.disable();
            }
          );
        }
      }
    );
  }

  checkSocialchanges() {
    this.socialAnyChanges = false;

    if (!this.selectedSocialNetwork._id && this.selectedSocialNetwork.href && this.selectedSocialNetwork.href.trim())
      this.socialAnyChanges = true;
    if (this.selectedSocialNetwork._id) {
      const socialObj = this.socialLinkItems.find(el => el._id === this.selectedSocialNetwork._id);
      const href1 = socialObj.info.href ? socialObj.info.href.trim() : '';
      const href2 = this.selectedSocialNetwork.href ? this.selectedSocialNetwork.href.trim() : '';
      if (href1 !== href2)
        this.socialAnyChanges = true;
    }
  }

  checkTextchanges() {
    this.textAnyChanges = false;

    if (!this.selectedTextLink._id &&
      this.selectedTextLink.href &&
      this.selectedTextLink.href.trim()
      && this.selectedTextLink.text && this.selectedTextLink.text.trim())
      this.textAnyChanges = true;

    if (this.selectedTextLink._id) {
      if (!this.selectedTextLink.href || !this.selectedTextLink.text)
        this.textAnyChanges = false;
      else {
        const textLinkObj = Object.keys(this.siteLinkItems)
          .map(el => this.siteLinkItems[el])
          .reduce((a, b) => (a || []).concat(b || []))
          .find(el => el._id === this.selectedTextLink._id);
        const text1 = textLinkObj.info.text ? textLinkObj.info.text.trim() : '';
        const href1 = textLinkObj.info.href ? textLinkObj.info.href.trim() : '';
        const text2 = this.selectedTextLink.text ? this.selectedTextLink.text.trim() : '';
        const href2 = this.selectedTextLink.href ? this.selectedTextLink.href.trim() : '';

        if (text1 !== text2 || href1 !== href2 || textLinkObj.info.is_header !== this.selectedTextLink.is_header)
          this.textAnyChanges = true;
      }
    }
  }

  clearSocialNetworkField() {
    this.selectedSocialNetwork = {
      _id: null,
      href: null,
      text: null,
      column: null,
    };
  }

  clearTextLinkField() {
    this.selectedTextLink = {
      _id: null,
      href: null,
      text: null,
      column: null,
      row: null,
      is_header: false,
    };
  }

  getKeyList(list) {
    return Object.keys(list);
  }

  arrangeTextLinkItems(list) {
    this.siteLinkItems = {};
    list.forEach(el => {
      if (!this.siteLinkItems[el.info.column])
        this.siteLinkItems[el.info.column] = [];
      this.siteLinkItems[el.info.column].push(el);
    });

    // Sort items in each column
    Object.keys(this.siteLinkItems).forEach(column => this.sortItems(this.siteLinkItems[column]));

    // Add empty column if there is not column
    if (Object.keys(this.siteLinkItems).length === 0) {
      this.siteLinkItems = {1: []};
    }
  }

  private sortItems(list) {
    list.sort((a, b) => {
      if (a.info.row > b.info.row)
        return 1;
      else if (a.info.row < b.info.row)
        return -1;
      return 0;
    });
  }

  addColumn() {
    this.newEmptyColumn = [];
    this.hasNewColumn = true;
  }

  addColumnDisability() {
    return this.hasNewColumn;
  }
}
