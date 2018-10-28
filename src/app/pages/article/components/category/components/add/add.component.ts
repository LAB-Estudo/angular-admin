/**
 * @file 分类页面发布组件
 * @module app/page/article/componennt/category/add
 * @author Surmon <https://github.com/surmon-china>
 */

import { Component, ViewEncapsulation, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { mergeFormControlsToInstance } from '@app/pages/pages.utils';

@Component({
  selector: 'box-category-add',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./add.scss')],
  template: require('./add.html')
})

export class CategoryAddComponent implements OnChanges {

  @Input() category;
  @Input() categories;
  @Input() submitState: any;
  @Output() categoryChange: EventEmitter<any> = new EventEmitter();
  @Output() submitCategory: EventEmitter<any> = new EventEmitter();
  @Output() submitStateChange: EventEmitter<any> = new EventEmitter();

  public editForm: FormGroup;
  public name: AbstractControl;
  public slug: AbstractControl;
  public pid: AbstractControl;
  public description: AbstractControl;
  public extends: AbstractControl;

  constructor(fb: FormBuilder) {
    this.editForm = fb.group({
      name: ['', Validators.compose([Validators.required])],
      slug: ['', Validators.compose([Validators.required])],
      pid: ['', Validators.compose([])],
      description: ['', Validators.compose([])],
      extends: [[{ name: 'icon', value: 'icon-category'}]]
    });
    mergeFormControlsToInstance(this, this.editForm);
  }

  // 级别标记
  public categoryLevelMark = level => Array.from({ length: level }, () => '');

  // 删除自定义配置项目
  public delExtendItem(index) {
    this.extends.value.splice(index, 1);
  }

  // 增加自定义配置项目
  public addExtendItem() {
    this.extends.setValue([...this.extends.value, {}]);
  }

  // 重置表单
  public resetForm(): void {
    this.editForm.reset({
      pid: '',
      name: '',
      slug: '',
      description: '',
      extends: [{ name: 'icon', value: 'icon-category'}]
    });
    if (this.category) {
      this.category = null;
      this.categoryChange.emit(this.category);
    }
    this.submitState.ing = false;
    this.submitState.success = false;
    this.submitStateChange.emit(this.submitState);
  }

  // 提交
  public onSubmit(category: Object): void {
    if (this.editForm.valid) {
      return this.submitCategory.emit(category);
    }
  }

  ngOnChanges(changes) {
    const submitOk = !!changes.submitState && !changes.submitState.currentValue.ing && changes.submitState.currentValue.success;
    const category = !!changes.category && !!changes.category.currentValue;
    if (submitOk) { this.resetForm(); }
    if (category) {
      changes.category.currentValue.pid = changes.category.currentValue.pid || '';
      this.editForm.reset(changes.category.currentValue);
    }
  }
}
