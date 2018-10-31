import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';
import {DictionaryService} from '../../../../shared/services/dictionary.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {
  waiting = false;
  preferred_size = null;
  preferred_brands = [];
  preferred_tags = [];
  shoesSize = [];
  brandList = [];
  tagList = [];
  gender = null;

  constructor(private httpService: HttpService, private authService: AuthService,
    private dictionary: DictionaryService) {}

  ngOnInit() {
    this.gender = this.authService.userDetails.gender;
    this.fetchPreference();
    this.fetchShoesSizes();
    this.fetchBrands();
    this.fetchTags();
  }

  fetchPreference() {
    this.httpService.get('customer/preferences').subscribe(
      (res) => {
        if (res) {
          this.preferred_size = res.preferred_size;
          this.preferred_brands = res.preferred_brands.filter(el => el._id);
          this.preferred_tags = res.preferred_tags.filter(el => el._id);
        };
      },
      (err) => {

      });
  }

  fetchShoesSizes() {
    this.waiting = true;
    this.httpService.get('../../../../../assets/shoesSize.json').subscribe(res => {
      const tempSizes = [];
      res[this.gender === 'm' ? 'men' : 'women'].forEach(element => {
        tempSizes.push({value: element['us'], disabled: false, displayValue: element['us']});
      });
      this.shoesSize = tempSizes;
      this.waiting = false;
    }, err => this.waiting = false);
  }

  fetchBrands() {
    this.httpService.get('brand').subscribe(brands => {
      brands.forEach(el => {
        this.brandList.push({name: this.dictionary.translateWord(el.name.trim()), _id: el._id});
      });
    });
  }

  fetchTags() {
    this.httpService.get('tags/Category').subscribe(tags => {
      tags.forEach(el => {
        this.tagList.push({name: this.dictionary.translateWord(el.name.trim()), _id: el._id});
      });
    });
  }

  selectSize(value) {
    if (value !== this.preferred_size) {
      this.waiting = true;
      this.preferred_size = value;
      this.httpService.post(`customer/preferences`, {
        preferred_size: this.preferred_size,
      }).subscribe(res => {
        this.waiting = false;
      }, err => {
        console.error('Cannot update the preferred size: ', err);
        this.waiting = false;
      });
    }
  }

  selectBrand(brand) {
    if (this.preferred_brands.find(el => el._id === brand._id))
      this.preferred_brands = this.preferred_brands.filter(el => el._id !== brand._id);
    else
      this.preferred_brands.push(brand);

    this.waiting = true;
    this.httpService.post('customer/preferences', {
      preferred_brands: this.preferred_brands,
    }).subscribe(res => {
      this.waiting = false;
    }, err => {
      console.error('Cannot update the preferred brands: ', err);
      this.waiting = false;
    });
  }

  selectTag(tag) {
    if (this.preferred_tags.find(el => el._id === tag._id))
      this.preferred_tags = this.preferred_tags.filter(el => el._id !== tag._id);
    else
      this.preferred_tags.push(tag);

    this.waiting = true;
    this.httpService.post('customer/preferences', {
      preferred_tags: this.preferred_tags,
    }).subscribe(res => {
      this.waiting = false;
    }, err => {
      console.error('Cannot update the preferred tags: ', err);
      this.waiting = false;
    });
  }

  isSelectedBrand(brand) {
    return this.preferred_brands.map(el => el._id).includes(brand._id);
  }

  isSelectedTag(tag) {
    return this.preferred_tags.map(el => el._id).includes(tag._id);
  }
}
