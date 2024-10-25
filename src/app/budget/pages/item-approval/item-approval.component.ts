import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ItemService } from '../../item.service';
import { Item, ItemStatus } from '../../models/item';
import { BudgetPlanComponent } from '../../components/budget-plan/budget-plan.component';
import { BudgetPlanService } from '../../budget-plan.service';

type ItemAction = 'Approve' | 'Reject';

@Component({
  selector: 'app-item-approval',
  standalone: true,
  // imports: [ReactiveFormsModule, DecimalPipe, BudgetPlanComponent, BudgetPlanService],
  imports: [ReactiveFormsModule, DecimalPipe, BudgetPlanComponent],
  templateUrl: './item-approval.component.html',
  styleUrl: './item-approval.component.scss'
})

export class ItemApprovalComponent {
  itemService = inject(ItemService);
  budgetPlanService = inject(BudgetPlanService)

  items: Item[] = [];

  modalService = inject(BsModalService);
  bsModalRef?: BsModalRef;

  readonly ItemStatus = ItemStatus;

  constructor() {
    this.itemService.list().subscribe((vs) => {
      this.items = vs;
      this.updateUsed(); //add new 3
    });
  }

  onConfirm(item: Item, itemAction: ItemAction) {
    const initialState: ModalOptions = {
      initialState: {
        title: `Confirm to ${itemAction} "${item.title}" ?`
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, initialState);
    this.bsModalRef?.onHidden?.subscribe(() => {
      if (this.bsModalRef?.content?.confirmed) {
        if (itemAction === 'Approve') {
          this.onApprove(item.id);
        }

        if (itemAction === 'Reject') {
          this.onReject(item.id);
        }
      }
    });
  }

  // onApprove(id: number) {
  //   this.itemService.approve(id).subscribe(() => {
  //     this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.APPROVED } : v));
  //   });
  // }

  // onReject(id: number) {
  //   this.itemService.reject(id).subscribe(() => {
  //     this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.REJECTED } : v));
  //   });
  // }

  //add new 3
  onApprove(id: number) {
    this.itemService.approve(id).subscribe(() => {
      this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.APPROVED } : v));
      this.updateUsed();
    });
  }

  onReject(id: number) {
    this.itemService.reject(id).subscribe(() => {
      this.items = this.items.map((v) => (v.id === id ? { ...v, status: ItemStatus.REJECTED } : v));
      this.updateUsed();
    });
  }

  private updateUsed() {
    const used = this.items
      .filter((v) => v.status === ItemStatus.APPROVED) // [{ id: 5, price: 600, ... }, { id: 8, price: 1200, ... }]
      .map((v) => v.price) // [600, 1200]
      .reduce((previous, current) => (previous += current), 0);

    this.budgetPlanService.updateUsed(used);
  }
}

