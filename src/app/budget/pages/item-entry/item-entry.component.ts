import { Component, inject } from '@angular/core';
import { Item } from '../../models/item';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ItemService } from '../../item.service';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { BudgetPlanComponent } from '../../components/budget-plan/budget-plan.component';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DecimalPipe, RouterLink, BudgetPlanComponent],
  templateUrl: './item-entry.component.html',
  styleUrl: './item-entry.component.scss'
})
export class ItemEntryComponent {
  
  isSmallTable = false;
  
  itemService = inject(ItemService); //fetch data from json server at ItemService

  // items: any; //cancel cause fetch data from json server instead
  items: Item[] = []; //fetch data from json server at ItemService
  filterItems = this.items;
  filterInput = new FormControl<string>('', { nonNullable: true });

  modalService = inject(BsModalService)
  bsModalRef?: BsModalRef;

  constructor() {
    //fetch data from json server instead
    this.itemService.list().subscribe((vs) => {
      this.items = vs;
      this.filterItems = vs;
    });
    //
    
    this.filterInput.valueChanges 
      .pipe(map((keyword) => keyword.toLocaleLowerCase())) 
      .subscribe((keyword) => {      
        this.filterItems = this.items.filter((item) => item.title.toLocaleLowerCase().includes(keyword));
      });
  }

  onConfirm(item: Item) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to delete "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        this.onDelete(item.id)
      }
    })

  }

  onDelete(id: number) {
    return this.itemService.delete(id).subscribe(v => {
      this.items = this.items.filter(item => item.id != id)
      this.filterItems = this.items
    });
  } 
}


