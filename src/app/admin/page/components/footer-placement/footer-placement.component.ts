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
      this.siteLinkItems = value.filter(el => el.variable_name.toLowerCase() === 'site_link');
      this.socialLinkItems = value.filter(el => el.variable_name.toLowerCase() === 'social_link');
    }
  }

  @Output() modifyPlacement = new EventEmitter();

  siteLinkItems = [];
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
  };
  socialAnyChanges = false;

  constructor(private httpService: HttpService, private dragulaService: DragulaService,
    private progressService: ProgressService, private dialog: MatDialog) {}

  ngOnInit() {
    if (!this.dragulaService.find(this.socialBag))
      this.dragulaService.setOptions(this.socialBag, {
        direction: 'vertical',
      });

    if (!this.dragulaService.find(this.textBag))
      this.dragulaService.setOptions(this.textBag, {
        direction: 'vertical',
      });

    this.dragulaService.dropModel.subscribe(value => {
      if (this.socialBag === value[0])
        this.changeSocialIconOrder();
      else if (this.textBag === value[0])
        this.changeTextLinkOrder();
    });

    this.initTextForm();
  }

  initTextForm() {

  }

  changeSocialIconOrder() {

  }

  changeTextLinkOrder() {

  }

  getNotSelectedIcons() {
    return this.socialNetworks.filter(el => !this.socialLinkItems.find(i => i.info.text.toLowerCase() !== el.text.toLowerCase()));
  }

  selectIcon(icon) {
    if (icon.info && this.socialLinkItems.find(el => el.info.href === icon.info.href))
      this.selectedSocialNetwork = {
        _id: icon._id,
        href: icon.info.href,
        text: icon.info.text,
      };
    else
      this.selectedSocialNetwork = {
        _id: null,
        href: null,
        text: icon.text,
      };
  }

  modifySocialNetwork() {

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
              };
              this.socialAnyChanges = false;
              this.progressService.disable();
            },
            (err) => {
              console.error('Cannot remove a placement item form footer: ', err);
              this.progressService.disable();
            }
          )
        }
      }
    )
  }

  checkSocialchanges() {
    this.socialAnyChanges = false;

    if (!this.selectedSocialNetwork._id && this.selectedSocialNetwork.href && this.selectedSocialNetwork.href.trim())
      this.socialAnyChanges = true;
    if (this.selectedSocialNetwork._id) {
      const socialObj = this.socialLinkItems.find(el => el._id === this.selectedSocialNetwork._id);
      if (socialObj.href.trim() !== this.selectedSocialNetwork.href.trim())
        this.socialAnyChanges = true;
    }
  }

  clearSocialNetworkField() {
    this.selectedSocialNetwork = {
      _id: null,
      href: null,
      text: null,
    };
  }
}